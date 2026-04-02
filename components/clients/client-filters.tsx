'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { CLIENT_STATUS_LABELS } from '@/lib/constants/status'
import type { Pod } from '@/lib/types'

interface ClientFiltersProps {
  pods: Pod[]
}

export function ClientFilters({ pods }: ClientFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/clients?${params.toString()}`)
  }

  function handleSearchChange(value: string) {
    setSearchValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam('search', value)
    }, 300)
  }

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Search clients..."
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-[220px]"
      />
      <select
        defaultValue={searchParams.get('status') ?? ''}
        onChange={(e) => updateParam('status', e.target.value)}
        aria-label="Filter by status"
        className="px-3 py-2 border border-border rounded-md text-[12.5px] bg-card text-muted-foreground"
      >
        <option value="">All Statuses</option>
        {Object.entries(CLIENT_STATUS_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
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
    </div>
  )
}
