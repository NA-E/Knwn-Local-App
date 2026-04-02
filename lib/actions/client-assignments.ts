'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AssignmentRole } from '@/lib/types'

export async function upsertAssignment(clientId: string, assignmentRole: AssignmentRole, teamMemberId: string | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: me } = await supabase.from('team_members').select('role').eq('auth_user_id', user.id).single()
  if (!me || !['admin', 'strategist', 'jr_strategist'].includes(me.role)) {
    return { error: 'Insufficient permissions' }
  }

  const { error: deleteError } = await supabase
    .from('client_assignments')
    .delete()
    .eq('client_id', clientId)
    .eq('assignment_role', assignmentRole)

  if (deleteError) return { error: deleteError.message }

  if (teamMemberId) {
    const { error } = await supabase.from('client_assignments').insert({
      client_id: clientId,
      team_member_id: teamMemberId,
      assignment_role: assignmentRole,
    })
    if (error) return { error: error.message }
  }

  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function getEligibleMembers(assignmentRole: AssignmentRole) {
  const supabase = await createClient()
  const { ASSIGNMENT_ROLE_ELIGIBLE_TEAM_ROLES } = await import('@/lib/constants/roles')
  const eligibleRoles = ASSIGNMENT_ROLE_ELIGIBLE_TEAM_ROLES[assignmentRole]

  const { data, error } = await supabase
    .from('team_members')
    .select('id, first_name, last_name, role')
    .in('role', eligibleRoles)
    .eq('status', 'active')
    .order('first_name')

  if (error) {
    console.error('getEligibleMembers failed:', error.message)
    return []
  }
  return data
}
