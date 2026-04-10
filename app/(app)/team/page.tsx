import Link from 'next/link'
import { getTeamMembers } from '@/lib/actions/team-members'
import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { TeamTable } from '@/components/team/team-table'
import { Button } from '@/components/ui/button'

export default async function TeamPage() {
  const [members, pods] = await Promise.all([
    getTeamMembers(),
    getPods(),
  ])

  return (
    <div>
      <PageHeader
        title="Team"
        meta={`${members.length} members`}
        action={<Link href="/team/new"><Button>+ Add Member</Button></Link>}
      />
      <TeamTable members={members} pods={pods} />
    </div>
  )
}
