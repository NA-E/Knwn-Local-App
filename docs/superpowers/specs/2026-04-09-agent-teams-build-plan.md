# Agent Teams Build Plan — Modules 2, 3, 3.5, 4

**Date:** 2026-04-09  
**Strategy:** Use Claude Code Agent Teams to parallelize implementation across teammates with strict file ownership.

---

## Current State

- **Modules 0+1:** Done (auth, layout, clients, team, pods)
- **Module 1.5:** In progress (onboarding automation — not addressed here)
- **Modules 2-4:** Not started

### Dependency Graph

```
Module 2 (Production Pipeline) ─── critical path
  │
  ├──→ Module 3 (Team Boards) ──── parallel ─┐
  ├──→ Module 3.5 (Client Dashboard) ── parallel ─┤
  └──→ Module 4 (Admin Dashboard) ── parallel ─┘
```

Module 2 must complete first — it builds the reusable Kanban component, project CRUD, and state machine that M3/M3.5/M4 all depend on.

---

## Pre-Work (Lead does before spawning teammates)

Before any teammate starts, the lead handles shared-file changes that would cause conflicts:

### P1. Update TypeScript types
File: `lib/types/database.ts`  
- Add missing Project fields: `script_url`, `edit_url`, `thumbnail_url`, `edit_version`, `edit_due`, `publish_due`, `last_status_change_at`
- Add `notes` field to `ProjectStatusHistory` interface
- Add `cancelled` to `ProjectStatus` type (missing from current types, exists in SPEC)
- Add shared `ProjectWithRelations` type (project + client name + writer name + editor name) used by Kanban and detail components
- Add `KanbanBoardProps` interface (columns config, projects data, current user role, onDrop callback)

### P2. Update STATUS_TRANSITIONS + board configs
Files: `lib/constants/status.ts`, `lib/constants/boards.ts`  
**Status transitions fixes:**
- Add `cancelled` to every active status's transitions: `{ to: 'cancelled', roles: ['strategist', 'jr_strategist', 'admin'] }`
- Add `on_hold` transitions from applicable statuses (idea, brief, scriptwriting, etc.)
- Add `posted_scheduled → ready_to_post` (admin undo): `{ to: 'ready_to_post', roles: ['admin'] }`
- Add `CANCELLED` to StatusGroup type and STATUS_TO_GROUP, STATUS_GROUP_COLORS

**Board configs** (new file `lib/constants/boards.ts`):
- Role → visible columns mapping (from SPEC Module 3):
  - Writer: `scriptwriting`, `fix_script` (2 cols)
  - Editor: `client_uploaded`, `editing`, `ready_for_internal_review`, `internal_adjustments_needed`, `client_adjustments_needed` (5 cols)
  - Sr Writer: `review_script` (1 col)
  - Sr Editor: `ready_for_internal_review` (1 col — approve/reject only)
  - Manager: `script_ready_to_send`, `script_sent_to_client`, `edit_ready_to_send`, `edit_sent_to_client`, `ready_to_post` (5 cols)
  - Designer: `editing`, `ready_for_internal_review`, `edit_ready_to_send` (3 cols, design_status focus)
  - Sr Designer: `editing`, `ready_for_internal_review` (2 cols)
  - Strategist / Jr Strategist: all 18 statuses
  - Admin: all 18 + cancelled
- Role → filter function mapping
- Role → allowed actions mapping
- Export from `lib/constants/index.ts`

### P3. Write migration 010
File: `supabase/migrations/010_module2_columns.sql`  
- Add `cancelled` to project_status enum
- Add index on `last_status_change_at` for stuck-project queries
- Add RLS policy: tighten `projects_update` — writers only update script_url+notes, editors only update edit_url+edit_version+thumbnail_url+notes, designers only update design_status+thumbnail_url (status changes go through server actions)
- Push to Supabase

### P4. Install pragmatic-drag-and-drop
```
npm install @atlaskit/pragmatic-drag-and-drop @atlaskit/pragmatic-drag-and-drop-hitbox
```

