-- 017_schema_verifications.sql — Schema verification fixes (I-4, I-5, S-3)
-- Reference: docs/schema-review.md (2026-04-06) items I-3, I-4, I-5, S-3
-- NOTE: No BEGIN/COMMIT — supabase db push wraps each file in its own transaction


-- ═══════════ I-3: client_contacts boolean flags — already fixed ═══════════
-- Migration 004 applied SET NOT NULL + SET DEFAULT false to both
-- client_contacts.is_primary and client_contacts.is_assistant.
-- The schema-review flagged a possible live/migration drift (dump artifact).
-- Re-asserting here idempotently to guarantee the live schema is correct.

ALTER TABLE client_contacts ALTER COLUMN is_primary SET NOT NULL;
ALTER TABLE client_contacts ALTER COLUMN is_primary SET DEFAULT false;

ALTER TABLE client_contacts ALTER COLUMN is_assistant SET NOT NULL;
ALTER TABLE client_contacts ALTER COLUMN is_assistant SET DEFAULT false;


-- ═══════════ I-4: videos_per_week precision — idempotent re-assertion ═══════════
-- Migration 001 defines videos_per_week as NUMERIC(4,1). The schema-review
-- flagged that a live dump showed bare `numeric` without precision/scale,
-- which may indicate the constraint did not apply or was a dump artifact.
-- Re-applying the type here idempotently to guarantee precision is enforced.

ALTER TABLE client_channels
  ALTER COLUMN videos_per_week TYPE NUMERIC(4,1);


-- ═══════════ I-5: Single-column index on onboarding_steps.client_id ═══════════
-- The UNIQUE(client_id, step) composite constraint creates a composite index
-- with client_id as the leading column, which Postgres can use for client_id
-- lookups. However, all other child tables have explicit FK indexes for
-- consistency. Adding the explicit index here matches that pattern and makes
-- index usage obvious to query planners and developers.
-- Using IF NOT EXISTS to make this safe to re-run.

CREATE INDEX IF NOT EXISTS idx_onboarding_steps_client_id
  ON onboarding_steps (client_id);


-- ═══════════ S-3: Sequence collision protection ═══════════
-- project_task_seq starts at 2700. Projects inserted by migrations 006 and 014
-- consumed sequence values via the generate_task_number() trigger. Any future
-- project imports that bypass the trigger (e.g. direct INSERT with task_number
-- specified) could produce numbers the sequence will later collide with.
-- Resetting the sequence to MAX(existing task number) ensures nextval() always
-- produces a value higher than any number already in use.
-- The COALESCE handles the edge case where projects table is empty (e.g. in a
-- fresh test environment) — it falls back to 2699 so the next value is 2700.

SELECT setval(
  'project_task_seq',
  COALESCE(
    (SELECT MAX(CAST(SUBSTRING(task_number FROM 4) AS INTEGER)) FROM projects),
    2699
  )
);
