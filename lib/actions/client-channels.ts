'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createChannel(clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const channel_name = formData.get('channel_name') as string
  if (!channel_name?.trim()) return { error: 'Channel name is required.' }

  const parsed = parseFloat(formData.get('videos_per_week') as string)
  const videos_per_week = Number.isNaN(parsed) ? 1 : parsed

  const { error } = await supabase.from('client_channels').insert({
    client_id: clientId,
    channel_name,
    channel_url: (formData.get('channel_url') as string) || null,
    videos_per_week,
  })
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function updateChannel(channelId: string, clientId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const channel_name = formData.get('channel_name') as string
  if (!channel_name?.trim()) return { error: 'Channel name is required.' }

  const parsed = parseFloat(formData.get('videos_per_week') as string)
  const videos_per_week = Number.isNaN(parsed) ? 1 : parsed

  const { error } = await supabase.from('client_channels').update({
    channel_name,
    channel_url: (formData.get('channel_url') as string) || null,
    videos_per_week,
  }).eq('id', channelId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}

export async function deleteChannel(channelId: string, clientId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('client_channels').delete().eq('id', channelId)
  if (error) return { error: error.message }
  revalidatePath(`/clients/${clientId}`)
  return { error: null }
}
