/**
 * Onboarding orchestrator — runs all onboarding steps for a new client.
 *
 * Execution model:
 *   Phase 1 (parallel): slack_channel + dropbox_folder + gdrive_folder
 *   Phase 2 (parallel): slack_invite + welcome_message + team_notify
 *     (invite/welcome depend on slack_channel result)
 *
 * Each step catches its own errors. Failed steps don't block other steps
 * in the same phase. Dependent steps are skipped if their dependency failed.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { OnboardingStepName, OnboardingStepStatus } from '@/lib/types'
import { createChannel, inviteToChannel, sendMessage, sendDM } from './slack'
import { createFolder as createDropboxFolder } from './dropbox'
import { createFolder as createGDriveFolder } from './gdrive'

// ============================================================================
// Slugify utility
// ============================================================================

export function slugify(name: string, fallbackId?: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  return slug || (fallbackId ? fallbackId.slice(0, 8) : 'unnamed')
}

// ============================================================================
// Step dependency map (for cascade retry)
// ============================================================================

const STEP_DEPENDENTS: Record<string, OnboardingStepName[]> = {
  slack_channel: ['slack_invite', 'welcome_message'],
  dropbox_folder: [],
  gdrive_folder: [],
  slack_invite: [],
  welcome_message: [],
  team_notify: [],
}

export function getStepsToReset(step: OnboardingStepName): OnboardingStepName[] {
  return [step, ...(STEP_DEPENDENTS[step] ?? [])]
}

// ============================================================================
// DB helpers
// ============================================================================

async function updateStep(
  supabase: SupabaseClient,
  clientId: string,
  step: OnboardingStepName,
  status: OnboardingStepStatus,
  resultData?: Record<string, unknown> | null,
  errorMessage?: string | null
): Promise<void> {
  const update: Record<string, unknown> = { status }
  if (resultData !== undefined) update.result_data = resultData
  if (errorMessage !== undefined) update.error_message = errorMessage
  if (status === 'success' || status === 'failed' || status === 'skipped') {
    update.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('onboarding_steps')
    .update(update)
    .eq('client_id', clientId)
    .eq('step', step)

  if (error) {
    console.error(`Failed to update onboarding step ${step} for client ${clientId}:`, error)
  }
}

export async function resetStep(
  supabase: SupabaseClient,
  clientId: string,
  step: OnboardingStepName
): Promise<void> {
  const { error } = await supabase
    .from('onboarding_steps')
    .update({
      status: 'pending',
      result_data: null,
      error_message: null,
      completed_at: null,
    })
    .eq('client_id', clientId)
    .eq('step', step)

  if (error) {
    console.error(`Failed to reset onboarding step ${step}:`, error)
  }
}

async function updateClientField(
  supabase: SupabaseClient,
  clientId: string,
  field: string,
  value: string
): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .update({ [field]: value })
    .eq('id', clientId)

  if (error) {
    console.error(`Failed to update client.${field}:`, error)
  }
}

// ============================================================================
// Data fetchers
// ============================================================================

interface ClientWithContacts {
  id: string
  name: string
  contacts: Array<{ email: string; contact_name: string | null; is_primary: boolean }>
}

async function getClientWithContacts(
  clientId: string,
  supabase: SupabaseClient
): Promise<ClientWithContacts> {
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, name')
    .eq('id', clientId)
    .single()

  if (clientError || !client) {
    throw new Error(`Client not found: ${clientId}`)
  }

  const { data: contacts } = await supabase
    .from('client_contacts')
    .select('email, contact_name, is_primary')
    .eq('client_id', clientId)
    .order('is_primary', { ascending: false })

  return {
    ...client,
    contacts: contacts ?? [],
  }
}

interface AssignmentWithMember {
  assignment_role: string
  team_members: {
    first_name: string
    last_name: string
    email: string
  } | null
}

async function getClientAssignments(
  clientId: string,
  supabase: SupabaseClient
): Promise<AssignmentWithMember[]> {
  const { data } = await supabase
    .from('client_assignments')
    .select('assignment_role, team_members ( first_name, last_name, email )')
    .eq('client_id', clientId)

  return (data ?? []) as unknown as AssignmentWithMember[]
}

// ============================================================================
// Welcome message builder
// ============================================================================

function buildWelcomeMessage(
  clientName: string,
  assignments: AssignmentWithMember[]
): string {
  const lines = [
    `Welcome to Known Local, ${clientName}!`,
    '',
    'This is your dedicated channel for all project communication and updates.',
    '',
  ]

  const teamLines: string[] = []
  const strategist = assignments.find(a => a.assignment_role === 'strategist')
  const manager = assignments.find(a => a.assignment_role === 'manager')

  if (strategist?.team_members) {
    teamLines.push(`  • Strategist: ${strategist.team_members.first_name} ${strategist.team_members.last_name}`)
  }
  if (manager?.team_members) {
    teamLines.push(`  • Manager: ${manager.team_members.first_name} ${manager.team_members.last_name}`)
  }

  if (teamLines.length > 0) {
    lines.push('Your team:')
    lines.push(...teamLines)
    lines.push('')
  }

  lines.push('If you have any questions, drop them here and we\'ll get back to you quickly.')

  return lines.join('\n')
}

// ============================================================================
// Step runner helpers
// ============================================================================

async function runStep<T extends Record<string, unknown>>(
  supabase: SupabaseClient,
  clientId: string,
  step: OnboardingStepName,
  fn: () => Promise<T>
): Promise<T | null> {
  await updateStep(supabase, clientId, step, 'running')
  try {
    const result = await fn()
    await updateStep(supabase, clientId, step, 'success', result)
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Onboarding step ${step} failed for client ${clientId}:`, message)
    await updateStep(supabase, clientId, step, 'failed', null, message)
    return null
  }
}

async function skipStep(
  supabase: SupabaseClient,
  clientId: string,
  step: OnboardingStepName,
  reason: string
): Promise<void> {
  await updateStep(supabase, clientId, step, 'skipped', null, reason)
}

// ============================================================================
// Main orchestrator
// ============================================================================

export async function runOnboarding(
  clientId: string,
  supabase: SupabaseClient
): Promise<void> {
  const client = await getClientWithContacts(clientId, supabase)
  const slug = slugify(client.name, clientId)
  const assignments = await getClientAssignments(clientId, supabase)

  // Phase 1: Independent steps — run in parallel
  const [slackResult, _dropboxResult, _gdriveResult] = await Promise.allSettled([
    runStep(supabase, clientId, 'slack_channel', async () => {
      const result = await createChannel(`client-${slug}`)
      await updateClientField(supabase, clientId, 'slack_channel_url', result.channel_url)
      return { channel_id: result.channel_id, channel_name: result.channel_name, channel_url: result.channel_url }
    }),
    runStep(supabase, clientId, 'dropbox_folder', async () => {
      const result = await createDropboxFolder(`/Clients/${client.name}`)
      await updateClientField(supabase, clientId, 'dropbox_upload_url', result.shared_link)
      return { folder_path: result.folder_path, shared_link: result.shared_link }
    }),
    runStep(supabase, clientId, 'gdrive_folder', async () => {
      const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID
      if (!parentFolderId) throw new Error('Missing GOOGLE_DRIVE_PARENT_FOLDER_ID env var')
      const result = await createGDriveFolder(client.name, parentFolderId)
      return { folder_id: result.folder_id, folder_url: result.folder_url }
    }),
  ])

  // Extract Slack channel ID from Phase 1 result
  let channelId: string | null = null
  if (slackResult.status === 'fulfilled' && slackResult.value) {
    channelId = slackResult.value.channel_id as string
  }

  // Phase 2: Slack-dependent steps + team notify — run in parallel
  await Promise.allSettled([
    channelId
      ? runStep(supabase, clientId, 'slack_invite', async () => {
          const contactEmail = client.contacts?.[0]?.email
          const inviteEmails = process.env.ONBOARD_INVITE_EMAILS?.split(',') ?? []
          const emails = [contactEmail, ...inviteEmails].filter(Boolean) as string[]
          const result = await inviteToChannel(channelId!, emails)
          return { invited_users: result.invited_users }
        })
      : skipStep(supabase, clientId, 'slack_invite', 'Slack channel not created'),

    channelId
      ? runStep(supabase, clientId, 'welcome_message', async () => {
          const message = buildWelcomeMessage(client.name, assignments)
          const result = await sendMessage(channelId!, message)
          return { message_ts: result.message_ts }
        })
      : skipStep(supabase, clientId, 'welcome_message', 'Slack channel not created'),

    (() => {
      const toNotify = assignments.filter(a =>
        ['senior_editor', 'senior_writer', 'senior_designer'].includes(a.assignment_role)
      )

      if (toNotify.length === 0) {
        return skipStep(supabase, clientId, 'team_notify', 'No senior team members assigned')
      }

      return runStep(supabase, clientId, 'team_notify', async () => {
        const notified: string[] = []
        for (const assignment of toNotify) {
          const member = assignment.team_members
          if (member?.email) {
            try {
              await sendDM(
                member.email,
                `New client onboarded: ${client.name}. You've been assigned as ${assignment.assignment_role.replace(/_/g, ' ')}.`
              )
              notified.push(`${member.first_name} ${member.last_name} (${assignment.assignment_role})`)
            } catch (err) {
              console.error(`Failed to DM ${member.email}:`, err)
            }
          }
        }

        return { notified }
      })
    })(),
  ])
}

/**
 * Retry onboarding from a specific step.
 * Only re-runs the specific failed step (plus its dependents if applicable).
 * Does NOT re-run the full orchestrator.
 */
