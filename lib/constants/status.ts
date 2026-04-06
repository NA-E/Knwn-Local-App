import type { ProjectStatus, DesignStatus, ClientStatus, TeamRole } from '@/lib/types'

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

// --- Status Groups (BUG-30) ---

export type StatusGroup = 'todo' | 'pre_production' | 'production' | 'post_production' | 'complete'

export const STATUS_GROUPS: Record<StatusGroup, string> = {
  todo: 'To-Do',
  pre_production: 'Pre-Production',
  production: 'Production',
  post_production: 'Post-Production',
  complete: 'Complete',
}

export const STATUS_TO_GROUP: Record<ProjectStatus, StatusGroup> = {
  idea: 'todo',
  on_hold: 'todo',
  brief: 'pre_production',
  scriptwriting: 'pre_production',
  review_script: 'pre_production',
  fix_script: 'pre_production',
  script_ready_to_send: 'pre_production',
  script_sent_to_client: 'pre_production',
  client_uploaded: 'production',
  editing: 'production',
  ready_for_internal_review: 'production',
  internal_adjustments_needed: 'production',
  edit_ready_to_send: 'production',
  edit_sent_to_client: 'production',
  client_adjustments_needed: 'production',
  ready_to_post: 'post_production',
  posted_scheduled: 'complete',
}

export const STATUS_GROUP_COLORS: Record<StatusGroup, string> = {
  todo: 'bg-gray-100 text-gray-700',
  pre_production: 'bg-blue-50 text-blue-700',
  production: 'bg-amber-50 text-amber-700',
  post_production: 'bg-green-50 text-green-700',
  complete: 'bg-purple-50 text-purple-700',
}

// --- Status Transitions (BUG-29) ---

export interface StatusTransition {
  to: ProjectStatus
  roles: TeamRole[]
}

export const STATUS_TRANSITIONS: Record<ProjectStatus, StatusTransition[]> = {
  idea: [
    { to: 'brief', roles: ['strategist', 'jr_strategist', 'admin'] },
    { to: 'on_hold', roles: ['strategist', 'jr_strategist', 'admin'] },
  ],
  on_hold: [
    { to: 'idea', roles: ['strategist', 'jr_strategist', 'admin'] },
    { to: 'brief', roles: ['strategist', 'jr_strategist', 'admin'] },
  ],
  brief: [
    { to: 'scriptwriting', roles: ['strategist', 'jr_strategist', 'admin'] },
  ],
  scriptwriting: [
    { to: 'review_script', roles: ['writer', 'jr_strategist', 'admin'] },
  ],
  review_script: [
    { to: 'script_ready_to_send', roles: ['senior_writer', 'jr_strategist', 'admin'] },
    { to: 'fix_script', roles: ['senior_writer', 'jr_strategist', 'admin'] },
  ],
  fix_script: [
    { to: 'review_script', roles: ['writer', 'jr_strategist', 'admin'] },
  ],
  script_ready_to_send: [
    { to: 'script_sent_to_client', roles: ['manager', 'jr_strategist', 'admin'] },
  ],
  script_sent_to_client: [
    { to: 'client_uploaded', roles: ['manager', 'jr_strategist', 'admin'] },
  ],
  client_uploaded: [
    { to: 'editing', roles: ['editor', 'jr_strategist', 'admin'] },
  ],
  editing: [
    { to: 'ready_for_internal_review', roles: ['editor', 'jr_strategist', 'admin'] },
  ],
  ready_for_internal_review: [
    { to: 'edit_ready_to_send', roles: ['senior_editor', 'jr_strategist', 'admin'] },
    { to: 'internal_adjustments_needed', roles: ['senior_editor', 'jr_strategist', 'admin'] },
  ],
  internal_adjustments_needed: [
    { to: 'ready_for_internal_review', roles: ['editor', 'jr_strategist', 'admin'] },
  ],
  edit_ready_to_send: [
    { to: 'edit_sent_to_client', roles: ['manager', 'jr_strategist', 'admin'] },
  ],
  edit_sent_to_client: [
    { to: 'client_adjustments_needed', roles: ['manager', 'jr_strategist', 'admin'] },
    { to: 'ready_to_post', roles: ['manager', 'jr_strategist', 'admin'] },
  ],
  client_adjustments_needed: [
    { to: 'editing', roles: ['editor', 'jr_strategist', 'admin'] },
  ],
  ready_to_post: [
    { to: 'posted_scheduled', roles: ['manager', 'jr_strategist', 'admin'] },
  ],
  posted_scheduled: [],
}
