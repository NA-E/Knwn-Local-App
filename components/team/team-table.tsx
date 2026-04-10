'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS } from '@/lib/constants/roles'
import type { Pod } from '@/lib/types'

interface TeamMemberWithPods {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  team_member_pods?: Array<{
    pod_id: string
    pods?: { id: string; name: string } | null
  }>
}

interface TeamTableProps {
  members: TeamMemberWithPods[]
  pods: Pod[]
}

export function TeamTable({ members, pods }: TeamTableProps) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [podFilter, setPodFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    return members.filter((m) => {
      // Search by name
      if (search.trim()) {
        const fullName = `${m.first_name} ${m.last_name}`.toLowerCase()
        if (!fullName.includes(search.trim().toLowerCase())) return false
      }
      // Role filter
      if (roleFilter && m.role !== roleFilter) return false
      // Pod filter
      if (podFilter) {
        const hasPod = m.team_member_pods?.some((tmp) => tmp.pod_id === podFilter)
        if (!hasPod) return false
      }
      // Status filter
      if (statusFilter && m.status !== statusFilter) return false
      return true
    })
  }, [members, search, roleFilter, podFilter, statusFilter])

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[220px]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter by role"
          className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
        >
          <option value="">All Roles</option>
          {Object.entries(ROLE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={podFilter}
          onChange={(e) => setPodFilter(e.target.value)}
          aria-label="Filter by pod"
          className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
        >
          <option value="">All Pods</option>
          {pods.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="onboarding">Onboarding</option>
          <option value="contract_paused">Contract Paused</option>
          <option value="offboarded">Offboarded</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Name</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Role</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Email</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Pod(s)</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[13px] text-muted-foreground">
                  No team members match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="border-b border-border hover:bg-[#FAFAF7] transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium">
                    <Link href={`/team/${m.id}/edit`} className="hover:underline">
                      {m.first_name} {m.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">
                    {ROLE_LABELS[m.role as keyof typeof ROLE_LABELS] ?? m.role}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">{m.email}</td>
                  <td className="px-4 py-3 text-[13px]">
                    {m.team_member_pods?.map((tmp) => (
                      <span key={tmp.pod_id} className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-muted-foreground mr-1">
                        {tmp.pods?.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-[13px]">
                    <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>
                      {m.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
