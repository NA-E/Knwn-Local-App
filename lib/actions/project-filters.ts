'use server'

import { createClient } from '@/lib/supabase/server'
import type { ProjectStatus, TeamRole } from '@/lib/types'
import type { ProjectWithRelations } from '@/lib/types'
import { BOARD_COLUMNS, BOARD_FILTERS } from '@/lib/constants/boards'
import { STATUS_TO_GROUP, type StatusGroup } from '@/lib/constants/status'

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

/**
 * Standard select for projects with relations — used by all filter queries.
 * Returns raw Supabase rows that need to be mapped to ProjectWithRelations.
 */
const PROJECT_SELECT = `
  *,
  clients!inner ( name, pod_id, pods ( name ) ),
  writer:team_members!projects_writer_id_fkey ( first_name, last_name ),
  editor:team_members!projects_editor_id_fkey ( first_name, last_name )
`

/** Map a raw Supabase project row (with joins) to a flat ProjectWithRelations shape. */
function mapProjectRow(row: any): ProjectWithRelations {
  const client = row.clients as any
  const writer = row.writer as any
  const editor = row.editor as any

  const { clients: _c, writer: _w, editor: _e, ...rest } = row

  return {
    ...rest,
    client_name: client?.name ?? '',
    pod_id: client?.pod_id ?? null,
    pod_name: client?.pods?.name ?? null,
    writer_name: writer ? `${writer.first_name} ${writer.last_name}` : null,
    editor_name: editor ? `${editor.first_name} ${editor.last_name}` : null,
  }
}

// ---------- Pipeline (all projects, with optional filters) ----------

export interface PipelineFilters {
  pod_id?: string
  client_id?: string
  status_group?: StatusGroup
  team_member_id?: string
  date_field?: 'created_at' | 'script_v1_due'
  date_from?: string
  date_to?: string
}