### P5. Update sidebar navigation
File: `components/shared/sidebar.tsx`
- Add "Projects" section with sub-links: Pipeline (`/projects/pipeline`), My Board (`/projects/my-board`)
- Update any existing nav links to match new route structure

---

## Phase 1: Module 2 — Production Pipeline (3 Teammates)

### Teammate: "backend"
**Model:** Opus  
**Focus:** Project server actions — all data layer  

**Files owned (exclusive):**
- `lib/actions/projects.ts` — Project CRUD (create, update, list, get, delete)
- `lib/actions/project-transitions.ts` — Status transition validation + execution
- `lib/actions/project-filters.ts` — Pipeline filters (by pod, client, status group, member, date range)

**Tasks (~6):**
1. Build `createProject` action — auto task_number via DB trigger, set initial status=idea, log to project_status_history
2. Build `updateProject` action — edit title, notes, dates, links, design_status (role-gated: writers only update script_url+notes, editors only update edit_url+edit_version+thumbnail_url+notes)
3. Build `transitionProjectStatus` action — validate against STATUS_TRANSITIONS, check preconditions (e.g., edit_url required for editing→ready_for_internal_review), log history, update last_status_change_at
4. Build `getProjectsForPipeline` — fetch all projects with joins (client name, writer name, editor name), support filters (pod, client, status group, member, date range)
5. Build `getProjectsForBoard` — role-filtered query using board configs (writer: writer_id=me, editor: editor_id=me, manager: client_assignments, etc.)
6. Build `getProjectDetail` + `getProjectHistory` — single project with all relations + status history log

### Teammate: "kanban"
**Model:** Opus  
**Focus:** Reusable Kanban board + project card UI components  

**Files owned (exclusive):**
- `components/projects/kanban-board.tsx` — Main board: columns layout, horizontal scroll, group separators, filter bar
- `components/projects/kanban-column.tsx` — Single column: header with count badge, droppable area, card list
- `components/projects/project-card.tsx` — Card: task ID, title, client, assignees, design dot, due date, time-in-status, hover/drag states
- `components/projects/kanban-filters.tsx` — Filter bar: pod toggle, client select, group select, member select, date range
- `components/projects/drag-validation.ts` — canDrop logic using STATUS_TRANSITIONS + current user role

**Tasks (~6):**
1. Build ProjectCard component — normal state with all fields from wireframe (KN-XXXX, title, client, writer/editor, design status dot, due date, time-in-status badge)
2. Add hover state (cyan border + shadow + translateY) and drag state (dashed border + opacity + rotation) to ProjectCard
3. Build KanbanColumn — droppable target using pragmatic-drag-and-drop, column header with status label + count, scrollable card list
4. Build KanbanBoard — horizontal scroll container, status group separators (TO-DO/PRE-PROD/PRODUCTION/POST-PROD/COMPLETE), group label pills (vertical text)
5. Build KanbanFilters — pod toggle buttons, client/group/member/date dropdowns, wire filter state to URL params
6. Build drag-validation — canDrop checks against STATUS_TRANSITIONS for current user's role, valid drop = cyan dashed ghost, invalid drop = coral dashed + error toast

### Teammate: "detail"
**Model:** Opus  
**Focus:** Project detail page components  

**Files owned (exclusive):**
- `components/projects/project-detail-header.tsx` — Header bar: back link, task ID, title (editable), status badge, design status, version badge
- `components/projects/status-actions.tsx` — Status action buttons + inline transition forms (e.g., edit_url + version radio for editing→internal_review)
- `components/projects/project-links.tsx` — Script/Edit/Thumbnail link cards with open buttons
- `components/projects/project-sidebar.tsx` — Right column: assignments, dates (with overdue highlight), design status 3-way toggle
- `components/projects/activity-log.tsx` — Full-width table: timestamp, from→to status badges, changed_by, notes
- `components/projects/project-create-form.tsx` — Create project form (title, client select, writer select, editor select)

