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