export async function getProjectsForPipeline(
  filters?: PipelineFilters
): Promise<ProjectWithRelations[]> {
  const supabase = await createClient()

  let query = supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .order('created_at', { ascending: false })

  // Pod filter: filter via client's pod_id
  if (filters?.pod_id) {
    query = query.eq('clients.pod_id', filters.pod_id)
  }

  // Client filter
  if (filters?.client_id) {
    query = query.eq('client_id', filters.client_id)
  }

  // Status group filter: resolve group to individual statuses
  if (filters?.status_group) {
    const statuses = Object.entries(STATUS_TO_GROUP)
      .filter(([, group]) => group === filters.status_group)
      .map(([status]) => status)
    query = query.in('status', statuses)
  }

  // Team member filter: match writer_id or editor_id (validate UUID format)
  if (filters?.team_member_id) {
    const uuid = filters.team_member_id
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
      query = query.or(`writer_id.eq.${uuid},editor_id.eq.${uuid}`)
    }
  }

  // Date range filter (validate date_field to prevent column injection)
  const ALLOWED_DATE_FIELDS = ['created_at', 'script_v1_due'] as const
  if (filters?.date_field && ALLOWED_DATE_FIELDS.includes(filters.date_field as any)) {
    if (filters.date_from) {
      query = query.gte(filters.date_field, filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte(filters.date_field, filters.date_to)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error('Pipeline query failed:', error.message)
    return []
  }

  return (data ?? []).map(mapProjectRow)
}

// ---------- Board (role-specific) ----------

export async function getProjectsForBoard(
  userId?: string,
  role?: TeamRole
): Promise<ProjectWithRelations[]> {
  const supabase = await createClient()

  // If no userId/role provided, infer from current session
  let teamMemberId = userId
  let teamRole = role

  if (!teamMemberId || !teamRole) {
    const member = await getCurrentTeamMember(supabase)
    if (!member) return []
    teamMemberId = member.id
    teamRole = member.role
  }

  const boardFilter = BOARD_FILTERS[teamRole]
  const boardStatuses = BOARD_COLUMNS[teamRole]

  if (!boardFilter || !boardStatuses || boardStatuses.length === 0) {
    return []
  }

  let projectIds: string[] | null = null

  // Resolve which projects to show based on filter kind
  switch (boardFilter.kind) {
    case 'all': {
      // Admin: return all projects in their board statuses
      // projectIds stays null — no filtering needed beyond status
      break
    }

    case 'field': {
      // Writer/Editor: projects where writer_id/editor_id = current user
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq(boardFilter.field, teamMemberId)
        .in('status', boardStatuses)

      if (error) {
        console.error(`Board field filter query failed:`, error.message)
        return []
      }
      projectIds = (data ?? []).map(p => p.id)
      if (projectIds.length === 0) return []
      break
    }

    case 'assignment': {
      // Manager, Designer, Strategist, Jr Strategist, Senior Designer:
      // 1. Get clients assigned to this user with the given assignment_role
      // 2. Get projects for those clients
      const { data: assignments, error: assignError } = await supabase
        .from('client_assignments')
        .select('client_id')
        .eq('team_member_id', teamMemberId)
        .eq('assignment_role', boardFilter.role)

      if (assignError) {
        console.error('Board assignment filter query failed:', assignError.message)
        return []
      }

      const clientIds = (assignments ?? []).map(a => a.client_id)
      if (clientIds.length === 0) return []

      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .in('client_id', clientIds)
        .in('status', boardStatuses)

      if (error) {
        console.error('Board assignment project query failed:', error.message)
        return []
      }
      projectIds = (data ?? []).map(p => p.id)
      if (projectIds.length === 0) return []
      break
    }

    case 'supervised_by': {
      // Senior Writer / Senior Editor:
      // 1. Get team members supervised by current user
      // 2. Get projects where writer_id/editor_id is in those members
      const { data: supervised, error: supError } = await supabase
        .from('team_members')
        .select('id')
        .eq('supervised_by', teamMemberId)

      if (supError) {
        console.error('Board supervised_by query failed:', supError.message)
        return []
      }

      const subordinateIds = (supervised ?? []).map(s => s.id)
      if (subordinateIds.length === 0) return []

      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .in(boardFilter.targetField, subordinateIds)
        .in('status', boardStatuses)

      if (error) {
        console.error('Board supervised_by project query failed:', error.message)
        return []
      }
      projectIds = (data ?? []).map(p => p.id)
      if (projectIds.length === 0) return []
      break
    }
  }

  // Now fetch full project data with relations
  let fullQuery = supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .in('status', boardStatuses)
    .order('last_status_change_at', { ascending: false })

  if (projectIds !== null) {
    fullQuery = fullQuery.in('id', projectIds)
  }

  const { data, error } = await fullQuery

  if (error) {
    console.error('Board full project query failed:', error.message)
    return []
  }

  return (data ?? []).map(mapProjectRow)
}

// ---------- Project History ----------

export interface ProjectHistoryEntry {
  id: string
  from_status: ProjectStatus | null
  to_status: ProjectStatus
  changed_by_name: string
  notes: string | null
  changed_at: string
}

export async function getProjectHistory(
  projectId: string,
  page: number = 1,
  per_page: number = 20
): Promise<{ entries: ProjectHistoryEntry[]; total: number }> {
  const supabase = await createClient()
  const from = (page - 1) * per_page
  const to = from + per_page - 1

  const { data, count, error } = await supabase
    .from('project_status_history')
    .select(
      `
      id, from_status, to_status, notes, changed_at,
      team_members!project_status_history_changed_by_fkey ( first_name, last_name )
    `,
      { count: 'exact' }
    )
    .eq('project_id', projectId)
    .order('changed_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Project history query failed:', error.message)
    return { entries: [], total: 0 }
  }

  const entries: ProjectHistoryEntry[] = (data ?? []).map((row: any) => {
    const tm = row.team_members
    return {
      id: row.id,
      from_status: row.from_status,
      to_status: row.to_status,
      changed_by_name: tm ? `${tm.first_name} ${tm.last_name}` : 'Unknown',
      notes: row.notes,
      changed_at: row.changed_at,
    }
  })

  return { entries, total: count ?? 0 }
}

// ---------- Stuck Projects ----------

export interface StuckProject extends ProjectWithRelations {
  days_stuck: number
}

export async function getStuckProjects(thresholdDays: number = 3): Promise<StuckProject[]> {
  const supabase = await createClient()

  // Calculate the cutoff date
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - thresholdDays)
  const cutoffIso = cutoff.toISOString()

  // Get projects that haven't had a status change in > thresholdDays
  // Exclude terminal and intentionally paused statuses
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .lt('last_status_change_at', cutoffIso)
    .not('status', 'in', '("posted_scheduled","cancelled","on_hold")')
    .order('last_status_change_at', { ascending: true })

  if (error) {
    console.error('Stuck projects query failed:', error.message)
    return []
  }

  const now = Date.now()

  return (data ?? []).map(row => {
    const mapped = mapProjectRow(row)
    const lastChange = new Date(mapped.last_status_change_at).getTime()
    const days_stuck = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24))
    return { ...mapped, days_stuck }
  })
}
