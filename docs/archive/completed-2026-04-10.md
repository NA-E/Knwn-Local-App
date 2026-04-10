# Completed Tasks — 2026-04-10

> Archived from `docs/master-tasklist.md`. All items verified done on this date.

---

## Bugs Fixed

- **BUG-P1**: Pipeline project cards — click-to-navigate with drag guard (2026-04-10)
- **BUG-P2**: Google OAuth sign-in — fixed `0.0.0.0` redirect bug, added `NEXT_PUBLIC_SITE_URL` (2026-04-10)
- **BUG-P3**: Client portal magic link — verified working on production (2026-04-10)
- **BUG-C2**: Drag-and-drop — verified working, both within-row and cross-row (2026-04-10)
- **BUG-C3**: Pagination on client list — verified working (80 clients, 4 pages) (2026-04-10)
- **BUG-38**: `client-team-section.tsx` — already fixed (has .catch() and loading state)
- **BUG-41**: `team-member-form.tsx` — already fixed (key prop forces remount on pod change)
- **BUG-L1**: Viewport clipping — removed h-full from html/body, pages now scroll naturally (2026-04-10)
- **BUG-W1**: Writer dropdown on project create — broadened role filter to writer/senior_writer/admin (2026-04-10)

## UI Improvements — Client List

- **UI-1**: Remove Strategist column from client list table (2026-04-10)
- **UI-2**: Add contract start date column to client list (2026-04-10)
- **UI-3**: Add column sorting (ascending/descending) for all columns (2026-04-10)
- **UI-4**: Fix column squeezing — fixed widths on Pod/Date/Status, truncate Market (2026-04-10)
- **UI-5**: Make pod names pill-style badges (2026-04-10)

## UI Improvements — Client Detail

- **UI-6**: Rename "Channels" to "YouTube Channels", move YouTube link into that section (2026-04-10)
- **UI-7**: Format Special Notes with whitespace/multiline support (2026-04-10)
- **UI-8**: Remove B-Roll Library link (2026-04-10)
- **UI-9**: Dropbox link — already functional via dropbox_upload_url (2026-04-10)
- **UI-10**: Add File Upload Link under portal section, renamed to "Client Access" (2026-04-10)
- **UI-16**: Remove click-to-reassign on team section (2026-04-10)

## UI Improvements — Client Create/Edit

- **UI-11**: Client edit form restructured to 2-column card layout mirroring detail view (2026-04-10)
- **UI-12**: Team assignment — pod selection auto-adds strategist and manager (2026-04-10)
- **UI-13**: Field names consistent between read-only and edit views — 5 labels aligned (2026-04-10)
- **UI-14**: Remove "Regenerate link" from portal section (2026-04-10)
- **UI-15**: Contacts section formatting — email primary, name above, assistant badge (2026-04-10)
- **UI-17**: Pod cards with client counts and capacity bars (2026-04-10)
- **UI-18**: Team assignment section with 7 role dropdowns + auto-assign on pod select (2026-04-10)
- **UI-19**: Remove Dropbox Upload URL and B-Roll Library URL fields (2026-04-10)
- **UI-20**: Generate portal links for all existing clients — Migration 016 (2026-04-10)

## UI Improvements — Team & Pods Pages

- **UI-21**: Add search and filter functionality to team list (2026-04-10)
- **UI-22**: Redesign pods page as master-detail layout with team members + roles (2026-04-10)

## UI Improvements — Project Create/Detail

- **UI-25**: Project create form — shows pod + inherited team from client assignments (2026-04-10)
- **UI-26**: Project create shows inherited team, auto-populates editor (2026-04-10)
- **UI-27**: Remove KN-##### task number from everywhere (2026-04-10)
- **UI-28**: Validation errors on project create — mounted Sonner Toaster (2026-04-10)
- **UI-29**: Make Script Due, Edit Due, and Publish Due dates editable (2026-04-10)
- **UI-30**: Project detail sidebar — pod pill + full team section with all assignment roles (2026-04-10)

## UI Improvements — Pipeline

- **UI-31**: Improve "design must be completed" error message with actionable guidance (2026-04-10)
- **UI-32**: Make ALL project detail fields editable — design_status, writer/editor, edit_version, dates, links (2026-04-10)
- **UI-33**: Add `actual_post_date` field to project detail UI and server action (2026-04-10)

## Security

- **SEC-1**: `lib/actions/team-members.ts` — added admin role check (2026-04-10)
- **SEC-2**: `lib/actions/pods.ts` — added admin role check (2026-04-10)
- **SEC-3**: `lib/actions/clients.ts` — added admin/strategist/jr_strategist role check (2026-04-10)
- Restrict Google OAuth sign-up to pre-existing team members only — auto-create removed, /access-denied page (2026-04-10)

## Other Fixes (2026-04-10)

- Removed "Add Client" from sidebar nav
- Removed Vid/wk column from client list table
- Removed KN-#### task number from kanban project cards
- Removed card count badges from kanban column headers
- Stacked row kanban layout — grouped by phase, collapsible, cross-row drag
- Fixed scroll issue (removed overflow-x wrapper from pipeline/my-board pages)
- Updated manual testing checklist for new layout + client portal
- Fix BUG-P1: Make project cards clickable
- Test client portal magic link sign-in on production
- Test Google OAuth on production — fixed redirect bug + verified
- Verify drag-and-drop cross-row works on production

---

## Module 0: Foundation — COMPLETE

> Plan: `docs/superpowers/plans/2026-04-02-client-onboarding.md` (Tasks 1-5)

