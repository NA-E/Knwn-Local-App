'use server'

import { createClient } from '@/lib/supabase/server'
import type { ClientStatus, ProjectStatus, TeamRole } from '@/lib/types'
import { STATUS_TO_GROUP, type StatusGroup } from '@/lib/constants/status'

// ---------- Types ----------

export interface DashboardStats {
  clientsByStatus: Record<ClientStatus, number>
  projectsByGroup: Record<StatusGroup, number>
  activeClients: number
  activeProjects: number
  stuckCount: number
  completedThisMonth: number
}

// ---------- getDashboardStats ----------

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()

  // Run all queries in parallel
  const [clientsRes, projectsRes, completedRes] = await Promise.all([
    // Count clients by status
    supabase
      .from('clients')
      .select('status'),

    // Get all project statuses
    supabase
      .from('projects')
      .select('status'),

    // Projects completed this calendar month (moved to posted_scheduled)
    (() => {
      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      return supabase
        .from('project_status_history')
        .select('id', { count: 'exact', head: true })
        .eq('to_status', 'posted_scheduled')
        .gte('changed_at', monthStart)
    })(),
  ])

  // --- Client counts ---
  const clientsByStatus: Record<ClientStatus, number> = {
    template: 0,
    onboarding: 0,
    active: 0,
    disengaged: 0,
    pending: 0,
    inactive: 0,
  }
  for (const row of clientsRes.data ?? []) {
    const status = row.status as ClientStatus
    if (status in clientsByStatus) {
      clientsByStatus[status]++
    }
  }

  // --- Project counts by group ---
  const projectsByGroup: Record<StatusGroup, number> = {
    todo: 0,
    pre_production: 0,
    production: 0,
    post_production: 0,
    complete: 0,
    cancelled: 0,
  }
  const terminalStatuses: ProjectStatus[] = ['posted_scheduled', 'cancelled']
  let activeProjects = 0

  for (const row of projectsRes.data ?? []) {
    const status = row.status as ProjectStatus
    const group = STATUS_TO_GROUP[status]
    if (group) {
      projectsByGroup[group]++
    }
    if (!terminalStatuses.includes(status)) {
      activeProjects++
    }
  }

  // --- Stuck count (from stuck projects query — threshold 3 days) ---
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 3)
  const cutoffIso = cutoff.toISOString()

  const { count: stuckCount } = await supabase
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .lt('last_status_change_at', cutoffIso)
    .not('status', 'in', '("posted_scheduled","cancelled","on_hold")')

  return {
    clientsByStatus,
    projectsByGroup,
    activeClients: clientsByStatus.active,
    activeProjects,
    stuckCount: stuckCount ?? 0,
    completedThisMonth: completedRes.count ?? 0,
  }
}

// ---------- getCurrentUserRole ----------

export async function getCurrentUserRole(): Promise<TeamRole | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: member } = await supabase
    .from('team_members')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  return (member?.role as TeamRole) ?? null
}
