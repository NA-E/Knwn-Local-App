import type { TeamRole, ProjectStatus } from '@/lib/types'

/** Which columns (statuses) each role sees on their "My Board" */
export const BOARD_COLUMNS: Record<TeamRole, ProjectStatus[]> = {
  writer: ['scriptwriting', 'fix_script'],
  editor: ['client_uploaded', 'editing', 'ready_for_internal_review', 'internal_adjustments_needed', 'client_adjustments_needed'],
  senior_writer: ['review_script'],
  senior_editor: ['ready_for_internal_review'],
  manager: ['script_ready_to_send', 'script_sent_to_client', 'edit_ready_to_send', 'edit_sent_to_client', 'ready_to_post'],
  designer: ['editing', 'ready_for_internal_review', 'edit_ready_to_send'],
  senior_designer: ['editing', 'ready_for_internal_review'],
  strategist: [
    'idea', 'on_hold', 'brief', 'scriptwriting', 'review_script', 'fix_script',
    'script_ready_to_send', 'script_sent_to_client', 'client_uploaded',
    'editing', 'ready_for_internal_review', 'internal_adjustments_needed',
    'edit_ready_to_send', 'edit_sent_to_client', 'client_adjustments_needed',
    'ready_to_post', 'posted_scheduled',
  ],
  jr_strategist: [
    'idea', 'on_hold', 'brief', 'scriptwriting', 'review_script', 'fix_script',
    'script_ready_to_send', 'script_sent_to_client', 'client_uploaded',
    'editing', 'ready_for_internal_review', 'internal_adjustments_needed',
    'edit_ready_to_send', 'edit_sent_to_client', 'client_adjustments_needed',
    'ready_to_post', 'posted_scheduled',
  ],
  admin: [
    'idea', 'on_hold', 'brief', 'scriptwriting', 'review_script', 'fix_script',
    'script_ready_to_send', 'script_sent_to_client', 'client_uploaded',
    'editing', 'ready_for_internal_review', 'internal_adjustments_needed',
    'edit_ready_to_send', 'edit_sent_to_client', 'client_adjustments_needed',
    'ready_to_post', 'posted_scheduled', 'cancelled',
  ],
}

/**
 * How each role's board filters projects.
 * - 'writer_id' / 'editor_id': match project's writer/editor to current user
 * - 'assignment:ROLE': join client_assignments where assignment_role = ROLE
 * - 'supervised_by': join team_members where supervised_by = current user, then match writer/editor
 * - 'all': no filter (admin, strategist see everything for their assigned clients)
 */
export type BoardFilterType =
  | { kind: 'field'; field: 'writer_id' | 'editor_id' }
  | { kind: 'assignment'; role: string }
  | { kind: 'supervised_by'; targetField: 'writer_id' | 'editor_id' }
  | { kind: 'all' }

export const BOARD_FILTERS: Record<TeamRole, BoardFilterType> = {
  writer: { kind: 'field', field: 'writer_id' },
  editor: { kind: 'field', field: 'editor_id' },
  senior_writer: { kind: 'supervised_by', targetField: 'writer_id' },
  senior_editor: { kind: 'supervised_by', targetField: 'editor_id' },
  manager: { kind: 'assignment', role: 'manager' },
  designer: { kind: 'assignment', role: 'designer' },
  senior_designer: { kind: 'assignment', role: 'senior_designer' },
  strategist: { kind: 'assignment', role: 'strategist' },
  jr_strategist: { kind: 'assignment', role: 'strategist' }, // jr_strategist uses strategist assignment slot
  admin: { kind: 'all' },
}

/** Friendly label for each role's board header */
export const BOARD_LABELS: Record<TeamRole, string> = {
  writer: 'Writer',
  editor: 'Editor',
  senior_writer: 'Senior Writer',
  senior_editor: 'Senior Editor',
  manager: 'Manager',
  designer: 'Designer',
  senior_designer: 'Senior Designer',
  strategist: 'Strategist',
  jr_strategist: 'Jr Strategist',
  admin: 'Admin',
}
