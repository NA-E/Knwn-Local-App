import Link from 'next/link'
import { Suspense } from 'react'
import { getClients, type ClientListFilters } from '@/lib/actions/clients'
import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientTable } from '@/components/clients/client-table'
import { ClientFilters } from '@/components/clients/client-filters'
import { Button } from '@/components/ui/button'
import type { ClientStatus } from '@/lib/types'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const filters: ClientListFilters = {
    search: params.search,
    status: params.status as ClientStatus | undefined,
    pod_id: params.pod_id,
    page: params.page ? parseInt(params.page) : 1,
  }

  const [{ clients, total }, pods] = await Promise.all([
    getClients(filters),
    getPods(),
  ])

  return (
    <div>
      <PageHeader
        title="Clients"
        meta={`${total} total`}
        action={<Link href="/clients/new"><Button>+ Add Client</Button></Link>}
      />
      <Suspense fallback={<div className="flex gap-3"><div className="h-10 w-48 bg-muted animate-pulse rounded" /></div>}>
        <ClientFilters pods={pods} />
      </Suspense>
      <ClientTable clients={clients} />
      {total > 25 && (
        <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
          <span>Page {filters.page} of {Math.ceil(total / 25)}</span>
          <div className="flex gap-2">
            {(filters.page ?? 1) > 1 && (
              <Link href={`/clients?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]), page: String((filters.page ?? 1) - 1) })}`}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {(filters.page ?? 1) * 25 < total && (
              <Link href={`/clients?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]), page: String((filters.page ?? 1) + 1) })}`}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
