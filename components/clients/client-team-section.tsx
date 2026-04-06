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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!editing) return
    let ignore = false
    setEligible([])
    setLoading(true)
    getEligibleMembers(editing)
      .then((data) => {
        if (!ignore) setEligible(data)
      })
      .catch((err) => {
        console.error('Failed to load eligible members:', err)
        if (!ignore) setEligible([])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => { ignore = true }
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
              {editing === role ? (
                <select
                  autoFocus
                  defaultValue={member?.id ?? ''}
                  onChange={(e) => handleAssign(role, e.target.value)}
                  onBlur={() => setEditing(null)}
                  className="px-2 py-1 border border-border rounded text-[12px] bg-card"
                >
                  {loading ? (
                    <option disabled>Loading…</option>
                  ) : (
                    <>
                      <option value="">— None —</option>
                      {eligible.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                      ))}
                    </>
                  )}
                </select>
              ) : (
                <button
                  onClick={() => setEditing(role)}
                  className={`text-[12.5px] ${member ? 'font-medium' : 'text-[#A8A59D] italic'} hover:underline`}
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
