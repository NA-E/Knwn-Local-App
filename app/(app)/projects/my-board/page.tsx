import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getProjectsForBoard } from '@/lib/actions/project-filters'
import { BOARD_COLUMNS, BOARD_LABELS } from '@/lib/constants/boards'
import type { TeamRole, ProjectStatus, ProjectWithRelations } from '@/lib/types'
import { MyBoardClient } from './my-board-client'

export default async function MyBoardPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('team_members')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!member) redirect('/login')

  const userRole = member.role as TeamRole
  const columns = BOARD_COLUMNS[userRole]
  const boardLabel = BOARD_LABELS[userRole]

  // Fetch projects for this user's board
  const projects = await getProjectsForBoard(member.id, userRole)

  // Group projects by status
  const projectsByStatus: Record<ProjectStatus, ProjectWithRelations[]> = {} as any
  for (const status of columns) {
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
      <div className="mb-5">
        <h1 className="text-[19px] font-semibold tracking-tight">{boardLabel} Board</h1>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          {totalProjects} project{totalProjects !== 1 ? 's' : ''} assigned to you
        </p>
      </div>

      <MyBoardClient
        columns={columns}
        projectsByStatus={projectsByStatus}
        currentUserRole={userRole}
      />
    </div>
  )
}
