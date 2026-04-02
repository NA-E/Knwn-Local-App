import Link from 'next/link'
import { getTeamMembers } from '@/lib/actions/team-members'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS } from '@/lib/constants/roles'

export default async function TeamPage() {
  const members = await getTeamMembers()

  return (
    <div>
      <PageHeader
        title="Team"
        meta={`${members.length} members`}
        action={<Link href="/team/new"><Button>+ Add Member</Button></Link>}
      />

      <div className="bg-card border border-border rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Name</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Role</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Email</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Pod(s)</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m: any) => (
              <tr key={m.id} className="border-b border-border hover:bg-[#FAFAF7] transition-colors">
                <td className="px-4 py-3 text-[13px] font-medium">
                  <Link href={`/team/${m.id}/edit`} className="hover:underline">
                    {m.first_name} {m.last_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[13px] text-muted-foreground">{ROLE_LABELS[m.role as keyof typeof ROLE_LABELS]}</td>
                <td className="px-4 py-3 text-[13px] text-muted-foreground">{m.email}</td>
                <td className="px-4 py-3 text-[13px]">
                  {m.team_member_pods?.map((tmp: any) => (
                    <span key={tmp.pod_id} className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-muted-foreground mr-1">
                      {tmp.pods?.name}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 text-[13px]">
                  <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>
                    {m.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
