import { getPodsWithMembers } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { PodFormDialog } from '@/components/pods/pod-form-dialog'
import { PodsLayout, type PodWithMembers } from '@/components/pods/pods-layout'
import { Button } from '@/components/ui/button'

export default async function PodsPage() {
  const rawPods = await getPodsWithMembers()

  const pods: PodWithMembers[] = (rawPods ?? []).map((pod: any) => ({
    id: pod.id,
    name: pod.name,
    members: (pod.team_member_pods ?? [])
      .filter((tmp: any) => tmp.team_members != null)
      .map((tmp: any) => ({
        id: tmp.team_members.id,
        first_name: tmp.team_members.first_name,
        last_name: tmp.team_members.last_name,
        role: tmp.team_members.role,
        status: tmp.team_members.status,
        is_primary: tmp.is_primary,
      }))
      .sort((a: any, b: any) =>
        `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
      ),
  }))

  return (
    <div>
      <PageHeader
        title="Pods"
        meta={`${pods.length} pods`}
        action={
          <PodFormDialog trigger={<Button>+ Create Pod</Button>} />
        }
      />

      <PodsLayout pods={pods} />
    </div>
  )
}
