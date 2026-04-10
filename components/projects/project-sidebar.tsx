'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Calendar, PenLine, Film, User, Palette, Hash } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ProjectWithRelations, ProjectStatus, TeamRole, TeamMember, DesignStatus } from '@/lib/types'
import { STATUS_TRANSITIONS } from '@/lib/constants/status'
import { ProjectLinks } from './project-links'
import { StatusActions } from './status-actions'
import { updateProject, type UpdateProjectInput } from '@/lib/actions/projects'
import { transitionProjectStatus, type TransitionMetadata } from '@/lib/actions/project-transitions'

interface ProjectSidebarProps {
  project: ProjectWithRelations
  userRole: TeamRole
  teamMembers: TeamMember[]
}

function InfoRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string | null
}) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <Icon className="size-3.5 text-brand-text-3 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-text-3">
          {label}
        </div>
        <div className="text-[13px] text-brand-text-1 truncate">
          {value || '\u2014'}
        </div>
      </div>
    </div>
  )
}

function DateRow({ icon: Icon, label, value, onChange }: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string | null
  onChange: (isoDate: string | null) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value // 'YYYY-MM-DD' or '' when cleared
    setSaving(true)
    await onChange(val || null)
    setSaving(false)
  }

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className="flex items-start gap-2 py-1.5">
      <Icon className="size-3.5 text-brand-text-3 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-text-3">
          {label}
        </div>
        <div className="relative flex items-center">
          {/* visible formatted date or placeholder */}
          <span className={`text-[13px] ${displayValue ? 'text-brand-text-1' : 'text-brand-text-3'} pointer-events-none select-none`}>
            {saving ? 'Saving…' : (displayValue ?? 'Set date')}
          </span>
          {/* invisible native date input overlaid for interaction */}
          <input
            type="date"
            value={value ?? ''}
            onChange={handleChange}
            disabled={saving}
            className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-default"
            aria-label={label}
          />
        </div>
      </div>
    </div>
  )
}

