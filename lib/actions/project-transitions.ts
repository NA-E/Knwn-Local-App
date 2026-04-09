'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ProjectStatus, TeamRole } from '@/lib/types'
import { STATUS_TRANSITIONS, PROJECT_STATUS_LABELS } from '@/lib/constants/status'

// ---------- Helpers ----------

async function getCurrentTeamMember(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: member } = await supabase
    .from('team_members')
    .select('id, role, email')
    .eq('auth_user_id', user.id)
    .single()

  return member as { id: string; role: TeamRole; email: string } | null
}

// ---------- Transition Metadata ----------

export interface TransitionMetadata {
  /** Rejection/feedback reason — required for fix_script, internal_adjustments_needed */
  feedback?: string
  /** Edit URL — required for editing → ready_for_internal_review */
  edit_url?: string
  /** Edit version — required for editing → ready_for_internal_review */
  edit_version?: number
  /** Writer ID — required for brief → scriptwriting */
  writer_id?: string
  /** Editor ID — required before client_uploaded */
  editor_id?: string
  /** General notes stored in history */
  notes?: string
}

// ---------- Precondition Checks ----------

interface PreconditionResult {
  ok: boolean
  error?: string
}

/**
 * Validate preconditions for a given transition.
 * Returns { ok: true } if all preconditions are met, or { ok: false, error } otherwise.
 */
function checkPreconditions(
  project: Record<string, any>,
  fromStatus: ProjectStatus,
  toStatus: ProjectStatus,
  metadata?: TransitionMetadata
): PreconditionResult {
  // brief → scriptwriting: writer_id must be set (either already on project or in metadata)
  if (fromStatus === 'brief' && toStatus === 'scriptwriting') {
    const writerId = metadata?.writer_id || project.writer_id
    if (!writerId) {
      return { ok: false, error: 'A writer must be assigned before moving to scriptwriting.' }
    }
  }

  // Any transition into client_uploaded: editor_id must be set
  if (toStatus === 'client_uploaded') {
    const editorId = metadata?.editor_id || project.editor_id
    if (!editorId) {
      return { ok: false, error: 'An editor must be assigned before the project can move to client_uploaded.' }
    }
  }

  // editing → ready_for_internal_review: requires edit_url and edit_version > 0
  if (fromStatus === 'editing' && toStatus === 'ready_for_internal_review') {
    const editUrl = metadata?.edit_url || project.edit_url
    const editVersion = metadata?.edit_version ?? project.edit_version
    if (!editUrl) {
      return { ok: false, error: 'An edit URL (Dropbox link) is required before submitting for review.' }
    }
    if (!editVersion || editVersion <= 0) {
      return { ok: false, error: 'Edit version must be set (V1 or higher) before submitting for review.' }
    }
  }

  // review_script → fix_script: requires feedback
  if (fromStatus === 'review_script' && toStatus === 'fix_script') {
    if (!metadata?.feedback?.trim()) {
      return { ok: false, error: 'Feedback is required when sending a script back for fixes.' }
    }
  }

  // ready_for_internal_review → internal_adjustments_needed: requires feedback
  if (fromStatus === 'ready_for_internal_review' && toStatus === 'internal_adjustments_needed') {
    if (!metadata?.feedback?.trim()) {
      return { ok: false, error: 'Feedback is required when requesting internal adjustments.' }
    }
  }

  // edit_ready_to_send → edit_sent_to_client: design_status must be completed
  if (toStatus === 'edit_sent_to_client') {
    if (project.design_status !== 'completed') {
      return { ok: false, error: 'Design must be completed before the edit can be sent to the client.' }
    }
  }

  return { ok: true }
}

// ---------- Core Transition ----------

