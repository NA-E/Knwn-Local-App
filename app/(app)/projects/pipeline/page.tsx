import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProjectsForPipeline, type PipelineFilters } from '@/lib/actions/project-filters'
import { PROJECT_STATUS_LABELS } from '@/lib/constants/status'
import type { StatusGroup } from '@/lib/constants/status'
import type { ProjectStatus, ProjectWithRelations } from '@/lib/types'
import { KanbanBoard } from '@/components/projects/kanban-board'
import { KanbanFilters } from '@/components/projects/kanban-filters'
import { PipelineClient } from './pipeline-client'

// All statuses in pipeline order
const PIPELINE_COLUMNS: ProjectStatus[] = [
  'idea', 'on_hold', 'brief', 'scriptwriting', 'review_script', 'fix_script',
  'script_ready_to_send', 'script_sent_to_client', 'client_uploaded',
  'editing', 'ready_for_internal_review', 'internal_adjustments_needed',
  'edit_ready_to_send', 'edit_sent_to_client', 'client_adjustments_needed',
  'ready_to_post', 'posted_scheduled',
]

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get current user's role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('team_members')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!member) redirect('/login')

  const userRole = member.role

  // Build filters from search params
  const filters: PipelineFilters = {}
  if (params.pod_id) filters.pod_id = params.pod_id
  if (params.client_id) filters.client_id = params.client_id
  if (params.status_group) filters.status_group = params.status_group as StatusGroup
  if (params.team_member_id) filters.team_member_id = params.team_member_id

  // Fetch data in parallel
  const [projects, { data: pods }, { data: clients }, { data: teamMembers }] = await Promise.all([
    getProjectsForPipeline(filters),
    supabase.from('pods').select('id, name').order('name'),
    supabase.from('clients').select('id, name').eq('status', 'active').order('name'),
    supabase.from('team_members').select('id, first_name, last_name, role').eq('status', 'active').order('first_name'),
  ])

  // Group projects by status
  const projectsByStatus: Record<ProjectStatus, ProjectWithRelations[]> = {} as any
  for (const status of PIPELINE_COLUMNS) {
    projectsByStatus[status] = []
  }
  for (const project of projects) {
    const status = project.status as ProjectStatus
    if (projectsByStatus[status]) {
      projectsByStatus[status].push(project)
    }
  }

  const totalProjects = projects.length

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight">Pipeline</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {totalProjects} project{totalProjects !== 1 ? 's' : ''} across all stages
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 rounded-md text-[13px] font-medium bg-brand-text-1 text-white hover:opacity-85 transition-opacity"
        >
          + New Project
        </Link>
      </div>

      <Suspense>
        <KanbanFilters
          pods={pods ?? []}
          clients={(clients ?? []).map(c => ({ id: c.id, name: c.name }))}
          teamMembers={teamMembers ?? []}
        />
      </Suspense>

      <div className="overflow-x-auto -mx-10 px-10">
        <PipelineClient
          columns={PIPELINE_COLUMNS}
          projectsByStatus={projectsByStatus}
          currentUserRole={userRole}
        />
      </div>
    </div>
  )
}
