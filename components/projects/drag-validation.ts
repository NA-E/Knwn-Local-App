import type { ProjectWithRelations, ProjectStatus, TeamRole } from '@/lib/types'
import { STATUS_TRANSITIONS, PROJECT_STATUS_LABELS } from '@/lib/constants/status'

export interface DropValidationResult {
  allowed: boolean
  reason?: string
}

/**
 * Validates whether a project can be dropped onto a target status column.
 * Checks both the status machine (valid transitions) and role permissions.
 */
export function canDropProject(
  project: ProjectWithRelations,
  targetStatus: ProjectStatus,
  userRole: TeamRole
): DropValidationResult {
  // No-op if dropping back onto same status
  if (project.status === targetStatus) {
    return { allowed: true }
  }

  const transitions = STATUS_TRANSITIONS[project.status]

  // Find a transition to the target status
  const transition = transitions.find((t) => t.to === targetStatus)

  if (!transition) {
    const fromLabel = PROJECT_STATUS_LABELS[project.status]
    const toLabel = PROJECT_STATUS_LABELS[targetStatus]
    return {
      allowed: false,
      reason: `No direct transition from "${fromLabel}" to "${toLabel}"`,
    }
  }

  // Check if user's role is permitted for this transition
  if (!transition.roles.includes(userRole)) {
    return {
      allowed: false,
      reason: 'Your role cannot make this transition',
    }
  }

  return { allowed: true }
}
