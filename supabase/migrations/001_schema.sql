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