- Project bootstrap (Next.js 16, TypeScript, Tailwind v4, shadcn v4)
- Database schema (001_schema.sql) + RLS (002_rls.sql) + seed (003_seed.sql)
- TypeScript types + Supabase client helpers
- Auth middleware + login page
- App shell (layout + sidebar)

## Module 1: Client Onboarding — COMPLETE

> Plan: `docs/superpowers/plans/2026-04-02-client-onboarding.md` (Tasks 6-14)

- Pods CRUD
- Team Members CRUD
- Client List page with filters
- Add/Edit Client form
- Client Detail — shell + info section
- Client Channels section
- Client Contacts section
- Client Assignments (team picker)
- Seed data + RLS policies

## Cross-Module: Bug Fixes & Infrastructure — COMPLETE

> Tracker: `docs/module01-test-review.md`

- Phase 1-4 bug fixes (45 total; BUG-7 skipped per user, BUG-21 not a bug)
- Phase 3 Module 2 prep (BUG-22, 25-28, 29-31, 38, 41)
- Migrations 004-006 applied (fixes, phase4_fixes, module2_prep)
- MCP server built (22 tools, dual transport) — `mcp-server/`
- Onboarding automation designed + implemented
- Migration 007: onboarding_steps table + RLS + Realtime
- Migration 008: schema fixes (indexes, enum, triggers, FK)
- DB schema review + Supabase CLI migration sync
- Migration 009: Real data from Notion (80 clients, 35 team members, 306 assignments, 77 channels, 40 contacts)
- Supabase project transferred to NA-E's Org (2026-04-06)

## Schema Review — COMPLETE (except blocked items)

> Full review: `docs/schema-review.md` (2026-04-06)

- **C-1:** Drop duplicate `updated_at` triggers — Migration 015 (2026-04-10)
- **C-3:** Add `ON DELETE SET NULL` to projects.writer_id and projects.editor_id FKs — Migration 015
- **C-4:** Document soft-delete convention — SQL COMMENT, Migration 018 (2026-04-10)
- **I-1:** `projects_update` RLS tightened — role-based update policies in Migration 010
- **I-2:** Document no-delete policy — SQL COMMENT, Migration 018 (2026-04-10)
- **I-3:** Re-asserted NOT NULL on client_contacts booleans — Migration 017 (2026-04-10)
- **I-4:** Re-asserted NUMERIC(4,1) on videos_per_week — Migration 017 (2026-04-10)
- **I-5:** Added index on onboarding_steps.client_id — Migration 017 (2026-04-10)
- **I-6:** Add partial unique index preventing multiple primary pods — Migration 015
- **S-1:** Add composite index `(client_id, status)` on projects — Migration 015
- **S-2:** CHECK constraint on `task_number` format — Migration 015
- **S-3:** Reset project_task_seq to max existing value — Migration 017 (2026-04-10)
- **S-4:** Document senior_writer as display-only — SQL COMMENT, Migration 018 (2026-04-10)
- **S-5:** Pod name length constraint — Migration 015
- **S-6:** Column comments for assignment_role vs role distinction — Migration 018 (2026-04-10)
- **S-7:** Document onboarding_steps service-role pattern — Migration 018 (2026-04-10)

## Auth: Google OAuth — COMPLETE

> Code implemented 2026-04-06. Config + testing completed 2026-04-07.

- Auth callback route (`app/auth/callback/route.ts`)
- Login page updated with "Sign in with Google" button
- Client-side OAuth helper (`app/(auth)/login/google-auth.ts`)
- Middleware updated to allow `/auth/callback` through
- Auto-link `auth_user_id` on first Google login (app layout)
- Build passes clean
- Create Google Cloud OAuth credentials — 2026-04-07
- Enable Google provider in Supabase Dashboard — 2026-04-07
- Set authorized redirect URI in Google Cloud — 2026-04-07
- Browser test: Google sign-in flow end to end — 2026-04-07
- Supabase project transferred to new "Known Local" org — 2026-04-07

## Deployment: Railway — COMPLETE

> Deployed 2026-04-10. URL: `https://knwn-local-app-production.up.railway.app`

- Railway project created (creative-comfort -> Knwn-Local-App)
- Switched builder from Railpack to Nixpacks
- Cleaned git history (removed node_modules from commits)
- Fixed Node.js version (added engines field + .nvmrc for Node 20)
- Fixed container networking (bind to 0.0.0.0)
- Fixed port mismatch (added PORT=3000 env var)
- Set environment variables (Supabase, Slack, onboarding)
- App live and serving login page — 2026-04-10
- Google OAuth redirect URI updated for production — 2026-04-10
- Supabase redirect URL updated for Railway domain — 2026-04-10

## Module 2: Production Pipeline (completed items)

- Build Project CRUD — auto task number, title, client FK, status, writer, editor, dates
- Implement status state machine — validate transitions in server actions
- Build reusable Kanban board component — stacked rows grouped by phase, collapsible
- Build Full Pipeline Kanban — all statuses, drag-and-drop, project cards
- Build Project Detail page — status action buttons, assignments, dates, notes, design status
- Add pipeline filters — pod, client, status group, team member
- Add activity log — write to `project_status_history` on every status change
- Add design parallel track — `design_status` field, badge on cards, toggle on detail page
- Make project cards clickable (BUG-P1)

## Pre-Module 2 (completed items)

- Migration 010-015: Schema fixes + Module 2 enhancements applied (all 15 migrations live)

## Module 4: Migration & Polish (completed items)

- Build migration script (`scripts/generate_migration.py`)
- Run migration with real data (009_notion_client_data.sql — 80 clients, 35 team members)
- Deploy to Railway production — 2026-04-10
