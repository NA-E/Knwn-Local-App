# Foundation & Client Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js + Supabase app from zero and deliver a working Client Onboarding module — Pods CRUD, Team Members CRUD, Client List with filters, Client Detail with Channels/Contacts/Team assignments.

**Architecture:** Server Components for data fetching; Server Actions for mutations; Supabase SSR client pattern; URL search params for filter state; shadcn/ui styled per brand.md tokens.

**Tech Stack:** Next.js 14+ (App Router), Supabase (PostgreSQL + Auth + RLS), TypeScript strict, Tailwind CSS, shadcn/ui, Sora + JetBrains Mono fonts.

**References:** SPEC.md (schema, state machine, roles), brand.md (design system), wireframes.md (page layouts).

---

## Status Tracker

| Task | Description | Status |
|------|-------------|--------|
| 1 | Project Bootstrap | Done |
| 2 | Database Schema | Done |
| 3 | TypeScript Types + Supabase Client Helpers | Done |
| 4 | Auth Middleware + Login Page | Done |
| 5 | App Shell (Layout + Sidebar) | Done |
| 6 | Pods CRUD | Done |
| 7 | Team Members CRUD | Done |
| 8 | Client List Page | Done |
| 9 | Add/Edit Client Form | Done |
| 10 | Client Detail Page — Shell + Info Section | Done |
| 11 | Client Channels Section | Done |
| 12 | Client Contacts Section | Done |
| 13 | Client Assignments (Team Picker) | Done |
| 14 | Seed Data + RLS Policies | Done |
| — | Onboarding Automation (spec, services, API routes, modal) | Done |
| — | Adversarial Code Review + 13 bug fixes | Done |
| — | Onboarding Test Plan (`docs/onboarding-test-plan.md`) | Done |
| — | MCP Server (22 tools, dual transport) | Done |
| — | Module 0+1 Bug Tracker — 45 bugs fixed | Done |
| — | Migration 007: onboarding_steps table + RLS + Realtime | Done (2026-04-03) |
| — | Migration 008: schema fixes (indexes, enum, triggers, FK) | Done (2026-04-03) |
| — | DB Schema Review + Supabase CLI migration sync | Done (2026-04-03) |

**Next:** Client data migration from Notion export → Module 2 (Production Pipeline + Kanban)

---

## File Structure

```
app/
  layout.tsx                          ← Root layout (fonts, globals)
  (auth)/
    login/page.tsx                    ← Login page
    login/actions.ts                  ← Login/logout server actions
    layout.tsx                        ← Auth layout (centered, no sidebar)
  (app)/
    layout.tsx                        ← App shell (sidebar + main area)
    dashboard/page.tsx                ← Dashboard placeholder
    pods/page.tsx                     ← Pods list + create/edit
    team/page.tsx                     ← Team members list
    team/new/page.tsx                 ← Create team member
    team/[id]/edit/page.tsx           ← Edit team member
    clients/page.tsx                  ← Client list (table + filters)
    clients/new/page.tsx              ← Add client form
    clients/[id]/page.tsx             ← Client detail (all sections)
    clients/[id]/edit/page.tsx        ← Edit client form

components/
  shared/
    sidebar.tsx                       ← App sidebar navigation
    page-header.tsx                   ← Reusable page header (title + action)
  clients/
    client-table.tsx                  ← Client list table
    client-filters.tsx                ← Search + filter bar (Client Component)
    client-form.tsx                   ← Add/Edit client form (Client Component)
    client-info-section.tsx           ← Client detail info panel
    client-channels-section.tsx       ← Channels CRUD section
    client-contacts-section.tsx       ← Contacts CRUD section
    client-team-section.tsx           ← Team assignment section
    client-projects-section.tsx       ← Projects list (read-only, Module 1)
  pods/
    pod-form-dialog.tsx               ← Create/edit pod dialog
  team/
    team-member-form.tsx              ← Create/edit team member form

lib/
  supabase/
    server.ts                         ← createServerClient helper
    client.ts                         ← createBrowserClient helper
  types/
    database.ts                       ← TypeScript types matching DB schema
    index.ts                          ← Re-exports
  constants/
    roles.ts                          ← Role labels, assignment role config
    status.ts                         ← Status labels and groups
  actions/
    pods.ts                           ← Pods CRUD server actions
    team-members.ts                   ← Team members CRUD server actions
    clients.ts                        ← Clients CRUD + filtered list
    client-channels.ts                ← Channel CRUD server actions
    client-contacts.ts                ← Contact CRUD server actions
    client-assignments.ts             ← Assignment upsert/delete server actions

middleware.ts                         ← Auth middleware

supabase/
  migrations/
    001_schema.sql                    ← Full DDL from SPEC.md
    002_rls.sql                       ← RLS policies
    003_seed.sql                      ← Seed data
```

---

## Task 1: Project Bootstrap

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `.env.local`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Initialize Next.js in existing repo**

```bash
cd "E:/1.Claude Code/knwn_local_app"
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

This scaffolds around existing files (SPEC.md, CLAUDE.md, etc.).

- [ ] **Step 2: Install Supabase SSR + JS client**

```bash
npm install @supabase/ssr @supabase/supabase-js
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Choose: New York style, Neutral base color, CSS variables = yes.

- [ ] **Step 4: Add shadcn components for Module 0+1**

```bash
npx shadcn@latest add button input label badge table dialog select separator dropdown-menu command toast sonner
```

- [ ] **Step 5: Create .env.local**

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 6: Add brand fonts to root layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Sora, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Known Local',
  description: 'Internal ops platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 7: Update globals.css with brand tokens**

Replace default shadcn CSS variables with brand.md tokens:

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Brand tokens — raw HSL values */
    --bg: 48 33% 96%;
    --bg-panel: 0 0% 100%;
    --sidebar: 50 8% 8%;
    --sidebar-hover: 50 8% 12%;
    --sidebar-active: 50 8% 15%;
    --border: 40 14% 88%;
    --border-light: 40 18% 91%;
    --text-1: 48 8% 10%;
    --text-2: 42 6% 45%;
    --text-3: 40 5% 64%;
    --accent: 28 70% 47%;
    --accent-bg: 33 96% 94%;

    /* shadcn required mappings */
    --background: 48 33% 96%;
    --foreground: 48 8% 10%;
    --card: 0 0% 100%;
    --card-foreground: 48 8% 10%;
    --primary: 48 8% 10%;
    --primary-foreground: 0 0% 100%;
    --secondary: 40 14% 92%;
    --secondary-foreground: 48 8% 10%;
    --muted: 40 14% 92%;
    --muted-foreground: 42 6% 45%;
    --destructive: 0 60% 48%;
    --destructive-foreground: 0 0% 100%;
    --input: 40 14% 88%;
    --ring: 28 70% 47%;
    --radius: 0.5rem;

    /* Status colors */
    --active-text: 148 60% 26%;
    --active-bg: 148 60% 90%;
    --onboard-text: 42 84% 25%;
    --onboard-bg: 45 96% 91%;
    --inactive-text: 42 5% 39%;
    --inactive-bg: 40 14% 91%;
  }
}

body {
  font-family: var(--font-sora), sans-serif;
  background-color: hsl(var(--bg));
  color: hsl(var(--text-1));
}

.font-mono {
  font-family: var(--font-mono), monospace;
}
```

- [ ] **Step 8: Extend tailwind.config.ts**

```ts
// tailwind.config.ts — inside theme.extend
fontFamily: {
  sans: ['var(--font-sora)', 'sans-serif'],
  mono: ['var(--font-mono)', 'monospace'],
},
colors: {
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar))',
    hover: 'hsl(var(--sidebar-hover))',
    active: 'hsl(var(--sidebar-active))',
  },
},
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: localhost:3000 loads with warm off-white background and Sora font.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js + Supabase + shadcn/ui with brand tokens (Module 0)"
```

---

## Task 2: Database Schema

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create Supabase project**

Manual: Go to supabase.com → create project → copy URL and anon key into `.env.local`.

- [ ] **Step 2: Write the full migration file**

Create `supabase/migrations/001_schema.sql` with complete DDL from SPEC.md:

```sql
-- 001_schema.sql — Known Local V1 Full DDL

-- ═══════════ ENUMS ═══════════

CREATE TYPE team_role AS ENUM (
  'admin', 'strategist', 'jr_strategist', 'manager',
  'senior_editor', 'senior_writer', 'senior_designer',
  'editor', 'writer', 'designer'
);

CREATE TYPE design_status AS ENUM ('not_started', 'in_progress', 'completed');

CREATE TYPE client_status AS ENUM (
  'template', 'onboarding', 'active', 'disengaged', 'pending', 'inactive'
);

CREATE TYPE script_format AS ENUM ('word_for_word', 'outline');
CREATE TYPE comm_method AS ENUM ('slack', 'email', 'other');

CREATE TYPE project_status AS ENUM (
  'idea', 'on_hold', 'brief', 'scriptwriting', 'review_script', 'fix_script',
  'script_ready_to_send', 'script_sent_to_client', 'client_uploaded',
  'editing', 'ready_for_internal_review', 'internal_adjustments_needed',
  'edit_ready_to_send', 'edit_sent_to_client', 'client_adjustments_needed',
  'ready_to_post', 'posted_scheduled'
);

