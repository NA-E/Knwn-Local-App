# Known Local App

## What This Is
Internal ops app for a YouTube content agency. Client management, production pipeline (Kanban), role-specific team boards. Read SPEC.md before doing anything.

**IMPORTANT: For all UI/design tasks, components, styling, and visual implementation — read `brand.md` first for complete design system specifications including colors, typography, buttons, tables, Kanban cards, modals, and layout guidelines.**

## Stack
- Next.js 16 (App Router, Server Actions, Server Components)
- Supabase (PostgreSQL, Auth, RLS)
- TypeScript (strict mode)
- Tailwind CSS v4 + shadcn/ui v4 (base-nova style)
- Deployed on Railway (Nixpacks builder, `knwn-local-app-production.up.railway.app`)

## Next.js 16 / Tailwind v4 / shadcn v4 Gotchas
- **Tailwind v4:** No `tailwind.config.ts` — all config in CSS via `@theme inline` in `globals.css`
- **shadcn v4 uses base-ui, NOT radix:** `asChild` does NOT exist on components like `DialogTrigger`. Use `render` prop instead: `<DialogTrigger render={<button>text</button>} />`
- **Page params are Promises:** `{ params }: { params: Promise<{ id: string }> }` — must `await params`. Same for `searchParams`.
- **Color format:** Brand tokens are hex values in `:root` CSS vars, mapped to Tailwind via `@theme inline` `--color-*` vars
- **`toast` is deprecated** in shadcn v4 — use `sonner` component instead
- **Middleware deprecation warning:** Next.js 16 shows "use proxy instead" — middleware still works, address in future

## Code Style
- Use ES modules (import/export)
- Prefer Server Components. Use 'use client' only when needed (interactivity, hooks)
- Server Actions for all data mutations — no API routes
- Use Supabase SSR client pattern (createServerClient / createBrowserClient)
- Colocate components with their page when page-specific
- Shared components go in /components/ui (shadcn) or /components/shared

## Project Structure
```
/app              → Pages (App Router)
/app/api          → Only if absolutely necessary
/components       → Shared and UI components
/lib              → Supabase client, utils, types, constants
/lib/supabase     → Server/client Supabase helpers
/lib/types        → TypeScript types matching DB schema
/lib/constants    → Enums, status machine config, role configs
/lib/actions      → Server Actions organized by entity
```

## Database
- All queries through Supabase JS client — no raw SQL in app code
- RLS policies enforce access — never filter by role in application code alone
- Status transitions validated in server actions before DB update
- Use the status machine config in /lib/constants — single source of truth

## Key Patterns
- Kanban board is a reusable component configured per role
- Role → board config mapping lives in /lib/constants
- Project cards are a shared component used across all boards
- Client assignments use a junction table, not separate columns per role

## Build Order
Module 0 → 1 → 2 → 3 → 4. Commit after each module. See SPEC.md for details.

## Do NOT
- Implement anything listed in "Out of Scope for V1" in SPEC.md
- Add API routes unless the use case requires it (e.g., fire-and-forget background work)
- Use client-side state management libraries (no Redux, Zustand) — server components + URL state
- Over-engineer auth — email/password + Google OAuth only

## Persistent Context

### Architectural Decisions (locked, do not re-debate)

**Board Filters — single source of truth:**
- Strategist board → `client_assignments WHERE assignment_role = 'strategist'` (NOT pod-based)
- Jr Strategist board → same as Strategist (`assignment_role = 'strategist'` slot)
- Manager board → `client_assignments WHERE assignment_role = 'manager'`
- Senior Editor board → `client_assignments WHERE assignment_role = 'senior_editor'`
- Senior Writer board → `team_members WHERE supervised_by = current_user` → `projects.writer_id`
- Designer board → `client_assignments WHERE assignment_role = 'designer'`
- Pods are for analytics/profitability ONLY — never used as operational board filter

