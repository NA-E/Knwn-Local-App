'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPods() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pods')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function createPod(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const name = formData.get('name') as string
  if (!name?.trim()) return { error: 'Pod name is required.' }

  const { error } = await supabase.from('pods').insert({ name })
  if (error) return { error: error.message }

  revalidatePath('/pods')
  return { error: null }
}

export async function updatePod(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const name = formData.get('name') as string
  if (!name?.trim()) return { error: 'Pod name is required.' }

  const { error } = await supabase.from('pods').update({ name }).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/pods')
  return { error: null }
}
