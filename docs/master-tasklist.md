# Master Task List — Known Local App

> **Single source of truth for all project work.** Bugs, tasks, user instructions — everything goes here. Reference detailed docs where they exist rather than duplicating content.

## How to Use
- Mark tasks: `[x]` done, `[ ]` not started, `[~]` in progress, `[!]` blocked
- Link to detailed plans/specs/reviews where they exist
- Add new tasks to the appropriate section as they arise
- Date-stamp completed items

---

## Active Work

> Current bugs, tasks, and instructions. Fix/complete these before starting new modules.

### Bugs — Open

- [x] **BUG-P1**: Pipeline project cards — added click-to-navigate with drag guard (2026-04-10)
- [x] **BUG-P2**: Google OAuth sign-in — fixed `0.0.0.0` redirect bug, added `NEXT_PUBLIC_SITE_URL` env var, verified working (2026-04-10)
- [x] **BUG-P3**: Client portal magic link — verified working on production (2026-04-10)
- [ ] **BUG-C1**: Non-admin role access not tested (only admin account available). Sidebar section hiding, server action blocks, RLS enforcement unverified on production.
- [x] **BUG-C2**: Drag-and-drop — verified working on production, both within-row and same-row (2026-04-10)
- [x] **BUG-C3**: Pagination on client list — verified working (80 clients, 4 pages) (2026-04-10)
- [x] **BUG-38**: `client-team-section.tsx` — already fixed (has .catch() and loading state)
- [x] **BUG-41**: `team-member-form.tsx` — already fixed (key prop forces remount on pod change)

### Bugs — Blocked

- [!] **C-2**: Populate `supervised_by` for real team members — needs mapping from Paulo/Clayton.
- [!] **I-7**: Clarify writer/senior_writer roles — needs human input from Paulo/Clayton.

### Tasks — From User Instructions (2026-04-10)

- [x] Fix BUG-P1: Make project cards clickable (navigate to project detail on click, keep drag working)
- [x] Test client portal magic link sign-in on production (BUG-P3)
- [x] Test Google OAuth on production — fixed redirect bug + verified (BUG-P2)
- [ ] Fix all remaining open bugs above
- [x] Verify drag-and-drop cross-row works on production (BUG-C2)

### UI Implementation Guide

> **When implementing any UI changes, refer to `wireframes.html` as the source of truth for layout and design.**

### UI Improvements — Client List (from manual testing 2026-04-10)

- [x] **UI-1**: Remove Strategist column from client list table (2026-04-10)
- [x] **UI-2**: Add a date column (contract start date) to client list (2026-04-10)
- [x] **UI-3**: Add column sorting (ascending/descending) for all columns in client list (2026-04-10)
- [x] **UI-4**: Fix column squeezing — fixed widths on Pod/Date/Status, truncate Market (2026-04-10)
- [x] **UI-5**: Make pod names pill-style buttons (instead of plain badges) (2026-04-10)
### UI Improvements — Client Detail (lost subagent commits, re-implement)

- [x] **UI-6**: Rename "Channels" → "YouTube Channels", move YouTube link into that section (2026-04-10)
- [x] **UI-7**: Format Special Notes with whitespace/multiline support (2026-04-10)
- [x] **UI-8**: Remove B-Roll Library link (2026-04-10)
- [ ] **UI-9**: Dropbox link should open client's specific Dropbox folder (keep it functional)
- [ ] **UI-10**: Add File Upload Link under client portal section, rename that section appropriately
- [ ] **UI-11**: Client edit view should mirror the read-only detail view (same fields/layout)
- [ ] **UI-12**: Team assignment — pod selection should auto-add strategist and manager
- [x] **UI-16**: Remove click-to-reassign on team section in client detail (2026-04-10)

### UI Improvements — Client Create/Edit (from manual testing 2026-04-10)

- [ ] **UI-17**: Client create form — add pod cards with client counts and capacity bars (instead of plain dropdown)
- [ ] **UI-18**: Client create form — add team assignment section (strategist, manager, etc.) with auto-assign on pod select
- [x] **UI-19**: Client create/edit forms — remove Dropbox Upload URL and B-Roll Library URL fields (2026-04-10)
- [ ] **UI-13**: Field names must be consistent between read-only and edit views across the whole app
- [ ] **UI-20**: Generate portal links for all existing clients (not generated during Notion migration)
- [x] **UI-14**: Remove "Regenerate link" from portal section — make portal links permanent (2026-04-10)
- [x] **UI-15**: Contacts section formatting — email primary, name above, assistant badge (2026-04-10)

