import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProjectCreateForm } from '@/components/projects/project-create-form'

export default async function NewProjectPage() {
  const supabase = await createClient()

  const [{ data: clients }, { data: writers }, { data: editors }] = await Promise.all([
    supabase
      .from('clients')
      .select('id, name')
      .in('status', ['active', 'onboarding'])
      .order('name'),
    supabase
      .from('team_members')
      .select('id, first_name, last_name')
      .eq('role', 'writer')
      .eq('status', 'active')
      .order('first_name'),
    supabase
      .from('team_members')
      .select('id, first_name, last_name')
      .eq('role', 'editor')
      .eq('status', 'active')
      .order('first_name'),
  ])

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
      />
    </div>
  )
}
