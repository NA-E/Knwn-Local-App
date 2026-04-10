'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClientAction, updateClientAction } from '@/lib/actions/clients'
import { CLIENT_STATUS_LABELS } from '@/lib/constants/status'
import { OnboardingModal } from '@/components/clients/onboarding-modal'
import { upsertAssignment } from '@/lib/actions/client-assignments'
import { ASSIGNMENT_ROLE_LABELS, ASSIGNMENT_ROLE_ELIGIBLE_TEAM_ROLES } from '@/lib/constants/roles'
import type { AssignmentRole, TeamRole } from '@/lib/types'

interface ClientFormProps {
  client?: any
  pods: { id: string; name: string; clientCount: number }[]
  podTeamDefaults?: Record<string, { strategistId: string | null; managerId: string | null }>
  teamMembers?: { id: string; first_name: string; last_name: string; role: string }[]
  initialAssignments?: Record<string, string>
}

const POD_CAPACITY = 20

const FORM_ASSIGNMENT_ROLES: AssignmentRole[] = [
  'strategist', 'manager', 'senior_editor', 'editor', 'designer', 'senior_designer', 'senior_writer',
]

export function ClientForm({ client, pods, podTeamDefaults, teamMembers, initialAssignments }: ClientFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [onboardingClientId, setOnboardingClientId] = useState<string | null>(null)
  const [onboardingClientName, setOnboardingClientName] = useState<string | null>(null)
  const [assignments, setAssignments] = useState<Record<string, string>>(initialAssignments ?? {})
  const [selectedPodId, setSelectedPodId] = useState<string>(client?.pod_id ?? '')
  const isEdit = !!client

  async function handleSubmit(formData: FormData) {
    setError(null)
    if (isEdit) {
      const result = await updateClientAction(client.id, formData)
      if (result?.error) { setError(result.error); return }

      // Save team assignments
      const assignmentErrors: string[] = []
      for (const [role, memberId] of Object.entries(assignments)) {
        const res = await upsertAssignment(client.id, role as AssignmentRole, memberId || null)
        if (res.error) assignmentErrors.push(`${role}: ${res.error}`)
      }
      if (assignmentErrors.length) {
        setError(`Client saved but team assignment errors: ${assignmentErrors.join(', ')}`)
        return
      }

      router.push(`/clients/${client.id}`)
    } else {
      const result = await createClientAction(formData)
      if (result?.error) { setError(result.error); return }

      // Save team assignments
      const assignmentErrors: string[] = []
      for (const [role, memberId] of Object.entries(assignments)) {
        if (memberId) {
          const res = await upsertAssignment(result.id!, role as AssignmentRole, memberId)
          if (res.error) assignmentErrors.push(`${role}: ${res.error}`)
        }
      }
      if (assignmentErrors.length) {
        setError(`Client created but team assignment errors: ${assignmentErrors.join(', ')}`)
      }

      // Open onboarding modal and fire off onboarding
      const clientName = (formData.get('name') as string) ?? ''
      setOnboardingClientId(result.id)
      setOnboardingClientName(clientName)

      // Fire-and-forget POST to start onboarding
      fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: result.id }),
      }).catch(err => console.error('Failed to start onboarding:', err))
    }
  }

  function field(name: string, label: string, type = 'text', opts?: { textarea?: boolean }) {
    const value = client?.[name] ?? ''
    return (
      <div>
        <Label htmlFor={name} className="text-xs font-medium text-muted-foreground">{label}</Label>
        {opts?.textarea ? (
          <textarea id={name} name={name} defaultValue={value} rows={3}
            className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card resize-none" />
        ) : (
          <Input id={name} name={name} type={type} defaultValue={value} className="mt-1.5" />
        )}
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-5">
      {/* Header fields — always visible at top */}
      <div className="grid grid-cols-2 gap-4">
        {field('name', 'Client Name *')}
        <div>
          <Label htmlFor="status" className="text-xs font-medium text-muted-foreground">Status</Label>
          <select id="status" name="status" defaultValue={client?.status ?? 'onboarding'}
            className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
            {Object.entries(CLIENT_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pod cards */}
      <div className="col-span-2">
        <Label className="text-xs font-medium text-muted-foreground mb-2 block">Pod</Label>
        <input type="hidden" name="pod_id" value={selectedPodId} />
        <div className="flex gap-2 flex-wrap">
          {/* No pod option */}
          <button
            type="button"
            onClick={() => {
              setSelectedPodId('')
              setAssignments(prev => {
                const next = { ...prev }
                delete next.strategist
                delete next.manager
                return next
              })
            }}
            className={`px-3 py-2 rounded-[8px] border text-[12px] font-medium transition-colors ${
              selectedPodId === '' ? 'border-brand-accent bg-brand-accent/10 text-brand-text-1' : 'border-border text-muted-foreground hover:border-brand-text-3'
            }`}
          >
            No pod
          </button>
          {pods.map(pod => {
            const pct = Math.min((pod.clientCount / POD_CAPACITY) * 100, 100)
            const isSelected = selectedPodId === pod.id
            return (
              <button
                key={pod.id}
                type="button"
                onClick={() => {
                  setSelectedPodId(pod.id)
                  if (podTeamDefaults?.[pod.id]) {
                    const defaults = podTeamDefaults[pod.id]
                    setAssignments(prev => ({
                      ...prev,
                      ...(defaults.strategistId ? { strategist: defaults.strategistId } : {}),
                      ...(defaults.managerId ? { manager: defaults.managerId } : {}),
                    }))
                  }
                }}
                className={`flex flex-col items-start px-3 py-2 rounded-[8px] border min-w-[100px] transition-colors ${
                  isSelected ? 'border-brand-accent bg-brand-accent/10' : 'border-border hover:border-brand-text-3'
                }`}
              >
                <span className={`text-[12px] font-medium ${isSelected ? 'text-brand-text-1' : 'text-muted-foreground'}`}>{pod.name}</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{pod.clientCount} / {POD_CAPACITY} clients</span>
                {/* Capacity bar */}
                <div className="w-full h-1 bg-border rounded-full mt-1.5">
                  <div
                    className={`h-1 rounded-full transition-all ${pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-amber-400' : 'bg-[#6BBF8E]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2-column card layout mirroring detail view */}
      <div className="grid grid-cols-2 gap-5">
        {/* Client Info card — mirrors ClientInfoSection */}
        <div className="bg-card border border-border rounded-[10px] p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D] mb-3">Client Info</div>
          <div className="space-y-3">
            {field('package', 'Package')}
            {field('contract_start_date', 'Contract Start', 'date')}
            {field('posting_schedule', 'Posting Schedule')}
            <div>
              <Label htmlFor="script_format" className="text-xs font-medium text-muted-foreground">Script Format</Label>
              <select id="script_format" name="script_format" defaultValue={client?.script_format ?? ''}
                className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
                <option value="">—</option>
                <option value="word_for_word">Word for Word</option>
                <option value="outline">Outline</option>
              </select>
            </div>
            <div>
              <Label htmlFor="communication_method" className="text-xs font-medium text-muted-foreground">Communication</Label>
              <select id="communication_method" name="communication_method" defaultValue={client?.communication_method ?? ''}
                className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
                <option value="">—</option>
                <option value="slack">Slack</option>
                <option value="email">Email</option>
                <option value="other">Other</option>
              </select>
            </div>
            {field('special_instructions', 'Special Notes', 'text', { textarea: true })}
          </div>
        </div>

        {/* Details card — market, timezone, links */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-[10px] p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D] mb-3">Details</div>
            <div className="space-y-3">
              {field('market', 'Market')}
              {field('timezone', 'Timezone')}
            </div>
          </div>

          <div className="bg-card border border-border rounded-[10px] p-5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D] mb-3">Links</div>
            <div className="space-y-3">
              {field('website', 'Website', 'url')}
              {field('youtube_channel_url', 'YouTube Channel', 'url')}
              {field('slack_channel_url', 'Slack Channel', 'url')}
            </div>
          </div>
        </div>
      </div>

      {/* Team Assignment section */}
      {teamMembers && teamMembers.length > 0 && (
        <div className="bg-card border border-border rounded-[10px] p-5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D] mb-3">Team</div>
          <div className="grid grid-cols-2 gap-3">
            {FORM_ASSIGNMENT_ROLES.map((role) => {
              const eligible = teamMembers.filter(tm =>
                ASSIGNMENT_ROLE_ELIGIBLE_TEAM_ROLES[role].includes(tm.role as TeamRole)
              )
              return (
                <div key={role}>
                  <Label className="text-xs font-medium text-muted-foreground">{ASSIGNMENT_ROLE_LABELS[role]}</Label>
                  <select
                    value={assignments[role] ?? ''}
                    onChange={(e) => setAssignments(prev => ({ ...prev, [role]: e.target.value }))}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm bg-card"
                  >
                    <option value="">— Unassigned —</option>
                    {eligible.map(tm => (
                      <option key={tm.id} value={tm.id}>{tm.first_name} {tm.last_name}</option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit">{isEdit ? 'Save Changes' : 'Create Client'}</Button>
      </div>

      {onboardingClientId && onboardingClientName && (
        <OnboardingModal
          clientId={onboardingClientId}
          clientName={onboardingClientName}
          open={!!onboardingClientId}
          onOpenChange={(open) => {
            if (!open) {
              setOnboardingClientId(null)
              setOnboardingClientName(null)
            }
          }}
        />
      )}
    </form>
  )
}