### UI Improvements — Team Page (from manual testing 2026-04-10)

- [x] **UI-21**: Add search and filter functionality to team list (2026-04-10)

### UI Improvements — Pods Page (from manual testing 2026-04-10)

- [x] **UI-22**: Redesign pods page as master-detail layout with team members + roles (2026-04-10)

### UI Improvements — Project Create/Detail (from manual testing 2026-04-10)

- [ ] **UI-25**: Project create form — add pod selection that auto-populates manager, strategist, and other roles
- [ ] **UI-26**: Projects should inherit the full team from the client's assignments on creation (strategist, manager, designer, senior editor, senior writer, etc.). Show all inherited roles on both project create and project detail — not just writer/editor.
- [x] **UI-27**: Remove KN-##### task number from everywhere (2026-04-10)
- [ ] **UI-30**: Project detail sidebar — add pod display and full team section showing all roles from the client's assignments
- [x] **UI-28**: Validation errors on project create — mounted Sonner Toaster (2026-04-10)
- [x] **UI-29**: Make Script Due, Edit Due, and Publish Due dates editable (2026-04-10)
- [ ] **BUG-W1**: Writer dropdown on project create is empty — no team members with `role = 'writer'` exist in DB. Verify if this is a data/migration issue or role mapping problem.

### UI Improvements — Pipeline (from manual testing 2026-04-10)

- [x] **UI-31**: Improve "design must be completed" error message with actionable guidance (2026-04-10)
- [x] **UI-32**: Make ALL project detail fields editable — design_status, writer/editor dropdowns, edit_version, due dates, project links (2026-04-10)
- [x] **UI-33**: Add `actual_post_date` field to project detail UI and server action (2026-04-10)

### Security — Server Action Role Checks (from manual testing 2026-04-10)

- [x] **SEC-1**: `lib/actions/team-members.ts` — added admin role check (2026-04-10)
- [x] **SEC-2**: `lib/actions/pods.ts` — added admin role check (2026-04-10)
- [x] **SEC-3**: `lib/actions/clients.ts` — added admin/strategist/jr_strategist role check (2026-04-10)

### Layout / Scroll Bug (from manual testing 2026-04-10)

- [x] **BUG-L1**: Viewport clipping — removed h-full from html/body, pages now scroll naturally (2026-04-10)

### Questions — Need Answer

- [ ] **Q-1**: Dashboard "Projects by Stage" bar chart — what is it communicating? Why do we need it? Might make more sense as part of KPI dashboard implementation (phase 2).
- [ ] **Q-2**: If we show percentages on the chart, percentages of what? Probably belongs in KPI/stage-phase analytics, not the current dashboard.

### Recently Fixed (2026-04-10)

- [x] Removed "Add Client" from sidebar nav
- [x] Removed Vid/wk column from client list table
- [x] Removed KN-#### task number from kanban project cards
- [x] Removed card count badges from kanban column headers
- [x] Stacked row kanban layout — grouped by phase, collapsible, cross-row drag
- [x] Fixed scroll issue (removed overflow-x wrapper from pipeline/my-board pages)
- [x] Updated manual testing checklist for new layout + client portal

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

## Module 2: Production Pipeline — IN PROGRESS
> Spec: `SPEC.md` lines 610-619. Plan: `docs/superpowers/specs/`

- [x] Build Project CRUD — auto task number, title, client FK, status, writer, editor, dates
- [x] Implement status state machine — validate transitions in server actions
- [x] Build reusable Kanban board component — stacked rows grouped by phase, collapsible
- [x] Build Full Pipeline Kanban — all statuses, drag-and-drop, project cards
- [x] Build Project Detail page — status action buttons, assignments, dates, notes, design status
- [x] Add pipeline filters — pod, client, status group, team member
- [x] Add activity log — write to `project_status_history` on every status change
- [x] Add design parallel track — `design_status` field, badge on cards, toggle on detail page
- [ ] Add bulk status update — multi-select projects, move to next valid status
- [x] Make project cards clickable (BUG-P1)

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
