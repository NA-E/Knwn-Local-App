-- 008_schema_fixes.sql — Schema best-practice fixes

-- ═══════════ 1. Missing indexes on FK columns ═══════════

CREATE INDEX idx_client_channels_client ON client_channels(client_id);
CREATE INDEX idx_client_contacts_client ON client_contacts(client_id);

-- ═══════════ 2. team_members.status → proper ENUM ═══════════

CREATE TYPE team_member_status AS ENUM ('active', 'inactive');

ALTER TABLE team_members ADD COLUMN status_new team_member_status NOT NULL DEFAULT 'active'::team_member_status;
UPDATE team_members SET status_new = status::team_member_status;
ALTER TABLE team_members DROP COLUMN status;
ALTER TABLE team_members RENAME COLUMN status_new TO status;

-- ═══════════ 3. Auto-update updated_at triggers ═══════════

CREATE EXTENSION IF NOT EXISTS moddatetime;

CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_updated_at_team_members
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER set_updated_at_pods
  BEFORE UPDATE ON pods
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ═══════════ 4. Safer FK: client_assignments.team_member_id ═══════════

ALTER TABLE client_assignments
  DROP CONSTRAINT client_assignments_team_member_id_fkey;

ALTER TABLE client_assignments
  ADD CONSTRAINT client_assignments_team_member_id_fkey
  FOREIGN KEY (team_member_id) REFERENCES team_members(id) ON DELETE RESTRICT;
