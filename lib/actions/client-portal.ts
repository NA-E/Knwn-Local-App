'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { TeamRole, Client, Project, ClientChannel } from '@/lib/types'
import { PROJECT_STATUS_LABELS } from '@/lib/constants/status'

// ---------- Helpers ----------

async function getCurrentTeamMember(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: member } = await supabase
    .from('team_members')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  return member as { id: string; role: TeamRole } | null
}

const ALLOWED_ROLES: TeamRole[] = ['admin', 'strategist', 'jr_strategist']

// ---------- Generate Portal Token ----------

export async function generatePortalToken(clientId: string) {
  const supabase = await createClient()
  const member = await getCurrentTeamMember(supabase)
  if (!member) return { error: 'Unauthorized', url: null }
  if (!ALLOWED_ROLES.includes(member.role)) return { error: 'Insufficient permissions', url: null }

  const token = crypto.randomUUID()

  // Token expires in 90 days
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 90)

  const { error } = await supabase
    .from('clients')
    .update({ portal_token: token, portal_token_expires_at: expiresAt.toISOString() })
    .eq('id', clientId)

  if (error) return { error: error.message, url: null }

  revalidatePath(`/clients/${clientId}`)
  return { error: null, url: `/client/${token}` }
}

// ---------- Get Client by Portal Token ----------

export interface PortalProject {
  id: string
  title: string
  task_number: string
  status: string
  status_label: string
  edit_version: number
  edit_url: string | null
}

export interface PortalClientData {
  client: {
    id: string
    name: string
    status: string
    dropbox_upload_url: string | null
  }
  projects: PortalProject[]
  channels: { channel_name: string; channel_url: string | null; videos_per_week: number }[]
}

export async function getClientByPortalToken(token: string): Promise<PortalClientData | null> {
  // Validate token format (UUID)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return null
  }

  // Use service-role client to bypass RLS (portal is public via token)
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Select only columns needed for portal — never expose email, phone, special_instructions, etc.
  const { data: client, error } = await serviceSupabase
    .from('clients')
    .select('id, name, status, dropbox_upload_url, portal_token_expires_at')
    .eq('portal_token', token)
    .single()

  if (error || !client) return null

  // Check token expiry
  if (client.portal_token_expires_at) {
    const expiresAt = new Date(client.portal_token_expires_at)
    if (expiresAt < new Date()) return null
  }

  const [{ data: projects }, { data: channels }] = await Promise.all([
    serviceSupabase
      .from('projects')
      .select('id, title, task_number, status, edit_version, edit_url')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false }),
    serviceSupabase
      .from('client_channels')
      .select('channel_name, channel_url, videos_per_week')
      .eq('client_id', client.id)
      .order('channel_name'),
  ])

  const portalProjects: PortalProject[] = (projects ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    task_number: p.task_number,
    status: p.status,
    status_label: PROJECT_STATUS_LABELS[p.status as keyof typeof PROJECT_STATUS_LABELS] ?? p.status,
    edit_version: p.edit_version,
    edit_url: p.edit_url,
  }))

  return {
    client: {
      id: client.id,
      name: client.name,
      status: client.status,
      dropbox_upload_url: client.dropbox_upload_url,
    },
    projects: portalProjects,
    channels: (channels ?? []) as PortalClientData['channels'],
  }
}
