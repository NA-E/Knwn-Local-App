import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from '@/lib/actions/dashboard'
import { getStuckProjects } from '@/lib/actions/project-filters'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/dashboard/stat-card'
import { StuckProjectsTable } from '@/components/dashboard/stuck-projects-table'
import {
  STATUS_GROUPS,
  type StatusGroup,
} from '@/lib/constants/status'
import type { TeamRole } from '@/lib/types'

/** Stronger bar colors for the dashboard chart (the constant STATUS_GROUP_COLORS is too light for bars) */
const BAR_COLORS: Record<StatusGroup, string> = {
  todo: 'bg-gray-300',
  pre_production: 'bg-blue-400',
  production: 'bg-amber-400',
  post_production: 'bg-emerald-400',
  complete: 'bg-purple-400',
  cancelled: 'bg-red-400',
}

const DASHBOARD_ROLES: TeamRole[] = ['admin', 'strategist', 'jr_strategist']

export default async function DashboardPage() {
  // --- Auth & role check ---
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('team_members')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  const role = (member?.role as TeamRole) ?? null

  if (!role || !DASHBOARD_ROLES.includes(role)) {
    redirect('/projects/my-board')
  }

  // --- Fetch data ---
  const [stats, stuckProjects] = await Promise.all([
    getDashboardStats(),
    getStuckProjects(3),
  ])

  // Groups to display (exclude cancelled from the bar)
  const displayGroups: StatusGroup[] = [
    'todo',
    'pre_production',
    'production',
    'post_production',
    'complete',
  ]
  const maxGroupCount = Math.max(
    ...displayGroups.map((g) => stats.projectsByGroup[g]),
    1
  )

  return (
    <div>
      <PageHeader title="Dashboard" />

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Clients" value={stats.activeClients} />
        <StatCard label="Active Projects" value={stats.activeProjects} />
        <StatCard
          label="Stuck Projects"
          value={stats.stuckCount}
          accent="amber"
        />
        <StatCard
          label="Completed This Month"
          value={stats.completedThisMonth}
          accent="green"
        />
      </div>

      {/* --- Projects by Status Group --- */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3">
            Projects by Stage
          </h2>
          <span
            title="Shows how many projects are currently in each pipeline phase. If a bar is disproportionately large, it signals a bottleneck — work is piling up at that stage and not flowing through to the next."
            className="inline-flex items-center justify-center size-4 rounded-full bg-[#EDEAE2] text-[9px] font-bold text-[#78756C] cursor-help select-none"
          >
            ?
          </span>
        </div>
        <div className="bg-card border border-border rounded-[8px] px-5 py-4 shadow-[0_1px_3px_rgba(26,25,22,0.06),0_1px_2px_rgba(26,25,22,0.04)]">
          <div className="space-y-3">
            {displayGroups.map((group) => {
              const count = stats.projectsByGroup[group]
              const pct = maxGroupCount > 0 ? (count / maxGroupCount) * 100 : 0
              const barColor = BAR_COLORS[group]

              return (
                <div key={group} className="flex items-center gap-3">
                  <span className="text-[12px] font-medium text-brand-text-2 w-[120px] shrink-0">
                    {STATUS_GROUPS[group]}
                  </span>
                  <div className="flex-1 h-[22px] bg-background rounded-[4px] overflow-hidden">
                    <div
                      className={`h-full rounded-[4px] transition-all ${barColor}`}
                      style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[13px] font-semibold text-brand-text-1 w-[36px] text-right tabular-nums">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* --- Stuck Projects --- */}
      <section>
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3 mb-3">
          Stuck Projects
          {stuckProjects.length > 0 && (
            <span className="ml-2 text-amber-600">({stuckProjects.length})</span>
          )}
        </h2>
        <StuckProjectsTable projects={stuckProjects} />
      </section>
    </div>
  )
}
