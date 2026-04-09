'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Project, ProjectStatus, TeamRole } from '@/lib/types'
import {
  PROJECT_STATUS_LABELS,
  STATUS_TO_GROUP,
  STATUS_GROUP_COLORS,
  type StatusTransition,
} from '@/lib/constants/status'

interface StatusActionsProps {
  project: Project
  userRole: TeamRole
  availableTransitions: StatusTransition[]
  onTransition: (
    toStatus: ProjectStatus,
    data?: { notes?: string; edit_url?: string; edit_version?: number }
  ) => Promise<{ error: string | null }>
}

/**
 * Transitions that require an inline form with extra data.
 * Maps from_status → to_status → form config.
 */
const TRANSITION_FORMS: Record<
  string,
  Record<string, { fields: Array<{ name: string; label: string; type: 'text' | 'textarea' | 'version'; required?: boolean; placeholder?: string }> }>
> = {
  editing: {
    ready_for_internal_review: {
      fields: [
        { name: 'edit_url', label: 'Dropbox Edit Link', type: 'text', required: true, placeholder: 'https://dropbox.com/...' },
        { name: 'edit_version', label: 'Version', type: 'version' },
      ],
    },
  },
  review_script: {
    fix_script: {
      fields: [
        { name: 'notes', label: 'Feedback', type: 'textarea', required: true, placeholder: 'Describe what needs to be fixed...' },
      ],
    },
  },
  ready_for_internal_review: {
    internal_adjustments_needed: {
      fields: [
        { name: 'notes', label: 'Feedback', type: 'textarea', required: true, placeholder: 'Describe the adjustments needed...' },
      ],
    },
  },
}

/** Check if a transition requires precondition form data */
function getTransitionForm(fromStatus: ProjectStatus, toStatus: ProjectStatus) {
  return TRANSITION_FORMS[fromStatus]?.[toStatus] ?? null
}

/** Classify transitions into primary (forward) and secondary (hold/cancel) */
function classifyTransition(to: ProjectStatus): 'primary' | 'hold' | 'cancel' {
  if (to === 'on_hold') return 'hold'
  if (to === 'cancelled') return 'cancel'
  return 'primary'
}

