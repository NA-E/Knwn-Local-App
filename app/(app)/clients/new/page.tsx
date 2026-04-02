import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clients/client-form'

export default async function NewClientPage() {
  const pods = await getPods()
  return (
    <div>
      <PageHeader title="Add Client" />
      <ClientForm pods={pods} />
    </div>
  )
}
