'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ClientStatus } from '@/lib/types'

export interface ClientListFilters {
  search?: string
  status?: ClientStatus
  pod_id?: string
  page?: number
  per_page?: number
}

export async function getClients(filters: ClientListFilters = {}) {
  const supabase = await createClient()
  const { page = 1, per_page = 25 } = filters
  const from = (page - 1) * per_page
  const to = from + per_page - 1

  let query = supabase
    .from('clients')
    .select(`
      *,
      pods ( name ),
      client_channels ( videos_per_week ),
      client_assignments (
        assignment_role,
        team_members ( first_name, last_name )
      )
    `, { count: 'exact' })
    .order('name')
    .range(from, to)

  if (filters.search) query = query.ilike('name', `%${filters.search}%`)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.pod_id) query = query.eq('pod_id', filters.pod_id)

  const { data, count, error } = await query
  if (error) {
    console.error('Client query with assignments failed, using fallback:', error.message)
    // Fallback without assignments join
    const fallback = supabase
      .from('clients')
      .select('*, pods ( name ), client_channels ( videos_per_week )', { count: 'exact' })
      .order('name')
      .range(from, to)
    if (filters.search) fallback.ilike('name', `%${filters.search}%`)
    if (filters.status) fallback.eq('status', filters.status)
    if (filters.pod_id) fallback.eq('pod_id', filters.pod_id)
    const { data: d, count: c } = await fallback
    return { clients: d ?? [], total: c ?? 0 }
  }

  return { clients: data ?? [], total: count ?? 0 }
}

export async function getClient(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*, pods ( name )')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', id: null }

  const { data: currentMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()
  if (!currentMember || !['admin', 'strategist', 'jr_strategist'].includes(currentMember.role)) {
    return { error: 'Only admins, strategists, and jr. strategists can create clients.', id: null }
  }

  const name = formData.get('name') as string
  if (!name?.trim()) return { error: 'Client name is required.', id: null }

  const fields: Record<string, any> = {
    name: formData.get('name'),
    market: formData.get('market') || null,
    timezone: formData.get('timezone') || null,
    website: formData.get('website') || null,
    youtube_channel_url: formData.get('youtube_channel_url') || null,
    dropbox_upload_url: formData.get('dropbox_upload_url') || null,
    broll_library_url: formData.get('broll_library_url') || null,
    slack_channel_url: formData.get('slack_channel_url') || null,
    status: formData.get('status') || 'onboarding',
    pod_id: formData.get('pod_id') || null,
    package: formData.get('package') || null,
    contract_start_date: formData.get('contract_start_date') || null,
    posting_schedule: formData.get('posting_schedule') || null,
    script_format: formData.get('script_format') || null,
    communication_method: formData.get('communication_method') || null,
    special_instructions: formData.get('special_instructions') || null,
    health: formData.get('health') || null,
    brand_voice_guide_url: formData.get('brand_voice_guide_url') || null,
    area_guide_url: formData.get('area_guide_url') || null,
    approval_emails: formData.get('approval_emails') || null,
  }

  const { data, error } = await supabase.from('clients').insert(fields).select().single()
  if (error) return { error: error.message, id: null }

  // Insert 6 onboarding step rows (all pending)
  const onboardingSteps = [
    'slack_channel', 'dropbox_folder', 'gdrive_folder',
    'slack_invite', 'welcome_message', 'team_notify',
  ] as const

  const { error: stepsError } = await supabase
    .from('onboarding_steps')
    .insert(onboardingSteps.map(step => ({
      client_id: data.id,
      step,
      status: 'pending',
    })))

  if (stepsError) {
    console.error('Failed to insert onboarding steps:', stepsError.message)
    // Don't fail the whole operation — the client was created successfully
  }

  revalidatePath('/clients')
  return { error: null, id: data.id }
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: currentMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()
  if (!currentMember || !['admin', 'strategist', 'jr_strategist'].includes(currentMember.role)) {
    return { error: 'Only admins, strategists, and jr. strategists can update clients.' }
  }

  const fields: Record<string, any> = {
    name: formData.get('name'),
    market: formData.get('market') || null,
    timezone: formData.get('timezone') || null,
    website: formData.get('website') || null,
    youtube_channel_url: formData.get('youtube_channel_url') || null,
    dropbox_upload_url: formData.get('dropbox_upload_url') || null,
    broll_library_url: formData.get('broll_library_url') || null,
    slack_channel_url: formData.get('slack_channel_url') || null,
    status: formData.get('status'),
    pod_id: formData.get('pod_id') || null,
    package: formData.get('package') || null,
    contract_start_date: formData.get('contract_start_date') || null,
    posting_schedule: formData.get('posting_schedule') || null,
    script_format: formData.get('script_format') || null,
    communication_method: formData.get('communication_method') || null,
    special_instructions: formData.get('special_instructions') || null,
    health: formData.get('health') || null,
    brand_voice_guide_url: formData.get('brand_voice_guide_url') || null,
    area_guide_url: formData.get('area_guide_url') || null,
    approval_emails: formData.get('approval_emails') || null,
  }

  const { error } = await supabase.from('clients').update(fields).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  return { error: null }
}
