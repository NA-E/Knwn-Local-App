'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/constants/roles'
import type { TeamRole } from '@/lib/types'

interface PodMember {
  id: string
  first_name: string
  last_name: string
  role: TeamRole
  status: string
  is_primary: boolean
}

export interface PodWithMembers {
  id: string
  name: string
  members: PodMember[]
}

interface PodsLayoutProps {
  pods: PodWithMembers[]
}

export function PodsLayout({ pods }: PodsLayoutProps) {
  const [selectedPodId, setSelectedPodId] = useState<string | null>(
    pods.length > 0 ? pods[0].id : null
  )

  const selectedPod = pods.find((p) => p.id === selectedPodId) ?? null

  return (
    <div className="flex gap-0 border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--bg-panel)]" style={{ minHeight: '480px' }}>
      {/* Left: Pod list */}
      <div className="w-[280px] shrink-0 border-r border-[var(--border)] flex flex-col">
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)]">
            Pods
          </span>
        </div>

        {pods.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-4">
            <p className="text-[12px] text-[var(--text-3)] text-center">No pods created yet.</p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {pods.map((pod) => {
              const isActive = pod.id === selectedPodId
              return (
                <li key={pod.id}>
                  <button
                    onClick={() => setSelectedPodId(pod.id)}
                    className="w-full text-left px-4 py-3 border-b border-[var(--border-light)] last:border-0 transition-colors flex items-center justify-between group"
                    style={{
                      background: isActive ? 'var(--accent-bg)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#FAFAF7'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                    }}
                  >
                    <span
                      className="text-[13px] font-medium truncate"
                      style={{ color: isActive ? 'var(--accent)' : 'var(--text-1)' }}
                    >
                      {pod.name}
                    </span>
                    <span
                      className="text-[11px] font-medium ml-2 shrink-0 flex items-center gap-1"
                      style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)' }}
                    >
                      <Users className="w-3 h-3" />
                      {pod.members.length}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Right: Detail panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {selectedPod ? (
          <>
            {/* Detail header */}
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)] flex items-baseline justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--text-1)]">{selectedPod.name}</h2>
                <span className="text-[12px] text-[var(--text-3)]">
                  {selectedPod.members.length} {selectedPod.members.length === 1 ? 'member' : 'members'}
                </span>
              </div>
            </div>

            {/* Member list */}
            <div className="flex-1 overflow-y-auto">
              {selectedPod.members.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8 py-12">
                  <Users className="w-8 h-8 text-[var(--text-3)]" />
                  <p className="text-[13px] text-[var(--text-2)]">No team members assigned to this pod.</p>
                </div>
              ) : (
                <>
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_160px_80px] px-6 py-2.5 border-b border-[var(--border)] bg-[var(--bg)]">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)]">Name</span>
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)]">Role</span>
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)]">Status</span>
                  </div>

                  {/* Member rows */}
                  {selectedPod.members.map((member) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-[1fr_160px_80px] items-center px-6 py-3 border-b border-[var(--border-light)] last:border-0 transition-colors"
                      style={{ background: 'transparent' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#FAFAF7' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[var(--text-1)]">
                          {member.first_name} {member.last_name}
                        </span>
                        {member.is_primary && (
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                          >
                            Primary
                          </span>
                        )}
                      </div>
                      <span className="text-[13px] text-[var(--text-2)]">
                        {ROLE_LABELS[member.role] ?? member.role}
                      </span>
                      <StatusBadge status={member.status} />
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-8">
            <Users className="w-8 h-8 text-[var(--text-3)]" />
            <p className="text-[13px] text-[var(--text-2)]">Select a pod to view its members</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { color: string; background: string }> = {
    active: { color: '#1A6B40', background: '#D9F5E8' },
    inactive: { color: '#68655E', background: '#EEEBE3' },
  }
  const s = styles[status] ?? styles.inactive
  return (
    <span
      className="text-[11px] font-medium px-2 py-0.5 rounded capitalize"
      style={{ color: s.color, background: s.background }}
    >
      {status}
    </span>
  )
}
