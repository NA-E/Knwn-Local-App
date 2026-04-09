-- 015_schema_cleanup.sql — Schema review fixes (C-1, C-3, I-6, S-1, S-2, S-5)
-- Reference: docs/schema-review.md (2026-04-06)
-- NOTE: No BEGIN/COMMIT — supabase db push wraps each file in its own transaction


-- ═══════════ C-1: Drop duplicate updated_at triggers ═══════════
-- Migration 004 added custom `set_updated_at` triggers (via update_updated_at()).
-- Migration 008 added `set_updated_at_*` triggers using the moddatetime extension.
-- Both fire BEFORE UPDATE on the same four tables. Drop the custom ones (004),
-- keep the moddatetime ones (008) which are the standard Supabase pattern.

DROP TRIGGER IF EXISTS set_updated_at ON clients;
DROP TRIGGER IF EXISTS set_updated_at ON projects;
DROP TRIGGER IF EXISTS set_updated_at ON team_members;
DROP TRIGGER IF EXISTS set_updated_at ON pods;

-- Drop the now-orphaned custom function from migration 004
DROP FUNCTION IF EXISTS update_updated_at();


-- ═══════════ C-3: ON DELETE SET NULL for projects.writer_id and projects.editor_id ═══════════
-- These FKs default to NO ACTION (RESTRICT). If a team member is deactivated and
-- eventually removed, all their projects would block deletion. SET NULL is correct:
-- projects become unassigned, and project_status_history preserves the audit trail.

ALTER TABLE projects DROP CONSTRAINT projects_writer_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_writer_id_fkey
  FOREIGN KEY (writer_id) REFERENCES team_members(id) ON DELETE SET NULL;

ALTER TABLE projects DROP CONSTRAINT projects_editor_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_editor_id_fkey
  FOREIGN KEY (editor_id) REFERENCES team_members(id) ON DELETE SET NULL;


-- ═══════════ I-6: Partial unique index — one primary pod per member ═══════════
-- The team_member_pods table has UNIQUE(team_member_id, pod_id) preventing
-- duplicate memberships, but nothing prevents a member from having is_primary = true
-- on multiple pods. This partial unique index enforces at most one primary pod.

CREATE UNIQUE INDEX idx_one_primary_pod_per_member
  ON team_member_pods (team_member_id)
  WHERE is_primary = true;


-- ═══════════ S-1: Composite index for Kanban board queries ═══════════
-- Board pages filter projects by client_id and group by status.
-- Individual indexes on client_id and status exist, but a composite index
-- lets Postgres satisfy both predicates in a single index scan.

CREATE INDEX idx_projects_client_status
  ON projects (client_id, status);


-- ═══════════ S-2: CHECK constraint on task_number format ═══════════
-- Task numbers must follow the KN-XXXXX pattern (5 digits, per migration 005).
-- This prevents manual inserts or updates from violating the format.

ALTER TABLE projects ADD CONSTRAINT chk_task_number_format
  CHECK (task_number ~ '^KN-\d{5}$');


-- ═══════════ S-5: Pod name length constraint ═══════════
-- Pod names should be non-empty and reasonably short.

ALTER TABLE pods ADD CONSTRAINT chk_pod_name_length
  CHECK (length(name) BETWEEN 1 AND 50);
