'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo } from 'react'

interface ClientTableProps {
  clients: any[]
}

type SortColumn = 'name' | 'market' | 'pod' | 'contract_start_date' | 'status' | null
type SortDirection = 'asc' | 'desc'

export function ClientTable({ clients }: ClientTableProps) {
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else {
        // third click — clear sort
        setSortColumn(null)
        setSortDirection('asc')
      }
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedClients = useMemo(() => {
    if (!sortColumn) return clients

    return [...clients].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      if (sortColumn === 'name') {
        aVal = (a.name ?? '').toLowerCase()
        bVal = (b.name ?? '').toLowerCase()
      } else if (sortColumn === 'market') {
        aVal = (a.market ?? '').toLowerCase()
        bVal = (b.market ?? '').toLowerCase()
      } else if (sortColumn === 'pod') {
        aVal = (a.pods?.name ?? '').toLowerCase()
        bVal = (b.pods?.name ?? '').toLowerCase()
      } else if (sortColumn === 'contract_start_date') {
        aVal = a.contract_start_date ? new Date(a.contract_start_date).getTime() : 0
        bVal = b.contract_start_date ? new Date(b.contract_start_date).getTime() : 0
      } else if (sortColumn === 'status') {
        aVal = (a.status ?? '').toLowerCase()
        bVal = (b.status ?? '').toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [clients, sortColumn, sortDirection])

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

  function SortIndicator({ column }: { column: SortColumn }) {
    if (sortColumn !== column) return null
    return (
      <span className="ml-1 text-[9px]">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    )
  }

  function thClass(column: SortColumn) {
    return [
      'text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap select-none cursor-pointer transition-colors',
      sortColumn === column ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
    ].join(' ')
  }

  return (
    <div className="bg-card border border-border rounded-[10px] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-background">
            <th className={thClass('name')} onClick={() => handleSort('name')}>
              Client<SortIndicator column="name" />
            </th>
            <th className={`${thClass('market')} max-w-[200px]`} onClick={() => handleSort('market')}>
              Market<SortIndicator column="market" />
            </th>
            <th className={`${thClass('pod')} w-[80px]`} onClick={() => handleSort('pod')}>
              Pod<SortIndicator column="pod" />
            </th>
            <th className={`${thClass('contract_start_date')} w-[130px]`} onClick={() => handleSort('contract_start_date')}>
              Contract Start<SortIndicator column="contract_start_date" />
            </th>
            <th className={`${thClass('status')} w-[100px]`} onClick={() => handleSort('status')}>
              Status<SortIndicator column="status" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((c: any) => (
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
