'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClientAction, updateClientAction } from '@/lib/actions/clients'
import { CLIENT_STATUS_LABELS } from '@/lib/constants/status'
import { OnboardingModal } from '@/components/clients/onboarding-modal'
import type { Pod } from '@/lib/types'

interface ClientFormProps {
  client?: any
  pods: Pod[]
}

export function ClientForm({ client, pods }: ClientFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [onboardingClientId, setOnboardingClientId] = useState<string | null>(null)
  const [onboardingClientName, setOnboardingClientName] = useState<string | null>(null)
  const isEdit = !!client

  async function handleSubmit(formData: FormData) {
    setError(null)
    if (isEdit) {
      const result = await updateClientAction(client.id, formData)
      if (result?.error) { setError(result.error); return }
      router.push(`/clients/${client.id}`)
    } else {
      const result = await createClientAction(formData)
      if (result?.error) { setError(result.error); return }

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
    <form action={handleSubmit} className="max-w-xl space-y-4">
      {field('name', 'Client Name *')}

      <div className="grid grid-cols-2 gap-4">
        {field('market', 'Market')}
        {field('timezone', 'Timezone')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pod_id" className="text-xs font-medium text-muted-foreground">Pod</Label>
          <select id="pod_id" name="pod_id" defaultValue={client?.pod_id ?? ''}
            className="mt-1.5 w-full px-3 py-2 border border-border rounded-md text-sm bg-card">
            <option value="">No pod</option>
            {pods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        {field('package', 'Package')}
        {field('contract_start_date', 'Contract Start Date', 'date')}
      </div>

      {field('posting_schedule', 'Posting Schedule')}

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {field('website', 'Website URL', 'url')}
      {field('youtube_channel_url', 'YouTube Channel URL', 'url')}
      {field('dropbox_upload_url', 'Dropbox Upload URL', 'url')}
      {field('broll_library_url', 'B-Roll Library URL', 'url')}
      {field('slack_channel_url', 'Slack Channel URL', 'url')}
      {field('special_instructions', 'Special Instructions', 'text', { textarea: true })}

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