CREATE TYPE assignment_role AS ENUM (
  'strategist', 'manager', 'editor', 'senior_editor',
  'designer', 'senior_designer', 'senior_writer'
);

-- ═══════════ TABLES ═══════════

CREATE TABLE pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role team_role NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  supervised_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE team_member_pods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  pod_id UUID NOT NULL REFERENCES pods(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  UNIQUE(team_member_id, pod_id)
);

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

CREATE TABLE client_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  channel_name TEXT NOT NULL,
  channel_url TEXT,
  videos_per_week NUMERIC(4,1) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

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

CREATE TABLE client_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  assignment_role assignment_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id, team_member_id, assignment_role)
);

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

CREATE TABLE project_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  from_status project_status,
  to_status project_status NOT NULL,
  changed_by UUID NOT NULL REFERENCES team_members(id),
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════ INDEXES ═══════════

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

- [ ] **Step 3: Run migration in Supabase SQL Editor**

Supabase Dashboard → SQL Editor → paste `001_schema.sql` → Run. Verify all 9 tables appear in Table Editor.

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add full DDL migration from SPEC.md"
```

---

## Task 3: TypeScript Types + Supabase Client Helpers

**Files:**
- Create: `lib/types/database.ts`
- Create: `lib/types/index.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/constants/roles.ts`
- Create: `lib/constants/status.ts`

- [ ] **Step 1: Write database types**

```typescript
// lib/types/database.ts

export type TeamRole =
  | 'admin' | 'strategist' | 'jr_strategist' | 'manager'
  | 'senior_editor' | 'senior_writer' | 'senior_designer'
  | 'editor' | 'writer' | 'designer'

export type ClientStatus =
  | 'template' | 'onboarding' | 'active' | 'disengaged' | 'pending' | 'inactive'

export type ProjectStatus =
  | 'idea' | 'on_hold' | 'brief' | 'scriptwriting' | 'review_script' | 'fix_script'
  | 'script_ready_to_send' | 'script_sent_to_client' | 'client_uploaded'
  | 'editing' | 'ready_for_internal_review' | 'internal_adjustments_needed'
  | 'edit_ready_to_send' | 'edit_sent_to_client' | 'client_adjustments_needed'
  | 'ready_to_post' | 'posted_scheduled'

export type DesignStatus = 'not_started' | 'in_progress' | 'completed'
export type ScriptFormat = 'word_for_word' | 'outline'
export type CommMethod = 'slack' | 'email' | 'other'

export type AssignmentRole =
  | 'strategist' | 'manager' | 'editor' | 'senior_editor'
  | 'designer' | 'senior_designer' | 'senior_writer'

export interface Pod {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  auth_user_id: string | null
  first_name: string
  last_name: string
  email: string
  role: TeamRole
  status: 'active' | 'inactive'
  supervised_by: string | null
  created_at: string
  updated_at: string
}

export interface TeamMemberPod {
  id: string
  team_member_id: string
  pod_id: string
  is_primary: boolean
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  market: string | null
  timezone: string | null
  website: string | null
  youtube_channel_url: string | null
  dropbox_upload_url: string | null
  broll_library_url: string | null
  slack_channel_url: string | null
  status: ClientStatus
  pod_id: string | null
  package: string | null
  contract_start_date: string | null
  posting_schedule: string | null
  script_format: ScriptFormat | null
  communication_method: CommMethod | null
  special_instructions: string | null
  created_at: string
  updated_at: string
}

export interface ClientChannel {
  id: string
  client_id: string
  channel_name: string
  channel_url: string | null
  videos_per_week: number
  created_at: string
}

export interface ClientContact {
  id: string
  client_id: string
  contact_name: string | null
  email: string
  phone: string | null
  is_primary: boolean
  is_assistant: boolean
  created_at: string
}

export interface ClientAssignment {
  id: string
  client_id: string
  team_member_id: string
  assignment_role: AssignmentRole
  created_at: string
}

export interface Project {
  id: string
  task_number: string
  title: string
  client_id: string
  status: ProjectStatus
  writer_id: string | null
  editor_id: string | null
  script_v1_due: string | null
  actual_post_date: string | null
  design_status: DesignStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ProjectStatusHistory {
  id: string
  project_id: string
  from_status: ProjectStatus | null
  to_status: ProjectStatus
  changed_by: string
  changed_at: string
}
```

- [ ] **Step 2: Write types index**

```typescript
// lib/types/index.ts
export * from './database'
```

- [ ] **Step 3: Write Supabase server client**

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookie writes silently ignored
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: Write Supabase browser client**

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 5: Write role constants**

```typescript
// lib/constants/roles.ts
import type { TeamRole, AssignmentRole } from '@/lib/types'

export const ROLE_LABELS: Record<TeamRole, string> = {
  admin: 'Admin',
  strategist: 'Strategist',
  jr_strategist: 'Jr Strategist',
  manager: 'Manager',
  senior_editor: 'Senior Editor',
  senior_writer: 'Senior Writer',
  senior_designer: 'Senior Designer',
  editor: 'Editor',
  writer: 'Writer',
  designer: 'Designer',
}

export const ASSIGNMENT_ROLE_LABELS: Record<AssignmentRole, string> = {
  strategist: 'Strategist',
  manager: 'Manager',
  editor: 'Editor',
  senior_editor: 'Senior Editor',
  designer: 'Designer',
  senior_designer: 'Senior Designer',
  senior_writer: 'Senior Writer',
}

// Which team_roles can fill each assignment slot
export const ASSIGNMENT_ROLE_ELIGIBLE_TEAM_ROLES: Record<AssignmentRole, TeamRole[]> = {
  strategist: ['strategist', 'jr_strategist'],
  manager: ['manager'],
  editor: ['editor'],
  senior_editor: ['senior_editor'],
  designer: ['designer'],
  senior_designer: ['senior_designer'],
  senior_writer: ['senior_writer'],
}

export const ADMIN_ROLES: TeamRole[] = ['admin']
```

- [ ] **Step 6: Write status constants**

```typescript
// lib/constants/status.ts
import type { ProjectStatus, DesignStatus, ClientStatus } from '@/lib/types'

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  idea: 'Idea',
  on_hold: 'On Hold',
  brief: 'Brief',
  scriptwriting: 'Script Writing',
  review_script: 'Review Script',
  fix_script: 'Fix Script',
  script_ready_to_send: 'Script Ready to Send',
  script_sent_to_client: 'Script Sent to Client',
  client_uploaded: 'Client Uploaded',
  editing: 'Editing',
  ready_for_internal_review: 'Ready for Internal Review',
  internal_adjustments_needed: 'Internal Adjustments Needed',
  edit_ready_to_send: 'Edit Ready to Send',
  edit_sent_to_client: 'Edit Sent to Client',
  client_adjustments_needed: 'Client Adjustments Needed',
  ready_to_post: 'Ready to Post',
  posted_scheduled: 'Posted / Scheduled',
}

export const DESIGN_STATUS_LABELS: Record<DesignStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  template: 'Template',
  onboarding: 'Onboarding',
  active: 'Active',
  disengaged: 'Disengaged',
  pending: 'Pending',
  inactive: 'Inactive',
}
```

- [ ] **Step 7: Commit**

```bash
git add lib/
git commit -m "feat: add TypeScript types, Supabase helpers, and constants"
```

---

## Task 4: Auth Middleware + Login Page

**Files:**
- Create: `middleware.ts`
- Create: `app/(auth)/layout.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/login/actions.ts`

- [ ] **Step 1: Write auth middleware**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Unauthenticated → login
  if (!user && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated on login → dashboard
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Root → dashboard
  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
```

- [ ] **Step 2: Write auth layout (centered, no sidebar)**

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--bg))' }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Write login server actions**

```typescript
// app/(auth)/login/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

- [ ] **Step 4: Write login page**

```tsx
// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-7">
        <h1 className="text-lg font-semibold tracking-tight mb-1">Known Local</h1>
        <p className="text-sm text-[hsl(var(--text-2))] mb-6">Sign in to continue</p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-xs font-medium text-[hsl(var(--text-2))]">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password" className="text-xs font-medium text-[hsl(var(--text-2))]">Password</Label>
            <Input id="password" name="password" type="password" required className="mt-1.5" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Test login flow**

1. Create a test user in Supabase Dashboard → Authentication → Users → Add User
2. Run `npm run dev` → should redirect to /login
3. Enter credentials → should redirect to /dashboard (404 is fine — dashboard not built yet)
4. Direct navigation to /login while authenticated → should redirect to /dashboard

- [ ] **Step 6: Commit**

```bash
git add middleware.ts app/\(auth\)/
git commit -m "feat: add auth middleware and login page"
```

---

## Task 5: App Shell (Layout + Sidebar)

