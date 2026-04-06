import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getStepsToReset, resetStep, retryOnboarding } from '@/lib/services/onboarding'
import type { OnboardingStepName } from '@/lib/types'

const VALID_STEPS: OnboardingStepName[] = [
  'slack_channel', 'dropbox_folder', 'gdrive_folder',
  'slack_invite', 'welcome_message', 'team_notify',
]

const ALLOWED_ROLES = ['admin', 'strategist', 'jr_strategist']

export async function POST(request: Request) {
  // 1. Validate auth
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
  let body: { clientId?: string; step?: string }
  try {
    body = await request.json() as { clientId?: string; step?: string }
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { clientId, step } = body

  if (!clientId || !step) {
    return Response.json({ error: 'Missing clientId or step' }, { status: 400 })
  }

  if (!VALID_STEPS.includes(step as OnboardingStepName)) {
    return Response.json({ error: 'Invalid step name' }, { status: 400 })
  }

  const typedStep = step as OnboardingStepName

  // 4. Create service-role client
  const serviceSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 5. Reset the target step + any dependent steps
  const stepsToReset = getStepsToReset(typedStep)
  for (const s of stepsToReset) {
    await resetStep(serviceSupabase, clientId, s)
  }

  // 6. Re-run from the target step (fire and forget)
  retryOnboarding(clientId, typedStep, serviceSupabase).catch((err) => {
    console.error('Onboarding retry failed:', err)
  })

  return Response.json({ retried: true })
}
