'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

interface ClientTableProps {
  clients: any[]
}

export function ClientTable({ clients }: ClientTableProps) {
  const router = useRouter()
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
            <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap">Client</th>
            <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap max-w-[200px]">Market</th>
            <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap w-[80px]">Pod</th>
            <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap w-[130px]">Contract Start</th>
            <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap w-[100px]">Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c: any) => (
            <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                onClick={() => router.push(`/clients/${c.id}`)}>
              <td className="px-4 py-3 text-[13px] font-medium">
                <Link href={`/clients/${c.id}`} className="hover:underline">{c.name}</Link>
              </td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground max-w-[200px] truncate">{c.market ?? '—'}</td>
              <td className="px-4 py-3 text-[13px] w-[80px]">
                {c.pods?.name ? (
                  <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#EDEAE2] text-[#78756C]">
                    {c.pods.name}
                  </span>
                ) : '—'}
              </td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground w-[130px]">
                {c.contract_start_date
                  ? new Date(c.contract_start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </td>
              <td className="px-4 py-3 w-[100px]">
                <Badge className={`text-[11px] font-medium ${statusBadgeClass(c.status)}`}>{c.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