export function StatusActions({ project, userRole, availableTransitions, onTransition }: StatusActionsProps) {
  const [expandedTransition, setExpandedTransition] = useState<ProjectStatus | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statusGroup = STATUS_TO_GROUP[project.status]
  const statusLabel = PROJECT_STATUS_LABELS[project.status]
  const statusColors = STATUS_GROUP_COLORS[statusGroup]

  const primary = availableTransitions.filter((t) => classifyTransition(t.to) === 'primary')
  const hold = availableTransitions.find((t) => t.to === 'on_hold')
  const cancel = availableTransitions.find((t) => t.to === 'cancelled')

  async function handleTransition(toStatus: ProjectStatus) {
    const form = getTransitionForm(project.status, toStatus)

    // If has form and not yet expanded, show the form
    if (form && expandedTransition !== toStatus) {
      setExpandedTransition(toStatus)
      setFormData({})
      setError(null)
      return
    }

    // Validate required fields
    if (form) {
      for (const field of form.fields) {
        if (field.required && !formData[field.name]?.trim()) {
          setError(`${field.label} is required.`)
          return
        }
      }
    }

    setLoading(true)
    setError(null)

    const transitionData: { notes?: string; edit_url?: string; edit_version?: number } = {}
    if (formData.notes) transitionData.notes = formData.notes
    if (formData.edit_url) transitionData.edit_url = formData.edit_url
    if (formData.edit_version) transitionData.edit_version = parseInt(formData.edit_version, 10)

    const result = await onTransition(toStatus, transitionData)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setExpandedTransition(null)
      setFormData({})
    }
  }

  function handleCancel() {
    setExpandedTransition(null)
    setFormData({})
    setError(null)
  }

  return (
    <div className="bg-card border border-border rounded-[8px] p-4">
      {/* Current status display */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3 mb-2">
          Current Status
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-[12px] font-medium ${statusColors}`}>
          {statusLabel}
        </span>
      </div>

      {/* No transitions available */}
      {availableTransitions.length === 0 && (
        <p className="text-[12px] text-brand-text-3 italic">
          No transitions available for your role.
        </p>
      )}

      {/* Primary transition buttons */}
      {primary.length > 0 && (
        <div className="space-y-2 mb-3">
          {primary.map((t) => {
            const toLabel = PROJECT_STATUS_LABELS[t.to]
            const hasForm = !!getTransitionForm(project.status, t.to)
            const isExpanded = expandedTransition === t.to

            return (
              <div key={t.to}>
                <Button
                  onClick={() => handleTransition(t.to)}
                  disabled={loading}
                  className="w-full justify-start bg-brand-text-1 text-white hover:opacity-85 text-[13px] font-medium"
                >
                  {loading && expandedTransition === t.to && (
                    <Loader2 className="size-4 animate-spin mr-1.5" />
                  )}
                  <span className="text-brand-text-3 mr-1">&rarr;</span> {toLabel}
                </Button>

                {/* Inline form for transitions with preconditions */}
                {hasForm && isExpanded && (
                  <InlineTransitionForm
                    form={getTransitionForm(project.status, t.to)!}
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={() => handleTransition(t.to)}
                    onCancel={handleCancel}
                    loading={loading}
                    error={error}
                    editVersion={project.edit_version}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Secondary actions */}
      {(hold || cancel) && (
        <div className="flex gap-2 pt-2 border-t border-[#EDEAE2]">
          {hold && (
            <Button
              variant="outline"
              onClick={() => handleTransition('on_hold')}
              disabled={loading}
              className="text-[13px]"
            >
              {loading && expandedTransition === 'on_hold' && (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              )}
              Put on Hold
            </Button>
          )}
          {cancel && (
            <Button
              variant="outline"
              onClick={() => handleTransition('cancelled')}
              disabled={loading}
              className="text-[13px] text-destructive border-destructive/30 hover:bg-destructive/5"
            >
              {loading && expandedTransition === 'cancelled' && (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              )}
              Cancel Project
            </Button>
          )}
        </div>
      )}

      {/* Error display for non-form transitions */}
      {error && !expandedTransition && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  )
}

// ---- Inline Transition Form ----

interface InlineTransitionFormProps {
  form: { fields: Array<{ name: string; label: string; type: 'text' | 'textarea' | 'version'; required?: boolean; placeholder?: string }> }
  formData: Record<string, string>
  setFormData: (data: Record<string, string>) => void
  onSubmit: () => void
  onCancel: () => void
  loading: boolean
  error: string | null
  editVersion: number
}

function InlineTransitionForm({
  form,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading,
  error,
  editVersion,
}: InlineTransitionFormProps) {
  function updateField(name: string, value: string) {
    setFormData({ ...formData, [name]: value })
  }

  return (
    <div className="mt-2 bg-card border-l-2 border-l-brand-accent border border-border rounded-md p-3 space-y-3">
      {form.fields.map((field) => {
        if (field.type === 'version') {
          return (
            <div key={field.name}>
              <Label className="text-xs font-medium text-brand-text-2 mb-1.5 block">
                {field.label}
              </Label>
              <div className="flex gap-2">
                {[1, 2, 3].map((v) => (
                  <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="edit_version"
                      value={String(v)}
                      checked={(formData.edit_version ?? String(editVersion)) === String(v)}
                      onChange={(e) => updateField('edit_version', e.target.value)}
                      className="accent-brand-accent"
                    />
                    <span className="text-[13px] text-brand-text-1">V{v}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.name}>
              <Label className="text-xs font-medium text-brand-text-2 mb-1.5 block">
                {field.label} {field.required && '*'}
              </Label>
              <Textarea
                value={formData[field.name] ?? ''}
                onChange={(e) => updateField(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="text-[13px]"
              />
            </div>
          )
        }

        return (
          <div key={field.name}>
            <Label className="text-xs font-medium text-brand-text-2 mb-1.5 block">
              {field.label} {field.required && '*'}
            </Label>
            <Input
              value={formData[field.name] ?? ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="text-[13px]"
            />
          </div>
        )
      })}

      {error && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}

      <div className="flex gap-2 pt-1">
        <Button
          onClick={onSubmit}
          disabled={loading}
          size="sm"
          className="bg-brand-text-1 text-white hover:opacity-85 text-[13px]"
        >
          {loading && <Loader2 className="size-3.5 animate-spin mr-1" />}
          Submit
        </Button>
        <Button
          onClick={onCancel}
          disabled={loading}
          variant="outline"
          size="sm"
          className="text-[13px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
