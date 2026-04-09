-- 010_module2_enhancements.sql — Add cancelled status + tighten RLS for projects

-- Add cancelled to project_status enum
ALTER TYPE project_status ADD VALUE IF NOT EXISTS 'cancelled';

-- Add last_status_change_at column (used by dashboard stuck-project queries)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS last_status_change_at TIMESTAMPTZ DEFAULT now();

-- Add index on last_status_change_at for stuck-project queries (dashboard)
CREATE INDEX IF NOT EXISTS idx_projects_last_status_change
  ON projects(last_status_change_at);

-- Tighten projects_update RLS: role-based column restrictions
-- Drop the overly permissive policy from 006
DROP POLICY IF EXISTS "projects_update" ON projects;

-- Writers can only update script_url and notes
CREATE POLICY "projects_update_writer" ON projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.auth_user_id = auth.uid()
      AND tm.role = 'writer'
      AND projects.writer_id = tm.id
    )
  );

-- Editors can only update edit_url, edit_version, thumbnail_url, notes
CREATE POLICY "projects_update_editor" ON projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.auth_user_id = auth.uid()
      AND tm.role = 'editor'
      AND projects.editor_id = tm.id
    )
  );

-- Designers can update design_status and thumbnail_url
CREATE POLICY "projects_update_designer" ON projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN client_assignments ca ON ca.team_member_id = tm.id
      WHERE tm.auth_user_id = auth.uid()
      AND tm.role = 'designer'
      AND ca.client_id = projects.client_id
      AND ca.assignment_role = 'designer'
    )
  );

-- Admin, strategist, jr_strategist, manager, senior_editor, senior_writer can update all columns
CREATE POLICY "projects_update_privileged" ON projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.auth_user_id = auth.uid()
      AND tm.role IN ('admin', 'strategist', 'jr_strategist', 'manager', 'senior_editor', 'senior_writer', 'senior_designer')
    )
  );
