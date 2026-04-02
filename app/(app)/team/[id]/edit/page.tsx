import { notFound } from 'next/navigation'
import { getPods } from '@/lib/actions/pods'
import { getTeamMember, getTeamMembers } from '@/lib/actions/team-members'
import { PageHeader } from '@/components/shared/page-header'
import { TeamMemberForm } from '@/components/team/team-member-form'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [member, pods, allMembers] = await Promise.all([
    getTeamMember(id).catch(() => null),
    getPods(),
    getTeamMembers(),
  ])

  if (!member) notFound()

  const supervisors = allMembers.filter((m: any) =>
    (m.role === 'senior_writer' || m.role === 'senior_editor') && m.id !== id
  )

  return (
    <div>
      <PageHeader title={`Edit: ${member.first_name} ${member.last_name}`} />
      <TeamMemberForm member={member} pods={pods} supervisors={supervisors} />
    </div>
  )
}
