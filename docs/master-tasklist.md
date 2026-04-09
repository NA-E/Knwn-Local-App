# Master Task List — Known Local App

> **Single source of truth for all project work.** Every new task, plan, review, or action item gets added here. Reference detailed docs where they exist rather than duplicating content.

## How to Use
- Mark tasks: `[x]` done, `[ ]` not started, `[~]` in progress, `[!]` blocked
- Link to detailed plans/specs/reviews where they exist
- Add new tasks to the appropriate section as they arise
- Date-stamp completed items

---

## Module 0: Foundation — COMPLETE
> Plan: `docs/superpowers/plans/2026-04-02-client-onboarding.md` (Tasks 1-5)

- [x] Project bootstrap (Next.js 16, TypeScript, Tailwind v4, shadcn v4)
- [x] Database schema (001_schema.sql) + RLS (002_rls.sql) + seed (003_seed.sql)
- [x] TypeScript types + Supabase client helpers
- [x] Auth middleware + login page
- [x] App shell (layout + sidebar)

## Module 1: Client Onboarding — COMPLETE
> Plan: `docs/superpowers/plans/2026-04-02-client-onboarding.md` (Tasks 6-14)

- [x] Pods CRUD
- [x] Team Members CRUD
- [x] Client List page with filters
- [x] Add/Edit Client form
- [x] Client Detail — shell + info section
- [x] Client Channels section
- [x] Client Contacts section
- [x] Client Assignments (team picker)
- [x] Seed data + RLS policies

## Cross-Module: Bug Fixes & Infrastructure — COMPLETE
> Tracker: `docs/module01-test-review.md`

- [x] Phase 1-4 bug fixes (45 total; BUG-7 skipped per user, BUG-21 not a bug)
- [x] Phase 3 Module 2 prep (BUG-22, 25-28, 29-31, 38, 41)
- [x] Migrations 004-006 applied (fixes, phase4_fixes, module2_prep)
- [x] MCP server built (22 tools, dual transport) — `mcp-server/`
- [x] Onboarding automation designed + implemented
  - Spec: `docs/superpowers/specs/2026-04-03-client-onboarding-automation.md`
  - Test plan: `docs/onboarding-test-plan.md`
- [x] Migration 007: onboarding_steps table + RLS + Realtime
- [x] Migration 008: schema fixes (indexes, enum, triggers, FK)
- [x] DB schema review + Supabase CLI migration sync
- [x] Migration 009: Real data from Notion (80 clients, 35 team members, 306 assignments, 77 channels, 40 contacts)
- [x] Supabase project transferred to NA-E's Org (2026-04-06)

## Schema Review Action Items
> Full review: `docs/schema-review.md` (2026-04-06)

### Critical
- [x] **C-1:** Drop duplicate `updated_at` triggers — Migration 015 (2026-04-10)
- [!] **C-2:** Populate `supervised_by` for real team members — **BLOCKED: needs mapping from Paulo/Clayton**
- [x] **C-3:** Add `ON DELETE SET NULL` to `projects.writer_id` and `projects.editor_id` FKs — Migration 015
- [ ] **C-4:** Document soft-delete convention (team members should never be hard-deleted)

### Important
- [x] **I-1:** `projects_update` RLS tightened — role-based update policies in Migration 010
- [ ] **I-2:** Document no-delete policy for clients (intentional soft-delete only)
- [ ] **I-3:** Verify `client_contacts.is_primary`/`is_assistant` NOT NULL in live DB (dump may be inaccurate)
- [ ] **I-4:** Verify `videos_per_week` precision `NUMERIC(4,1)` in live DB
- [ ] **I-5:** (Optional) Add explicit index on `onboarding_steps.client_id` for consistency
- [x] **I-6:** Add partial unique index preventing multiple primary pods per member — Migration 015
- [!] **I-7:** Clarify writer/senior_writer roles with Paulo/Clayton — **BLOCKED: needs human input**

### Suggestions (do during Module 2)
- [x] **S-1:** Add composite index `(client_id, status)` on projects for Kanban queries — Migration 015
- [x] **S-2:** CHECK constraint on `task_number` format (`^KN-\d{5}$`) — Migration 015
- [ ] **S-3:** Reset `project_task_seq` after any project data import
- [ ] **S-4:** Document `senior_writer` in `assignment_role` as display-only
- [x] **S-5:** Pod name length constraint — Migration 015
- [ ] **S-6:** Column comments for `assignment_role` vs `role` distinction
- [ ] **S-7:** Document `onboarding_steps` update-via-service-role pattern

## Auth: Google OAuth — COMPLETE
> Code implemented 2026-04-06. Config + testing completed 2026-04-07.

