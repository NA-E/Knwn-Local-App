'use client'

import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
  PROJECT_STATUS_LABELS,
  STATUS_TO_GROUP,
  STATUS_GROUP_COLORS,
} from '@/lib/constants/status'
import type { StuckProject } from '@/lib/actions/project-filters'
import type { ProjectStatus } from '@/lib/types'

interface StuckProjectsTableProps {
  projects: StuckProject[]
}

export function StuckProjectsTable({ projects }: StuckProjectsTableProps) {
  const router = useRouter()

  function daysStuckClass(days: number): string {
    if (days > 7) return 'text-red-600 font-semibold'
    if (days > 5) return 'text-amber-600 font-semibold'
    return 'text-brand-text-1'
  }

  if (projects.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[10px] px-6 py-10 text-center">
        <p className="text-[13px] text-brand-text-2">No stuck projects. Everything is moving.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-[10px] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-background">
            {['Title', 'Client', 'Status', 'Days Stuck', 'Writer', 'Editor'].map(
              (h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const status = p.status as ProjectStatus
            const group = STATUS_TO_GROUP[status]
            const groupColors = STATUS_GROUP_COLORS[group]

            return (
              <tr
                key={p.id}
                className="border-b border-border last:border-b-0 hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                onClick={() => router.push(`/projects/${p.id}`)}
              >
                <td className="px-4 py-3 text-[13px] font-medium text-brand-text-1 max-w-[240px] truncate">
                  {p.title}
                </td>
                <td className="px-4 py-3 text-[13px] text-brand-text-2">
                  {p.client_name}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    className={`text-[11px] font-medium border-none ${groupColors}`}
                  >
                    {PROJECT_STATUS_LABELS[status]}
                  </Badge>
                </td>
                <td className={`px-4 py-3 text-[13px] ${daysStuckClass(p.days_stuck)}`}>
                  {p.days_stuck}d
                </td>
                <td className="px-4 py-3 text-[13px] text-brand-text-2">
                  {p.writer_name ?? '—'}
                </td>
                <td className="px-4 py-3 text-[13px] text-brand-text-2">
                  {p.editor_name ?? '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
