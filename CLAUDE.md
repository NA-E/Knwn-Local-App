# Known Local App

## What This Is
Internal ops app for a YouTube content agency. Client management, production pipeline (Kanban), role-specific team boards. Read SPEC.md before doing anything.

**IMPORTANT: For all UI/design tasks, components, styling, and visual implementation — read `brand.md` first for complete design system specifications including colors, typography, buttons, tables, Kanban cards, modals, and layout guidelines.**

## Stack
- Next.js 16 (App Router, Server Actions, Server Components)
- Supabase (PostgreSQL, Auth, RLS)
- TypeScript (strict mode)
- Tailwind CSS v4 + shadcn/ui v4 (base-nova style)
- Deployed on Vercel

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
- Add API routes when Server Actions work
- Use client-side state management libraries (no Redux, Zustand) — server components + URL state
- Over-engineer auth — email/password only, no social providers

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
- `SPEC.md` — full V1 spec, authoritative source for schema, state machine, board configs
- `brand.md` — design system reference: colors, typography, components, layout rules. Read before any UI work.
- `wireframes.md` — ASCII wireframes for all major pages (Clayton/Paulo review)
- `ui-inspiration.html` — live HTML design system demo (open in browser)
- `docs/superpowers/plans/2026-04-02-client-onboarding.md` — Module 0+1 implementation plan (14 tasks)
- `docs/module01-test-review.md` — Module 0+1 bug tracker: browser test results, code review findings, fix priority plan
- `erd.html` — entity relationship diagram (open in browser)
- `first meeting transcript.md` — original planning call, reference for business logic questions

### Supabase Project
- Project ref: `tcpynxcruaddahdhuugb`
- Region: East US (North Virginia)
- Admin user: `admin@knownlocal.com` (linked to team_members table)
- All 3 migrations (001_schema, 002_rls, 003_seed) applied successfully

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
