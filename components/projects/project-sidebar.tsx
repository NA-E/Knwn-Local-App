'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Calendar, PenLine, Film, User } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ProjectWithRelations, ProjectStatus, TeamRole } from '@/lib/types'
import { STATUS_TRANSITIONS } from '@/lib/constants/status'
import { ProjectLinks } from './project-links'
import { StatusActions } from './status-actions'
import { updateProject } from '@/lib/actions/projects'
import { transitionProjectStatus, type TransitionMetadata } from '@/lib/actions/project-transitions'

interface ProjectSidebarProps {
  project: ProjectWithRelations
  userRole: TeamRole
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '\u2014'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

export function ProjectSidebar({ project, userRole }: ProjectSidebarProps) {
  const [notes, setNotes] = useState(project.notes ?? '')
  const [savingNotes, setSavingNotes] = useState(false)

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
          <InfoRow icon={User} label="Client" value={project.client_name} />
          <InfoRow icon={PenLine} label="Writer" value={project.writer_name} />
          <InfoRow icon={Film} label="Editor" value={project.editor_name} />
          <InfoRow icon={Calendar} label="Script Due" value={formatDate(project.script_v1_due)} />
          <InfoRow icon={Calendar} label="Edit Due" value={formatDate(project.edit_due)} />
          <InfoRow icon={Calendar} label="Publish Due" value={formatDate(project.publish_due)} />
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