- [x] Auth callback route (`app/auth/callback/route.ts`)
- [x] Login page updated with "Sign in with Google" button
- [x] Client-side OAuth helper (`app/(auth)/login/google-auth.ts`)
- [x] Middleware updated to allow `/auth/callback` through
- [x] Auto-link `auth_user_id` on first Google login (app layout)
- [x] Build passes clean
- [x] Create Google Cloud OAuth credentials (client ID + secret) — 2026-04-07
- [x] Enable Google provider in Supabase Dashboard (Auth → Providers → Google) — 2026-04-07
- [x] Set authorized redirect URI in Google Cloud — 2026-04-07
- [x] Browser test: Google sign-in flow end to end — 2026-04-07 (both automated + manual)
- [x] Supabase project transferred to new "Known Local" org (isolated from other apps) — 2026-04-07

## Pre-Module 2: Outstanding Items
- [x] Migration 010-015: Schema fixes + Module 2 enhancements applied (all 15 migrations live)
- [!] Get `supervised_by` mapping from Paulo/Clayton (C-2) — blocks Senior Writer/Editor boards
- [!] Clarify writer/senior_writer role question with Paulo/Clayton (I-7) — blocks Writer board
- [ ] Get Dropbox API credentials (app key, secret, refresh token)
- [ ] Get Google Drive service account + share Clients folder
- [ ] Browser test full onboarding flow (9 test phases in `docs/onboarding-test-plan.md`)
- [ ] Reset admin@knownlocal.com password in Supabase Dashboard (login fails on production)
- [ ] Manual test: Google OAuth sign-in on production (click "Sign in with Google" at Railway URL)
- [ ] Commit all changes

## Module 2: Production Pipeline — NOT STARTED
> No detailed plan yet. Spec: `SPEC.md` lines 610-619

- [ ] Write Module 2 implementation plan
- [ ] Build Project CRUD — auto task number, title, client FK, status, writer, editor, dates
- [ ] Implement status state machine — validate transitions in server actions
- [ ] Build reusable Kanban board component — accepts config: visible statuses, project filter function
- [ ] Build Full Pipeline Kanban — all statuses as columns, drag-and-drop, project cards
- [ ] Build Project Detail page — status action buttons, assignments, dates, notes, design status
- [ ] Add pipeline filters — pod, client, status group, team member, date range
- [ ] Add bulk status update — multi-select projects, move to next valid status
- [ ] Add design parallel track — `design_status` field, badge on cards, toggle on detail page
- [ ] Add activity log — write to `project_status_history` on every status change

## Module 3: Team Boards — NOT STARTED
> No detailed plan yet. Spec: `SPEC.md` lines 621-633

- [ ] Write Module 3 implementation plan
- [ ] Build role detection → board config mapping
- [ ] Implement Writer board
- [ ] Implement Editor board
- [ ] Implement Designer board
- [ ] Implement Senior Designer board
- [ ] Implement Senior Writer board
- [ ] Implement Senior Editor board
- [ ] Implement Manager board
- [ ] Implement Jr Strategist board
- [ ] Implement Strategist board
- [ ] Implement Admin board (Full Pipeline + extra controls)
- [ ] Build My Board page — auto-renders correct board based on logged-in user's role

## Module 4: Migration & Polish — PARTIALLY COMPLETE
> Spec: `SPEC.md` lines 635-643. Data migration done early (session 8).

- [x] Build migration script (`scripts/generate_migration.py`)
- [x] Run migration with real data (009_notion_client_data.sql — 80 clients, 35 team members)
- [ ] Validate: spot-check 10 clients, 10 projects, all pod assignments, all team members
- [ ] QA with Paulo — verify client data, project statuses, team assignments
- [ ] Bug fixes from QA
- [x] Deploy to Railway production — 2026-04-10
- [ ] Set up custom domain (if needed)
- [ ] Team walkthrough — record Loom or live session

## Deployment: Railway — COMPLETE
> Deployed 2026-04-10. URL: `https://knwn-local-app-production.up.railway.app`

- [x] Railway project created (creative-comfort → Knwn-Local-App)
- [x] Switched builder from Railpack to Nixpacks
- [x] Cleaned git history (removed node_modules from commits)
- [x] Fixed Node.js version (added engines field + .nvmrc for Node 20)
- [x] Fixed container networking (bind to 0.0.0.0)
- [x] Fixed port mismatch (added PORT=3000 env var)
- [x] Set environment variables (Supabase, Slack, onboarding)
- [x] App live and serving login page — 2026-04-10
- [x] Google OAuth redirect URI updated for production — 2026-04-10
- [x] Supabase redirect URL updated for Railway domain — 2026-04-10

## Post-Launch: Security Hardening
- [ ] Restrict Google OAuth sign-up to pre-existing team members only (remove auto-create branch in app layout, redirect unknown emails to "access denied" page)
- [ ] Consider domain restriction (e.g. only `@knownlocal.com`) as alternative/additional guard

---

*Last updated: 2026-04-10*
