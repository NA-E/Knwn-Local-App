import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
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
      // New user — create team member via service-role client (bypasses RLS)
      const serviceSupabase = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const meta = user.user_metadata ?? {}
      const firstName = meta.given_name || meta.full_name?.split(' ')[0] || user.email.split('@')[0]
      const lastName = meta.family_name || meta.full_name?.split(' ').slice(1).join(' ') || ''

      const { data: newMember } = await serviceSupabase
        .from('team_members')
        .insert({
          auth_user_id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName || '-',
          role: 'editor',
          status: 'active',
        })
        .select('id, first_name, last_name, role, auth_user_id')
        .single()

      if (!newMember) redirect('/login?error=provision_failed')
      teamMember = newMember
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