const DESIGN_STATUS_OPTIONS: { value: DesignStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const DESIGN_DOT_COLOR: Record<DesignStatus, string> = {
  not_started: 'bg-[#D2CFC6]',
  in_progress: 'bg-brand-accent',
  completed: 'bg-[#6BBF8E]',
}

export function ProjectSidebar({ project, userRole, teamMembers }: ProjectSidebarProps) {
  const [notes, setNotes] = useState(project.notes ?? '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [scriptDue, setScriptDue] = useState<string | null>(project.script_v1_due ?? null)
  const [editDue, setEditDue] = useState<string | null>(project.edit_due ?? null)
  const [publishDue, setPublishDue] = useState<string | null>(project.publish_due ?? null)
  const [actualPostDate, setActualPostDate] = useState<string | null>(project.actual_post_date ?? null)
  const [designStatus, setDesignStatus] = useState<DesignStatus>(project.design_status)
  const [writerId, setWriterId] = useState<string | null>(project.writer_id ?? null)
  const [editorId, setEditorId] = useState<string | null>(project.editor_id ?? null)
  const [editVersion, setEditVersion] = useState<number>(project.edit_version ?? 0)

  const currentStatus = project.status as ProjectStatus
  const allTransitions = STATUS_TRANSITIONS[currentStatus] ?? []
  const availableTransitions = allTransitions.filter(t => t.roles.includes(userRole))

  async function handleTransition(
    toStatus: ProjectStatus,
    data?: { notes?: string; edit_url?: string; edit_version?: number }
  ): Promise<{ error: string | null }> {
    const metadata: TransitionMetadata = {}
    if (data?.notes) metadata.feedback = data.notes
    if (data?.notes) metadata.notes = data.notes
    if (data?.edit_url) metadata.edit_url = data.edit_url
    if (data?.edit_version !== undefined) metadata.edit_version = data.edit_version

    const result = await transitionProjectStatus(project.id, toStatus, metadata)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Status updated')
    }
    return { error: result.error }
  }

  async function handleDateChange(field: 'script_v1_due' | 'edit_due' | 'publish_due' | 'actual_post_date', value: string | null) {
    const result = await updateProject(project.id, { [field]: value } as UpdateProjectInput)
    if (result.error) {
      toast.error(result.error)
    } else {
      if (field === 'script_v1_due') setScriptDue(value)
      if (field === 'edit_due') setEditDue(value)
      if (field === 'publish_due') setPublishDue(value)
      if (field === 'actual_post_date') setActualPostDate(value)
      toast.success('Date updated')
    }
  }

  async function handleSaveNotes() {
    setSavingNotes(true)
    const result = await updateProject(project.id, { notes: notes || null })
    setSavingNotes(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Notes saved')
    }
  }

  async function handleDesignStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as DesignStatus
    const prev = designStatus
    setDesignStatus(value)
    const result = await updateProject(project.id, { design_status: value })
    if (result.error) {
      toast.error(result.error)
      setDesignStatus(prev)
    } else {
      toast.success('Design status updated')
    }
  }

  async function handleWriterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value || null
    const prev = writerId
    setWriterId(value)
    const result = await updateProject(project.id, { writer_id: value })
    if (result.error) {
      toast.error(result.error)
      setWriterId(prev)
    } else {
      toast.success('Writer updated')
    }
  }

  async function handleEditorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value || null
    const prev = editorId
    setEditorId(value)
    const result = await updateProject(project.id, { editor_id: value })
    if (result.error) {
      toast.error(result.error)
      setEditorId(prev)
    } else {
      toast.success('Editor updated')
    }
  }

  async function handleEditVersionBlur(e: React.FocusEvent<HTMLInputElement>) {
    const raw = parseInt(e.target.value, 10)
    const value = isNaN(raw) || raw < 0 ? 0 : raw
    if (value === project.edit_version) return
    setEditVersion(value)
    const result = await updateProject(project.id, { edit_version: value })
    if (result.error) {
      toast.error(result.error)
      setEditVersion(project.edit_version)
    } else {
      toast.success('Edit version updated')
    }
  }

  function handleEditVersionKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  const selectClass =
    'w-full text-[13px] text-brand-text-1 bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer'

  return (
    <div className="space-y-4 w-[320px] shrink-0">
      <StatusActions
        project={project}
        userRole={userRole}
        availableTransitions={availableTransitions}
        onTransition={handleTransition}
      />

      <div className="bg-card border border-border rounded-[8px] p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3 mb-3">
          Details
        </div>
        <div className="space-y-0.5">
          {/* Client — read only */}
          <InfoRow icon={User} label="Client" value={project.client_name} />

          {/* Writer — editable dropdown */}
          <div className="flex items-start gap-2 py-1.5">
            <PenLine className="size-3.5 text-brand-text-3 mt-[18px] shrink-0" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-text-3 mb-1">
                Writer
              </div>
              <select
                value={writerId ?? ''}
                onChange={handleWriterChange}
                className={selectClass}
                aria-label="Writer"
              >
                <option value="">— Unassigned —</option>
                {teamMembers.filter(m => ['writer', 'senior_writer', 'admin'].includes(m.role)).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.first_name} {m.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Editor — editable dropdown */}
          <div className="flex items-start gap-2 py-1.5">
            <Film className="size-3.5 text-brand-text-3 mt-[18px] shrink-0" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-text-3 mb-1">
                Editor
              </div>
              <select
                value={editorId ?? ''}
                onChange={handleEditorChange}
                className={selectClass}
                aria-label="Editor"
              >
                <option value="">— Unassigned —</option>
                {teamMembers.filter(m => ['editor', 'senior_editor', 'admin'].includes(m.role)).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.first_name} {m.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Design Status — editable dropdown */}
          <div className="flex items-start gap-2 py-1.5">
            <Palette className="size-3.5 text-brand-text-3 mt-[18px] shrink-0" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-text-3 mb-1">
                Design
              </div>
              <div className="relative flex items-center gap-1.5">
                <span className={`inline-block size-[7px] shrink-0 rounded-full ${DESIGN_DOT_COLOR[designStatus]}`} />
                <select
                  value={designStatus}
                  onChange={handleDesignStatusChange}
                  className="flex-1 text-[13px] text-brand-text-1 bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-accent cursor-pointer"
                  aria-label="Design status"
                >
                  {DESIGN_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Edit Version — small number input */}
          <div className="flex items-start gap-2 py-1.5">
            <Hash className="size-3.5 text-brand-text-3 mt-[18px] shrink-0" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-brand-text-3 mb-1">
                Edit Version
              </div>
              <input
                type="number"
                min={0}
                value={editVersion}
                onChange={(e) => setEditVersion(parseInt(e.target.value, 10) || 0)}
                onBlur={handleEditVersionBlur}
                onKeyDown={handleEditVersionKeyDown}
                className="w-20 text-[13px] text-brand-text-1 bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-accent"
                aria-label="Edit version"
              />
            </div>
          </div>

          <DateRow
            icon={Calendar}
            label="Script Due"
            value={scriptDue}
            onChange={(v) => handleDateChange('script_v1_due', v)}
          />
          <DateRow
            icon={Calendar}
            label="Edit Due"
            value={editDue}
            onChange={(v) => handleDateChange('edit_due', v)}
          />
          <DateRow
            icon={Calendar}
            label="Publish Due"
            value={publishDue}
            onChange={(v) => handleDateChange('publish_due', v)}
          />
          <DateRow
            icon={Calendar}
            label="Post Date"
            value={actualPostDate}
            onChange={(v) => handleDateChange('actual_post_date', v)}
          />
        </div>
      </div>

      <ProjectLinks project={project} />

      <div className="bg-card border border-border rounded-[8px] p-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3 mb-3">
          Notes
        </div>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes..."
          rows={4}
          className="text-[13px] mb-2"
        />
        <Button
          onClick={handleSaveNotes}
          disabled={savingNotes || notes === (project.notes ?? '')}
          size="sm"
          className="bg-brand-text-1 text-white hover:opacity-85 text-[13px]"
        >
          {savingNotes ? 'Saving...' : 'Save Notes'}
        </Button>
      </div>
    </div>
  )
}