**Tasks (~6):**
1. Build ProjectDetailHeader — breadcrumb (← Pipeline), task ID, inline-editable title, status badge, design status dot, version badge
2. Build StatusActions — render available transitions as buttons based on current status + user role, highlight primary action in coral
3. Build inline transition forms — conditional fields per transition (edit_url+version for editing→review, feedback note for review→fix_script, etc.), form validation, submit calls transitionProjectStatus
4. Build ProjectLinks — 3 link cards (Script, Edit, Thumbnail) with "Not set" placeholder state, Open ↗ button, Upload button for thumbnail
5. Build ProjectSidebar — assignments panel (writer/editor with Change button, client link, pod), dates panel (script_v1_due, edit_due with overdue warning, publish_due, actual_post_date), design status 3-way toggle (not_started/in_progress/completed)
6. Build ActivityLog — table with colored from→to status transitions, newest first
7. Build ProjectCreateForm — title, client dropdown, writer dropdown, editor dropdown, submit calls createProject

### Lead wires up pages after teammates complete:
- `app/(app)/projects/pipeline/page.tsx` — Server component: fetch data, render KanbanBoard + KanbanFilters
- `app/(app)/projects/[id]/page.tsx` — Server component: fetch project + history, compose detail components
- `app/(app)/projects/new/page.tsx` — Create project form (simple — title, client, writer, editor)

---

## Phase 2: Modules 3 + 3.5 + 4 (3 Teammates, Fully Parallel)

Launch after Phase 1 merges. All three modules are completely independent.

### Teammate: "boards" (Module 3 — Team Boards)
**Model:** Sonnet (config-heavy, less complex logic)  

**Files owned:**
- `app/(app)/projects/my-board/page.tsx` — Route for role-specific board
- `components/projects/my-board-wrapper.tsx` — Detects current user role, loads board config, renders KanbanBoard with role-filtered data

**Tasks (~6):**
1. Build role detection — get current user's team_member role from session
2. Build MyBoard page — server component that calls getProjectsForBoard with role-based filter
3. Wire board configs for all 10 roles (writer: 2 cols, editor: 5 cols, manager: 5 cols, strategist: all cols, sr_writer: 1 col, sr_editor: 3 cols, designer: 3 cols, sr_designer: 2 cols, jr_strategist: all cols, admin: all+cancelled)
4. Add role-specific action buttons on cards (e.g., writer sees "Submit for Review", sr_writer sees "Approve/Reject")
5. Add overdue highlighting on cards (amber >3d, coral >7d based on last_status_change_at)
6. Test all role views with existing seed data

### Teammate: "portal" (Module 3.5 — Client Dashboard)
**Model:** Opus  

**Files owned:**
- `app/client/[token]/layout.tsx` — Light theme layout (separate from main app)
- `app/client/[token]/page.tsx` — Client dashboard
- `app/client/[token]/welcome/page.tsx` — Magic link landing
- `components/client-portal/portal-nav.tsx` — Left sidebar nav (Upload, Projects, Reviews, Resources)
- `components/client-portal/upload-hero.tsx` — Dropbox upload CTA
- `components/client-portal/project-list.tsx` — Read-only project cards with friendly status labels
- `components/client-portal/review-section.tsx` — Pending reviews with Dropbox links
- `components/client-portal/resources-list.tsx` — Brand docs, filming tips, FAQ links
- `lib/actions/client-portal.ts` — Token validation, project fetching for client view
- `supabase/migrations/011_client_portal.sql` — client_portal_tokens table, magic link generation

**Tasks (~6):**
1. Design + migrate client_portal_tokens table (token, client_id, expires_at, created_by)
2. Build token validation middleware / server action — validate token, check expiry, return client data
3. Build magic link landing page — welcome message, auto-redirect, expired state
4. Build client dashboard layout — light theme, portal nav, client branding
5. Build project list with friendly status labels (mapping internal enums to "Script Being Reviewed", "In Editing", etc.)
6. Build upload hero (Dropbox link), review section (edit_url when status=edit_sent_to_client), resources list

### Teammate: "admin" (Module 4 — Admin Dashboard + Polish)
**Model:** Sonnet  

