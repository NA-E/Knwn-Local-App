-- 018_documentation_comments.sql
-- Adds SQL COMMENT statements for schema conventions, data policies,
-- and architectural patterns that are not obvious from DDL alone.
-- No schema changes — documentation only.

-- ─── C-4: Soft-delete convention for team members ───────────────────────────
COMMENT ON TABLE team_members IS
  'Team members must never be hard-deleted. '
  'To deactivate a team member set status = ''inactive''. '
  'Hard deletes would break project history, assignment audit trails, '
  'and supervised_by references on other team members.';

-- ─── I-2: No-delete policy for clients ──────────────────────────────────────
COMMENT ON TABLE clients IS
  'Clients must never be hard-deleted. '
  'Use status transitions (active → disengaged → inactive) to reflect '
  'a client''s lifecycle. Hard deletes would orphan projects, assignments, '
  'contacts, channels, and onboarding history.';

-- ─── S-7: onboarding_steps update-via-service-role pattern ──────────────────
COMMENT ON TABLE onboarding_steps IS
  'Written exclusively by the /api/onboard server-side route using the '
  'SUPABASE_SERVICE_ROLE_KEY — never via the end-user''s session token. '
  'RLS allows the service role to bypass row-level policies during the '
  'automated onboarding workflow (Slack channel creation, Dropbox folder, '
  'Google Drive setup, invite emails). '
  'The UI reads this table through a Supabase Realtime subscription '
  '(onboarding-modal.tsx) to stream live progress to the operator.';

-- ─── S-4: senior_writer in assignment_role ENUM ─────────────────────────────
-- COMMENT ON TYPE is not supported in PostgreSQL — document via the column instead.
COMMENT ON COLUMN client_assignments.assignment_role IS
  'The slot a team member fills for a specific client. '
  'Values: strategist | manager | editor | senior_editor | designer | senior_designer | senior_writer. '
  'NOTE — senior_writer is a display-only supervisory label used for board '
  'filtering (Senior Writer board → supervised_by chain → projects.writer_id). '
  'Senior writers are not directly assigned to client slots; this value '
  'should not appear in practice for individual client assignments. '
  'Do not confuse with team_members.role, which is the team member''s '
  'actual job title/capability (see column comment on that table).';

-- ─── S-6: Distinguish assignment_role (client_assignments) vs role (team_members) ─
COMMENT ON COLUMN team_members.role IS
  'The team member''s actual job title and capability level '
  '(e.g. strategist, senior_editor, writer). '
  'This is the authoritative record of who the person IS on the team. '
  'Do not confuse with client_assignments.assignment_role, which records '
  'the slot they fill for a particular client relationship '
  '(e.g. a senior_editor team member might fill the editor slot for some clients).';