export async function retryOnboarding(
  clientId: string,
  step: OnboardingStepName,
  supabase: SupabaseClient
): Promise<void> {
  const client = await getClientWithContacts(clientId, supabase)
  const slug = slugify(client.name, clientId)
  const assignments = await getClientAssignments(clientId, supabase)

  // Helper to get existing slack channel ID from previous successful step
  async function getExistingChannelId(): Promise<string | null> {
    const { data: slackStep } = await supabase
      .from('onboarding_steps')
      .select('result_data')
      .eq('client_id', clientId)
      .eq('step', 'slack_channel')
      .single()
    return (slackStep?.result_data as Record<string, unknown> | null)?.channel_id as string | null
  }

  // Helpers for running individual steps (no type casts needed)
  async function runSlackChannel(): Promise<string | null> {
    const result = await runStep(supabase, clientId, 'slack_channel', async () => {
      const r = await createChannel(`client-${slug}`)
      await updateClientField(supabase, clientId, 'slack_channel_url', r.channel_url)
      return { channel_id: r.channel_id, channel_name: r.channel_name, channel_url: r.channel_url }
    })
    return result?.channel_id as string | null
  }

  async function runSlackInvite(channelId: string): Promise<void> {
    await runStep(supabase, clientId, 'slack_invite', async () => {
      const contactEmail = client.contacts?.[0]?.email
      const inviteEmails = process.env.ONBOARD_INVITE_EMAILS?.split(',') ?? []
      const emails = [contactEmail, ...inviteEmails].filter(Boolean) as string[]
      const result = await inviteToChannel(channelId, emails)
      return { invited_users: result.invited_users }
    })
  }

  async function runWelcomeMessage(channelId: string): Promise<void> {
    await runStep(supabase, clientId, 'welcome_message', async () => {
      const message = buildWelcomeMessage(client.name, assignments)
      const result = await sendMessage(channelId, message)
      return { message_ts: result.message_ts }
    })
  }

  async function runTeamNotify(): Promise<void> {
    const toNotify = assignments.filter(a =>
      ['senior_editor', 'senior_writer', 'senior_designer'].includes(a.assignment_role)
    )

    if (toNotify.length === 0) {
      await skipStep(supabase, clientId, 'team_notify', 'No senior team members assigned')
      return
    }

    await runStep(supabase, clientId, 'team_notify', async () => {
      const notified: string[] = []
      for (const assignment of toNotify) {
        const member = assignment.team_members
        if (member?.email) {
          try {
            await sendDM(
              member.email,
              `New client onboarded: ${client.name}. You've been assigned as ${assignment.assignment_role.replace(/_/g, ' ')}.`
            )
            notified.push(`${member.first_name} ${member.last_name} (${assignment.assignment_role})`)
          } catch (err) {
            console.error(`Failed to DM ${member.email}:`, err)
          }
        }
      }
      return { notified }
    })
  }

  // Route to the correct step(s) to retry
  switch (step) {
    case 'slack_channel': {
      // Re-run slack_channel, then cascade to slack_invite + welcome_message
      const channelId = await runSlackChannel()
      if (channelId) {
        await Promise.allSettled([
          runSlackInvite(channelId),
          runWelcomeMessage(channelId),
        ])
      } else {
        await skipStep(supabase, clientId, 'slack_invite', 'Slack channel not created')
        await skipStep(supabase, clientId, 'welcome_message', 'Slack channel not created')
      }
      break
    }
    case 'dropbox_folder': {
      await runStep(supabase, clientId, 'dropbox_folder', async () => {
        const result = await createDropboxFolder(`/Clients/${client.name}`)
        await updateClientField(supabase, clientId, 'dropbox_upload_url', result.shared_link)
        return { folder_path: result.folder_path, shared_link: result.shared_link }
      })
      break
    }
    case 'gdrive_folder': {
      await runStep(supabase, clientId, 'gdrive_folder', async () => {
        const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID
        if (!parentFolderId) throw new Error('Missing GOOGLE_DRIVE_PARENT_FOLDER_ID env var')
        const result = await createGDriveFolder(client.name, parentFolderId)
        return { folder_id: result.folder_id, folder_url: result.folder_url }
      })
      break
    }
    case 'slack_invite': {
      const channelId = await getExistingChannelId()
      if (channelId) {
        await runSlackInvite(channelId)
      } else {
        await skipStep(supabase, clientId, 'slack_invite', 'Slack channel not created')
      }
      break
    }
    case 'welcome_message': {
      const channelId = await getExistingChannelId()
      if (channelId) {
        await runWelcomeMessage(channelId)
      } else {
        await skipStep(supabase, clientId, 'welcome_message', 'Slack channel not created')
      }
      break
    }
    case 'team_notify': {
      await runTeamNotify()
      break
    }
  }
}
