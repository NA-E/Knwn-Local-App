import { getPods } from '@/lib/actions/pods'
import { getTeamMembers } from '@/lib/actions/team-members'
import { PageHeader } from '@/components/shared/page-header'
import { TeamMemberForm } from '@/components/team/team-member-form'

export default async function NewTeamMemberPage() {
  const [pods, allMembers] = await Promise.all([
    getPods(),
    getTeamMembers(),
  ])

  const supervisors = allMembers.filter((m: any) =>
    m.role === 'senior_writer' || m.role === 'senior_editor'
  )

  return (
    <div>
      <PageHeader title="Add Team Member" />
      <TeamMemberForm pods={pods} supervisors={supervisors} />
    </div>
  )
}
