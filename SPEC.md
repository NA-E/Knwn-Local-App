# Known Local — V1 App Specification

## Overview
Internal operations app for Known Local, a YouTube content agency managing ~70 active clients across 4 pods. Replaces their current Notion-based system with a custom app covering client onboarding, production pipeline management, and role-specific team boards.

## Tech Stack
- **Framework:** Next.js (App Router, Server Actions)
- **Database:** Supabase (PostgreSQL + Auth + Row Level Security)
- **UI:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel
- **Language:** TypeScript end-to-end

---

## Roles & Permissions
Ten roles in the system. Every user has exactly one role.

| Role | Can see | Can do |
|------|---------|--------|
| Admin | Everything | Full CRUD on all entities. Manage users. |
| Strategist | All projects for clients in their pod. All clients in their pod. | **Create projects** for their pod's clients. Edit client info. Move any project status within valid transitions. Assign writers to projects (at brief→scriptwriting). Add notes. |
| Jr Strategist | Same as Strategist — all projects for clients in their pod. | **Create projects** for their pod's clients. Same as Strategist + Manager combined: edit client info, move any status, assign writers, send scripts/edits to client, schedule posts. |
| Manager | Projects in handoff statuses for their assigned clients. All their assigned clients. | Move statuses: Script Ready to Send → Script Sent, Edit Ready to Send → Edit Sent, Ready to Post → Posted. |
| Senior Editor | Projects in Ready for Internal Review for editors they oversee. | Approve/reject edits. Move status: Ready for Internal Review → Edit Ready to Send OR Internal Adjustments Needed. |
| Senior Writer | Projects in Review Script for writers they oversee. | Approve/reject scripts. Move status: Review Script → Script Ready to Send OR Fix Script. |
| Senior Designer | Same board as Designer. Manages designer assignments to clients. | Update design_status on any client's projects. Assign designers to clients (admin-level for design assignments). |
| Editor | Only projects assigned to them in editing statuses. | Move statuses within editing range. |
| Writer | Only projects assigned to them in writing statuses. | Move statuses within writing range. |
| Designer | Projects for their assigned clients from Client Uploaded through Edit Ready to Send. | Update design_status on their assigned clients' projects. View-only for pipeline status. |

---

## Auth Implementation
- Supabase Auth with email/password login (no social auth for V1)
- `role` column on `team_members` table determines access
- Row Level Security (RLS) policies enforce visibility per role
- No self-registration — Admin creates accounts

---

## Database Schema

### Enums

```sql
-- Team member roles
CREATE TYPE team_role AS ENUM (
  'admin',
  'strategist',
  'jr_strategist',
  'manager',
  'senior_editor',
  'senior_writer',
  'senior_designer',
  'editor',
  'writer',
  'designer'
);

-- Design parallel track status
CREATE TYPE design_status AS ENUM (
  'not_started',
  'in_progress',
  'completed'
);

-- Client lifecycle status
-- Definitions for pending/disengaged/template deferred to phase 2 — migrate only 'active' and 'onboarding' for V1.
CREATE TYPE client_status AS ENUM (
  'template',
  'onboarding',
  'active',
  'disengaged',
  'pending',
  'inactive'
);

-- Script format preference
CREATE TYPE script_format AS ENUM (
  'word_for_word',
  'outline'
);

-- Communication method
CREATE TYPE comm_method AS ENUM (
  'slack',
  'email',
  'other'
);

-- Project master status — ordered exactly as the pipeline flows
CREATE TYPE project_status AS ENUM (
  'idea',
  'on_hold',
  'brief',
  'scriptwriting',
  'review_script',
  'fix_script',
  'script_ready_to_send',
  'script_sent_to_client',
  'client_uploaded',
  'editing',
  'ready_for_internal_review',
  'internal_adjustments_needed',
  'edit_ready_to_send',
  'edit_sent_to_client',
  'client_adjustments_needed',
  'ready_to_post',
  'posted_scheduled'
);

-- Assignment role type — named slots on a client record, populated during client onboarding.
-- These represent the fixed per-client team. Writers are excluded (round-robin, per-project).
-- jr_strategist is NOT here — Jr Strategists use the 'strategist' slot on the client record.
-- senior_writer is included for Client Detail Team Section display only — it is NOT used for board filtering.
--   Senior Writer board uses supervised_by chain, not client_assignments. Confirmed: keep this value.
CREATE TYPE assignment_role AS ENUM (
  'strategist',
  'manager',
  'editor',
  'senior_editor',
  'designer',
  'senior_designer',
  'senior_writer'
);
```

