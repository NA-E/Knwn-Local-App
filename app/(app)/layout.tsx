import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/shared/sidebar'
import type { TeamRole } from '@/lib/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (!user.email) redirect('/login')

  // Look up team member — first by auth_user_id, then by email
  let { data: teamMember } = await supabase
    .from('team_members')
    .select('id, first_name, last_name, role, auth_user_id')
    .eq('auth_user_id', user.id)
    .single()

  if (!teamMember) {
    // Try matching by email (existing team member, first OAuth login)
    const { data: memberByEmail } = await supabase
      .from('team_members')
      .select('id, first_name, last_name, role, auth_user_id')
      .eq('email', user.email)
      .single()

    if (memberByEmail) {
      // Auto-link auth_user_id if not yet set
      if (!memberByEmail.auth_user_id) {
        await supabase
          .from('team_members')
          .update({ auth_user_id: user.id })
          .eq('id', memberByEmail.id)
      }
      teamMember = memberByEmail
    } else {
      // Unknown email — sign out and redirect to access denied
      await supabase.auth.signOut()
      redirect('/access-denied')
    }
  }

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
