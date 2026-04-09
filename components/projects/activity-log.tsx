'use client'

import { useEffect, useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { PROJECT_STATUS_LABELS, STATUS_TO_GROUP, STATUS_GROUP_COLORS } from '@/lib/constants/status'
import type { ProjectStatus } from '@/lib/types'
import { getProjectHistory, type ProjectHistoryEntry } from '@/lib/actions/project-filters'

interface ActivityLogProps {
  projectId: string
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const group = STATUS_TO_GROUP[status]
  const colors = STATUS_GROUP_COLORS[group]
  return (
    <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium', colors)}>
      {PROJECT_STATUS_LABELS[status]}
    </span>
  )
}

export function ActivityLog({ projectId }: ActivityLogProps) {
  const [entries, setEntries] = useState<ProjectHistoryEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const result = await getProjectHistory(projectId, 1, 20)
      setEntries(result.entries)
      setTotal(result.total)
      setPage(1)
    })
  }, [projectId])

  function loadMore() {
    const nextPage = page + 1
    startTransition(async () => {
      const result = await getProjectHistory(projectId, nextPage, 20)
      setEntries(prev => [...prev, ...result.entries])
      setPage(nextPage)
    })
  }

  const hasMore = entries.length < total

  return (
    <div className="bg-card border border-border rounded-[8px] p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3 mb-4">
        Activity Log
      </div>

      {entries.length === 0 && !isPending && (
        <p className="text-[12px] text-brand-text-3 italic">No activity yet.</p>
      )}

      <div className="space-y-0">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="relative flex gap-3 pb-4">
            {/* Vertical timeline line */}
            {idx < entries.length - 1 && (
              <div className="absolute left-[5px] top-3 bottom-0 w-px bg-border" />
            )}

            {/* Timeline dot */}
            <div className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-border bg-card" />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {entry.from_status ? (
                  <>
                    <StatusBadge status={entry.from_status} />
                    <span className="text-[11px] text-brand-text-3">&rarr;</span>
                    <StatusBadge status={entry.to_status} />
                  </>
                ) : (
                  <>
                    <span className="text-[11px] text-brand-text-2">Created as</span>
                    <StatusBadge status={entry.to_status} />
                  </>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-brand-text-3">
                <span>{entry.changed_by_name}</span>
                <span>&middot;</span>
                <span>{formatTimestamp(entry.changed_at)}</span>
              </div>
              {entry.notes && (
                <p className="mt-1 text-[12px] text-brand-text-2 bg-[#F7F6F1] rounded px-2 py-1.5">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isPending}
          className="text-[12px] text-brand-accent hover:underline mt-2"
        >
          {isPending ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  )
}
