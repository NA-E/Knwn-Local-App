import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PROJECT_STATUS_LABELS, DESIGN_STATUS_LABELS } from '@/lib/constants/status'
import type { ProjectStatus, DesignStatus } from '@/lib/types'

interface ProjectRow {
  id: string
  task_number: string
  title: string
  status: ProjectStatus
  design_status: DesignStatus
  writer: { first_name: string; last_name: string } | null
  editor: { first_name: string; last_name: string } | null
}

interface Props {
  projects: ProjectRow[]
}

function designDotClass(status: DesignStatus) {
  switch (status) {
    case 'not_started': return 'bg-muted-foreground/40'
    case 'in_progress': return 'bg-status-onboard-text'
    case 'completed': return 'bg-status-active-text'
    default: return 'bg-muted-foreground/40'
  }
}

function personName(p: { first_name: string; last_name: string } | null) {
  if (!p) return '—'
  return `${p.first_name} ${p.last_name}`
}

export function ClientProjectsSection({ projects }: Props) {
  return (
    <div className="col-span-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Projects</h2>
        <span className="text-[11px] text-muted-foreground">{projects.length} projects</span>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-[10px] p-6 text-center text-[13px] text-muted-foreground">
          No projects yet.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                {['Task ID', 'Title', 'Status', 'Writer', 'Editor', 'Design'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-muted transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/projects/${p.id}`} className="text-[12px] font-mono text-muted-foreground hover:underline">
                      {p.task_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium">
                    <Link href={`/projects/${p.id}`} className="hover:underline">{p.title}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-[10.5px] font-medium">
                      {PROJECT_STATUS_LABELS[p.status] ?? p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">{personName(p.writer)}</td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">{personName(p.editor)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`size-2 rounded-full ${designDotClass(p.design_status)}`} />
                      <span className="text-[11px] text-muted-foreground">{DESIGN_STATUS_LABELS[p.design_status] ?? p.design_status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
