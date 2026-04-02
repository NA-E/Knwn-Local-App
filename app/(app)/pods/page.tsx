import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { PodFormDialog } from '@/components/pods/pod-form-dialog'
import { Button } from '@/components/ui/button'

export default async function PodsPage() {
  const pods = await getPods()

  return (
    <div>
      <PageHeader
        title="Pods"
        meta={`${pods.length} pods`}
        action={
          <PodFormDialog trigger={<Button>+ Create Pod</Button>} />
        }
      />

      <div className="grid grid-cols-2 gap-4">
        {pods.map((pod) => (
          <div key={pod.id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
            <span className="font-medium text-sm">{pod.name}</span>
            <PodFormDialog
              pod={pod}
              trigger={<Button variant="outline" size="sm">Edit</Button>}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
