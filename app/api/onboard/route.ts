import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { runOnboarding } from '@/lib/services/onboarding'

const ALLOWED_ROLES = ['admin', 'strategist', 'jr_strategist']

export async function POST(request: Request) {
  // 1. Validate the user is authenticated (via cookie session)
  const userSupabase = await createServerClient()
  const { data: { user }, error } = await userSupabase.auth.getUser()
  if (!user || error) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Verify the user has the right role
  const { data: member } = await userSupabase
    .from('team_members')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  if (!member || !ALLOWED_ROLES.includes(member.role)) {
    return Response.json({ error: 'Forbidden: insufficient role' }, { status: 403 })
  }

  // 3. Parse request body
  let body: { clientId?: string }
  try {
    body = await request.json() as { clientId?: string }
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { clientId } = body
  if (!clientId) {
    return Response.json({ error: 'Missing clientId' }, { status: 400 })
  }

  // 4. Create a service-role client for background work
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 5. Fire and forget — respond immediately
  runOnboarding(clientId, serviceSupabase).catch((err) => {
    console.error('Onboarding failed:', err)
  })

  return Response.json({ started: true })
}
