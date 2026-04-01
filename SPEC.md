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
Eight roles in the system. Every user has exactly one role.

| Role | Can see | Can do |
|------|---------|--------|
| Admin | Everything | Full CRUD on all entities. Manage users. |
| Strategist | All projects for their assigned clients. All clients in their pod(s). | Edit client info. Move project statuses. Add notes. |
| Manager | Projects in handoff statuses for their assigned clients. All their assigned clients. | Move statuses: Script Ready to Send → Script Sent, Edit Ready to Send → Edit Sent, Ready to Post → Posted. |
| Senior Editor | Projects in review statuses for editors they oversee. | Approve/reject edits. Move status: Ready for Internal Review → Edit Ready to Send OR Internal Adjustments Needed. |
| Senior Writer | Projects in script review for writers they oversee. | Approve/reject scripts. Move status: Review Script → Script Ready to Send OR Fix Script. |
| Editor | Only projects assigned to them in editing statuses. | Move statuses within editing range. |
| Writer | Only projects assigned to them in writing statuses. | Move statuses within writing range. |
| Designer | Projects for their assigned clients from Client Uploaded through Edit Sent. | Update design checklist/status on projects. |

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
  'manager',
  'senior_editor',
  'senior_writer',
  'senior_designer',
  'editor',
  'writer',
  'designer'
);

-- Client lifecycle status
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

-- Assignment role type — how a team member relates to a client
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
-- Pods: lightweight grouping for profitability tracking
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
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Team Member ↔ Pod junction (many-to-many)
-- Writers/editors can span multiple pods
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
  design_status TEXT DEFAULT 'not_started' CHECK (design_status IN ('not_started', 'in_progress', 'completed')),
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

### Valid Transitions
Each status can only move to specific next statuses. Enforce this in the application layer.

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

### Senior Writer Board
- **Columns:** Review Script
- **Filter:** Projects where the assigned writer reports to this senior writer. (V1 simplification: show all projects in Review Script status within the senior writer's pod(s).)
- **Actions:** Move Review Script → Script Ready to Send (approve) OR Review Script → Fix Script (reject).

### Senior Editor Board
- **Columns:** Ready for Internal Review
- **Filter:** Projects where the assigned editor reports to this senior editor. (V1 simplification: show all projects in Ready for Internal Review status within the senior editor's pod(s).)
- **Actions:** Move Ready for Internal Review → Edit Ready to Send (approve) OR Ready for Internal Review → Internal Adjustments Needed (reject).

### Manager Board
- **Columns:** Script Ready to Send, Edit Ready to Send, Ready to Post
- **Filter:** Projects for clients assigned to this manager (via `client_assignments`)
- **Actions:** Move Script Ready to Send → Script Sent to Client. Move Edit Ready to Send → Edit Sent to Client. Move Ready to Post → Posted/Scheduled.

### Strategist Board
- **Columns:** All statuses
- **Filter:** Projects for clients in the strategist's pod(s)
- **Actions:** Full visibility. Can move any status within valid transitions.
- **Special:** Show project counts per status. Show design_status badges.

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
- **Assignment:** Writer picker, Editor picker
- **Dates:** Script V1 Due, Actual Post Date
- **Client Info:** Client name (linked), Pod
- **Design:** Design status toggle (Not Started / In Progress / Completed)
- **Notes:** Free text field for handoff context
- **Activity Log:** (V1 basic) Timestamp + status change history

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
- **Pod 3 agency editors:** Create one `team_member` record for the agency contact. Role = `editor`. Note in `special_instructions` that this represents an external agency with their own team.
- **Pod 3 agency designer:** Same approach — one record for the agency contact.
- **Multi-pod team members:** Ensure junction table records are created for all pod associations. Flag the primary pod with `is_primary = true`.
- **Null/empty fields:** Many Notion fields are sparse (Posting Schedule, Communication Method, Special Instructions). Import as NULL — don't skip the record.
- **Task number sequence:** After migration, set `project_task_seq` to `MAX(existing task numbers) + 1`.

---

## Module Implementation Order
Build in this exact order. Each module should be committed before starting the next.

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
- Build Full Pipeline Kanban — all statuses as columns, drag-and-drop, project cards
- Build Project Detail page — status action buttons, assignments, dates, notes, design status
- Add pipeline filters — pod, client, status group, team member, date range
- Add bulk status update — multi-select projects, move to next valid status
- Add design parallel track — `design_status` field, badge on cards, toggle on detail page
- Add basic activity log — store status changes with timestamp and user

### Module 3: Team Boards
- Build reusable Kanban board component — accepts config: visible statuses, project filter function
- Build role detection → board config mapping
- Implement Writer board
- Implement Editor board
- Implement Designer board
- Implement Senior Writer board
- Implement Senior Editor board
- Implement Manager board
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
