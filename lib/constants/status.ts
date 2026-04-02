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