**Schema additions (in SPEC.md, must be in DDL):**
- `team_members.supervised_by UUID REFERENCES team_members(id)` — supervision chain for writers/editors
- `project_status_history` table — audit log for all status changes
- `design_status` is a proper ENUM (not CHECK constraint)
- `jr_strategist` added to `team_role` enum

**Jr Strategist RLS critical note:**
- Jr Strategist handoff permissions must check `team_role = 'jr_strategist'` — NOT `client_assignments`
- Jr Strategists have NO `assignment_role = 'manager'` row — any policy joining through client_assignments for manager transitions will silently block them

**Migration:**
- Pod 3 agency editing contact → `role = senior_editor` (NOT editor)
- Pod 3 agency designer contact → `role = designer`
- After migration: populate `supervised_by` for all writers and editors (Paulo/Clayton must provide the mapping)
- Migrate only `active` + `onboarding` clients — pending/disengaged/template/inactive deferred to phase 2

**Build order:**
- Pre-Build: wireframe review with Clayton + Paulo BEFORE any code (Module 0)
- Reusable Kanban component built in Module 2 (not Module 3)
- Commit after each module

**Out of scope (phase 2):**
- KPIs and dashboards
- Health score
- Round-robin writer assignment automation
- Client portal

### Key Files
- `docs/master-tasklist.md` — **single source of truth for all project tasks.** Add every new task, plan, or action item here.
- `docs/schema-review.md` — Principal engineer schema review (2026-04-06), 4 critical + 7 important findings
- `SPEC.md` — full V1 spec, authoritative source for schema, state machine, board configs
- `brand.md` — design system reference: colors, typography, components, layout rules. Read before any UI work.
- `wireframes.md` — ASCII wireframes for all major pages (Clayton/Paulo review)
- `ui-inspiration.html` — live HTML design system demo (open in browser)
- `docs/superpowers/plans/2026-04-02-client-onboarding.md` — Module 0+1 implementation plan (14 tasks)
- `docs/superpowers/specs/2026-04-03-client-onboarding-automation.md` — Onboarding automation design spec (Slack, Dropbox, GDrive, realtime modal)
- `docs/onboarding-test-plan.md` — Onboarding test plan with env var setup, 9 test phases
- `docs/module01-test-review.md` — Module 0+1 bug tracker: browser test results, code review findings, fix priority plan
- `erd.html` — entity relationship diagram (open in browser)
- `first meeting transcript.md` — original planning call, reference for business logic questions

### MCP Server
- Located at `mcp-server/` — dual transport: stdio (Claude Desktop) + Streamable HTTP (Claude.ai)
- 22 tools: all Module 0+1 entities + `get_onboarding_status`
- Auth: Supabase PostgREST with JWT auto-refresh
- Config: `mcp-server/.env` (SUPABASE_URL, SUPABASE_ANON_KEY, credentials, PORT)
- Build: `cd mcp-server && npm run build` → `node dist/index.js`
- Claude Desktop config: `AppData\Local\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude\claude_desktop_config.json`

### Status Machine
- `lib/constants/status.ts` — STATUS_TRANSITIONS (21 transitions with role arrays), STATUS_TO_GROUP, STATUS_GROUPS
- `lib/constants/index.ts` — barrel export for all constants

### Client Onboarding Automation
- Architecture: fire-and-forget API route (`/api/onboard`) + Supabase Realtime + service-role client
- Service layer: `lib/services/` (slack.ts, dropbox.ts, onboarding.ts)
- Parallel execution: Phase 1 (Slack+Dropbox), Phase 2 (invite+welcome+notify)
- Modal: `components/clients/onboarding-modal.tsx` — realtime subscription, spinner/tick/X, retry, stall detection
- Env vars in `.env.local`: SUPABASE_SERVICE_ROLE_KEY, SLACK_BOT_TOKEN, DROPBOX_APP_KEY/SECRET/REFRESH_TOKEN, ONBOARD_INVITE_EMAILS
- **Google Drive integration removed** — not being integrated

