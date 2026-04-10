import { notFound } from 'next/navigation'
import { getClient } from '@/lib/actions/clients'
import { getPodsWithMembers } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clients/client-form'
import { createClient } from '@/lib/supabase/server'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [client, podsWithMembers, { data: teamMembers }, { data: existingAssignments }] = await Promise.all([
    getClient(id).catch(() => null),
    getPodsWithMembers(),
    supabase
      .from('team_members')
      .select('id, first_name, last_name, role')
      .eq('status', 'active')
      .order('first_name'),
    supabase
      .from('client_assignments')
      .select('assignment_role, team_member_id')
      .eq('client_id', id),
  ])

  if (!client) notFound()

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

  const { data: clientCounts } = await supabase
    .from('clients')
    .select('pod_id')
    .in('status', ['active', 'onboarding'])

  const podClientCounts: Record<string, number> = {}
  for (const c of (clientCounts ?? [])) {
    if (c.pod_id) podClientCounts[c.pod_id] = (podClientCounts[c.pod_id] ?? 0) + 1
  }
  const pods = podsWithMembers.map(p => ({ id: p.id, name: p.name, clientCount: podClientCounts[p.id] ?? 0 }))

  // Build initial assignments map
  const initialAssignments: Record<string, string> = {}
  for (const a of (existingAssignments ?? [])) {
    initialAssignments[a.assignment_role] = a.team_member_id
  }

  return (
    <div>
      <PageHeader title={`Edit: ${client.name}`} />
      <ClientForm
        client={client}
        pods={pods}
        podTeamDefaults={podTeamDefaults}
        teamMembers={teamMembers ?? []}
        initialAssignments={initialAssignments}
      />
    </div>
  )
}
