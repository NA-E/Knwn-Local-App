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
  virtual_assistant: 'Virtual Assistant',
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
