'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { ProjectStatus, ProjectWithRelations, TeamRole } from '@/lib/types'
import { KanbanBoard } from '@/components/projects/kanban-board'
import { transitionProjectStatus } from '@/lib/actions/project-transitions'

interface PipelineClientProps {
  columns: ProjectStatus[]
  projectsByStatus: Record<ProjectStatus, ProjectWithRelations[]>
  currentUserRole: TeamRole
}

export function PipelineClient({ columns, projectsByStatus, currentUserRole }: PipelineClientProps) {
  const router = useRouter()

  const handleTransition = useCallback(
    async (projectId: string, fromStatus: ProjectStatus, toStatus: ProjectStatus) => {
      const result = await transitionProjectStatus(projectId, toStatus)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Status updated')
        router.refresh()
      }
    },
    [router]
  )

  return (
    <KanbanBoard
      columns={columns}
      projectsByStatus={projectsByStatus}
      currentUserRole={currentUserRole}
      onTransition={handleTransition}
    />
  )
}
