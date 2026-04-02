'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createChannel, updateChannel, deleteChannel } from '@/lib/actions/client-channels'
import type { ClientChannel } from '@/lib/types'

interface Props {
  clientId: string
  channels: ClientChannel[]
}

export function ClientChannelsSection({ clientId, channels }: Props) {
  const [editChannel, setEditChannel] = useState<ClientChannel | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  async function handleAdd(formData: FormData) {
    const result = await createChannel(clientId, formData)
    if (!result.error) setShowAdd(false)
  }

  async function handleEdit(formData: FormData) {
    if (!editChannel) return
    const result = await updateChannel(editChannel.id, clientId, formData)
    if (!result.error) setEditChannel(null)
  }

  async function handleDelete(channelId: string) {
    if (!window.confirm('Remove this channel?')) return
    const result = await deleteChannel(channelId, clientId)
    if (result?.error) {
      alert(result.error)
    }
  }

  function channelForm(channel: ClientChannel | null, onSubmit: (fd: FormData) => void, onCancel: () => void) {
    return (
      <form action={onSubmit} className="space-y-3">
        <div>
          <Label>Channel Name</Label>
          <Input name="channel_name" defaultValue={channel?.channel_name ?? ''} required className="mt-1" />
        </div>
        <div>
          <Label>Channel URL</Label>
          <Input name="channel_url" defaultValue={channel?.channel_url ?? ''} className="mt-1" />
        </div>
        <div>
          <Label>Videos / Week</Label>
          <Input name="videos_per_week" type="number" step="0.5" min="0" defaultValue={channel?.videos_per_week ?? 1} className="mt-1" />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{channel ? 'Save' : 'Add'}</Button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-card border border-border rounded-[10px] p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D]">Channels</div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger render={<button className="text-[12px] text-brand-accent hover:underline">+ Add</button>} />
          <DialogContent>
            <DialogHeader><DialogTitle>Add Channel</DialogTitle></DialogHeader>
            {channelForm(null, handleAdd, () => setShowAdd(false))}
          </DialogContent>
        </Dialog>
      </div>

      {channels.length === 0 ? (
        <p className="text-[12.5px] text-[#A8A59D]">No channels yet.</p>
      ) : (
        <div className="space-y-2">
          {channels.map((ch) => (
            <div key={ch.id} className="flex justify-between items-center text-[12.5px] py-1">
              <span>{ch.channel_name}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{ch.videos_per_week} / wk</span>
                <button onClick={() => setEditChannel(ch)} className="text-[#A8A59D] hover:text-foreground text-[11px]">Edit</button>
                <button onClick={() => handleDelete(ch.id)} className="text-[#A8A59D] hover:text-red-600 text-[11px]">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editChannel} onOpenChange={(open) => !open && setEditChannel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Channel</DialogTitle></DialogHeader>
          {editChannel && channelForm(editChannel, handleEdit, () => setEditChannel(null))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
