'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { createProject } from '@/lib/actions/projects'
import { ASSIGNMENT_ROLE_LABELS } from '@/lib/constants/roles'
import type { AssignmentRole } from '@/lib/types'

interface ProjectCreateFormProps {
  clients: { id: string; name: string; podName: string | null }[]
  writers: { id: string; first_name: string; last_name: string }[]
  editors: { id: string; first_name: string; last_name: string }[]
  assignmentsByClient: Record<string, { assignment_role: string; team_member_name: string; team_member_id: string }[]>
}

export function ProjectCreateForm({ clients, writers, editors, assignmentsByClient }: ProjectCreateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('')
  const [writerId, setWriterId] = useState('')
  const [editorId, setEditorId] = useState('')
  const [notes, setNotes] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!clientId) {
      toast.error('Client is required')
      return
    }

    setLoading(true)
    const result = await createProject({
      title: title.trim(),
      client_id: clientId,
      writer_id: writerId || null,
      editor_id: editorId || null,
      notes: notes || null,
    })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Project created')
      router.push(`/projects/${result.project!.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[560px] space-y-5">
      <div>
        <Label className="text-[12px] font-medium text-brand-text-2 mb-1.5 block">
          Title *
        </Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video title or working name"
          className="text-[13px]"
          autoFocus
        />
      </div>

      <div>
        <Label className="text-[12px] font-medium text-brand-text-2 mb-1.5 block">
          Client *
        </Label>
        <select
          value={clientId}
          onChange={(e) => {
            const newClientId = e.target.value
            setClientId(newClientId)
            // Reset and auto-populate editor from client assignments
            setEditorId('')
            if (newClientId && assignmentsByClient[newClientId]) {
              const editorAssignment = assignmentsByClient[newClientId].find(a => a.assignment_role === 'editor')
              if (editorAssignment) setEditorId(editorAssignment.team_member_id)
            }
          }}
          className="w-full px-3 py-2 border border-border rounded-md text-[13px] bg-card text-brand-text-1"
        >
          <option value="">Select a client...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {clientId && (() => {
        const selectedClient = clients.find(c => c.id === clientId)
        return (
        <div className="bg-[#FAFAF7] border border-border rounded-[8px] p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.10em] text-muted-foreground mb-2">
            Inherited from Client
          </div>
          <div className="space-y-1">
            {/* Pod row */}
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">Pod</span>
              <span>
                {selectedClient?.podName ? (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EDEAE2] text-[#78756C]">
                    {selectedClient.podName}
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">No pod</span>
                )}
              </span>
            </div>
            {/* Team assignments */}
            {(assignmentsByClient[clientId] ?? []).map((a, i) => (
              <div key={i} className="flex justify-between text-[12px]">
                <span className="text-muted-foreground">{ASSIGNMENT_ROLE_LABELS[a.assignment_role as AssignmentRole] ?? a.assignment_role}</span>
                <span className="font-medium text-brand-text-1">{a.team_member_name}</span>
              </div>
            ))}
          </div>
        </div>
        )
      })()}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[12px] font-medium text-brand-text-2 mb-1.5 block">
            Writer
          </Label>
          <select
            value={writerId}
            onChange={(e) => setWriterId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-[13px] bg-card text-brand-text-1"
          >
            <option value="">Unassigned</option>
            {writers.map((w) => (
              <option key={w.id} value={w.id}>{w.first_name} {w.last_name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-[12px] font-medium text-brand-text-2 mb-1.5 block">
            Editor
          </Label>
          <select
            value={editorId}
            onChange={(e) => setEditorId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md text-[13px] bg-card text-brand-text-1"
          >
            <option value="">Unassigned</option>
            {editors.map((ed) => (
              <option key={ed.id} value={ed.id}>{ed.first_name} {ed.last_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label className="text-[12px] font-medium text-brand-text-2 mb-1.5 block">
          Notes
        </Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Brief, topic, or special instructions..."
          rows={3}
          className="text-[13px]"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="bg-brand-text-1 text-white hover:opacity-85 text-[13px] px-6"
        >
          {loading && <Loader2 className="size-4 animate-spin mr-1.5" />}
          Create Project
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="text-[13px]"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