### Supabase Project
- Project ref: `tcpynxcruaddahdhuugb`
- Organization: **Known Local** org (transferred from NA-E's Org on 2026-04-07 to isolate from other apps, Free plan / Nano compute)
- Region: East US (North Virginia)
- Admin user: `admin@knownlocal.com` (linked to team_members table)
- 18 migrations (001_schema through 018_documentation_comments)
- 009_notion_client_data.sql: Real data from Notion — 80 clients (74 active + 6 onboarding), 35 team members, 306 assignments, 77 channels, 40 contacts. Replaced all test/seed data.
- Realtime enabled on `onboarding_steps` table (via ALTER PUBLICATION in 007)
- Supabase CLI migration tracking synced (all 18 migrations)
- **`supabase db push` gotcha:** It wraps each migration file in its own transaction — do NOT include `BEGIN`/`COMMIT` in migration SQL files (causes nested transaction issues)

### Meeting Transcripts & Process Maps
- Transcripts directory: `docs/transcripts/YYYY-MM-DD/` — one directory per date
- Naming: `{type}-{sequence}-{topic-slug}.md` where type is `recap` (Fathom AI summary) or `transcript` (full word-for-word)
- Examples: `transcript-1-kpi-onboarding-storage.md`, `recap-2-video-workflow.md`
- Process maps: `docs/process-maps/` — as-is and to-be Mermaid flowcharts, discovery scripts
- Source: Fathom AI via email recaps → "View Meeting" link for full transcripts

### Data Migration
- Notion exports: `client database from notion/` (2 CSVs), `team members from notion/` (2 CSVs)
- Generator script: `scripts/generate_migration.py` — reads both Notion exports, normalizes names/pods/roles, generates SQL
- Review script: `scripts/review_migration_data.py` — prints 5 tables for data verification
- 22/35 team members have real emails from Notion, 13 have `@knownlocal.com` placeholders
- Name normalization: Mae=Mae Ariate, Anderson "Cirion" Ruan=Anderson Ruan, Juan Audiovisual=Juan Bravo, igor marques→Igor Marques

### Railway Deployment
- Project: `creative-comfort` → Service: `Knwn-Local-App`
- URL: `https://knwn-local-app-production.up.railway.app`
- Builder: Nixpacks (Railpack failed to generate build plan)
- Region: us-west2, 1 Replica
- GitHub auto-deploy: connected to `main` branch
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SLACK_BOT_TOKEN`, `ONBOARD_INVITE_EMAILS`, `PORT=3000`
- `PORT=3000` is required — Railway domain proxy forwards to port 3000, without this Railway injects PORT=8080 causing a mismatch
- `package.json` start script: `next start -H 0.0.0.0 -p ${PORT:-3000}` — must bind to 0.0.0.0 for container networking
- `.nvmrc` = `20` — tells Nixpacks to use Node 20+ (Next.js 16 requirement)

### Google OAuth
- Google Cloud project: `gen-lang-client-0914174214` (Gemini API project, shared with other apps)
- OAuth client: "Known Local" (Web application), Client ID: `541238776209-65qo8qshroh7df4a8htjg50tl15q2cfs.apps.googleusercontent.com`
- Authorized redirect URIs: `https://tcpynxcruaddahdhuugb.supabase.co/auth/v1/callback`
- Supabase Google provider: enabled in "Known Local" org with Client ID + Secret
- Supabase redirect URLs: includes `https://knwn-local-app-production.up.railway.app/**` for Railway production
- OAuth consent screen: External, app name "Known Local", email: ekanourin@gmail.com
- Code files: `app/(auth)/login/google-auth.ts` (client-side OAuth), `app/auth/callback/route.ts` (code exchange), `app/(app)/layout.tsx` (auto-link existing team member)
- **Security:** Auto-create removed. Unknown emails → signed out → `/access-denied`. Only pre-existing team members can sign in.
- **Gotcha:** Google Cloud new Auth Platform no longer shows client secrets after creation — must copy immediately or generate new

### Bug Fix Status
- All Phase 1–4 bugs fixed (45 total; BUG-7 skipped per user, BUG-21 not a bug)
- Phase 3 Module 2 prep complete (BUG-22, 25-28, 29-31, 38, 41)
- Tracker: `docs/module01-test-review.md`

### Testing Workflow
- Test module-by-module in browser (login, navigate, CRUD operations, check console errors)
- Run parallel code review agents (auth, server actions, pages/components, SQL/types)
- Consolidate bugs into `docs/module01-test-review.md` with severity and fix priority
- Fix critical → medium → low, then re-test in browser

## Design System Reference

**All UI/design specifications are maintained in `brand.md`** — refer to that file for:
- Complete color token system (CSS custom properties)
- Typography: Sora for UI, JetBrains Mono for task IDs
- Button variants (btn-dark, btn-ghost) and usage rules
- Table, card, panel, modal, and form field specs
- Sidebar nav styling
- Kanban column and project card patterns
- Status badge colors and design status dot specs
- What NOT to do (fonts, shadows, gradients to avoid)

## Project Rules & Conventions

### Data Integrity
- **Team members are NEVER hard-deleted.** Set `status = 'inactive'` instead. Hard delete breaks project history, assignment trails, and `supervised_by` references.
- **Clients are NEVER hard-deleted.** Use status lifecycle (`active → disengaged → inactive`). Hard delete orphans projects, contacts, channels, and onboarding history.
- **Portal tokens are permanent.** No "regenerate" option — once generated, the token persists with a 90-day expiry.

### Roles & Assignments
- `team_members.role` = who the person IS (job title/capability: writer, editor, admin, etc.)
- `client_assignments.assignment_role` = which slot they FILL for a specific client (strategist, manager, editor, etc.)
- `senior_writer` in assignment_role is display-only for board filtering — not expected in real client assignment rows
- Writer/editor dropdowns must include `writer + senior_writer + admin` and `editor + senior_editor + admin` respectively — not just the base role
- Pod selection on client form auto-populates strategist and manager from pod's team members

### Security
- All server actions that mutate data must check the user's role via `team_members.auth_user_id`
- Team/pod mutations → admin only
- Client mutations → admin, strategist, jr_strategist
- Project mutations → role-based field allowlists in `lib/actions/projects.ts`
- OAuth sign-in restricted to pre-existing team members. Unknown emails → `/access-denied`.
- `onboarding_steps` table is written via service-role key (bypasses RLS), read via Realtime subscription

### UI Conventions
- Field labels must be consistent between read-only detail views and edit forms
- Pod names render as pill badges: `rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-[#EDEAE2] text-[#78756C]`
- Card sections use: `bg-card border border-border rounded-[10px] p-5`
- Section headers use: `text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D] mb-3`
- Client edit form mirrors the detail view layout (2-column card grid)
- Pod selection uses visual cards with client counts and capacity bars, not plain dropdown
- Toasts via `sonner` — `<Toaster>` mounted in root layout

### Integrations
- **Slack**: Active. Bot token in env, used for onboarding notifications.
- **Dropbox**: Planned. App credentials needed. Used for client folder creation during onboarding.
- **Google Drive**: NOT integrating. Remove any remaining GDrive code.

### Task Management
- `docs/master-tasklist.md` — active/open items only, kept lean
- `docs/archive/` — completed items, organized by date, max 1000 lines per file
- New tasks go in master-tasklist; move to archive when done

### Migration Rules
- Never include `BEGIN`/`COMMIT` in migration SQL files (Supabase wraps each in a transaction)
- Always use `IF NOT EXISTS` / `IF EXISTS` for idempotent migrations
- After any project data import, reset `project_task_seq` to max existing value
- Run `npx supabase db push` to apply; `--dry-run` to preview
