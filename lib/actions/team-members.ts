'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TeamRole } from '@/lib/types'

export async function getTeamMembers(filters?: { role?: TeamRole; pod_id?: string; status?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('team_members')
    .select(`
      *,
      team_member_pods (
        pod_id,
        is_primary,
        pods ( id, name )
      )
    `)
    .order('first_name')

  if (filters?.role) query = query.eq('role', filters.role)
  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query
  if (error) throw error

  if (filters?.pod_id && data) {
    return data.filter((tm: any) =>
      tm.team_member_pods?.some((tmp: any) => tmp.pod_id === filters.pod_id)
    )
  }

  return data
}

export async function getTeamMember(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      team_member_pods (
        pod_id,
        is_primary,
        pods ( id, name )
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createTeamMember(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: currentMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()
  if (!currentMember || currentMember.role !== 'admin') {
    return { error: 'Only admins can create team members.' }
  }

  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !role?.trim()) {
    return { error: 'First name, last name, email, and role are required.' }
  }

  const { data: member, error: memberError } = await supabase
    .from('team_members')
    .insert({
      first_name,
      last_name,
      email,
      role: role as TeamRole,
      supervised_by: (formData.get('supervised_by') as string) || null,
    })
    .select()
    .single()

  if (memberError) return { error: memberError.message }

  const podIds = formData.getAll('pod_ids') as string[]
  const primaryPodId = formData.get('primary_pod_id') as string

  if (podIds.length > 0) {
    const podRows = podIds.map((pod_id) => ({
      team_member_id: member.id,
      pod_id,
      is_primary: pod_id === primaryPodId,
    }))
    const { error: podError } = await supabase.from('team_member_pods').insert(podRows)
    if (podError) return { error: podError.message }
  }

  revalidatePath('/team')
  return { error: null, id: member.id }
}

export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: currentMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()
  if (!currentMember || currentMember.role !== 'admin') {
    return { error: 'Only admins can update team members.' }
  }

  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !role?.trim()) {
    return { error: 'First name, last name, email, and role are required.' }
  }

  const status = formData.get('status') as string
  if (status && !['active', 'inactive'].includes(status)) {
    return { error: 'Invalid status value.' }
  }

  const { error: memberError } = await supabase
    .from('team_members')
    .update({
      first_name,
      last_name,
      email,
      role: role as TeamRole,
      supervised_by: (formData.get('supervised_by') as string) || null,
      status,
    })
    .eq('id', id)

  if (memberError) return { error: memberError.message }

  const { error: podDeleteError } = await supabase.from('team_member_pods').delete().eq('team_member_id', id)
  if (podDeleteError) return { error: podDeleteError.message }

  const podIds = formData.getAll('pod_ids') as string[]
  const primaryPodId = formData.get('primary_pod_id') as string

  if (podIds.length > 0) {
    const podRows = podIds.map((pod_id) => ({
      team_member_id: id,
      pod_id,
      is_primary: pod_id === primaryPodId,
    }))
    const { error: podInsertError } = await supabase.from('team_member_pods').insert(podRows)
    if (podInsertError) return { error: podInsertError.message }
  }

  revalidatePath('/team')
  revalidatePath(`/team/${id}/edit`)
  return { error: null }
}
