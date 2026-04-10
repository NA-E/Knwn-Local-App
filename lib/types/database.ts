export type TeamRole =
  | 'admin' | 'strategist' | 'jr_strategist' | 'manager'
  | 'senior_editor' | 'senior_writer' | 'senior_designer'
  | 'editor' | 'writer' | 'designer' | 'virtual_assistant'

export type ClientStatus =
  | 'template' | 'onboarding' | 'active' | 'disengaged' | 'pending' | 'inactive'

export type ProjectStatus =
  | 'idea' | 'on_hold' | 'brief' | 'scriptwriting' | 'review_script' | 'fix_script'
  | 'script_ready_to_send' | 'script_sent_to_client' | 'client_uploaded'
  | 'editing' | 'ready_for_internal_review' | 'internal_adjustments_needed'
  | 'edit_ready_to_send' | 'edit_sent_to_client' | 'client_adjustments_needed'
  | 'ready_to_post' | 'posted_scheduled' | 'cancelled'

export type DesignStatus = 'not_started' | 'in_progress' | 'completed'
export type ScriptFormat = 'word_for_word' | 'outline'
export type CommMethod = 'slack' | 'email' | 'other'
export type TeamMemberStatus = 'active' | 'inactive' | 'onboarding' | 'contract_paused' | 'offboarded'

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
  status: TeamMemberStatus
  phone: string | null
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
  portal_token: string | null
  portal_token_expires_at: string | null
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
  edit_due: string | null
  publish_due: string | null
  actual_post_date: string | null
  script_url: string | null
  edit_url: string | null
  thumbnail_url: string | null
  edit_version: number
  design_status: DesignStatus
  last_status_change_at: string
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
  notes: string | null
  changed_at: string
}

/** Project with joined relation names — used by Kanban board and detail pages */
export interface ProjectWithRelations extends Project {
  client_name: string
  writer_name: string | null
  editor_name: string | null
  pod_id: string | null
  pod_name: string | null
}

// Onboarding types

export type OnboardingStepName =
  | 'slack_channel' | 'dropbox_folder' | 'gdrive_folder'
  | 'slack_invite' | 'welcome_message' | 'team_notify'

export type OnboardingStepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'

export interface OnboardingStep {
  id: string
  client_id: string
  step: OnboardingStepName
  status: OnboardingStepStatus
  result_data: Record<string, unknown> | null
  error_message: string | null
  completed_at: string | null
  created_at: string
}