export async function transitionProjectStatus(
  projectId: string,
  toStatus: ProjectStatus,
  metadata?: TransitionMetadata
) {
  const supabase = await createClient()
  const member = await getCurrentTeamMember(supabase)
  if (!member) return { error: 'Unauthorized', project: null }

  // 1. Get current project
  const { data: project, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (fetchError || !project) {
    return { error: 'Project not found.', project: null }
  }

  const fromStatus = project.status as ProjectStatus

  // 2. Look up allowed transitions
  const transitions = STATUS_TRANSITIONS[fromStatus]
  if (!transitions) {
    return { error: `No transitions defined from status "${fromStatus}".`, project: null }
  }

  const matchingTransition = transitions.find(t => t.to === toStatus)
  if (!matchingTransition) {
    return {
      error: `Cannot transition from "${fromStatus}" to "${toStatus}". This transition is not allowed.`,
      project: null,
    }
  }

  // 3. Verify role authorization
  if (!matchingTransition.roles.includes(member.role)) {
    return {
      error: `Your role (${member.role}) is not authorized for this transition.`,
      project: null,
    }
  }

  // 4. Check preconditions
  const preconditionResult = checkPreconditions(project, fromStatus, toStatus, metadata)
  if (!preconditionResult.ok) {
    return { error: preconditionResult.error!, project: null }
  }

  // 5. Build update payload
  const now = new Date().toISOString()
  const updatePayload: Record<string, unknown> = {
    status: toStatus,
    last_status_change_at: now,
  }

  // Auto-populate actual_post_date when transitioning to posted_scheduled
  if (toStatus === 'posted_scheduled') {
    updatePayload.actual_post_date = now.split('T')[0] // DATE only
  }

  // Apply metadata fields to the project if provided
  if (metadata?.writer_id) updatePayload.writer_id = metadata.writer_id
  if (metadata?.editor_id) updatePayload.editor_id = metadata.editor_id
  if (metadata?.edit_url) updatePayload.edit_url = metadata.edit_url
  if (metadata?.edit_version !== undefined) updatePayload.edit_version = metadata.edit_version

  // 6. Update project (optimistic concurrency: only update if status hasn't changed)
  const { data: updatedProject, error: updateError } = await supabase
    .from('projects')
    .update(updatePayload)
    .eq('id', projectId)
    .eq('status', fromStatus)
    .select()
    .single()

  if (updateError) {
    // If no rows matched, status was changed by another user
    if (updateError.code === 'PGRST116') {
      return { error: 'This project was updated by someone else. Please refresh and try again.', project: null }
    }
    return { error: updateError.message, project: null }
  }

  // 7. Insert history record
  const historyNotes = metadata?.feedback || metadata?.notes || null
  const { error: historyError } = await supabase
    .from('project_status_history')
    .insert({
      project_id: projectId,
      from_status: fromStatus,
      to_status: toStatus,
      changed_by: member.id,
      notes: historyNotes,
    })

  if (historyError) {
    console.error('Failed to insert status history:', historyError.message)
    // Non-fatal — status was already updated
  }

  // 8. Fire-and-forget Slack notifications for critical transitions
  sendTransitionNotification(supabase, project, fromStatus, toStatus, member.id).catch(err => {
    console.error('Slack notification failed (non-blocking):', err)
  })

  revalidatePath('/projects/pipeline')
  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/clients/${project.client_id}`)

  return { error: null, project: updatedProject }
}

// ---------- Available Transitions ----------

export interface AvailableTransition {
  to: ProjectStatus
  label: string
}

export async function getAvailableTransitions(projectId: string): Promise<{
  error: string | null
  transitions: AvailableTransition[]
}> {
  const supabase = await createClient()
  const member = await getCurrentTeamMember(supabase)
  if (!member) return { error: 'Unauthorized', transitions: [] }

  const { data: project, error } = await supabase
    .from('projects')
    .select('status')
    .eq('id', projectId)
    .single()

  if (error || !project) {
    return { error: 'Project not found.', transitions: [] }
  }

  const currentStatus = project.status as ProjectStatus
  const allTransitions = STATUS_TRANSITIONS[currentStatus] ?? []

  // Filter to transitions allowed for this user's role
  const available = allTransitions
    .filter(t => t.roles.includes(member.role))
    .map(t => ({
      to: t.to,
      label: PROJECT_STATUS_LABELS[t.to],
    }))

  return { error: null, transitions: available }
}

// ---------- Slack Notifications (fire-and-forget) ----------

/**
 * Send targeted Slack DMs for the 4 critical-path transitions.
 * This is non-blocking — failures are logged but don't affect the transition.
 */
async function sendTransitionNotification(
  supabase: Awaited<ReturnType<typeof createClient>>,
  project: Record<string, any>,
  fromStatus: ProjectStatus,
  toStatus: ProjectStatus,
  changedById: string
) {
  // Only import slack service when needed to avoid startup cost
  const { sendDM } = await import('@/lib/services/slack')

  let targetEmail: string | null = null
  let message: string = ''

  // 1. editing → ready_for_internal_review → DM to assigned senior editor
  if (fromStatus === 'editing' && toStatus === 'ready_for_internal_review') {
    // Look up the client's assigned senior editor
    const { data: assignment } = await supabase
      .from('client_assignments')
      .select('team_members ( email, first_name )')
      .eq('client_id', project.client_id)
      .eq('assignment_role', 'senior_editor')
      .single()

    const tm = (assignment as any)?.team_members
    if (tm?.email) {
      targetEmail = tm.email
      message = `🎬 Edit submitted for review: *${project.title}* (${project.task_number}). Please review.`
    }
  }

  // 2. review_script → fix_script → DM to writer
  if (fromStatus === 'review_script' && toStatus === 'fix_script') {
    if (project.writer_id) {
      const { data: writer } = await supabase
        .from('team_members')
        .select('email')
        .eq('id', project.writer_id)
        .single()
      if (writer?.email) {
        targetEmail = writer.email
        message = `📝 Script needs fixes: *${project.title}* (${project.task_number}). Check the project for feedback.`
      }
    }
  }

  // 3. ready_for_internal_review → internal_adjustments_needed → DM to editor
  if (fromStatus === 'ready_for_internal_review' && toStatus === 'internal_adjustments_needed') {
    if (project.editor_id) {
      const { data: editor } = await supabase
        .from('team_members')
        .select('email')
        .eq('id', project.editor_id)
        .single()
      if (editor?.email) {
        targetEmail = editor.email
        message = `🔧 Edit needs adjustments: *${project.title}* (${project.task_number}). Check the project for feedback.`
      }
    }
  }

  // 4. internal_adjustments_needed → ready_for_internal_review → DM to senior editor
  if (fromStatus === 'internal_adjustments_needed' && toStatus === 'ready_for_internal_review') {
    const { data: assignment } = await supabase
      .from('client_assignments')
      .select('team_members ( email, first_name )')
      .eq('client_id', project.client_id)
      .eq('assignment_role', 'senior_editor')
      .single()

    const tm = (assignment as any)?.team_members
    if (tm?.email) {
      targetEmail = tm.email
      message = `✅ Edit fixed and resubmitted: *${project.title}* (${project.task_number}). Ready for your review.`
    }
  }

  if (targetEmail && message) {
    try {
      await sendDM(targetEmail, message)
    } catch (err) {
      // Log but don't throw — Slack failures must never block transitions
      console.error(`Slack DM to ${targetEmail} failed:`, err)
    }
  }
}
