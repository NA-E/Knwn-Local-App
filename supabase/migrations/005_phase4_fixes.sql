-- 005_phase4_fixes.sql
-- Phase 4 bug fixes: BUG-24 (task number padding), BUG-33 (assignment_role index)
-- Applied: 2026-04-02

-- ============================================================================
-- BUG-24: Widen task number padding from 4 to 5 digits
-- The sequence starts at 2700. With LPAD(4), numbers above 9999 produce
-- 5+ character strings (e.g. KN-10000) breaking the fixed-width format.
-- Switching to LPAD(5) gives KN-02700 through KN-99999 — room for ~97k projects.
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_task_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.task_number := 'KN-' || LPAD(nextval('project_task_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- BUG-33: Add index on client_assignments.assignment_role
-- Board queries for strategist, manager, senior_editor, and designer all
-- filter by this column. Without an index every board load does a seq scan.
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_client_assignments_role
  ON client_assignments (assignment_role);
