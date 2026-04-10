import { getPodsWithMembers } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clients/client-form'
import { createClient } from '@/lib/supabase/server'

export default async function NewClientPage() {
  const supabase = await createClient()
  const [podsWithMembers, { data: teamMembers }] = await Promise.all([
    getPodsWithMembers(),
    supabase
      .from('team_members')
      .select('id, first_name, last_name, role')
      .eq('status', 'active')
      .order('first_name'),
  ])

  // Build pod member lookup: podId -> { strategistId, managerId }
  const podTeamDefaults: Record<string, { strategistId: string | null; managerId: string | null }> = {}
  for (const pod of podsWithMembers) {
    let strategistId: string | null = null
    let managerId: string | null = null
    for (const tmp of (pod.team_member_pods ?? [])) {
      const tm = tmp.team_members as any
      if (!tm) continue
      if (tm.role === 'strategist' && !strategistId) strategistId = tm.id
      if (tm.role === 'manager' && !managerId) managerId = tm.id
    }
    podTeamDefaults[pod.id] = { strategistId, managerId }
  }

  const pods = podsWithMembers.map(p => ({ id: p.id, name: p.name }))

  return (
    <div>
      <PageHeader title="Add Client" />
      <ClientForm pods={pods} podTeamDefaults={podTeamDefaults} teamMembers={teamMembers ?? []} />
    </div>
  )
}
