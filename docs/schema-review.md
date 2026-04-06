# PostgreSQL Schema Review — Known Local App
**Date:** 2026-04-06
**Reviewer:** Opus (Principal Software Engineer level)
**Schema source:** Live Supabase dump (`current_schema.sql`) + migrations 001-009

## Summary
The schema is structurally sound for Modules 0 and 1. Table design, enum choices, FK relationships, and RLS policies are well-organized. Most issues can be resolved in a single migration (010) before Module 2 work begins.

---

## CRITICAL (Must Fix)

### C-1. Duplicate `updated_at` Triggers on Four Tables
**Issue:** Migration 004 created `set_updated_at` triggers using a custom `update_updated_at()` function. Migration 008 added additional `set_updated_at_clients`, `set_updated_at_projects`, `set_updated_at_team_members`, `set_updated_at_pods` triggers using the `moddatetime()` extension. Both fire `BEFORE UPDATE` on clients, projects, team_members, pods.

**Impact:** Two triggers race on every UPDATE. PostgreSQL fires same-event triggers in alphabetical name order, so `set_updated_at` (custom) runs first, then `set_updated_at_*` (moddatetime) runs second. Result is correct but fragile and wasteful — doubles per-row overhead.

**Fix:**
```sql
DROP TRIGGER IF EXISTS set_updated_at ON clients;
DROP TRIGGER IF EXISTS set_updated_at ON projects;
DROP TRIGGER IF EXISTS set_updated_at ON team_members;
DROP TRIGGER IF EXISTS set_updated_at ON pods;
DROP FUNCTION IF EXISTS update_updated_at();
```

### C-2. `supervised_by` Not Populated for Real Data
**Issue:** Migration 009 loaded 35 real team members from Notion but contains zero `supervised_by` assignments. The relationships from migration 006 were for test data that 009 deleted. CLAUDE.md notes: "After migration: populate supervised_by for all writers and editors (Paulo/Clayton must provide the mapping)."

**Impact:** **Blocking for Module 2/3.** Senior Writer and Senior Editor boards filter by `WHERE supervised_by = current_user.team_member_id`. With all values NULL, those boards return zero projects.

**Fix:** Get the supervision mapping from Paulo/Clayton and create migration 010 with UPDATE statements.

### C-3. `projects.writer_id` and `projects.editor_id` Have No ON DELETE Behavior
**Issue:** Both FK columns default to `ON DELETE NO ACTION` (equivalent to RESTRICT). Meanwhile, `client_assignments.team_member_id` was explicitly changed to `ON DELETE RESTRICT` in migration 008 for consistency, but writer_id/editor_id were not addressed.

**Impact:** If a team member is deactivated and eventually deleted, you cannot remove them because projects still reference them. No documented strategy for handling deactivated team members on existing projects.

**Fix:**
```sql
ALTER TABLE projects DROP CONSTRAINT projects_writer_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_writer_id_fkey
  FOREIGN KEY (writer_id) REFERENCES team_members(id) ON DELETE SET NULL;

ALTER TABLE projects DROP CONSTRAINT projects_editor_id_fkey;
ALTER TABLE projects ADD CONSTRAINT projects_editor_id_fkey
  FOREIGN KEY (editor_id) REFERENCES team_members(id) ON DELETE SET NULL;
```
SET NULL is correct here: if a writer/editor is removed, projects become unassigned. The `project_status_history` table preserves the audit trail via `changed_by`.

### C-4. `project_status_history.changed_by` Blocks Team Member Deletion
**Issue:** `changed_by UUID NOT NULL REFERENCES team_members(id)` defaults to NO ACTION. Since it's NOT NULL, SET NULL is not viable.

**Impact:** You can never delete a team member who has any status history entries. This is correct for audit integrity, but conflicts with `team_member_pods ON DELETE CASCADE`.

**Fix:** Document the convention: team members should be soft-deleted (`status = 'inactive'`) rather than hard-deleted. The `team_member_status` enum already supports this.

---

## IMPORTANT (Should Fix)

### I-1. RLS: `projects_all` and `projects_update` Policies Overlap
**Issue:** `projects_all` (FOR ALL) grants full CRUD to admin/strategist/jr_strategist. `projects_update` (FOR UPDATE, added in 006) grants UPDATE to all authenticated users with `USING (true)` and no `WITH CHECK`.

**Impact:** Any authenticated user can update any column on any project row — not just status. A writer could change `editor_id`, `title`, `client_id`, or `design_status` at the database level.

**Fix:** For Module 2, either tighten the policy or document as accepted risk (status validation is in server actions, not RLS).

