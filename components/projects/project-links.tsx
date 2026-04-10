'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { ExternalLink, FileText, Film, Image, Pencil, X, Check } from 'lucide-react'
import type { Project } from '@/lib/types'
import { updateProject } from '@/lib/actions/projects'

interface ProjectLinksProps {
  project: Project
}

function EditableLinkRow({
  icon: Icon,
  label,
  field,
  initialUrl,
  projectId,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  field: 'script_url' | 'edit_url' | 'thumbnail_url'
  initialUrl: string | null
  projectId: string
}) {
  const [url, setUrl] = useState<string | null>(initialUrl)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialUrl ?? '')
  const [saving, setSaving] = useState(false)

  function startEdit() {
    setDraft(url ?? '')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setDraft(url ?? '')
  }

  async function saveEdit() {
    const value = draft.trim() || null
    if (value === url) {
      setEditing(false)
      return
    }
    setSaving(true)
    const result = await updateProject(projectId, { [field]: value })
    setSaving(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      setUrl(value)
      setEditing(false)
      toast.success(`${label} URL updated`)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 py-1.5">
        <Icon className="size-3.5 text-brand-text-3 shrink-0" strokeWidth={1.5} />
        <input
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Paste ${label} URL…`}
          autoFocus
          disabled={saving}
          className="flex-1 min-w-0 text-[12px] text-brand-text-1 bg-transparent border border-border rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:opacity-50"
        />
        <button
          onClick={saveEdit}
          disabled={saving}
          className="text-brand-accent hover:opacity-70 disabled:opacity-40 shrink-0"
          aria-label="Save"
        >
          <Check className="size-3.5" strokeWidth={2} />
        </button>
        <button
          onClick={cancelEdit}
          disabled={saving}
          className="text-brand-text-3 hover:opacity-70 disabled:opacity-40 shrink-0"
          aria-label="Cancel"
        >
          <X className="size-3.5" strokeWidth={2} />
        </button>
      </div>
    )
  }

  if (!url) {
    return (
      <div className="flex items-center gap-2 py-1.5 group">
        <Icon className="size-3.5 text-brand-text-3 shrink-0" strokeWidth={1.5} />
        <span className="text-[12px] text-brand-text-3 flex-1">{label}: not set</span>
        <button
          onClick={startEdit}
          className="opacity-0 group-hover:opacity-100 text-brand-text-3 hover:text-brand-text-2 transition-opacity shrink-0"
          aria-label={`Set ${label} URL`}
        >
          <Pencil className="size-3" strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-1.5 group">
      <Icon className="size-3.5 text-brand-text-2 shrink-0" strokeWidth={1.5} />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] text-brand-accent hover:underline truncate flex-1 min-w-0"
      >
        {label}
      </a>
      <ExternalLink className="size-3 text-brand-text-3 shrink-0" strokeWidth={1.5} />
      <button
        onClick={startEdit}
        className="opacity-0 group-hover:opacity-100 text-brand-text-3 hover:text-brand-text-2 transition-opacity shrink-0"
        aria-label={`Edit ${label} URL`}
      >
        <Pencil className="size-3" strokeWidth={1.5} />
      </button>
    </div>
  )
}

export function ProjectLinks({ project }: ProjectLinksProps) {
  return (
    <div className="bg-card border border-border rounded-[8px] p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-text-3 mb-3">
        Links
      </div>
      <div className="space-y-0.5">
        <EditableLinkRow
          icon={FileText}
          label="Script"
          field="script_url"
          initialUrl={project.script_url}
          projectId={project.id}
        />
        <EditableLinkRow
          icon={Film}
          label="Edit"
          field="edit_url"
          initialUrl={project.edit_url}
          projectId={project.id}
        />
        <EditableLinkRow
          icon={Image}
          label="Thumbnail"
          field="thumbnail_url"
          initialUrl={project.thumbnail_url}
          projectId={project.id}
        />
      </div>
    </div>
  )
}
