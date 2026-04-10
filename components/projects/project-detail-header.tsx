'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Pencil,
} from 'lucide-react'
import type { ProjectWithRelations, DesignStatus } from '@/lib/types'
import {
  PROJECT_STATUS_LABELS,
  STATUS_TO_GROUP,
  STATUS_GROUP_COLORS,
  DESIGN_STATUS_LABELS,
} from '@/lib/constants/status'

const DESIGN_STATUS_DOT_COLORS: Record<DesignStatus, string> = {
  not_started: 'bg-[#D2CFC6]',
  in_progress: 'bg-brand-accent',
  completed: 'bg-[#1A6B40]',
}

interface ProjectDetailHeaderProps {
  project: ProjectWithRelations
  onTitleUpdate?: (title: string) => void
}

export function ProjectDetailHeader({ project, onTitleUpdate }: ProjectDetailHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(project.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Keep title in sync with prop changes
  useEffect(() => {
    setTitle(project.title)
  }, [project.title])

  function handleTitleSubmit() {
    const trimmed = title.trim()
    if (trimmed && trimmed !== project.title) {
      onTitleUpdate?.(trimmed)
    } else {
      setTitle(project.title)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    } else if (e.key === 'Escape') {
      setTitle(project.title)
      setIsEditing(false)
    }
  }

  const statusGroup = STATUS_TO_GROUP[project.status]
  const statusLabel = PROJECT_STATUS_LABELS[project.status]
  const statusColors = STATUS_GROUP_COLORS[statusGroup]
  const designDot = DESIGN_STATUS_DOT_COLORS[project.design_status]
  const designLabel = DESIGN_STATUS_LABELS[project.design_status]

  return (
    <div className="bg-[#EDEAE2] border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/projects/pipeline"
            className="flex items-center gap-1.5 text-[13px] text-brand-text-2 hover:text-brand-text-1 transition-colors shrink-0"
          >
            <ArrowLeft className="size-4" />
            Pipeline
          </Link>

          <div className="w-px h-5 bg-border shrink-0" />

          {isEditing ? (
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              className="text-[18px] font-semibold text-brand-text-1 bg-transparent border-b-2 border-brand-accent outline-none min-w-[200px] py-0.5"
            />
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-[18px] font-semibold text-brand-text-1 truncate">
                {project.title}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-[12px] text-brand-accent hover:underline shrink-0"
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${statusColors}`}
          >
            {statusLabel}
          </span>

          {/* Design status dot + label */}
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-[7px] h-[7px] rounded-full ${designDot}`} />
            <span className="text-[11px] text-brand-text-2">
              {designLabel}
            </span>
          </div>

          {/* Version badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-[11px] font-medium">
            {project.edit_version > 0 ? `V${project.edit_version}` : 'V—'}
          </span>
        </div>
      </div>
    </div>
  )
}