**Files:**
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/dashboard/page.tsx`
- Create: `components/shared/sidebar.tsx`
- Create: `components/shared/page-header.tsx`

- [ ] **Step 1: Write the app layout with sidebar**

```tsx
// app/(app)/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/shared/sidebar'
import type { TeamRole } from '@/lib/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Look up team member for role-based nav
  const { data: teamMember } = await supabase
    .from('team_members')
    .select('id, first_name, last_name, role')
    .eq('email', user.email!)
    .single()

  const role = (teamMember?.role ?? 'writer') as TeamRole
  const displayName = teamMember
    ? `${teamMember.first_name} ${teamMember.last_name.charAt(0)}.`
    : user.email!

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} userName={displayName} />
      <main className="flex-1 min-w-0 ml-[220px]" style={{ backgroundColor: 'hsl(var(--bg))' }}>
        <div className="px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Write the sidebar component**

```tsx
// components/shared/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(auth)/login/actions'
import type { TeamRole } from '@/lib/types'
import { ROLE_LABELS, ADMIN_ROLES } from '@/lib/constants/roles'

interface SidebarProps {
  role: TeamRole
  userName: string
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = ADMIN_ROLES.includes(role)

  function navItem(href: string, label: string) {
    const active = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link
        href={href}
        className={`block px-3 py-[7px] rounded-md text-[12.5px] transition-colors ${
          active
            ? 'bg-[hsl(var(--sidebar-active))] text-white font-medium'
            : 'text-white/55 hover:bg-[hsl(var(--sidebar-hover))] hover:text-white/85'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <aside className="fixed left-0 top-0 w-[220px] h-screen bg-[hsl(var(--sidebar))] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        <div className="text-[12px] font-bold text-white tracking-[0.12em] uppercase">Known Local</div>
        <div className="text-[10.5px] text-white/25 tracking-[0.04em] mt-0.5">Ops Platform</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItem('/dashboard', 'Dashboard')}

        <div className="pt-3">
          <div className="px-3 mb-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/25">Clients</div>
          {navItem('/clients', 'Client List')}
          {navItem('/clients/new', 'Add Client')}
        </div>

        <div className="pt-3">
          <div className="px-3 mb-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/25">Projects</div>
          {navItem('/pipeline', 'Pipeline')}
          {navItem('/board', 'My Board')}
        </div>

        {isAdmin && (
          <div className="pt-3">
            <div className="px-3 mb-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/25">Admin</div>
            {navItem('/team', 'Team')}
            {navItem('/pods', 'Pods')}
          </div>
        )}
      </nav>

      {/* User */}
      <div className="px-5 py-3.5 border-t border-white/8">
        <div className="text-[12px] font-medium text-white/75">{userName}</div>
        <div className="text-[11px] text-white/30 mt-0.5">{ROLE_LABELS[role]}</div>
        <button
          onClick={() => logout()}
          className="mt-2 text-[11px] text-white/30 hover:text-white/60 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 3: Write the reusable page header**

```tsx
// components/shared/page-header.tsx
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  meta?: string
  action?: ReactNode
}

export function PageHeader({ title, meta, action }: PageHeaderProps) {
  return (
    <div className="flex items-baseline justify-between mb-5">
      <div className="flex items-baseline gap-2.5">
        <h1 className="text-[19px] font-semibold tracking-tight">{title}</h1>
        {meta && <span className="text-[12px] text-[hsl(var(--text-3))]">{meta}</span>}
      </div>
      {action}
    </div>
  )
}
```

- [ ] **Step 4: Write dashboard placeholder**

```tsx
// app/(app)/dashboard/page.tsx
import { PageHeader } from '@/components/shared/page-header'

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <p className="text-sm text-[hsl(var(--text-2))]">Dashboard will be built in Module 3.</p>
    </div>
  )
}
```

- [ ] **Step 5: Test app shell**

1. Run `npm run dev` → login → should see sidebar + dashboard placeholder
2. Verify sidebar shows correct role label and user name
3. Verify "Admin" section only shows for admin role
4. Click sidebar links — active state highlights correctly

- [ ] **Step 6: Commit**

```bash
git add app/\(app\)/ components/shared/
git commit -m "feat: add app shell with sidebar, page header, and dashboard placeholder"
```

---

## Task 6: Pods CRUD

**Files:**
- Create: `lib/actions/pods.ts`
- Create: `app/(app)/pods/page.tsx`
- Create: `components/pods/pod-form-dialog.tsx`

- [ ] **Step 1: Write pods server actions**

```typescript
// lib/actions/pods.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPods() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pods')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function createPod(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  const { error } = await supabase.from('pods').insert({ name })
  if (error) return { error: error.message }

  revalidatePath('/pods')
  return { error: null }
}

export async function updatePod(id: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  const { error } = await supabase.from('pods').update({ name }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/pods')
  return { error: null }
}
```

- [ ] **Step 2: Write pod form dialog**

```tsx
// components/pods/pod-form-dialog.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createPod, updatePod } from '@/lib/actions/pods'
import type { Pod } from '@/lib/types'

interface PodFormDialogProps {
  pod?: Pod
  trigger: React.ReactNode
}

export function PodFormDialog({ pod, trigger }: PodFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!pod

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = isEdit
      ? await updatePod(pod!.id, formData)
      : await createPod(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Pod' : 'Create Pod'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Pod Name</Label>
            <Input id="name" name="name" defaultValue={pod?.name ?? ''} required className="mt-1.5" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Write pods page**

```tsx
// app/(app)/pods/page.tsx
import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { PodFormDialog } from '@/components/pods/pod-form-dialog'
import { Button } from '@/components/ui/button'