**Files owned:**
- `app/(app)/dashboard/page.tsx` — Replace placeholder with real dashboard
- `components/dashboard/stats-row.tsx` — Stat cards (total clients, active projects, stuck projects, team members)
- `components/dashboard/stuck-projects.tsx` — Stuck projects table with amber/red severity
- `components/dashboard/quick-actions.tsx` — Add Client, View Pipeline, Manage Users buttons
- `lib/actions/dashboard.ts` — Dashboard aggregate queries

**Tasks (~5):**
1. Build dashboard data queries — count clients by status, count active projects, find stuck projects (last_status_change_at > 3 days), count team members
2. Build StatsRow — 4 stat cards matching wireframe (total clients, active projects, stuck projects, team members with migration indicator)
3. Build StuckProjects table — ID, title, status badge, days stuck (amber >3d, red >7d), assigned to
4. Build QuickActions — Add Client, View Pipeline, Manage Users buttons
5. Wire dashboard page as server component — fetch all aggregates, compose components

---

## File Ownership Matrix

Ensures zero overlap between teammates:

| File/Directory | Owner |
|---|---|
| `lib/types/database.ts` | Lead (pre-work) |
| `lib/constants/boards.ts` | Lead (pre-work) |
| `lib/constants/index.ts` | Lead (pre-work) |
| `lib/actions/projects.ts` | backend teammate |
| `lib/actions/project-transitions.ts` | backend teammate |
| `lib/actions/project-filters.ts` | backend teammate |
| `components/projects/kanban-*.tsx` | kanban teammate |
| `components/projects/project-card.tsx` | kanban teammate |
| `components/projects/drag-validation.ts` | kanban teammate |
| `components/projects/project-detail-*.tsx` | detail teammate |
| `components/projects/status-actions.tsx` | detail teammate |
| `components/projects/activity-log.tsx` | detail teammate |
| `components/projects/project-links.tsx` | detail teammate |
| `components/projects/project-sidebar.tsx` | detail teammate |
| `app/(app)/projects/pipeline/page.tsx` | Lead (after Phase 1) |
| `app/(app)/projects/[id]/page.tsx` | Lead (after Phase 1) |
| `app/(app)/projects/my-board/page.tsx` | boards teammate |
| `app/client/[token]/**` | portal teammate |
| `components/client-portal/**` | portal teammate |
| `app/(app)/dashboard/page.tsx` | admin teammate |
| `components/dashboard/**` | admin teammate |

---

## Estimated Timeline

- **Pre-work (Lead):** ~30 min
- **Phase 1 (3 teammates, parallel):** ~2-3 hours
- **Phase 1 integration (Lead):** ~30 min
- **Phase 2 (3 teammates, parallel):** ~2-3 hours
- **Final integration + testing (Lead):** ~1 hour

---

## Agent Teams Configuration

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**Display mode:** in-process (Windows — no tmux)  
**Team size:** 3 per phase  
**Tasks per teammate:** 5-6  
**Model:** Opus for backend/kanban/detail/portal, Sonnet for boards/admin (config-heavy)

---

## Wireframe Discrepancies to Fix During Build

From cross-check (address during implementation, not wireframe update):

1. Add `cancelled` status + CANCELLED group to Kanban
2. Include all 18 columns in full pipeline (fix_script, internal_adjustments_needed, client_adjustments_needed were missing from wireframe)
3. Add project creation flow (idea column + button or from client detail)
4. All 10 role boards in Module 3 (wireframe only showed 5)
5. Bulk select not in V1 scope (defer to phase 2 — too complex for first build)

## Deferred to Phase 2

- **Bulk select + move** on pipeline (SPEC mentions it but too complex for V1)
- **Slack DM notifications** on critical transitions (backend teammate could add the hook point, but actual Slack integration deferred — needs SLACK_BOT_TOKEN which is already configured for onboarding)
- **KPIs and dashboards** (out of scope per SPEC)
- **Round-robin writer assignment** (out of scope per SPEC)
