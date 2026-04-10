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
  function getMemberForRole(role: AssignmentRole) {
    const a = assignments.find((a) => a.assignment_role === role)
    if (!a?.team_members) return null
    return a.team_members
  }

  return (
    <div className="bg-card border border-border rounded-[10px] p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D]">Team</div>
      </div>

      <div className="space-y-1">
        {ALL_ASSIGNMENT_ROLES.map((role) => {
          const member = getMemberForRole(role)
          return (
            <div key={role} className="flex justify-between items-center text-[12.5px] py-1.5 border-b border-[#EDEAE2] last:border-b-0">
              <span className="text-muted-foreground">{ASSIGNMENT_ROLE_LABELS[role]}</span>
              <span className={`text-[12.5px] ${member ? 'font-medium' : 'text-[#A8A59D] italic'}`}>
                {member ? `${member.first_name} ${member.last_name}` : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
