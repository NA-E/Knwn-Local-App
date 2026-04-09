'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { STATUS_GROUPS } from '@/lib/constants/status'

interface KanbanFiltersProps {
  pods: { id: string; name: string }[]
  clients: { id: string; name: string }[]
  teamMembers: { id: string; first_name: string; last_name: string }[]
}

export function KanbanFilters({ pods, clients, teamMembers }: KanbanFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/projects/pipeline?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <select
        defaultValue={searchParams.get('pod_id') ?? ''}
        onChange={(e) => updateParam('pod_id', e.target.value)}
        aria-label="Filter by pod"
        className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
      >
        <option value="">All Pods</option>
        {pods.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get('client_id') ?? ''}
        onChange={(e) => updateParam('client_id', e.target.value)}
        aria-label="Filter by client"
        className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
      >
        <option value="">All Clients</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get('status_group') ?? ''}
        onChange={(e) => updateParam('status_group', e.target.value)}
        aria-label="Filter by status group"
        className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
      >
        <option value="">All Statuses</option>
        {Object.entries(STATUS_GROUPS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get('team_member_id') ?? ''}
        onChange={(e) => updateParam('team_member_id', e.target.value)}
        aria-label="Filter by team member"
        className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
      >
        <option value="">All Team Members</option>
        {teamMembers.map((m) => (
          <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
        ))}
      </select>
    </div>
  )
}
