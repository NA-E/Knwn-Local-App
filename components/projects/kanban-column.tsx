'use client'

import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { cn } from '@/lib/utils'
import { PROJECT_STATUS_LABELS } from '@/lib/constants/status'
import type { ProjectStatus, ProjectWithRelations } from '@/lib/types'
import type { StatusGroup } from '@/lib/constants/status'
import { ProjectCard } from './project-card'

interface KanbanColumnProps {
  status: ProjectStatus
  projects: ProjectWithRelations[]
  statusGroup: StatusGroup
  /** Called when a project is dropped onto this column */
  onDrop: (projectId: string, fromStatus: ProjectStatus, toStatus: ProjectStatus) => void
  /** Whether a drop on this column would be valid (set by the board during drag) */
  isValidTarget?: boolean
  /** Whether a drag is in progress (set by the board) */
  isDragActive?: boolean
}

export function KanbanColumn({
  status,
  projects,
  statusGroup,
  onDrop,
  isValidTarget,
  isDragActive,
}: KanbanColumnProps) {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  useEffect(() => {
    const el = dropRef.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      getData: () => ({ targetStatus: status }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source }) => {
        setIsDraggedOver(false)
        const projectId = source.data.projectId as string
        const fromStatus = source.data.projectStatus as ProjectStatus
        if (fromStatus !== status) {
          onDrop(projectId, fromStatus, status)
        }
      },
    })
  }, [status, onDrop])

  const label = PROJECT_STATUS_LABELS[status]

  // Determine border styling for drop target feedback
  const showValidFeedback = isDragActive && isDraggedOver && isValidTarget === true
  const showInvalidFeedback = isDragActive && isDraggedOver && isValidTarget === false

  return (
    <div
      className={cn(
        'flex w-[240px] min-w-[240px] flex-col rounded-lg border bg-background p-3',
        showValidFeedback && 'border-2 border-dashed border-cyan-500',
        showInvalidFeedback && 'border-2 border-dashed border-red-400',
        !showValidFeedback && !showInvalidFeedback && 'border-border'
      )}
    >
      {/* Column header */}
      <div className="mb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.10em] text-brand-text-2">
          {label}
        </h3>
      </div>

      {/* Droppable area */}
      <div
        ref={dropRef}
        className={cn(
          'flex flex-1 flex-col gap-2 overflow-y-auto rounded-md p-1',
          showValidFeedback && 'bg-cyan-50/40',
          showInvalidFeedback && 'bg-red-50/30'
        )}
      >
        {projects.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            {showInvalidFeedback ? (
              <span className="text-[11px] font-medium text-red-400">Not allowed</span>
            ) : (
              <span className="text-[11px] text-brand-text-3">Empty</span>
            )}
          </div>
        ) : (
          <>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {showInvalidFeedback && (
              <div className="flex items-center justify-center py-2">
                <span className="text-[11px] font-medium text-red-400">Not allowed</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
