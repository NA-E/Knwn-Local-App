'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createContact, updateContact, deleteContact } from '@/lib/actions/client-contacts'
import type { ClientContact } from '@/lib/types'

interface Props {
  clientId: string
  contacts: ClientContact[]
}

export function ClientContactsSection({ clientId, contacts }: Props) {
  const [editContact, setEditContact] = useState<ClientContact | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  async function handleAdd(formData: FormData) {
    const result = await createContact(clientId, formData)
    if (!result.error) setShowAdd(false)
  }

  async function handleEdit(formData: FormData) {
    if (!editContact) return
    const result = await updateContact(editContact.id, clientId, formData)
    if (!result.error) setEditContact(null)
  }

  function contactForm(contact: ClientContact | null, onSubmit: (fd: FormData) => void, onCancel: () => void) {
    return (
      <form action={onSubmit} className="space-y-3">
        <div>
          <Label>Name</Label>
          <Input name="contact_name" defaultValue={contact?.contact_name ?? ''} className="mt-1" />
        </div>
        <div>
          <Label>Email *</Label>
          <Input name="email" type="email" defaultValue={contact?.email ?? ''} required className="mt-1" />
        </div>
        <div>
          <Label>Phone</Label>
          <Input name="phone" defaultValue={contact?.phone ?? ''} className="mt-1" />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_primary" value="true" defaultChecked={contact?.is_primary ?? false} />
            Primary
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_assistant" value="true" defaultChecked={contact?.is_assistant ?? false} />
            Assistant
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{contact ? 'Save' : 'Add'}</Button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-card border border-border rounded-[10px] p-5">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D]">Contacts</div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger render={<button className="text-[12px] text-brand-accent hover:underline">+ Add</button>} />
          <DialogContent>
            <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
            {contactForm(null, handleAdd, () => setShowAdd(false))}
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length === 0 ? (
        <p className="text-[12.5px] text-[#A8A59D]">No contacts yet.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex justify-between items-start py-1">
              <div className="flex flex-col gap-0.5">
                {c.contact_name && (
                  <span className="text-[11.5px] text-muted-foreground leading-tight">{c.contact_name}</span>
                )}
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${c.email}`}
                    className="text-[12.5px] text-foreground hover:underline leading-tight"
                  >
                    {c.email}
                  </a>
                  {c.is_primary && (
                    <span className="text-[10px] bg-brand-accent-bg text-brand-accent px-1.5 py-0.5 rounded">Primary</span>
                  )}
                  {c.is_assistant && (
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Assistant</span>
                  )}
                </div>
                {c.phone && (
                  <span className="text-[11.5px] text-muted-foreground leading-tight">{c.phone}</span>
                )}
              </div>
              <button onClick={() => setEditContact(c)} className="text-[#A8A59D] hover:text-foreground text-[11px] shrink-0 ml-3 mt-0.5">Edit</button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editContact} onOpenChange={(open) => !open && setEditContact(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
          {editContact && contactForm(editContact, handleEdit, () => setEditContact(null))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
