'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2, MinusCircle, RotateCcw } from 'lucide-react'
import type { OnboardingStepName, OnboardingStepStatus } from '@/lib/types'

interface OnboardingModalProps {
  clientId: string
  clientName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Step display configuration — order matters
const STEP_CONFIG: Array<{
  key: OnboardingStepName
  pendingLabel: string
  successLabel: string
}> = [
  { key: 'slack_channel', pendingLabel: 'Creating Slack channel', successLabel: 'Slack channel created' },
  { key: 'dropbox_folder', pendingLabel: 'Creating Dropbox folder', successLabel: 'Dropbox folder created' },
  { key: 'gdrive_folder', pendingLabel: 'Creating Google Drive folder', successLabel: 'Google Drive folder created' },
  { key: 'slack_invite', pendingLabel: 'Inviting to Slack', successLabel: 'Invited to Slack' },
  { key: 'welcome_message', pendingLabel: 'Sending welcome message', successLabel: 'Welcome message sent' },
  { key: 'team_notify', pendingLabel: 'Notifying team', successLabel: 'Team notified' },
]

type StepStatuses = Record<OnboardingStepName, {
  status: OnboardingStepStatus
  error_message: string | null
}>

const INITIAL_STATUSES: StepStatuses = {
  slack_channel: { status: 'pending', error_message: null },
  dropbox_folder: { status: 'pending', error_message: null },
  gdrive_folder: { status: 'pending', error_message: null },
  slack_invite: { status: 'pending', error_message: null },
  welcome_message: { status: 'pending', error_message: null },
  team_notify: { status: 'pending', error_message: null },
}

export function OnboardingModal({ clientId, clientName, open, onOpenChange }: OnboardingModalProps) {
  const router = useRouter()
  const [steps, setSteps] = useState<StepStatuses>({ ...INITIAL_STATUSES })
  const [retrying, setRetrying] = useState<string | null>(null)
  const [stalled, setStalled] = useState(false)
  const retryingRef = useRef(retrying)
  retryingRef.current = retrying

  // Check if all steps are resolved (not pending or running)
  const allResolved = Object.values(steps).every(
    s => s.status !== 'pending' && s.status !== 'running'
  )
  const hasFailures = Object.values(steps).some(s => s.status === 'failed')

  // Stall timer: show close button if no progress after 30 seconds
  useEffect(() => {
    if (!open || allResolved) {
      setStalled(false)
      return
    }
    const timer = setTimeout(() => setStalled(true), 30_000)
    return () => clearTimeout(timer)
  }, [open, allResolved, steps])

  // Subscribe to realtime updates, then fetch initial state to catch up
  useEffect(() => {
    if (!open) return

    const supabase = createClient()

    // Subscribe FIRST so we don't miss updates between fetch and subscribe
    const channel = supabase
      .channel(`onboarding-${clientId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'onboarding_steps',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          const row = payload.new as {
            step: OnboardingStepName
            status: OnboardingStepStatus
            error_message: string | null
          }
          setSteps(prev => ({
            ...prev,
            [row.step]: {
              status: row.status,
              error_message: row.error_message,
            },
          }))
          if (retryingRef.current === row.step) {
            setRetrying(null)
          }
        }
      )
      .subscribe(async (status) => {
        // Once subscribed, fetch current state to catch any steps completed before subscription
        if (status === 'SUBSCRIBED') {
          const { data } = await supabase
            .from('onboarding_steps')
            .select('step, status, error_message')
            .eq('client_id', clientId)

          if (data && data.length > 0) {
            setSteps(prev => {
              const updated = { ...prev }
              for (const row of data) {
                const stepName = row.step as OnboardingStepName
                if (stepName in updated) {
                  updated[stepName] = {
                    status: row.status as OnboardingStepStatus,
                    error_message: row.error_message,
                  }
                }
              }
              return updated
            })
          }
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [open, clientId])

  async function handleRetry(step: OnboardingStepName) {
    setRetrying(step)
    // Optimistically reset the step display to running
    setSteps(prev => ({
      ...prev,
      [step]: { status: 'running', error_message: null },
    }))

    // Also reset dependents in UI
    if (step === 'slack_channel') {
      setSteps(prev => ({
        ...prev,
        slack_channel: { status: 'running', error_message: null },
        slack_invite: { status: 'pending', error_message: null },
        welcome_message: { status: 'pending', error_message: null },
      }))
    }

    try {
      await fetch('/api/onboard/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, step }),
      })
    } catch (err) {
      console.error('Retry request failed:', err)
      setRetrying(null)
    }
  }

  function handleContinue() {
    onOpenChange(false)
    router.push(`/clients/${clientId}`)
  }

  function renderStepIcon(status: OnboardingStepStatus) {
    switch (status) {
      case 'pending':
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-brand-text-3" />
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-status-active-text" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'skipped':
        return <MinusCircle className="h-4 w-4 text-brand-text-3" />
    }
  }

  function renderStepLabel(config: typeof STEP_CONFIG[number], status: OnboardingStepStatus) {
    switch (status) {
      case 'success':
        return config.successLabel
      case 'failed':
        return `${config.pendingLabel} — failed`
      case 'skipped':
        return `${config.successLabel} — skipped`
      default:
        return config.pendingLabel
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={allResolved || stalled}
      >
        <DialogHeader>
          <DialogTitle>Setting up {clientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Static: Client record created */}
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-status-active-text flex-shrink-0" />
            <span className="text-[13px] text-brand-text-1">Client record created</span>
          </div>

          {/* Dynamic onboarding steps */}
          {STEP_CONFIG.map(config => {
            const stepState = steps[config.key]
            return (
              <div key={config.key} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {renderStepIcon(stepState.status)}
                </div>
                <span className={`text-[13px] flex-1 ${
                  stepState.status === 'failed' ? 'text-red-600' :
                  stepState.status === 'skipped' ? 'text-brand-text-3' :
                  stepState.status === 'success' ? 'text-brand-text-1' :
                  'text-brand-text-2'
                }`}>
                  {renderStepLabel(config, stepState.status)}
                </span>
                {stepState.status === 'failed' && retrying !== config.key && (
                  <button
                    onClick={() => handleRetry(config.key)}
                    className="flex items-center gap-1 text-[11px] font-medium text-brand-accent hover:opacity-80 transition-opacity"
                    title={stepState.error_message ?? 'Retry this step'}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Retry
                  </button>
                )}
                {stepState.status === 'skipped' && stepState.error_message && (
                  <span className="text-[11px] text-brand-text-3" title={stepState.error_message}>
                    ({stepState.error_message})
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {allResolved && (
          <DialogFooter>
            {hasFailures && (
              <span className="text-[12px] text-brand-text-3 mr-auto self-center">
                Some steps failed. You can retry them later from the client page.
              </span>
            )}
            <Button onClick={handleContinue}>
              Continue
            </Button>
          </DialogFooter>
        )}

        {!allResolved && stalled && (
          <DialogFooter>
            <span className="text-[12px] text-brand-text-3 mr-auto self-center">
              Onboarding is taking longer than expected.
            </span>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
