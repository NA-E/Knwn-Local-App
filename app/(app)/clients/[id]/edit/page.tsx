import { notFound } from 'next/navigation'
import { getClient } from '@/lib/actions/clients'
import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clients/client-form'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [client, pods] = await Promise.all([
    getClient(id).catch(() => null),
    getPods(),
  ])

  if (!client) notFound()

  return (
    <div>
      <PageHeader title={`Edit: ${client.name}`} />
      <ClientForm client={client} pods={pods} />
    </div>
  )
}
