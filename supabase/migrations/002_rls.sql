-- 002_rls.sql — Basic RLS for Module 0+1
-- Full role-specific RLS will be hardened in Module 2 when boards are built.

ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_history ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's team_member record
CREATE OR REPLACE FUNCTION get_my_team_member_id()
RETURNS UUID AS $$
  SELECT id FROM team_members WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS team_role AS $$
  SELECT role FROM team_members WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Pods: all authenticated can read, admin can write
CREATE POLICY "pods_select" ON pods FOR SELECT TO authenticated USING (true);
CREATE POLICY "pods_insert" ON pods FOR INSERT TO authenticated WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "pods_update" ON pods FOR UPDATE TO authenticated USING (get_my_role() = 'admin');

-- Team members: all authenticated can read, admin can write
CREATE POLICY "tm_select" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "tm_insert" ON team_members FOR INSERT TO authenticated WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "tm_update" ON team_members FOR UPDATE TO authenticated USING (get_my_role() = 'admin');

-- Team member pods: all authenticated can read, admin can write
CREATE POLICY "tmp_select" ON team_member_pods FOR SELECT TO authenticated USING (true);
CREATE POLICY "tmp_insert" ON team_member_pods FOR INSERT TO authenticated WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "tmp_update" ON team_member_pods FOR UPDATE TO authenticated USING (get_my_role() = 'admin');
CREATE POLICY "tmp_delete" ON team_member_pods FOR DELETE TO authenticated USING (get_my_role() = 'admin');

-- Clients: all authenticated can read, admin + strategist + jr_strategist can write
CREATE POLICY "clients_select" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "clients_insert" ON clients FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));
CREATE POLICY "clients_update" ON clients FOR UPDATE TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

-- Client sub-entities: same as clients
CREATE POLICY "channels_select" ON client_channels FOR SELECT TO authenticated USING (true);
CREATE POLICY "channels_all" ON client_channels FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

CREATE POLICY "contacts_select" ON client_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "contacts_all" ON client_contacts FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

CREATE POLICY "assignments_select" ON client_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignments_all" ON client_assignments FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

-- Projects + history: read-all for now, write policies added in Module 2
CREATE POLICY "projects_select" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects_all" ON projects FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

CREATE POLICY "history_select" ON project_status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "history_insert" ON project_status_history FOR INSERT TO authenticated WITH CHECK (true);
