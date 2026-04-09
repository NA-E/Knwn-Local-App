'use client'

import { ExternalLink, FileText, Film, Image } from 'lucide-react'
import type { Project } from '@/lib/types'

interface ProjectLinksProps {
  project: Project
}

function LinkRow({
  icon: Icon,
  label,
  url,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  url: string | null
}) {
  if (!url) {
    return (
      <div className="flex items-center gap-2 py-1.5">
        <Icon className="size-3.5 text-brand-text-3" strokeWidth={1.5} />
        <span className="text-[12px] text-brand-text-3">{label}: not set</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <Icon className="size-3.5 text-brand-text-2" strokeWidth={1.5} />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[12px] text-brand-accent hover:underline truncate max-w-[200px]"
      >
        {label}
      </a>
      <ExternalLink className="size-3 text-brand-text-3 shrink-0" strokeWidth={1.5} />
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
        <LinkRow icon={FileText} label="Script" url={project.script_url} />
        <LinkRow icon={Film} label="Edit" url={project.edit_url} />
        <LinkRow icon={Image} label="Thumbnail" url={project.thumbnail_url} />
      </div>
    </div>
  )
}
