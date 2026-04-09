'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  STATUS_TO_GROUP,
  STATUS_GROUPS,
} from '@/lib/constants/status'
import type { StatusGroup } from '@/lib/constants/status'
import type { ProjectStatus, ProjectWithRelations, TeamRole } from '@/lib/types'
import { canDropProject } from './drag-validation'
import { KanbanColumn } from './kanban-column'

interface KanbanBoardProps {
  /** Ordered list of status columns to render */
  columns: ProjectStatus[]
  /** Projects grouped by status */
  projectsByStatus: Record<ProjectStatus, ProjectWithRelations[]>
  /** Current user's team role (for transition validation) */
  currentUserRole: TeamRole
  /** Callback when a valid transition drop occurs */
  onTransition: (projectId: string, fromStatus: ProjectStatus, toStatus: ProjectStatus) => void
}

/** Ordered groups for rendering group pills and separators */
const GROUP_ORDER: StatusGroup[] = [
  'todo',
  'pre_production',
  'production',
  'post_production',
  'complete',
  'cancelled',
]

/**
 * Group pill colors — background/text pairs that match STATUS_GROUP_COLORS
 * but are optimized for the vertical pill format.
 */
const GROUP_PILL_COLORS: Record<StatusGroup, string> = {
  todo: 'bg-gray-200 text-gray-600',
  pre_production: 'bg-blue-100 text-blue-700',
  production: 'bg-amber-100 text-amber-700',
  post_production: 'bg-green-100 text-green-700',
  complete: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-700',
}

export function KanbanBoard({
  columns,
  projectsByStatus,
  currentUserRole,
  onTransition,
}: KanbanBoardProps) {
  // Track which project is being dragged and whether the target is valid
  const [dragState, setDragState] = useState<{
    projectId: string
    project: ProjectWithRelations | null
  } | null>(null)

  // Build a lookup of projectId -> project for drag validation
  const projectById = useMemo(() => {
    const map = new Map<string, ProjectWithRelations>()
    for (const status of columns) {
      const projects = projectsByStatus[status] ?? []
      for (const p of projects) {
        map.set(p.id, p)
      }
    }
    return map
  }, [columns, projectsByStatus])

  // Group columns by StatusGroup
  const groupedColumns = useMemo(() => {
    const groups = new Map<StatusGroup, ProjectStatus[]>()

    for (const status of columns) {
      const group = STATUS_TO_GROUP[status]
      if (!groups.has(group)) {
        groups.set(group, [])
      }
      groups.get(group)!.push(status)
    }

    // Return in defined order, filtering to only groups with columns
    return GROUP_ORDER
      .filter((g) => groups.has(g))
      .map((g) => ({
        group: g,
        label: STATUS_GROUPS[g],
        statuses: groups.get(g)!,
      }))
  }, [columns])

  // Handle drop: validate then call onTransition or show toast
  const handleDrop = useCallback(
    (projectId: string, fromStatus: ProjectStatus, toStatus: ProjectStatus) => {
      const project = projectById.get(projectId)
      if (!project) return

      const result = canDropProject(project, toStatus, currentUserRole)
      if (result.allowed) {
        onTransition(projectId, fromStatus, toStatus)
      } else {
        toast.error(result.reason ?? 'This transition is not allowed')
      }
    },
    [projectById, currentUserRole, onTransition]
  )

  // Compute per-column validity for the current drag
  const columnValidity = useMemo(() => {
    if (!dragState?.project) return new Map<ProjectStatus, boolean>()

    const map = new Map<ProjectStatus, boolean>()
    for (const status of columns) {
      if (status === dragState.project.status) {
        map.set(status, true) // same column is always "valid" (no-op)
      } else {
        const result = canDropProject(dragState.project, status, currentUserRole)
        map.set(status, result.allowed)
      }
    }
    return map
  }, [dragState, columns, currentUserRole])

  // Global drag monitor
  useEffect(() => {
    return monitorForElements({
      onDragStart: ({ source }) => {
        const projectId = source.data.projectId as string
        const project = projectById.get(projectId) ?? null
        setDragState({ projectId, project })
      },
      onDrop: () => {
        setDragState(null)
      },
    })
  }, [projectById])

  // Track which groups are collapsed
  const [collapsedGroups, setCollapsedGroups] = useState<Set<StatusGroup>>(new Set())

  const toggleGroup = useCallback((group: StatusGroup) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }, [])

  // Count total projects in a group
  const groupProjectCount = useCallback(
    (statuses: ProjectStatus[]) =>
      statuses.reduce((sum, s) => sum + (projectsByStatus[s]?.length ?? 0), 0),
    [projectsByStatus]
  )

  return (
    <div className="flex flex-col gap-3 pb-4">
      {groupedColumns.map((groupDef) => {
        const isCollapsed = collapsedGroups.has(groupDef.group)
        const totalCards = groupProjectCount(groupDef.statuses)

        return (
          <div key={groupDef.group} className="rounded-xl border border-border/60 bg-background/50">
            {/* Group header — click to collapse/expand */}
            <button
              onClick={() => toggleGroup(groupDef.group)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-background/80 transition-colors rounded-t-xl"
            >
              <span className="text-[10px] text-brand-text-3 transition-transform duration-200"
                style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
              >
                ▼
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.10em]',
                  GROUP_PILL_COLORS[groupDef.group]
                )}
              >
                {groupDef.label}
              </span>
              <span className="text-[11px] text-brand-text-3">
                {totalCards} {totalCards === 1 ? 'project' : 'projects'}
              </span>
            </button>

            {/* Columns row — hidden when collapsed */}
            {!isCollapsed && (
              <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
                {groupDef.statuses.map((status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    projects={projectsByStatus[status] ?? []}
                    statusGroup={groupDef.group}
                    onDrop={handleDrop}
                    isDragActive={dragState !== null}
                    isValidTarget={columnValidity.get(status)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
