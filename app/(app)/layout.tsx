import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/shared/sidebar'
import type { TeamRole } from '@/lib/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!user.email) redirect('/login')

  // Look up team member for role-based nav
  const { data: teamMember } = await supabase
    .from('team_members')
    .select('id, first_name, last_name, role')
    .eq('email', user.email)
    .single()

  // User exists in auth but has not been provisioned in team_members
  if (!teamMember) redirect('/login')

  const role = teamMember.role as TeamRole
  const displayName = `${teamMember.first_name} ${teamMember.last_name.charAt(0)}.`

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} userName={displayName} />
      <main className="flex-1 min-w-0 ml-[220px] bg-background">
        <div className="px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
