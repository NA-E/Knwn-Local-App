'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, MinusCircle, RotateCcw } from 'lucide-react'
import type { OnboardingStep, OnboardingStepName } from '@/lib/types'

const STEP_LABELS: Record<OnboardingStepName, string> = {
  slack_channel: 'Slack channel',
  dropbox_folder: 'Dropbox folder',
  gdrive_folder: 'Google Drive folder',
  slack_invite: 'Slack invite',
  welcome_message: 'Welcome message',
  team_notify: 'Team notification',
}

const STEP_ORDER: OnboardingStepName[] = [
  'slack_channel', 'dropbox_folder', 'gdrive_folder',
  'slack_invite', 'welcome_message', 'team_notify',
]

interface OnboardingStatusSectionProps {
  clientId: string
  steps: OnboardingStep[]
}

export function OnboardingStatusSection({ clientId, steps }: OnboardingStatusSectionProps) {
  const [retrying, setRetrying] = useState<string | null>(null)

  // Don't render if no onboarding steps exist (old clients)
  if (steps.length === 0) return null

  const allSucceeded = steps.every(s => s.status === 'success')
  const hasFailures = steps.some(s => s.status === 'failed')

  // Sort steps by our defined order
  const sortedSteps = [...steps].sort(
    (a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step)
  )

  // Find latest completed_at for "completed" timestamp
  const latestCompleted = steps
    .filter(s => s.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0]

  async function handleRetry(step: OnboardingStepName) {
    setRetrying(step)
    try {
      await fetch('/api/onboard/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, step }),
      })
    } catch (err) {
      console.error('Retry failed:', err)
    } finally {
      // Will require page refresh to see updated status (no realtime on detail page)
      setRetrying(null)
    }
  }

  function renderIcon(status: string) {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-3.5 w-3.5 text-status-active-text" />
      case 'failed':
        return <XCircle className="h-3.5 w-3.5 text-red-600" />
      case 'skipped':
        return <MinusCircle className="h-3.5 w-3.5 text-brand-text-3" />
      default:
        return <MinusCircle className="h-3.5 w-3.5 text-brand-text-3" />
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3">
          Onboarding
        </h3>
        {allSucceeded && latestCompleted?.completed_at && (
          <span className="text-[11px] text-status-active-text font-medium">
            Completed {new Date(latestCompleted.completed_at).toLocaleDateString()}
          </span>
        )}
        {hasFailures && (
          <span className="text-[11px] text-red-600 font-medium">
            Some steps failed
          </span>
        )}
      </div>

      <div className="space-y-2">
        {sortedSteps.map(step => (
          <div key={step.id} className="flex items-center gap-2">
            {renderIcon(step.status)}
            <span className={`text-[12px] flex-1 ${
              step.status === 'failed' ? 'text-red-600' :
              step.status === 'skipped' ? 'text-brand-text-3' :
              'text-brand-text-2'
            }`}>
              {STEP_LABELS[step.step]}
            </span>
            {step.status === 'failed' && (
              <button
                onClick={() => handleRetry(step.step)}
                disabled={retrying === step.step}
                className="flex items-center gap-1 text-[10px] font-medium text-brand-accent hover:opacity-80 transition-opacity disabled:opacity-50"
                title={step.error_message ?? 'Retry'}
              >
                <RotateCcw className={`h-2.5 w-2.5 ${retrying === step.step ? 'animate-spin' : ''}`} />
                Retry
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
