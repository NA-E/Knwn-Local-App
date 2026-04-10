'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTeamMember, updateTeamMember } from '@/lib/actions/team-members'
import { ROLE_LABELS } from '@/lib/constants/roles'
import type { TeamMember, TeamRole, Pod } from '@/lib/types'

interface TeamMemberFormProps {
  member?: any
  pods: Pod[]
  supervisors?: TeamMember[]
}

export function TeamMemberForm({ member, pods, supervisors }: TeamMemberFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [selectedPods, setSelectedPods] = useState<string[]>(
    member?.team_member_pods?.map((tmp: any) => tmp.pod_id) ?? []
  )
  const isEdit = !!member

  async function handleSubmit(formData: FormData) {
    setError(null)
    selectedPods.forEach((id) => formData.append('pod_ids', id))

    const result = isEdit
      ? await updateTeamMember(member.id, formData)
      : await createTeamMember(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push('/team')
    }
  }

  return (
    <form action={handleSubmit} className="max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" name="first_name" defaultValue={member?.first_name ?? ''} required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" name="last_name" defaultValue={member?.last_name ?? ''} required className="mt-1.5" />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={member?.email ?? ''} required className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={member?.phone ?? ''} className="mt-1.5" />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <select id="role" name="role" defaultValue={member?.role ?? 'writer'} required
          className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
          {(Object.entries(ROLE_LABELS) as [TeamRole, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {isEdit && (
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue={member?.status ?? 'active'}
            className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="onboarding">Onboarding</option>
            <option value="contract_paused">Contract Paused</option>
            <option value="offboarded">Offboarded</option>
          </select>
        </div>
      )}

      <div>
        <Label>Pod Assignments</Label>
        <div className="mt-1.5 space-y-2">
          {pods.map((pod) => (
            <label key={pod.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedPods.includes(pod.id)}
                onChange={(e) =>
                  setSelectedPods((prev) =>
                    e.target.checked ? [...prev, pod.id] : prev.filter((id) => id !== pod.id)
                  )
                }
              />
              {pod.name}
            </label>
          ))}
        </div>
        {selectedPods.length > 1 && (
          <div className="mt-2">
            <Label htmlFor="primary_pod_id">Primary Pod</Label>
            <select id="primary_pod_id" name="primary_pod_id"
              key={selectedPods.join(',')}
              defaultValue={member?.team_member_pods?.find((p: any) => p.is_primary)?.pod_id ?? ''}
              className="mt-1 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
              {selectedPods.map((pid) => {
                const pod = pods.find((p) => p.id === pid)
                return <option key={pid} value={pid}>{pod?.name}</option>
              })}
            </select>
          </div>
        )}
      </div>

      {supervisors && supervisors.length > 0 && (
        <div>
          <Label htmlFor="supervised_by">Supervised By</Label>
          <select id="supervised_by" name="supervised_by" defaultValue={member?.supervised_by ?? ''}
            className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
            <option value="">None</option>
            {supervisors.map((s) => (
              <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push('/team')}>Cancel</Button>
        <Button type="submit">{isEdit ? 'Save Changes' : 'Create Member'}</Button>
      </div>
    </form>
  )
}
