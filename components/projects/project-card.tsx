'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { PenLine, Film, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DESIGN_STATUS_LABELS } from '@/lib/constants/status'
import type { ProjectWithRelations } from '@/lib/types'

interface ProjectCardProps {
  project: ProjectWithRelations
  isDragging?: boolean
}

/** Design status dot color mapping */
const DESIGN_DOT_COLOR: Record<string, string> = {
  not_started: 'bg-[#D2CFC6]',
  in_progress: 'bg-brand-accent',
  completed: 'bg-[#1A6B40]',
}

/** Design status container tint mapping */
const DESIGN_TINT_BG: Record<string, string> = {
  not_started: 'bg-[#F2F1ED]',
  in_progress: 'bg-brand-accent-bg',
  completed: 'bg-[#D9F5E8]',
}

/**
 * Compute "Xd in status" from last_status_change_at.
 * Returns e.g. "3d in status" or "0d in status".
 */
function daysInStatus(lastChange: string): string {
  const changed = new Date(lastChange)
  const now = new Date()
  const diffMs = now.getTime() - changed.getTime()
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  return `${days}d in status`
}

/** Format a due date string to short month/day format */
function formatDueDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Pick the most relevant due date based on current status */
function getRelevantDueDate(project: ProjectWithRelations): { label: string; date: string } | null {
  // Pre-production statuses: show script due
  const scriptStatuses = ['idea', 'on_hold', 'brief', 'scriptwriting', 'review_script', 'fix_script', 'script_ready_to_send', 'script_sent_to_client']
  // Post-production/complete: show publish due
  const publishStatuses = ['ready_to_post', 'posted_scheduled']

  if (scriptStatuses.includes(project.status) && project.script_v1_due) {
    return { label: 'Script', date: project.script_v1_due }
  }
  if (publishStatuses.includes(project.status) && project.publish_due) {
    return { label: 'Publish', date: project.publish_due }
  }
  if (project.edit_due) {
    return { label: 'Edit', date: project.edit_due }
  }
  if (project.publish_due) {
    return { label: 'Publish', date: project.publish_due }
  }
  if (project.script_v1_due) {
    return { label: 'Script', date: project.script_v1_due }
  }
  return null
}

export function ProjectCard({ project, isDragging: isDraggingProp }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDraggingLocal, setIsDraggingLocal] = useState(false)
  const wasDragging = useRef(false)
  const router = useRouter()

  const isDragging = isDraggingProp ?? isDraggingLocal

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({
        projectId: project.id,
        projectStatus: project.status,
        taskNumber: project.task_number,
      }),
      onDragStart: () => {
        setIsDraggingLocal(true)
        wasDragging.current = true
      },
      onDrop: () => {
        setIsDraggingLocal(false)
        // Reset after a tick so onClick can check it
        requestAnimationFrame(() => { wasDragging.current = false })
      },
    })
  }, [project.id, project.status, project.task_number])

  const handleClick = () => {
    if (!wasDragging.current) {
      router.push(`/projects/${project.id}`)
    }
  }

  const dueInfo = getRelevantDueDate(project)
  const designLabel = DESIGN_STATUS_LABELS[project.design_status]

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        'w-full cursor-pointer rounded-lg border bg-card p-3.5 transition-all duration-150',
        isDragging
          ? 'cursor-grabbing rotate-[1.5deg] border-dashed border-brand-accent opacity-55 shadow-[0_8px_24px_rgba(26,25,22,0.18)]'
          : 'border-border shadow-[0_1px_3px_rgba(26,25,22,0.06),0_1px_2px_rgba(26,25,22,0.04)] hover:border-brand-accent hover:shadow-[0_2px_8px_rgba(200,120,42,0.10)]'
      )}
    >
      {/* Row 1: Edit version (if any) */}
      {project.edit_version > 0 && (
        <div className="flex items-center justify-end">
          <span className="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
            V{project.edit_version}
          </span>
        </div>
      )}

      {/* Row 2: Title */}
      <p className={cn("text-[13px] font-semibold leading-snug text-brand-text-1 line-clamp-2", project.edit_version > 0 ? 'mt-1.5' : '')}>

        {project.title}
      </p>

      {/* Row 3: Client name */}
      <p className="mt-1 text-[11px] text-brand-text-2">
        {project.client_name}
      </p>

      {/* Row 4: Assignees */}
      <div className="mt-2.5 flex flex-col gap-1">
        {project.writer_name && (
          <div className="flex items-center gap-1.5">
            <PenLine className="size-3 shrink-0 text-brand-text-3" strokeWidth={1.5} />
            <span className="truncate text-[11px] text-brand-text-2">
              {project.writer_name}
            </span>
          </div>
        )}
        {project.editor_name && (
          <div className="flex items-center gap-1.5">
            <Film className="size-3 shrink-0 text-brand-text-3" strokeWidth={1.5} />
            <span className="truncate text-[11px] text-brand-text-2">
              {project.editor_name}
            </span>
          </div>
        )}
      </div>

      {/* Row 5: Design status */}
      <div
        className={cn(
          'mt-2.5 flex items-center gap-1.5 rounded px-2 py-1',
          DESIGN_TINT_BG[project.design_status] ?? 'bg-[#F2F1ED]'
        )}
      >
        <span
          className={cn(
            'inline-block size-[7px] shrink-0 rounded-full',
            DESIGN_DOT_COLOR[project.design_status] ?? 'bg-[#D2CFC6]'
          )}
        />
        <span className="text-[10.5px] font-medium text-brand-text-2">
          {designLabel}
        </span>
      </div>

      {/* Row 6: Due date + time in status */}
      <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2">
        <div className="flex items-center gap-1">
          {dueInfo ? (
            <>
              <Calendar className="size-3 text-brand-text-3" strokeWidth={1.5} />
              <span className="text-[10.5px] text-brand-text-2">
                {formatDueDate(dueInfo.date)}
              </span>
            </>
          ) : (
            <span className="text-[10.5px] text-brand-text-3">No date</span>
          )}
        </div>
        <span className="text-[10.5px] text-brand-text-3">
          {daysInStatus(project.last_status_change_at)}
        </span>
      </div>
    </div>
  )
}
