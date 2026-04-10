-- 019_team_members_update.sql — Schema changes only
-- Enum values must commit before they can be used in data inserts.
-- Data inserts are in 020_team_members_data.sql.
-- NOTE: No BEGIN/COMMIT — supabase db push wraps each file in its own transaction


-- ═══════════ 1. Add virtual_assistant to team_role enum ═══════════

ALTER TYPE team_role ADD VALUE IF NOT EXISTS 'virtual_assistant';


-- ═══════════ 2. Add phone column to team_members ═══════════

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS phone TEXT;


-- ═══════════ 3. Expand team_member_status enum ═══════════
-- Migration 008 created team_member_status AS ENUM ('active', 'inactive').
-- Adding new values for Notion status lifecycle.

ALTER TYPE team_member_status ADD VALUE IF NOT EXISTS 'onboarding';
ALTER TYPE team_member_status ADD VALUE IF NOT EXISTS 'contract_paused';
ALTER TYPE team_member_status ADD VALUE IF NOT EXISTS 'offboarded';
