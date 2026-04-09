-- 012_add_missing_project_columns.sql
-- Add columns expected by M2-M4 code but missing from original schema

-- Project fields for production workflow
ALTER TABLE projects ADD COLUMN IF NOT EXISTS edit_due DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS publish_due DATE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS script_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS edit_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS edit_version INTEGER NOT NULL DEFAULT 0;

-- Status history notes (feedback, rejection reasons)
ALTER TABLE project_status_history ADD COLUMN IF NOT EXISTS notes TEXT;