### I-2. No RLS DELETE Policy for Clients or Projects
**Issue:** No `clients_delete` policy exists. The `projects_all` FOR ALL covers DELETE for admin/strategist/jr_strategist, but clients have no explicit DELETE policy.

**Impact:** No one can delete a client through the Supabase client (RLS blocks it). If intentional (soft-delete only), document it. If admin should be able to delete, add policy.

### I-3. `client_contacts.is_primary` and `is_assistant` — Live vs. Migration Drift
**Issue:** Live dump shows `is_primary boolean DEFAULT false` (nullable) and `is_assistant boolean DEFAULT false` (nullable). Migration 004 explicitly set both to NOT NULL.

**Impact:** If nullable in live DB, three-valued boolean logic causes subtle bugs in contact filtering. May be a dump artifact — verify with `\d client_contacts`.

### I-4. `videos_per_week` Type Mismatch
**Issue:** Migration 001 defines `NUMERIC(4,1)` (max 999.9). Live dump shows bare `numeric` without precision/scale.

**Impact:** Without precision constraints, column accepts values like `99999.12345`. Low risk in internal app but is a data integrity gap. May be a dump artifact.

### I-5. No Single-Column Index on `onboarding_steps.client_id`
**Issue:** UNIQUE constraint on `(client_id, step)` creates a composite index, but no single-column index on `client_id` alone. All other child tables have explicit FK indexes.

**Impact:** Composite unique index covers this adequately since `client_id` is the leading column. Pattern inconsistency only.

### I-6. Multiple Primary Pods Allowed Per Member
**Issue:** UNIQUE on `(team_member_id, pod_id)` prevents duplicate pod memberships, but nothing prevents `is_primary = true` on multiple pods for the same member.

**Impact:** Queries doing `WHERE is_primary = true` could return multiple rows, breaking UI assumptions.

**Fix:**
```sql
CREATE UNIQUE INDEX idx_one_primary_pod_per_member
  ON team_member_pods (team_member_id)
  WHERE is_primary = true;
```

### I-7. No `writer`/`senior_writer` Roles in Real Team Data
**Issue:** Migration 009 loaded 35 team members. Zero have `role = 'writer'` or `role = 'senior_writer'`. Roles present: manager, senior_editor, editor, strategist, designer.

**Impact:** Writer and Senior Writer boards in Module 2/3 cannot be tested with real data. Status transitions gating on `writer`/`senior_writer` roles won't work.

**Fix:** Clarify with Clayton/Paulo whether writers are a distinct role not in Notion, editors serve as writers, or writers are external/contractors.

---

## SUGGESTIONS

### S-1. Composite Index for Module 2 Kanban Queries
```sql
CREATE INDEX idx_projects_client_status ON projects(client_id, status);
```

### S-2. CHECK Constraint on Task Number Format
```sql
ALTER TABLE projects ADD CONSTRAINT chk_task_number_format CHECK (task_number ~ '^KN-\d{5}$');
```

### S-3. Sequence Collision Protection
After any project data import, reset sequence:
```sql
SELECT setval('project_task_seq', (SELECT MAX(CAST(SUBSTRING(task_number FROM 4) AS INTEGER)) FROM projects));
```

### S-4. Document `senior_writer` in `assignment_role` as Display-Only
Per SPEC: "senior_writer is for Client Detail Team Section display only — NOT used for board filtering."

### S-5. Pod Name Length Constraint
```sql
ALTER TABLE pods ADD CONSTRAINT chk_pod_name_length CHECK (length(name) <= 50);
```

### S-6. Column Comments for Role Distinction
```sql
COMMENT ON COLUMN client_assignments.assignment_role IS 'Role this team member fills for this specific client (distinct from team_members.role which is their org-wide role)';
```

### S-7. Document `onboarding_steps` UPDATE-via-Service-Role Pattern
No UPDATE/DELETE policies exist for authenticated users. Updates happen exclusively via service-role client in `/api/onboard`. This is intentional.

---

## Module 2 Readiness Checklist

| Priority | Item | Blocking? |
|----------|------|-----------|
| C-1 | Drop duplicate updated_at triggers | No, but causes double execution |
| C-2 | Populate supervised_by for real team members | **Yes** — Senior Writer/Editor boards |
| C-3 | Explicit ON DELETE for writer_id/editor_id | **Yes** — needed before project CRUD |
| I-1 | Document or tighten projects_update RLS | No, but should happen alongside board work |
| I-7 | Resolve missing writer/senior_writer roles | **Yes** — Writer board unusable |
| S-1 | Add composite index for board queries | No, but improves performance |