export default async function PodsPage() {
  const pods = await getPods()

  return (
    <div>
      <PageHeader
        title="Pods"
        meta={`${pods.length} pods`}
        action={
          <PodFormDialog trigger={<Button>+ Create Pod</Button>} />
        }
      />

      <div className="grid grid-cols-2 gap-4">
        {pods.map((pod) => (
          <div key={pod.id} className="bg-white border border-[hsl(var(--border))] rounded-lg p-5 flex items-center justify-between">
            <span className="font-medium text-sm">{pod.name}</span>
            <PodFormDialog
              pod={pod}
              trigger={<Button variant="outline" size="sm">Edit</Button>}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Test pods CRUD**

1. Navigate to /pods → should show empty state
2. Click "Create Pod" → enter "Pod 1" → submit → card appears
3. Create all 4 pods: Pod 1, Pod 2, Pod 3, Pod 4
4. Click Edit on a pod → rename → save → name updates

- [ ] **Step 5: Commit**

```bash
git add lib/actions/pods.ts app/\(app\)/pods/ components/pods/
git commit -m "feat: add Pods CRUD with dialog form"
```

---

## Task 7: Team Members CRUD

**Files:**
- Create: `lib/actions/team-members.ts`
- Create: `app/(app)/team/page.tsx`
- Create: `app/(app)/team/new/page.tsx`
- Create: `app/(app)/team/[id]/edit/page.tsx`
- Create: `components/team/team-member-form.tsx`

- [ ] **Step 1: Write team members server actions**

```typescript
// lib/actions/team-members.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TeamRole } from '@/lib/types'

export async function getTeamMembers(filters?: { role?: TeamRole; pod_id?: string; status?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('team_members')
    .select(`
      *,
      team_member_pods (
        pod_id,
        is_primary,
        pods ( id, name )
      )
    `)
    .order('first_name')

  if (filters?.role) query = query.eq('role', filters.role)
  if (filters?.status) query = query.eq('status', filters.status)

  const { data, error } = await query
  if (error) throw error

  // If pod filter, filter client-side (Supabase can't filter on nested joins easily)
  if (filters?.pod_id && data) {
    return data.filter((tm: any) =>
      tm.team_member_pods?.some((tmp: any) => tmp.pod_id === filters.pod_id)
    )
  }

  return data
}

export async function getTeamMember(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      team_member_pods (
        pod_id,
        is_primary,
        pods ( id, name )
      )
    `)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createTeamMember(formData: FormData) {
  const supabase = await createClient()

  const { data: member, error: memberError } = await supabase
    .from('team_members')
    .insert({
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as TeamRole,
      supervised_by: (formData.get('supervised_by') as string) || null,
    })
    .select()
    .single()

  if (memberError) return { error: memberError.message }

  // Pod assignments
  const podIds = formData.getAll('pod_ids') as string[]
  const primaryPodId = formData.get('primary_pod_id') as string

  if (podIds.length > 0) {
    const podRows = podIds.map((pod_id) => ({
      team_member_id: member.id,
      pod_id,
      is_primary: pod_id === primaryPodId,
    }))
    const { error: podError } = await supabase.from('team_member_pods').insert(podRows)
    if (podError) return { error: podError.message }
  }

  revalidatePath('/team')
  return { error: null, id: member.id }
}

export async function updateTeamMember(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error: memberError } = await supabase
    .from('team_members')
    .update({
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as TeamRole,
      supervised_by: (formData.get('supervised_by') as string) || null,
      status: formData.get('status') as string,
    })
    .eq('id', id)

  if (memberError) return { error: memberError.message }

  // Replace pod assignments
  await supabase.from('team_member_pods').delete().eq('team_member_id', id)

  const podIds = formData.getAll('pod_ids') as string[]
  const primaryPodId = formData.get('primary_pod_id') as string

  if (podIds.length > 0) {
    const podRows = podIds.map((pod_id) => ({
      team_member_id: id,
      pod_id,
      is_primary: pod_id === primaryPodId,
    }))
    await supabase.from('team_member_pods').insert(podRows)
  }

  revalidatePath('/team')
  revalidatePath(`/team/${id}/edit`)
  return { error: null }
}
```

- [ ] **Step 2: Write team member form component**

```tsx
// components/team/team-member-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTeamMember, updateTeamMember } from '@/lib/actions/team-members'
import { ROLE_LABELS } from '@/lib/constants/roles'
import type { TeamMember, TeamRole, Pod } from '@/lib/types'

interface TeamMemberFormProps {
  member?: any // TeamMember with nested pods
  pods: Pod[]
  supervisors?: TeamMember[]
}

export function TeamMemberForm({ member, pods, supervisors }: TeamMemberFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [selectedPods, setSelectedPods] = useState<string[]>(
    member?.team_member_pods?.map((tmp: any) => tmp.pod_id) ?? []
  )
  const isEdit = !!member

  async function handleSubmit(formData: FormData) {
    setError(null)
    // Append pod IDs to formData
    selectedPods.forEach((id) => formData.append('pod_ids', id))

    const result = isEdit
      ? await updateTeamMember(member.id, formData)
      : await createTeamMember(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/team')
    }
  }

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" name="first_name" defaultValue={member?.first_name ?? ''} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" name="last_name" defaultValue={member?.last_name ?? ''} required className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={member?.email ?? ''} required className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select id="role" name="role" defaultValue={member?.role ?? 'writer'} required
          className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
          {(Object.entries(ROLE_LABELS) as [TeamRole, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {isEdit && (
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue={member?.status ?? 'active'}
            className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      <div>
        <Label>Pod Assignments</Label>
        <div className="mt-1.5 space-y-2">
          {pods.map((pod) => (
            <label key={pod.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedPods.includes(pod.id)}
                onChange={(e) =>
                  setSelectedPods((prev) =>
                    e.target.checked ? [...prev, pod.id] : prev.filter((id) => id !== pod.id)
                  )
                }
              />
              {pod.name}
            </label>
          ))}
        </div>
        {selectedPods.length > 1 && (
          <div className="mt-2">
            <Label htmlFor="primary_pod_id">Primary Pod</Label>
            <select id="primary_pod_id" name="primary_pod_id"
              defaultValue={member?.team_member_pods?.find((p: any) => p.is_primary)?.pod_id ?? ''}
              className="mt-1 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
              {selectedPods.map((pid) => {
                const pod = pods.find((p) => p.id === pid)
                return <option key={pid} value={pid}>{pod?.name}</option>
              })}
            </select>
          </div>
        )}
      </div>

      {supervisors && supervisors.length > 0 && (
        <div>
          <Label htmlFor="supervised_by">Supervised By</Label>
          <select id="supervised_by" name="supervised_by" defaultValue={member?.supervised_by ?? ''}
            className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
            <option value="">None</option>
            {supervisors.map((s) => (
              <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push('/team')}>Cancel</Button>
        <Button type="submit">{isEdit ? 'Save Changes' : 'Create Member'}</Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Write team members list page**

```tsx
// app/(app)/team/page.tsx
import Link from 'next/link'
import { getTeamMembers } from '@/lib/actions/team-members'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS } from '@/lib/constants/roles'

export default async function TeamPage() {
  const members = await getTeamMembers()

  return (
    <div>
      <PageHeader
        title="Team"
        meta={`${members.length} members`}
        action={<Link href="/team/new"><Button>+ Add Member</Button></Link>}
      />

      <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">Name</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">Role</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">Email</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">Pod(s)</th>
              <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m: any) => (
              <tr key={m.id} className="border-b border-[hsl(var(--border-light))] hover:bg-[#FAFAF7] transition-colors">
                <td className="px-4 py-3 text-[13px] font-medium">
                  <Link href={`/team/${m.id}/edit`} className="hover:underline">
                    {m.first_name} {m.last_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-[13px] text-[hsl(var(--text-2))]">{ROLE_LABELS[m.role as keyof typeof ROLE_LABELS]}</td>
                <td className="px-4 py-3 text-[13px] text-[hsl(var(--text-2))]">{m.email}</td>
                <td className="px-4 py-3 text-[13px]">
                  {m.team_member_pods?.map((tmp: any) => (
                    <span key={tmp.pod_id} className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[hsl(var(--border-light))] text-[hsl(var(--text-2))] mr-1">
                      {tmp.pods?.name}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 text-[13px]">
                  <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>
                    {m.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write create team member page**

```tsx
// app/(app)/team/new/page.tsx
import { getPods } from '@/lib/actions/pods'
import { getTeamMembers } from '@/lib/actions/team-members'
import { PageHeader } from '@/components/shared/page-header'
import { TeamMemberForm } from '@/components/team/team-member-form'

export default async function NewTeamMemberPage() {
  const [pods, allMembers] = await Promise.all([
    getPods(),
    getTeamMembers(),
  ])

  // For supervised_by dropdown: senior_writers and senior_editors
  const supervisors = allMembers.filter((m: any) =>
    m.role === 'senior_writer' || m.role === 'senior_editor'
  )

  return (
    <div>
      <PageHeader title="Add Team Member" />
      <TeamMemberForm pods={pods} supervisors={supervisors} />
    </div>
  )
}
```

- [ ] **Step 5: Write edit team member page**

```tsx
// app/(app)/team/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { getPods } from '@/lib/actions/pods'
import { getTeamMember, getTeamMembers } from '@/lib/actions/team-members'
import { PageHeader } from '@/components/shared/page-header'
import { TeamMemberForm } from '@/components/team/team-member-form'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [member, pods, allMembers] = await Promise.all([
    getTeamMember(id).catch(() => null),
    getPods(),
    getTeamMembers(),
  ])

  if (!member) notFound()

  const supervisors = allMembers.filter((m: any) =>
    (m.role === 'senior_writer' || m.role === 'senior_editor') && m.id !== id
  )

  return (
    <div>
      <PageHeader title={`Edit: ${member.first_name} ${member.last_name}`} />
      <TeamMemberForm member={member} pods={pods} supervisors={supervisors} />
    </div>
  )
}
```

- [ ] **Step 6: Test team members CRUD**

1. Navigate to /team → empty table
2. Click "Add Member" → fill form → select Pod 1 → submit → row appears
3. Create 3-4 test members with different roles
4. Click a name → edit page → change role → save → updated in list
5. Deactivate a member → status badge updates

- [ ] **Step 7: Commit**

```bash
git add lib/actions/team-members.ts app/\(app\)/team/ components/team/
git commit -m "feat: add Team Members CRUD with pod assignments"
```

---

## Task 8: Client List Page

**Files:**
- Create: `lib/actions/clients.ts`
- Create: `app/(app)/clients/page.tsx`
- Create: `components/clients/client-table.tsx`
- Create: `components/clients/client-filters.tsx`

- [ ] **Step 1: Write clients server actions (list + filters)**

```typescript
// lib/actions/clients.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ClientStatus } from '@/lib/types'

export interface ClientListFilters {
  search?: string
  status?: ClientStatus
  pod_id?: string
  page?: number
  per_page?: number
}

export async function getClients(filters: ClientListFilters = {}) {
  const supabase = await createClient()
  const { page = 1, per_page = 25 } = filters
  const from = (page - 1) * per_page
  const to = from + per_page - 1

  let query = supabase
    .from('clients')
    .select(`
      *,
      pods ( name ),
      client_channels ( videos_per_week ),
      client_assignments!inner (
        assignment_role,
        team_members ( first_name, last_name )
      )
    `, { count: 'exact' })
    .order('name')
    .range(from, to)

  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.pod_id) {
    query = query.eq('pod_id', filters.pod_id)
  }

  const { data, count, error } = await query
  if (error) {
    // Retry without inner join if no assignments exist yet
    const fallback = supabase
      .from('clients')
      .select('*, pods ( name ), client_channels ( videos_per_week )', { count: 'exact' })
      .order('name')
      .range(from, to)
    if (filters.search) fallback.ilike('name', `%${filters.search}%`)
    if (filters.status) fallback.eq('status', filters.status)
    if (filters.pod_id) fallback.eq('pod_id', filters.pod_id)
    const { data: d, count: c } = await fallback
    return { clients: d ?? [], total: c ?? 0 }
  }

  return { clients: data ?? [], total: count ?? 0 }
}

export async function getClient(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*, pods ( name )')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()

  const fields: Record<string, any> = {
    name: formData.get('name'),
    market: formData.get('market') || null,
    timezone: formData.get('timezone') || null,
    website: formData.get('website') || null,
    youtube_channel_url: formData.get('youtube_channel_url') || null,
    dropbox_upload_url: formData.get('dropbox_upload_url') || null,
    broll_library_url: formData.get('broll_library_url') || null,
    slack_channel_url: formData.get('slack_channel_url') || null,
    status: formData.get('status') || 'onboarding',
    pod_id: formData.get('pod_id') || null,
    package: formData.get('package') || null,
    contract_start_date: formData.get('contract_start_date') || null,
    posting_schedule: formData.get('posting_schedule') || null,
    script_format: formData.get('script_format') || null,
    communication_method: formData.get('communication_method') || null,
    special_instructions: formData.get('special_instructions') || null,
  }

  const { data, error } = await supabase.from('clients').insert(fields).select().single()
  if (error) return { error: error.message, id: null }

  revalidatePath('/clients')
  return { error: null, id: data.id }
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient()

  const fields: Record<string, any> = {
    name: formData.get('name'),
    market: formData.get('market') || null,
    timezone: formData.get('timezone') || null,
    website: formData.get('website') || null,
    youtube_channel_url: formData.get('youtube_channel_url') || null,
    dropbox_upload_url: formData.get('dropbox_upload_url') || null,
    broll_library_url: formData.get('broll_library_url') || null,
    slack_channel_url: formData.get('slack_channel_url') || null,
    status: formData.get('status'),
    pod_id: formData.get('pod_id') || null,
    package: formData.get('package') || null,
    contract_start_date: formData.get('contract_start_date') || null,
    posting_schedule: formData.get('posting_schedule') || null,
    script_format: formData.get('script_format') || null,
    communication_method: formData.get('communication_method') || null,
    special_instructions: formData.get('special_instructions') || null,
  }

  const { error } = await supabase.from('clients').update(fields).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  return { error: null }
}
```

- [ ] **Step 2: Write client filters component (Client Component)**

```tsx
// components/clients/client-filters.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { CLIENT_STATUS_LABELS } from '@/lib/constants/status'
import type { Pod } from '@/lib/types'

interface ClientFiltersProps {
  pods: Pod[]
}

export function ClientFilters({ pods }: ClientFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to page 1
    router.push(`/clients?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Search clients…"
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => updateParam('search', e.target.value)}
        className="w-[220px]"
      />
      <select
        defaultValue={searchParams.get('status') ?? ''}
        onChange={(e) => updateParam('status', e.target.value)}
        className="px-3 py-2 border border-[hsl(var(--border))] rounded-md text-[12.5px] bg-white text-[hsl(var(--text-2))]"
      >
        <option value="">All Statuses</option>
        {Object.entries(CLIENT_STATUS_LABELS).map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
      <select
        defaultValue={searchParams.get('pod_id') ?? ''}
        onChange={(e) => updateParam('pod_id', e.target.value)}
        className="px-3 py-2 border border-[hsl(var(--border))] rounded-md text-[12.5px] bg-white text-[hsl(var(--text-2))]"
      >
        <option value="">All Pods</option>
        {pods.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 3: Write client table component**

```tsx
// components/clients/client-table.tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface ClientTableProps {
  clients: any[]
}

export function ClientTable({ clients }: ClientTableProps) {
  function getStrategist(client: any) {
    const assignment = client.client_assignments?.find((a: any) => a.assignment_role === 'strategist')
    if (!assignment?.team_members) return '—'
    return `${assignment.team_members.first_name} ${assignment.team_members.last_name}`
  }

  function getVideosPerWeek(client: any) {
    if (!client.client_channels?.length) return '—'
    return client.client_channels.reduce((sum: number, ch: any) => sum + Number(ch.videos_per_week), 0)
  }

  function statusBadgeClass(status: string) {
    switch (status) {
      case 'active': return 'bg-[hsl(var(--active-bg))] text-[hsl(var(--active-text))] border-none'
      case 'onboarding': return 'bg-[hsl(var(--onboard-bg))] text-[hsl(var(--onboard-text))] border-none'
      default: return 'bg-[hsl(var(--inactive-bg))] text-[hsl(var(--inactive-text))] border-none'
    }
  }

  return (
    <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
            {['Client', 'Market', 'Pod', 'Status', 'Vid/wk', 'Strategist'].map((h) => (
              <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[hsl(var(--text-3))] whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map((c: any) => (
            <tr key={c.id} className="border-b border-[hsl(var(--border-light))] last:border-b-0 hover:bg-[#FAFAF7] transition-colors cursor-pointer">
              <td className="px-4 py-3 text-[13px] font-medium">
                <Link href={`/clients/${c.id}`} className="hover:underline">{c.name}</Link>
              </td>
              <td className="px-4 py-3 text-[13px] text-[hsl(var(--text-2))]">{c.market ?? '—'}</td>
              <td className="px-4 py-3 text-[13px]">
                {c.pods?.name ? (
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[hsl(var(--border-light))] text-[hsl(var(--text-2))]">
                    {c.pods.name}
                  </span>
                ) : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge className={`text-[11px] font-medium ${statusBadgeClass(c.status)}`}>{c.status}</Badge>
              </td>
              <td className="px-4 py-3 text-[13px] text-[hsl(var(--text-2))]">{getVideosPerWeek(c)}</td>
              <td className="px-4 py-3 text-[13px] text-[hsl(var(--text-2))]">{getStrategist(c)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Write client list page**

```tsx
// app/(app)/clients/page.tsx
import Link from 'next/link'
import { getClients, type ClientListFilters } from '@/lib/actions/clients'
import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientTable } from '@/components/clients/client-table'
import { ClientFilters } from '@/components/clients/client-filters'
import { Button } from '@/components/ui/button'
import type { ClientStatus } from '@/lib/types'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const filters: ClientListFilters = {
    search: params.search,
    status: params.status as ClientStatus | undefined,
    pod_id: params.pod_id,
    page: params.page ? parseInt(params.page) : 1,
  }

  const [{ clients, total }, pods] = await Promise.all([
    getClients(filters),
    getPods(),
  ])

  return (
    <div>
      <PageHeader
        title="Clients"
        meta={`${total} total`}
        action={<Link href="/clients/new"><Button>+ Add Client</Button></Link>}
      />
      <ClientFilters pods={pods} />
      <ClientTable clients={clients} />
      {total > 25 && (
        <div className="flex justify-between items-center mt-4 text-sm text-[hsl(var(--text-2))]">
          <span>Page {filters.page} of {Math.ceil(total / 25)}</span>
          <div className="flex gap-2">
            {(filters.page ?? 1) > 1 && (
              <Link href={`/clients?${new URLSearchParams({ ...params, page: String((filters.page ?? 1) - 1) })}`}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {(filters.page ?? 1) * 25 < total && (
              <Link href={`/clients?${new URLSearchParams({ ...params, page: String((filters.page ?? 1) + 1) })}`}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Test client list**

1. Create 2-3 clients directly in Supabase (or use the Add Client form from Task 9)
2. Navigate to /clients → table renders with all columns
3. Type in search → filters by client name
4. Select a status filter → filters correctly
5. Select a pod filter → filters correctly
6. Verify row click navigates to /clients/[id]

- [ ] **Step 6: Commit**

```bash
git add lib/actions/clients.ts app/\(app\)/clients/page.tsx components/clients/
git commit -m "feat: add Client List page with search, status, and pod filters"
```

---

## Task 9: Add/Edit Client Form

**Files:**
- Create: `app/(app)/clients/new/page.tsx`
- Create: `app/(app)/clients/[id]/edit/page.tsx`
- Create: `components/clients/client-form.tsx`

- [ ] **Step 1: Write client form component**

```tsx
// components/clients/client-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClientAction, updateClientAction } from '@/lib/actions/clients'
import { CLIENT_STATUS_LABELS } from '@/lib/constants/status'
import type { Pod } from '@/lib/types'

interface ClientFormProps {
  client?: any
  pods: Pod[]
}

export function ClientForm({ client, pods }: ClientFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!client

  async function handleSubmit(formData: FormData) {
    setError(null)
    if (isEdit) {
      const result = await updateClientAction(client.id, formData)
      if (result?.error) { setError(result.error); return }
      router.push(`/clients/${client.id}`)
    } else {
      const result = await createClientAction(formData)
      if (result?.error) { setError(result.error); return }
      router.push(`/clients/${result.id}`)
    }
  }

  function field(name: string, label: string, type = 'text', opts?: { textarea?: boolean }) {
    const value = client?.[name] ?? ''
    return (
      <div>
        <Label htmlFor={name} className="text-xs font-medium text-[hsl(var(--text-2))]">{label}</Label>
        {opts?.textarea ? (
          <textarea id={name} name={name} defaultValue={value} rows={3}
            className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white resize-none" />
        ) : (
          <Input id={name} name={name} type={type} defaultValue={value} className="mt-1.5" />
        )}
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="max-w-xl space-y-4">
      {field('name', 'Client Name *')}

      <div className="grid grid-cols-2 gap-4">
        {field('market', 'Market')}
        {field('timezone', 'Timezone')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pod_id" className="text-xs font-medium text-[hsl(var(--text-2))]">Pod</Label>
          <select id="pod_id" name="pod_id" defaultValue={client?.pod_id ?? ''}
            className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
            <option value="">No pod</option>
            {pods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="status" className="text-xs font-medium text-[hsl(var(--text-2))]">Status</Label>
          <select id="status" name="status" defaultValue={client?.status ?? 'onboarding'}
            className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
            {Object.entries(CLIENT_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field('package', 'Package')}
        {field('contract_start_date', 'Contract Start Date', 'date')}
      </div>

      {field('posting_schedule', 'Posting Schedule')}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="script_format" className="text-xs font-medium text-[hsl(var(--text-2))]">Script Format</Label>
          <select id="script_format" name="script_format" defaultValue={client?.script_format ?? ''}
            className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
            <option value="">—</option>
            <option value="word_for_word">Word for Word</option>
            <option value="outline">Outline</option>
          </select>
        </div>
        <div>
          <Label htmlFor="communication_method" className="text-xs font-medium text-[hsl(var(--text-2))]">Communication</Label>
          <select id="communication_method" name="communication_method" defaultValue={client?.communication_method ?? ''}
            className="mt-1.5 w-full px-3 py-2 border border-[hsl(var(--border))] rounded-md text-sm bg-white">
            <option value="">—</option>
            <option value="slack">Slack</option>
            <option value="email">Email</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {field('website', 'Website URL', 'url')}
      {field('youtube_channel_url', 'YouTube Channel URL', 'url')}
      {field('dropbox_upload_url', 'Dropbox Upload URL', 'url')}
      {field('broll_library_url', 'B-Roll Library URL', 'url')}
      {field('slack_channel_url', 'Slack Channel URL', 'url')}
      {field('special_instructions', 'Special Instructions', 'text', { textarea: true })}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit">{isEdit ? 'Save Changes' : 'Create Client'}</Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Write new client page**

```tsx
// app/(app)/clients/new/page.tsx
import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clients/client-form'

export default async function NewClientPage() {
  const pods = await getPods()
  return (
    <div>
      <PageHeader title="Add Client" />
      <ClientForm pods={pods} />
    </div>
  )
}
```

- [ ] **Step 3: Write edit client page**

```tsx
// app/(app)/clients/[id]/edit/page.tsx
import { notFound } from 'next/navigation'
import { getClient } from '@/lib/actions/clients'
import { getPods } from '@/lib/actions/pods'
import { PageHeader } from '@/components/shared/page-header'
import { ClientForm } from '@/components/clients/client-form'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [client, pods] = await Promise.all([
    getClient(id).catch(() => null),
    getPods(),
  ])

  if (!client) notFound()

  return (
    <div>
      <PageHeader title={`Edit: ${client.name}`} />
      <ClientForm client={client} pods={pods} />
    </div>
  )
}
```

- [ ] **Step 4: Test add/edit client**

1. Navigate to /clients/new → form renders all fields
2. Fill "Acme Co" + select Pod 1 + status Onboarding → submit
3. Redirects to /clients/[id] (404 OK — detail page not built yet, check URL)
4. Navigate to /clients → new client appears in list
5. Navigate to /clients/[id]/edit → form is pre-filled → change market → save

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/clients/new/ app/\(app\)/clients/\[id\]/edit/ components/clients/client-form.tsx
git commit -m "feat: add Client create/edit form with all schema fields"
```

---

## Task 10: Client Detail Page — Shell + Info Section

**Files:**
- Create: `app/(app)/clients/[id]/page.tsx`
- Create: `components/clients/client-info-section.tsx`

- [ ] **Step 1: Write client info section**

```tsx
// components/clients/client-info-section.tsx
import type { Client } from '@/lib/types'

export function ClientInfoSection({ client }: { client: any }) {
  function row(label: string, value: string | null, opts?: { link?: boolean }) {
    return (
      <div className="flex justify-between items-baseline py-1 text-[12.5px]">
        <span className="text-[hsl(var(--text-2))]">{label}</span>
        {opts?.link && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="text-[hsl(var(--accent))] hover:underline text-[12px]">Open ↗</a>
        ) : (
          <span className="text-[hsl(var(--text-1))]">{value ?? '—'}</span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--text-3))] mb-3">Client Info</div>
      {row('Package', client.package)}
      {row('Contract Start', client.contract_start_date)}
      {row('Posting Schedule', client.posting_schedule)}
      {row('Script Format', client.script_format)}
      {row('Communication', client.communication_method)}
      {row('Special Notes', client.special_instructions)}
      <div className="border-t border-[hsl(var(--border-light))] mt-3 pt-3">
        {row('Dropbox', client.dropbox_upload_url, { link: true })}
        {row('B-Roll Library', client.broll_library_url, { link: true })}
        {row('Slack Channel', client.slack_channel_url, { link: true })}
        {row('YouTube', client.youtube_channel_url, { link: true })}
        {row('Website', client.website, { link: true })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write client detail page**

```tsx
// app/(app)/clients/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { ClientInfoSection } from '@/components/clients/client-info-section'
import { ClientChannelsSection } from '@/components/clients/client-channels-section'
import { ClientContactsSection } from '@/components/clients/client-contacts-section'
import { ClientTeamSection } from '@/components/clients/client-team-section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*, pods ( name )')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const [{ data: channels }, { data: contacts }, { data: assignments }] = await Promise.all([
    supabase.from('client_channels').select('*').eq('client_id', id).order('channel_name'),
    supabase.from('client_contacts').select('*').eq('client_id', id).order('is_primary', { ascending: false }),
    supabase.from('client_assignments').select('*, team_members ( id, first_name, last_name, role )').eq('client_id', id),
  ])

  function statusClass(status: string) {
    switch (status) {
      case 'active': return 'bg-[hsl(var(--active-bg))] text-[hsl(var(--active-text))] border-none'
      case 'onboarding': return 'bg-[hsl(var(--onboard-bg))] text-[hsl(var(--onboard-text))] border-none'
      default: return 'bg-[hsl(var(--inactive-bg))] text-[hsl(var(--inactive-text))] border-none'
    }
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Link href="/clients" className="text-[12px] text-[hsl(var(--text-2))] hover:underline mb-4 inline-block">← Clients</Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight">{client.name}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge className={`text-[11px] font-medium ${statusClass(client.status)}`}>{client.status}</Badge>
            {client.pods?.name && (
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[hsl(var(--border-light))] text-[hsl(var(--text-2))]">{client.pods.name}</span>
            )}
            {client.market && <span className="text-[12px] text-[hsl(var(--text-2))]">· {client.market}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/clients/${id}/edit`}><Button variant="outline">Edit</Button></Link>
        </div>
      </div>

      {/* Grid: Info + Team on left, Channels + Contacts on right */}
      <div className="grid grid-cols-2 gap-5">
        <ClientInfoSection client={client} />
        <ClientTeamSection clientId={id} assignments={assignments ?? []} />
        <ClientChannelsSection clientId={id} channels={channels ?? []} />
        <ClientContactsSection clientId={id} contacts={contacts ?? []} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test client detail shell**

Note: This page imports ClientChannelsSection, ClientContactsSection, and ClientTeamSection which are built in Tasks 11-13. Create placeholder exports for now if building sequentially:

```tsx
// Temporary placeholders — replace in Tasks 11-13
// components/clients/client-channels-section.tsx
export function ClientChannelsSection({ clientId, channels }: any) {
  return <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-5">
    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--text-3))]">Channels ({channels.length})</div>
  </div>
}

// components/clients/client-contacts-section.tsx
export function ClientContactsSection({ clientId, contacts }: any) {
  return <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-5">
    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--text-3))]">Contacts ({contacts.length})</div>
  </div>
}

// components/clients/client-team-section.tsx
export function ClientTeamSection({ clientId, assignments }: any) {
  return <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-5">
    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--text-3))]">Team ({assignments.length})</div>
  </div>
}
```

1. Navigate to /clients/[id] → header shows name, status badge, pod tag
2. Info section shows all fields
3. Three placeholder sections render

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/clients/\[id\]/page.tsx components/clients/
git commit -m "feat: add Client Detail page with info section and placeholder sub-entities"
```

---

## Task 11: Client Channels Section

**Files:**
- Create: `lib/actions/client-channels.ts`
- Modify: `components/clients/client-channels-section.tsx`

- [ ] **Step 1: Write channel server actions**

```typescript
// lib/actions/client-channels.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createChannel(clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('client_channels').insert({
    client_id: clientId,
    channel_name: formData.get('channel_name') as string,
    channel_url: (formData.get('channel_url') as string) || null,
    videos_per_week: parseFloat(formData.get('videos_per_week') as string) || 1,
  })
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function updateChannel(channelId: string, clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('client_channels').update({
    channel_name: formData.get('channel_name') as string,
    channel_url: (formData.get('channel_url') as string) || null,
    videos_per_week: parseFloat(formData.get('videos_per_week') as string) || 1,
  }).eq('id', channelId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function deleteChannel(channelId: string, clientId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('client_channels').delete().eq('id', channelId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}
```

- [ ] **Step 2: Replace channels section placeholder**

```tsx
// components/clients/client-channels-section.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createChannel, updateChannel, deleteChannel } from '@/lib/actions/client-channels'
import type { ClientChannel } from '@/lib/types'

interface Props {
  clientId: string
  channels: ClientChannel[]
}

export function ClientChannelsSection({ clientId, channels }: Props) {
  const [editChannel, setEditChannel] = useState<ClientChannel | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  async function handleAdd(formData: FormData) {
    const result = await createChannel(clientId, formData)
    if (!result.error) setShowAdd(false)
  }

  async function handleEdit(formData: FormData) {
    if (!editChannel) return
    const result = await updateChannel(editChannel.id, clientId, formData)
    if (!result.error) setEditChannel(null)
  }

  async function handleDelete(channelId: string) {
    await deleteChannel(channelId, clientId)
  }

  function channelForm(channel: ClientChannel | null, onSubmit: (fd: FormData) => void, onCancel: () => void) {
    return (
      <form action={onSubmit} className="space-y-3">
        <div>
          <Label>Channel Name</Label>
          <Input name="channel_name" defaultValue={channel?.channel_name ?? ''} required className="mt-1" />
        </div>
        <div>
          <Label>Channel URL</Label>
          <Input name="channel_url" defaultValue={channel?.channel_url ?? ''} className="mt-1" />
        </div>
        <div>
          <Label>Videos / Week</Label>
          <Input name="videos_per_week" type="number" step="0.5" min="0" defaultValue={channel?.videos_per_week ?? 1} className="mt-1" />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{channel ? 'Save' : 'Add'}</Button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--text-3))]">Channels</div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <button className="text-[12px] text-[hsl(var(--accent))] hover:underline">+ Add</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Channel</DialogTitle></DialogHeader>
            {channelForm(null, handleAdd, () => setShowAdd(false))}
          </DialogContent>
        </Dialog>
      </div>

      {channels.length === 0 ? (
        <p className="text-[12.5px] text-[hsl(var(--text-3))]">No channels yet.</p>
      ) : (
        <div className="space-y-2">
          {channels.map((ch) => (
            <div key={ch.id} className="flex justify-between items-center text-[12.5px] py-1">
              <span>{ch.channel_name}</span>
              <div className="flex items-center gap-3">
                <span className="text-[hsl(var(--text-2))]">{ch.videos_per_week} / wk</span>
                <button onClick={() => setEditChannel(ch)} className="text-[hsl(var(--text-3))] hover:text-[hsl(var(--text-1))] text-[11px]">Edit</button>
                <button onClick={() => handleDelete(ch.id)} className="text-[hsl(var(--text-3))] hover:text-red-600 text-[11px]">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editChannel} onOpenChange={(open) => !open && setEditChannel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Channel</DialogTitle></DialogHeader>
          {editChannel && channelForm(editChannel, handleEdit, () => setEditChannel(null))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

- [ ] **Step 3: Test channels**

1. Navigate to /clients/[id] → channels section shows "No channels yet"
2. Click "+ Add" → fill form → submit → channel appears
3. Click "Edit" → change name → save → updates
4. Click "Remove" → channel disappears

- [ ] **Step 4: Commit**

```bash
git add lib/actions/client-channels.ts components/clients/client-channels-section.tsx
git commit -m "feat: add Client Channels CRUD on detail page"
```

---

## Task 12: Client Contacts Section

**Files:**
- Create: `lib/actions/client-contacts.ts`
- Modify: `components/clients/client-contacts-section.tsx`

- [ ] **Step 1: Write contact server actions**

```typescript
// lib/actions/client-contacts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createContact(clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('client_contacts').insert({
    client_id: clientId,
    contact_name: (formData.get('contact_name') as string) || null,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || null,
    is_primary: formData.get('is_primary') === 'true',
    is_assistant: formData.get('is_assistant') === 'true',
  })
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function updateContact(contactId: string, clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('client_contacts').update({
    contact_name: (formData.get('contact_name') as string) || null,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || null,
    is_primary: formData.get('is_primary') === 'true',
    is_assistant: formData.get('is_assistant') === 'true',
  }).eq('id', contactId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function deleteContact(contactId: string, clientId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('client_contacts').delete().eq('id', contactId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}
```

- [ ] **Step 2: Replace contacts section placeholder**

```tsx
// components/clients/client-contacts-section.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createContact, updateContact, deleteContact } from '@/lib/actions/client-contacts'
import type { ClientContact } from '@/lib/types'

interface Props {
  clientId: string
  contacts: ClientContact[]
}

export function ClientContactsSection({ clientId, contacts }: Props) {
  const [editContact, setEditContact] = useState<ClientContact | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  async function handleAdd(formData: FormData) {
    const result = await createContact(clientId, formData)
    if (!result.error) setShowAdd(false)
  }

  async function handleEdit(formData: FormData) {
    if (!editContact) return
    const result = await updateContact(editContact.id, clientId, formData)
    if (!result.error) setEditContact(null)
  }

  function contactForm(contact: ClientContact | null, onSubmit: (fd: FormData) => void, onCancel: () => void) {
    return (
      <form action={onSubmit} className="space-y-3">
        <div>
          <Label>Name</Label>
          <Input name="contact_name" defaultValue={contact?.contact_name ?? ''} className="mt-1" />
        </div>
        <div>
          <Label>Email *</Label>
          <Input name="email" type="email" defaultValue={contact?.email ?? ''} required className="mt-1" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" defaultValue={contact?.phone ?? ''} className="mt-1" />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="hidden" name="is_primary" value="false" />
            <input type="checkbox" name="is_primary" value="true" defaultChecked={contact?.is_primary ?? false} />
            Primary
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="hidden" name="is_assistant" value="false" />
            <input type="checkbox" name="is_assistant" value="true" defaultChecked={contact?.is_assistant ?? false} />
            Assistant
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{contact ? 'Save' : 'Add'}</Button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--text-3))]">Contacts</div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <button className="text-[12px] text-[hsl(var(--accent))] hover:underline">+ Add</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
            {contactForm(null, handleAdd, () => setShowAdd(false))}
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <p className="text-[12.5px] text-[hsl(var(--text-3))]">No contacts yet.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex justify-between items-center text-[12.5px] py-1">
              <div className="flex items-center gap-2">
                <span>{c.contact_name ?? 'Unnamed'}</span>
                {c.is_primary && (
                  <span className="text-[10px] bg-[hsl(var(--accent-bg))] text-[hsl(var(--accent))] px-1.5 py-0.5 rounded">Primary</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[hsl(var(--text-2))] text-[11.5px]">{c.email}</span>
                <button onClick={() => setEditContact(c)} className="text-[hsl(var(--text-3))] hover:text-[hsl(var(--text-1))] text-[11px]">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editContact} onOpenChange={(open) => !open && setEditContact(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
          {editContact && contactForm(editContact, handleEdit, () => setEditContact(null))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

- [ ] **Step 3: Test contacts**

1. Client detail → contacts shows "No contacts yet"
2. Add a primary contact → shows with "Primary" badge
3. Add an assistant → shows without badge
4. Edit a contact → changes persist

- [ ] **Step 4: Commit**

```bash
git add lib/actions/client-contacts.ts components/clients/client-contacts-section.tsx
git commit -m "feat: add Client Contacts CRUD on detail page"
```

---

## Task 13: Client Assignments (Team Picker)

**Files:**
- Create: `lib/actions/client-assignments.ts`
- Modify: `components/clients/client-team-section.tsx`

- [ ] **Step 1: Write assignment server actions**

```typescript
// lib/actions/client-assignments.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { AssignmentRole } from '@/lib/types'

export async function upsertAssignment(clientId: string, assignmentRole: AssignmentRole, teamMemberId: string | null) {
  const supabase = await createClient()

  // Delete existing assignment for this role
  await supabase
    .from('client_assignments')
    .delete()
    .eq('client_id', clientId)
    .eq('assignment_role', assignmentRole)

  // Insert new if a member was selected
  if (teamMemberId) {
    const { error } = await supabase.from('client_assignments').insert({
      client_id: clientId,
      team_member_id: teamMemberId,
      assignment_role: assignmentRole,
    })
    if (error) return { error: error.message }
  }

  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function getEligibleMembers(assignmentRole: AssignmentRole) {
  const supabase = await createClient()
  const { ASSIGNMENT_ROLE_ELIGIBLE_TEAM_ROLES } = await import('@/lib/constants/roles')
  const eligibleRoles = ASSIGNMENT_ROLE_ELIGIBLE_TEAM_ROLES[assignmentRole]

  const { data, error } = await supabase
    .from('team_members')
    .select('id, first_name, last_name, role')
    .in('role', eligibleRoles)
    .eq('status', 'active')
    .order('first_name')

  if (error) return []
  return data
}
```

- [ ] **Step 2: Replace team section placeholder**

```tsx
// components/clients/client-team-section.tsx
'use client'

import { useState, useEffect } from 'react'
import { upsertAssignment, getEligibleMembers } from '@/lib/actions/client-assignments'
import { ASSIGNMENT_ROLE_LABELS } from '@/lib/constants/roles'
import type { AssignmentRole, ClientAssignment } from '@/lib/types'

const ALL_ASSIGNMENT_ROLES: AssignmentRole[] = [
  'strategist', 'manager', 'senior_writer', 'senior_editor', 'editor', 'designer', 'senior_designer',
]

interface Props {
  clientId: string
  assignments: (ClientAssignment & { team_members: { id: string; first_name: string; last_name: string; role: string } })[]
}

export function ClientTeamSection({ clientId, assignments }: Props) {
  const [editing, setEditing] = useState<AssignmentRole | null>(null)
  const [eligible, setEligible] = useState<any[]>([])

  useEffect(() => {
    if (editing) {
      getEligibleMembers(editing).then(setEligible)
    }
  }, [editing])

  function getMemberForRole(role: AssignmentRole) {
    const a = assignments.find((a) => a.assignment_role === role)
    if (!a?.team_members) return null
    return a.team_members
  }

  async function handleAssign(role: AssignmentRole, memberId: string) {
    await upsertAssignment(clientId, role, memberId || null)
    setEditing(null)
  }

  return (
    <div className="bg-white border border-[hsl(var(--border))] rounded-[10px] p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--text-3))]">Team</div>
      </div>

      <div className="space-y-1">
        {ALL_ASSIGNMENT_ROLES.map((role) => {
          const member = getMemberForRole(role)
          return (
            <div key={role} className="flex justify-between items-center text-[12.5px] py-1.5 border-b border-[hsl(var(--border-light))] last:border-b-0">
              <span className="text-[hsl(var(--text-2))]">{ASSIGNMENT_ROLE_LABELS[role]}</span>
              {editing === role ? (
                <select
                  autoFocus
                  defaultValue={member?.id ?? ''}
                  onChange={(e) => handleAssign(role, e.target.value)}
                  onBlur={() => setEditing(null)}
                  className="px-2 py-1 border border-[hsl(var(--border))] rounded text-[12px] bg-white"
                >
                  <option value="">— None —</option>
                  {eligible.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                  ))}
                </select>
              ) : (
                <button
                  onClick={() => setEditing(role)}
                  className={`text-[12.5px] ${member ? 'font-medium text-[hsl(var(--text-1))]' : 'text-[hsl(var(--text-3))] italic'} hover:underline`}
                >
                  {member ? `${member.first_name} ${member.last_name}` : '—'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Test team assignments**

1. Client detail → Team section shows all 7 role slots with "—"
2. Click "—" next to Strategist → dropdown shows only strategist/jr_strategist role members
3. Select a member → saves → name appears
4. Click name → dropdown → change to different member → updates
5. Select "None" → clears the assignment

- [ ] **Step 4: Commit**

```bash
git add lib/actions/client-assignments.ts components/clients/client-team-section.tsx
git commit -m "feat: add Client Team assignments with role-filtered picker"
```

---

## Task 14: Seed Data + RLS Policies

**Files:**
- Create: `supabase/migrations/002_rls.sql`
- Create: `supabase/migrations/003_seed.sql`

- [ ] **Step 1: Write basic RLS policies**

```sql
-- 002_rls.sql — Basic RLS for Module 0+1
-- Full role-specific RLS will be hardened in Module 2 when boards are built.

ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_history ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's team_member record
CREATE OR REPLACE FUNCTION get_my_team_member_id()
RETURNS UUID AS $$
  SELECT id FROM team_members WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS team_role AS $$
  SELECT role FROM team_members WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Pods: all authenticated can read, admin can write
CREATE POLICY "pods_select" ON pods FOR SELECT TO authenticated USING (true);
CREATE POLICY "pods_insert" ON pods FOR INSERT TO authenticated WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "pods_update" ON pods FOR UPDATE TO authenticated USING (get_my_role() = 'admin');

-- Team members: all authenticated can read, admin can write
CREATE POLICY "tm_select" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "tm_insert" ON team_members FOR INSERT TO authenticated WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "tm_update" ON team_members FOR UPDATE TO authenticated USING (get_my_role() = 'admin');

-- Team member pods: all authenticated can read, admin can write
CREATE POLICY "tmp_select" ON team_member_pods FOR SELECT TO authenticated USING (true);
CREATE POLICY "tmp_insert" ON team_member_pods FOR INSERT TO authenticated WITH CHECK (get_my_role() = 'admin');
CREATE POLICY "tmp_update" ON team_member_pods FOR UPDATE TO authenticated USING (get_my_role() = 'admin');
CREATE POLICY "tmp_delete" ON team_member_pods FOR DELETE TO authenticated USING (get_my_role() = 'admin');

-- Clients: all authenticated can read, admin + strategist + jr_strategist can write
CREATE POLICY "clients_select" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "clients_insert" ON clients FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));
CREATE POLICY "clients_update" ON clients FOR UPDATE TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

-- Client sub-entities: same as clients
CREATE POLICY "channels_select" ON client_channels FOR SELECT TO authenticated USING (true);
CREATE POLICY "channels_all" ON client_channels FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

CREATE POLICY "contacts_select" ON client_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "contacts_all" ON client_contacts FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

CREATE POLICY "assignments_select" ON client_assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "assignments_all" ON client_assignments FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

-- Projects + history: read-all for now, write policies added in Module 2
CREATE POLICY "projects_select" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects_all" ON projects FOR ALL TO authenticated
  USING (get_my_role() IN ('admin', 'strategist', 'jr_strategist'));

CREATE POLICY "history_select" ON project_status_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "history_insert" ON project_status_history FOR INSERT TO authenticated WITH CHECK (true);
```

- [ ] **Step 2: Write seed data**

```sql
-- 003_seed.sql — Development seed data

-- Create admin auth user first (do this in Supabase Dashboard → Auth → Users)
-- Then insert the team_member record linking to that auth user:

-- Pods
INSERT INTO pods (name) VALUES ('Pod 1'), ('Pod 2'), ('Pod 3'), ('Pod 4');

-- You will need to replace 'AUTH_USER_UUID' with the actual auth.users id after creating the admin user.
-- INSERT INTO team_members (auth_user_id, first_name, last_name, email, role)
-- VALUES ('AUTH_USER_UUID', 'Admin', 'User', 'admin@knownlocal.com', 'admin');

-- Sample team members (no auth accounts — for testing display)
INSERT INTO team_members (first_name, last_name, email, role) VALUES
  ('Clayton', 'Test', 'clayton@test.com', 'strategist'),
  ('Paulo', 'Test', 'paulo@test.com', 'manager'),
  ('Maria', 'Test', 'maria@test.com', 'senior_writer'),
  ('Raj', 'Test', 'raj@test.com', 'senior_editor'),
  ('Tess', 'Test', 'tess@test.com', 'designer'),
  ('Marcus', 'Test', 'marcus@test.com', 'writer'),
  ('Sofia', 'Test', 'sofia@test.com', 'writer'),
  ('Leo', 'Test', 'leo@test.com', 'editor');

-- Assign strategist + manager to Pod 1
INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
SELECT tm.id, p.id, true
FROM team_members tm, pods p
WHERE tm.email = 'clayton@test.com' AND p.name = 'Pod 1';

INSERT INTO team_member_pods (team_member_id, pod_id, is_primary)
SELECT tm.id, p.id, true
FROM team_members tm, pods p
WHERE tm.email = 'paulo@test.com' AND p.name = 'Pod 1';

-- Sample clients
INSERT INTO clients (name, market, status, pod_id) VALUES
  ('Acme Co', 'Chicago', 'active', (SELECT id FROM pods WHERE name = 'Pod 1')),
  ('BrightPath Media', 'Austin', 'active', (SELECT id FROM pods WHERE name = 'Pod 2')),
  ('GreenLeaf Health', 'Miami', 'onboarding', (SELECT id FROM pods WHERE name = 'Pod 1'));

-- Sample channels
INSERT INTO client_channels (client_id, channel_name, videos_per_week) VALUES
  ((SELECT id FROM clients WHERE name = 'Acme Co'), 'Acme Official', 2),
  ((SELECT id FROM clients WHERE name = 'Acme Co'), 'Acme Shorts', 1);
```

- [ ] **Step 3: Run migrations in Supabase SQL Editor**

1. Run `002_rls.sql`
2. Run `003_seed.sql`
3. Verify: pods exist, team members exist, clients exist

- [ ] **Step 4: Test full flow end-to-end**

1. Login as admin
2. /pods → 4 pods visible
3. /team → 8 team members visible
4. /clients → 3 clients with status badges and pod tags
5. Click "Acme Co" → detail page with info, 2 channels, 0 contacts
6. Assign Clayton as Strategist → saves
7. Assign Paulo as Manager → saves
8. Add a contact → shows with Primary badge
9. Back to /clients → Strategist column shows "Clayton Test"

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/
git commit -m "feat: add RLS policies and seed data — Module 0+1 complete"
```

---

## Summary

| Task | What | Commit |
|------|------|--------|
| 1 | Next.js + Supabase + shadcn + brand tokens | Module 0 scaffold |
| 2 | Full DDL migration | Database schema |
| 3 | Types + Supabase helpers + constants | App infrastructure |
| 4 | Auth middleware + login page | Authentication |
| 5 | App shell + sidebar + dashboard | Navigation |
| 6 | Pods CRUD | Admin entity |
| 7 | Team Members CRUD | Admin entity |
| 8 | Client List + filters | Client onboarding |
| 9 | Add/Edit Client form | Client onboarding |
| 10 | Client Detail page + info | Client onboarding |
| 11 | Client Channels section | Client sub-entity |
| 12 | Client Contacts section | Client sub-entity |
| 13 | Client Assignments (team picker) | Client sub-entity |
| 14 | RLS + Seed data | Security + dev data |

**After completing all 14 tasks:** Module 0 + Module 1 are done. The app has auth, navigation, full client onboarding with all sub-entities, and basic RLS. Ready for Module 2 (Production Pipeline + Kanban).
