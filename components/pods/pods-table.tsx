'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/constants/roles'
import type { TeamRole } from '@/lib/types'

interface PodMember {
  id: string
  first_name: string
  last_name: string
  role: string
  status: string
}

interface PodWithMembers {
  id: string
  name: string
  clientCount: number
  memberCount: number
  members: PodMember[]
}

interface PodsTableProps {
  pods: PodWithMembers[]
}

export function PodsTable({ pods }: PodsTableProps) {
  const [selectedPod, setSelectedPod] = useState<PodWithMembers | null>(null)

  return (
    <div className="flex gap-4">
      {/* Table */}
      <div className={`transition-all duration-200 ${selectedPod ? 'flex-1 min-w-0' : 'w-full'}`}>
        <div className="bg-card border border-border rounded-[10px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Pod</th>
                <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Members</th>
                <th className="text-left px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Clients</th>
              </tr>
            </thead>
            <tbody>
              {pods.map((pod) => (
                <tr
                  key={pod.id}
                  onClick={() => setSelectedPod(selectedPod?.id === pod.id ? null : pod)}
                  className={`border-b border-border cursor-pointer transition-colors ${
                    selectedPod?.id === pod.id
                      ? 'bg-brand-accent-bg'
                      : 'hover:bg-muted'
                  }`}
                >
                  <td className="px-4 py-3 text-[13px] font-medium">{pod.name}</td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">{pod.memberCount}</td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">{pod.clientCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail sidebar */}
      {selectedPod && (
        <div className="w-[340px] shrink-0">
          <div className="bg-card border border-border rounded-[10px] p-5 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold">{selectedPod.name}</h3>
              <button
                onClick={() => setSelectedPod(null)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-4 mb-5">
              <div className="text-center">
                <div className="text-[18px] font-semibold">{selectedPod.memberCount}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">Members</div>
              </div>
              <div className="text-center">
                <div className="text-[18px] font-semibold">{selectedPod.clientCount}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground">Clients</div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
                Team Members
              </div>

              {selectedPod.members.length === 0 ? (
                <p className="text-[12px] text-muted-foreground">No members assigned to this pod.</p>
              ) : (
                <div className="space-y-2">
                  {selectedPod.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <div>
                        <div className="text-[13px] font-medium">
                          {m.first_name} {m.last_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {ROLE_LABELS[m.role as TeamRole] || m.role}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          m.status === 'active'
                            ? 'bg-status-active-bg text-status-active-text'
                            : 'bg-status-inactive-bg text-status-inactive-text'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
