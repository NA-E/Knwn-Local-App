-- Add portal_token and expiry columns for magic link auth
ALTER TABLE clients ADD COLUMN IF NOT EXISTS portal_token TEXT UNIQUE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS portal_token_expires_at TIMESTAMPTZ;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_clients_portal_token ON clients(portal_token);

-- NOTE: No anon RLS policy — portal lookup uses service-role client.
-- This avoids exposing all client columns to anonymous users.
