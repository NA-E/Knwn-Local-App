import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProject } from '@/lib/actions/projects'
import type { TeamRole } from '@/lib/types'
import { ProjectDetailClient } from './project-detail-client'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get current user's role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('team_members')
    .select('id, role')
    .eq('auth_user_id', user.id)
    .single()

  if (!member) redirect('/login')

  const userRole = member.role as TeamRole

  let project
  try {
    project = await getProject(id)
  } catch {
    notFound()
  }

  return (
    <div className="-mx-10 -mt-8">
      <ProjectDetailClient project={project} userRole={userRole} />
    </div>
  )
}
