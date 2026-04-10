-- Generate portal tokens for all existing clients that don't have one
-- These were not generated during the Notion migration (009)
UPDATE clients
SET portal_token = gen_random_uuid()::text,
    portal_token_expires_at = NOW() + INTERVAL '90 days'
WHERE portal_token IS NULL;
