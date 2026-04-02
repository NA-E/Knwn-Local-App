'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createPod, updatePod } from '@/lib/actions/pods'
import type { Pod } from '@/lib/types'

interface PodFormDialogProps {
  pod?: Pod
  trigger: React.ReactElement
}

export function PodFormDialog({ pod, trigger }: PodFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!pod

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = isEdit
      ? await updatePod(pod!.id, formData)
      : await createPod(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Pod' : 'Create Pod'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Pod Name</Label>
            <Input id="name" name="name" defaultValue={pod?.name ?? ''} required className="mt-1.5" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{isEdit ? 'Save' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
