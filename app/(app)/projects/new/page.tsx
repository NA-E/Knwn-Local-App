import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProjectCreateForm } from '@/components/projects/project-create-form'

export default async function NewProjectPage() {
  const supabase = await createClient()

  const [{ data: clients }, { data: writers }, { data: editors }, { data: allAssignments }] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name')
      .in('status', ['active', 'onboarding'])
      .order('name'),
    supabase
      .from('team_members')
      .select('id, first_name, last_name')
      .in('role', ['writer', 'senior_writer', 'admin'])
      .eq('status', 'active')
      .order('first_name'),
    supabase
      .from('team_members')
      .select('id, first_name, last_name')
      .in('role', ['editor', 'senior_editor', 'admin'])
      .eq('status', 'active')
      .order('first_name'),
    supabase
      .from('client_assignments')
      .select('client_id, assignment_role, team_members ( id, first_name, last_name )'),
  ])

  const assignmentsByClient: Record<string, { assignment_role: string; team_member_name: string; team_member_id: string }[]> = {}
  for (const a of (allAssignments ?? [])) {
    if (!a.team_members) continue
    const tm = a.team_members as { id: string; first_name: string; last_name: string }
    const entry = {
      assignment_role: a.assignment_role,
      team_member_name: `${tm.first_name} ${tm.last_name}`,
      team_member_id: tm.id,
    }
    if (!assignmentsByClient[a.client_id]) assignmentsByClient[a.client_id] = []
    assignmentsByClient[a.client_id].push(entry)
  }

  return (
    <div>
      <Link href="/projects/pipeline" className="text-[12px] text-muted-foreground hover:underline mb-4 inline-block">
        &larr; Pipeline
      </Link>

      <h1 className="text-[19px] font-semibold tracking-tight mb-6">New Project</h1>

      <ProjectCreateForm
        clients={(clients ?? []).map(c => ({ id: c.id, name: c.name }))}
        writers={writers ?? []}
        editors={editors ?? []}
        assignmentsByClient={assignmentsByClient}
      />
    </div>
  )
}
