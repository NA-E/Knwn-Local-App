-- 021_client_schema_update.sql — New client columns: health, brand voice guide, area guide, approval emails
-- Reference: data-verification/clients_migration_data.txt
-- NOTE: No BEGIN/COMMIT — supabase db push wraps each file in its own transaction


-- ═══════════ 1. Create health status enum ═══════════

DO $$ BEGIN
  CREATE TYPE client_health AS ENUM ('on_track', 'at_risk', 'off_track');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- ═══════════ 2. Add new columns to clients table ═══════════

ALTER TABLE clients ADD COLUMN IF NOT EXISTS health client_health;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS brand_voice_guide_url TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS area_guide_url TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS approval_emails TEXT;
