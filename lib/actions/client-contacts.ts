'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createContact(clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const email = formData.get('email') as string
  if (!email?.trim()) return { error: 'Email is required.' }

  const { error } = await supabase.from('client_contacts').insert({
    client_id: clientId,
    contact_name: (formData.get('contact_name') as string) || null,
    email,
    phone: (formData.get('phone') as string) || null,
    is_primary: formData.get('is_primary') === 'true',
    is_assistant: formData.get('is_assistant') === 'true',
  })
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function updateContact(contactId: string, clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const email = formData.get('email') as string
  if (!email?.trim()) return { error: 'Email is required.' }

  const { error } = await supabase.from('client_contacts').update({
    contact_name: (formData.get('contact_name') as string) || null,
    email,
    phone: (formData.get('phone') as string) || null,
    is_primary: formData.get('is_primary') === 'true',
    is_assistant: formData.get('is_assistant') === 'true',
  }).eq('id', contactId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function deleteContact(contactId: string, clientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('client_contacts').delete().eq('id', contactId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}
