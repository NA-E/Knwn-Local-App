-- 007_onboarding.sql — Client Onboarding Automation

-- ═══════════ ENUMS ═══════════

CREATE TYPE onboarding_step_name AS ENUM (
  'slack_channel', 'dropbox_folder', 'gdrive_folder',
  'slack_invite', 'welcome_message', 'team_notify'
);

CREATE TYPE onboarding_step_status AS ENUM (
  'pending', 'running', 'success', 'failed', 'skipped'
);

-- ═══════════ TABLE ═══════════

CREATE TABLE onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step onboarding_step_name NOT NULL,
  status onboarding_step_status NOT NULL DEFAULT 'pending',
  result_data JSONB,
  error_message TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, step)
);

-- ═══════════ RLS ═══════════

ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;

-- Read: all authenticated users can view onboarding status
CREATE POLICY "onboarding_steps_select" ON onboarding_steps
  FOR SELECT TO authenticated USING (true);

-- Insert: only roles that can create clients
CREATE POLICY "onboarding_steps_insert" ON onboarding_steps
  FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

-- No UPDATE/DELETE policies for authenticated users.
-- The API route uses a service-role client (bypasses RLS) to update step statuses.

-- ═══════════ REALTIME ═══════════

ALTER PUBLICATION supabase_realtime ADD TABLE onboarding_steps;