### Tables

```sql
-- Pods: grouping unit for profitability tracking and org structure.
-- NOT used as the operational filter for Strategist/Jr Strategist boards — client_assignments is.
-- Used for: Admin board pod filter, dashboard aggregations, client list Pod column, team roster display.
CREATE TABLE pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team Members: staff roster
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role team_role NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  -- Supervision chain: for writers, points to their senior_writer. For editors, points to their senior_editor. NULL for all other roles.
  supervised_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team Member ↔ Pod junction (many-to-many)
-- Strategists, managers, designers are pod-scoped. Writers/senior writers are cross-pod (round-robin). Editors are departmental — pod assignment is a future goal, not current V1 state.
CREATE TABLE team_member_pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  UNIQUE(team_member_id, pod_id)
);

-- Clients: master client record
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  market TEXT,
  timezone TEXT,
  website TEXT,
  youtube_channel_url TEXT,
  dropbox_upload_url TEXT,
  broll_library_url TEXT,
  slack_channel_url TEXT,
  status client_status NOT NULL DEFAULT 'onboarding',
  pod_id UUID REFERENCES pods(id),
  package TEXT,
  contract_start_date DATE,
  posting_schedule TEXT,
  script_format script_format,
  communication_method comm_method,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Client Channels: one client can have multiple YouTube channels
CREATE TABLE client_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  channel_url TEXT,
  videos_per_week NUMERIC(4,1) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Client Contacts: primary + assistant emails
CREATE TABLE client_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  contact_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_assistant BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Client Assignments: normalized role mapping
-- Replaces Notion's 6-7 separate relation columns
CREATE TABLE client_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  assignment_role assignment_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, team_member_id, assignment_role)
);

-- Projects: one record = one video/content piece
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status project_status NOT NULL DEFAULT 'idea',
  writer_id UUID REFERENCES team_members(id),
  editor_id UUID REFERENCES team_members(id),
  script_v1_due DATE,
  actual_post_date DATE,
  design_status design_status NOT NULL DEFAULT 'not_started',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Task number auto-generation
-- Format: KN-0001, KN-0002, etc.
CREATE SEQUENCE project_task_seq START 2700;

CREATE OR REPLACE FUNCTION generate_task_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.task_number := 'KN-' || LPAD(nextval('project_task_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_task_number
  BEFORE INSERT ON projects
  FOR EACH ROW
  WHEN (NEW.task_number IS NULL)
  EXECUTE FUNCTION generate_task_number();

-- Project Status History: audit log for all status changes
CREATE TABLE project_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  from_status project_status,
  to_status project_status NOT NULL,
  changed_by UUID NOT NULL REFERENCES team_members(id),
  changed_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexes

```sql
CREATE INDEX idx_clients_pod ON clients(pod_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_writer ON projects(writer_id);
CREATE INDEX idx_projects_editor ON projects(editor_id);
CREATE INDEX idx_client_assignments_client ON client_assignments(client_id);
CREATE INDEX idx_client_assignments_member ON client_assignments(team_member_id);
CREATE INDEX idx_team_member_pods_member ON team_member_pods(team_member_id);
CREATE INDEX idx_team_member_pods_pod ON team_member_pods(pod_id);
CREATE INDEX idx_team_members_supervised_by ON team_members(supervised_by);
CREATE INDEX idx_project_status_history_project ON project_status_history(project_id);
CREATE INDEX idx_project_status_history_changed_at ON project_status_history(changed_at);
```

---

## Master Status State Machine

### Status Groups
```
TO-DO:           idea, on_hold
PRE-PRODUCTION:  brief, scriptwriting, review_script, fix_script, script_ready_to_send, script_sent_to_client
PRODUCTION:      client_uploaded, editing, ready_for_internal_review, internal_adjustments_needed, edit_ready_to_send, edit_sent_to_client, client_adjustments_needed
POST-PRODUCTION: ready_to_post
COMPLETE:        posted_scheduled
```

### Transition Ownership
Each transition has a designated role owner. Enforce in both application layer and RLS.

| Transition | Owner(s) |
|---|---|
| `idea → brief` | Strategist, Jr Strategist, Admin |
| `idea → on_hold` | Strategist, Jr Strategist, Admin |
| `on_hold → idea` | Strategist, Jr Strategist, Admin |
| `on_hold → brief` | Strategist, Jr Strategist, Admin |
| `brief → scriptwriting` | Strategist, Jr Strategist, Admin — **assign writer at this step**. No client approval gate — `brief` means idea is fully fleshed out and internally ready. |
| `scriptwriting → review_script` | Writer, Jr Strategist, Admin |
| `review_script → script_ready_to_send` | Senior Writer, Jr Strategist, Admin |
| `review_script → fix_script` | Senior Writer, Jr Strategist, Admin |
| `fix_script → review_script` | Writer, Jr Strategist, Admin |
| `script_ready_to_send → script_sent_to_client` | Manager, Jr Strategist, Admin |
| `script_sent_to_client → client_uploaded` | **Manager** (monitors Slack for client upload confirmation), Jr Strategist, Admin |
| `client_uploaded → editing` | Editor, Jr Strategist, Admin |
| `editing → ready_for_internal_review` | Editor, Jr Strategist, Admin |
| `ready_for_internal_review → edit_ready_to_send` | Senior Editor, Jr Strategist, Admin |
| `ready_for_internal_review → internal_adjustments_needed` | Senior Editor, Jr Strategist, Admin |
| `internal_adjustments_needed → ready_for_internal_review` | Editor, Jr Strategist, Admin |
| `edit_ready_to_send → edit_sent_to_client` | Manager, Jr Strategist, Admin |
| `edit_sent_to_client → client_adjustments_needed` | **Manager** (monitors Slack for client feedback), Jr Strategist, Admin |
| `edit_sent_to_client → ready_to_post` | **Manager** (client approved, no changes), Jr Strategist, Admin |
| `client_adjustments_needed → editing` | Editor, Jr Strategist, Admin |
| `ready_to_post → posted_scheduled` | Manager, Jr Strategist, Admin |

### Valid Transitions
Each status can only move to specific next statuses. Enforce in the application layer.

```
idea → brief, on_hold
on_hold → idea, brief
brief → scriptwriting
scriptwriting → review_script
review_script → fix_script, script_ready_to_send
fix_script → review_script
script_ready_to_send → script_sent_to_client
script_sent_to_client → client_uploaded
client_uploaded → editing
editing → ready_for_internal_review
ready_for_internal_review → internal_adjustments_needed, edit_ready_to_send
internal_adjustments_needed → ready_for_internal_review
edit_ready_to_send → edit_sent_to_client
edit_sent_to_client → client_adjustments_needed, ready_to_post
client_adjustments_needed → editing
ready_to_post → posted_scheduled
```

---

## Design Parallel Track
- Design runs concurrently with editing. It is **NOT** a pipeline status — it is a secondary field on the project record (`design_status`).
- Design work can start when `status = client_uploaded`
- Design must be completed before `status = edit_sent_to_client`
- Three states: `not_started`, `in_progress`, `completed`
- Show as a badge/indicator on the project card, not a Kanban column

---

## Role-Specific Kanban Boards
Each role sees a filtered Kanban board showing only the statuses relevant to their responsibilities, with projects filtered to their assignments.

### Writer Board
- **Columns:** Scriptwriting, Fix Script
- **Filter:** Projects where `writer_id = current user`
- **Actions:** Move Scriptwriting → Review Script. Move Fix Script → Review Script.

### Editor Board
- **Columns:** Client Uploaded, Editing, Ready for Internal Review, Internal Adjustments Needed, Client Adjustments Needed
- **Filter:** Projects where `editor_id = current user`
- **Actions:** Move Client Uploaded → Editing. Move Editing → Ready for Internal Review. Move Internal Adjustments → Ready for Internal Review. Move Client Adjustments → Editing.

### Designer Board
- **Columns:** Client Uploaded, Editing, Ready for Internal Review, Edit Ready to Send
- **Filter:** Projects where client is assigned to this designer (via `client_assignments`)
- **Actions:** Update `design_status` on projects. View-only for pipeline status — designers don't move pipeline statuses.
- **Special:** Show `design_status` badge prominently. Sort/group by `design_status`.

### Jr Strategist Board
- **Columns:** All statuses
- **Filter:** `projects WHERE client_id IN (SELECT client_id FROM client_assignments WHERE team_member_id = current_user.team_member_id AND assignment_role = 'strategist')`. Same scope as Strategist — assigned via `client_assignments` with `assignment_role = 'strategist'` (Jr Strategist does NOT have a separate assignment_role entry; they use the 'strategist' slot on the client record).
- **Actions:** Same as Strategist (move any status within valid transitions) AND same as Manager (handoff transitions). Combined role.
- **Special:** Show project counts per status. Show design_status badges.
- **CRITICAL IMPLEMENTATION NOTE:** Handoff transition permissions for Jr Strategist must be enforced by checking `team_role = 'jr_strategist'` — NOT by checking `client_assignments WHERE assignment_role = 'manager'`. Jr Strategists will never have a 'manager' assignment row. Any RLS policy that gates Manager actions on `client_assignments` membership will silently block Jr Strategists.

### Senior Writer Board
- **Columns:** Review Script
- **Filter:** `projects WHERE status = 'review_script' AND writer_id IN (SELECT id FROM team_members WHERE supervised_by = current_user.team_member_id)`. Writers are cross-pod round-robin — pod is irrelevant. The `supervised_by` column on `team_members` is the scope. Each senior writer only sees scripts from writers they directly supervise.
- **Actions:** Move Review Script → Script Ready to Send (approve) OR Review Script → Fix Script (reject).

### Senior Editor Board
- **Columns:** Ready for Internal Review
- **Filter:** `projects WHERE status = 'ready_for_internal_review' AND client_id IN (SELECT client_id FROM client_assignments WHERE team_member_id = current_user.team_member_id AND assignment_role = 'senior_editor')`. Editors are not in pods (departmental, not pod-scoped). Use `client_assignments` as the scope — each client has a senior editor assigned during onboarding. Pod-based filtering does NOT work for this role.
- **Actions:** Move Ready for Internal Review → Edit Ready to Send (approve) OR Ready for Internal Review → Internal Adjustments Needed (reject).

### Manager Board
- **Columns:** Script Ready to Send, Script Sent to Client, Edit Ready to Send, Edit Sent to Client, Ready to Post
- **Filter:** Projects for clients assigned to this manager (via `client_assignments`)
- **Actions:**
  - Move Script Ready to Send → Script Sent to Client (manager sends script)
  - Move Script Sent to Client → Client Uploaded (manager confirms client has filmed and uploaded footage via Slack)
  - Move Edit Ready to Send → Edit Sent to Client (manager sends edit)
  - Move Edit Sent to Client → Client Adjustments Needed (client left feedback)
  - Move Edit Sent to Client → Ready to Post (client approved, no changes needed)
  - Move Ready to Post → Posted/Scheduled
- **Note:** Script Sent to Client and Edit Sent to Client columns are "watching" columns — the manager monitors client responses (via Slack) and moves status accordingly. These are the two external-action transition owners that were previously undefined.

### Strategist Board
- **Columns:** All statuses
- **Filter:** `projects WHERE client_id IN (SELECT client_id FROM client_assignments WHERE team_member_id = current_user.team_member_id AND assignment_role = 'strategist')`. Uses `client_assignments` as scope — NOT pod. Pod path is fragile (can go out of sync) and is reserved for analytics/profitability only.
- **Actions:** Full visibility. Can move any status within valid transitions. Create projects for their clients.
- **Special:** Show project counts per status. Show design_status badges.

### Senior Designer Board
- **Columns:** Client Uploaded, Editing, Ready for Internal Review, Edit Ready to Send, Edit Sent to Client
- **Filter:** All projects across all clients assigned to any designer (no pod restriction — senior designer has company-wide design visibility)
- **Actions:** Update `design_status` on any project. Assign/reassign designers to clients (via client_assignments). View-only for pipeline status.
- **Special:** Show `design_status` badge prominently. Filter by designer to see individual workloads.

### Admin Board
- **Columns:** All statuses
- **Filter:** No filter — all projects
- **Actions:** Full CRUD. Can move any status. Can reassign writers/editors.
- **Special:** Filter controls for pod, client, team member, date range, status group.

---

## Pages & Navigation

### Sidebar Navigation
```
Dashboard (landing page)
Clients
  → Client List
  → Add Client
Projects
  → Full Pipeline (Admin Kanban)
  → My Board (role-specific Kanban)
Team
  → Team Members List
  → Pods
Settings (Admin only)
  → Manage Users
```

### Page Specifications

#### Dashboard
- Role-aware landing page
- **Admin:** Total clients (by status), total active projects (by status group), projects needing attention (stuck > 3 days)
- **Strategist:** Their client count, projects by status for their pod, any projects stuck
- **All other roles:** Redirect to My Board

#### Client List Page
- Table view with columns: Name, Market, Pod, Status, Videos/Week, Strategist, Manager
- Filters: Status (multi-select), Pod (multi-select), Market (text search)
- Search: By client name
- Sort: By name, contract start date, videos/week
- Click row → Client Detail Page

#### Client Detail Page
- **Header:** Client name, status badge, pod badge
- **Info Section:** All client fields in editable form (market, timezone, package, contract start date, dropbox link, broll link, slack channel, posting schedule, script format, communication method, special instructions, website, youtube channel URL)
- **Channels Section:** List of channels with channel name, URL, videos/week. Add/edit/remove.
- **Contacts Section:** Contact name, email, phone, primary/assistant flags. Add/edit/remove.
- **Team Section:** Current role assignments displayed as cards. Each card shows: role label, team member name. Button to change assignment (opens a picker filtered by role).
- **Projects Section:** Table of all projects for this client. Columns: Task ID, Title, Status, Writer, Editor, Design Status. Click → Project Detail.

#### Add/Edit Client Page
- Form with all client fields
- Pod selector (dropdown of active pods)
- After creating: redirect to Client Detail Page to add channels, contacts, and assignments

#### Full Pipeline Page (Admin Kanban)
- Kanban board with all statuses as columns
- Project cards show: Task ID, Title, Client Name, Writer/Editor avatars, Design Status badge
- Drag and drop to change status (validates against allowed transitions)
- Filter bar: Pod, Client, Status Group, Team Member, Date Range
- Bulk select + move action

#### My Board Page
- Kanban board configured by current user's role (see Role-Specific Kanban Boards section above)
- Same card design as Full Pipeline
- Drag and drop for allowed transitions only

#### Project Detail Page
- **Header:** Task ID, Title, Status badge, Design Status badge
- **Status Controls:** Next valid status buttons (not a dropdown — explicit action buttons like "Send to Review", "Approve", "Needs Fix")
- **Assignment:**
  - Writer picker — nullable. Assigned by Strategist/Jr Strategist/Admin **when moving brief → scriptwriting**. Null at creation and until that point. Round-robin is a manual process in V1 (automation out of scope).
  - Editor picker — nullable. Assignable by Strategist, Jr Strategist, Admin, **or the editor themselves**. Must be set before project reaches `client_uploaded`.
- **Dates:** Script V1 Due, Actual Post Date
- **Client Info:** Client name (linked), Pod
- **Design:** Design status toggle (Not Started / In Progress / Completed)
- **Notes:** Free text field for handoff context
- **Activity Log:** Renders from `project_status_history` table — timestamp, from_status, to_status, changed_by name

#### Project Creation
- **Who can create:** Admin, Strategist, Jr Strategist only.
- **Entry point:** "Add Project" button on Client Detail Page (Projects section) OR from the Strategist/Admin board Idea column.
- **Required fields at creation:** `title`, `client_id`. All other fields nullable.
- **Default status:** `idea`.
- **writer_id:** NULL at creation.
- **editor_id:** NULL at creation for new projects. For migration: auto-populate from `client_assignments` (client's assigned editor). Post-migration new projects: set manually by Strategist, Jr Strategist, Admin, or the editor themselves.

#### Team Members List Page
- Table: Name, Role, Email, Status, Pod(s)
- Filters: Role (multi-select), Pod (multi-select), Status
- Click row → Team Member Detail (shows their info + assigned clients + current projects)

#### Pods Page
- Card view: Pod name, member count, client count
- Click → Pod detail showing members and clients

#### Manage Users Page (Admin only)
- Create new team member account (generates Supabase auth user)
- Edit role, status, pod assignments
- Deactivate accounts

---

## UI Components

### Project Card (Kanban)
```
┌─────────────────────────────┐
│ KN-2615                     │
│ "5 Tips for Local SEO"      │
│ Client: Smith Roofing       │
│ ✏️ Jane (writer) 🎬 Mike (ed)│
│ 🎨 Design: In Progress      │
│ Due: Apr 12                 │
└─────────────────────────────┘
```

### Status Badge Colors
```
TO-DO:           Gray
PRE-PRODUCTION:  Blue
PRODUCTION:      Yellow/Amber
POST-PRODUCTION: Green
COMPLETE:        Purple
```

### Design Status Badge
```
Not Started:  Gray outline
In Progress:  Yellow filled
Completed:    Green filled
```

---

## Data Migration Plan

### Source: Notion Export

Migration script reads from a structured Notion export (CSV or JSON) and inserts into Supabase.

### Migration Order (respects foreign keys)
1. **Pods** — Create pods: POD 1, POD 2, POD 3, POD 4
2. **Team Members** — Import all active team members. Map Notion roles to `team_role` enum. Create Supabase auth accounts.
3. **Team Member Pods** — Create junction records for pod assignments. Handle multi-pod members.
4. **Clients** — Import all clients with `status = 'active'` or `'onboarding'`. Map fields to schema. Link to pods.
5. **Client Channels** — Parse videos/week data. Create channel records per client.
6. **Client Contacts** — Import contact emails where available.
7. **Client Assignments** — Map Notion's separate role columns (Creative Strategist, Youtube Manager, Editor, Graphic Designer, etc.) into normalized `client_assignments` records.
8. **Projects** — Import active KnwnTasks. Map Master Status to `project_status` enum. Link writer/editor. Preserve task IDs (KN-XXXX). Set sequence to start after highest existing ID.

### Migration Edge Cases
- **Pod 3 agency editing:** Create one `team_member` record for the agency contact. Role = `senior_editor` (NOT `editor` — this person acts as the senior editor approving work for Pod 3 clients). Assign them to all Pod 3 clients via `client_assignments` with `assignment_role = 'senior_editor'`. Note in their record that this represents an external agency. There are no in-house editor records for Pod 3 — Pod 3 editing projects will have `editor_id` pointing to this agency contact.
- **Pod 3 agency designer:** Create one `team_member` record for the agency contact. Role = `designer`. Assign via `client_assignments` to all Pod 3 clients.
- **Multi-pod team members:** Ensure junction table records are created for all pod associations. Flag the primary pod with `is_primary = true`.
- **Null/empty fields:** Many Notion fields are sparse (Posting Schedule, Communication Method, Special Instructions). Import as NULL — don't skip the record.
- **Task number sequence:** After migration, set `project_task_seq` to `MAX(existing task numbers) + 1`.
- **Supervision mapping:** After importing team members, populate `supervised_by` for all writers and editors. Requires Paulo or Clayton to provide the explicit list of which writers report to which senior writer, and which editors report to which senior editor. This data must be confirmed before migration runs — it is required for Senior Writer and Senior Editor board filters to work correctly.

---

## Module Implementation Order
Build in this exact order. Each module should be committed before starting the next.

### Pre-Build: Design Review (Before Any Code)
- Build dummy/wireframe screens for all major pages (Client List, Client Detail, Full Pipeline Kanban, My Board, Project Detail, Dashboard)
- Review with Clayton + Paulo — get explicit sign-off on layout, navigation, and card design
- Incorporate feedback into this spec before starting Module 0
- No code written until this step is complete

### Module 0: Foundation
- Initialize Next.js project with TypeScript, Tailwind, shadcn/ui
- Set up Supabase project (database + auth)
- Run full DDL — all tables, enums, indexes, triggers, sequences
- Implement Supabase Auth with email/password
- Build auth middleware — protect all routes, redirect unauthenticated users to login
- Build role detection — read `team_members.role` for the authenticated user
- Build app shell: sidebar navigation, layout, responsive frame
- Seed data: create admin account, create 4 pods, create a few test team members and clients for development

### Module 1: Client Onboarding
- Build Pods CRUD (simple — name only, list/create/edit)
- Build Team Members CRUD (create, edit, list, deactivate). Include pod assignment via junction table.
- Build Clients CRUD — all fields from schema. Pod selector dropdown.
- Build Client Channels sub-entity — add/edit/remove channels on client detail page
- Build Client Contacts sub-entity — add/edit/remove contacts on client detail page
- Build Client Assignments — role-based team member picker on client detail page
- Build Client List page with filters (status, pod, market) and search
- Build Client Detail page — unified view with all sub-entities and linked projects

### Module 2: Production Pipeline
- Build Project CRUD — auto task number, title, client (FK), status, writer, editor, dates
- Implement status state machine — validate transitions in server actions
- **Build reusable Kanban board component first** — accepts config: visible statuses, project filter function. Used for Full Pipeline AND all role boards.
- Build Full Pipeline Kanban using the reusable component — all statuses as columns, drag-and-drop, project cards
- Build Project Detail page — status action buttons, assignments, dates, notes, design status
- Add pipeline filters — pod, client, status group, team member, date range
- Add bulk status update — multi-select projects, move to next valid status
- Add design parallel track — `design_status` field, badge on cards, toggle on detail page
- Add activity log — write to `project_status_history` on every status change (server action)

### Module 3: Team Boards
- Build role detection → board config mapping (reusable Kanban component already exists from Module 2)
- Implement Writer board
- Implement Editor board
- Implement Designer board
- Implement Senior Designer board
- Implement Senior Writer board
- Implement Senior Editor board
- Implement Manager board
- Implement Jr Strategist board
- Implement Strategist board
- Implement Admin board (same as Full Pipeline with extra controls)
- Build My Board page — auto-renders correct board based on logged-in user's role

### Module 4: Migration & Polish
- Build migration script — reads Notion export, inserts into Supabase following migration order above
- Run migration with real data
- Validate: spot-check 10 clients, 10 projects, all pod assignments, all team members
- QA with Paulo — have him verify client data, project statuses, team assignments
- Bug fixes from QA
- Deploy to Vercel production
- Set up custom domain (if needed)
- Team walkthrough — record Loom or live session

---

## Out of Scope for V1
These are explicitly **NOT** part of this build. Do not implement any of these:
- KPI calculations or dashboards (company, department, individual)
- MPR system (monthly performance reviews)
- Health score (manual or calculated)
- AI script review
- Client portal
- Automated Slack/Dropbox handoffs
- Posting automation
- Round-robin writer assignment automation
- Calendar integration for strategist meetings
- ELLA pod special handling
- YouTube Videos, Design Assets, Approval Emails as separate tables
- Notification system (Slack, email, in-app)
- Real-time collaboration / live updates
