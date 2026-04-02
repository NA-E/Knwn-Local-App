-- 004_fixes.sql — Schema and RLS bug fixes

-- ═══════════ BUG-23: Restrict audit log entries to current user ═══════════
-- The previous INSERT policy used WITH CHECK (true), allowing any authenticated
-- user to insert history rows with an arbitrary changed_by value. This restricts
-- inserts so that changed_by must match the caller's own team_member id.

DROP POLICY IF EXISTS "history_insert" ON project_status_history;
CREATE POLICY "history_insert" ON project_status_history
  FOR INSERT TO authenticated
  WITH CHECK (changed_by = get_my_team_member_id());

-- ═══════════ BUG-32: Auto-update updated_at on row modification ═══════════
-- Tables with updated_at columns did not have triggers to keep the value
-- current on UPDATE. This adds a shared trigger function and per-table triggers.

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON pods FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════ BUG-34: Make boolean flags NOT NULL with default false ═══════════
-- is_primary / is_assistant were declared as nullable BOOLEAN DEFAULT false.
-- Setting NOT NULL eliminates the three-valued logic (true/false/null) and
-- makes the semantics unambiguous: a row is either primary or it is not.

-- team_member_pods.is_primary
ALTER TABLE team_member_pods ALTER COLUMN is_primary SET NOT NULL;
ALTER TABLE team_member_pods ALTER COLUMN is_primary SET DEFAULT false;

-- client_contacts.is_primary and is_assistant (same pattern found in schema)
ALTER TABLE client_contacts ALTER COLUMN is_primary SET NOT NULL;
ALTER TABLE client_contacts ALTER COLUMN is_primary SET DEFAULT false;

ALTER TABLE client_contacts ALTER COLUMN is_assistant SET NOT NULL;
ALTER TABLE client_contacts ALTER COLUMN is_assistant SET DEFAULT false;
