'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

interface ClientTableProps {
  clients: any[]
}

export function ClientTable({ clients }: ClientTableProps) {
  const router = useRouter()
  function getStrategist(client: any) {
    const assignment = client.client_assignments?.find((a: any) => a.assignment_role === 'strategist')
    if (!assignment?.team_members) return '—'
    return `${assignment.team_members.first_name} ${assignment.team_members.last_name}`
  }

  function getVideosPerWeek(client: any) {
    if (!client.client_channels?.length) return '—'
    return client.client_channels.reduce((sum: number, ch: any) => sum + Number(ch.videos_per_week), 0)
  }

  function statusBadgeClass(status: string) {
    switch (status) {
      case 'active': return 'bg-status-active-bg text-status-active-text border-none'
      case 'onboarding': return 'bg-status-onboard-bg text-status-onboard-text border-none'
      default: return 'bg-status-inactive-bg text-status-inactive-text border-none'
    }
  }

  return (
    <div className="bg-card border border-border rounded-[10px] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-background">
            {['Client', 'Market', 'Pod', 'Status', 'Strategist'].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map((c: any) => (
            <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                onClick={() => router.push(`/clients/${c.id}`)}>
              <td className="px-4 py-3 text-[13px] font-medium">
                <Link href={`/clients/${c.id}`} className="hover:underline">{c.name}</Link>
              </td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground">{c.market ?? '—'}</td>
              <td className="px-4 py-3 text-[13px]">
                {c.pods?.name ? (
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-muted-foreground">
                    {c.pods.name}
                  </span>
                ) : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge className={`text-[11px] font-medium ${statusBadgeClass(c.status)}`}>{c.status}</Badge>
              </td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground">{getStrategist(c)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
