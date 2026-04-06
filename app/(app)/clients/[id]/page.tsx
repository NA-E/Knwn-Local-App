import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/page-header'
import { ClientInfoSection } from '@/components/clients/client-info-section'
import { ClientChannelsSection } from '@/components/clients/client-channels-section'
import { ClientContactsSection } from '@/components/clients/client-contacts-section'
import { ClientTeamSection } from '@/components/clients/client-team-section'
import { OnboardingStatusSection } from '@/components/clients/onboarding-status-section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { OnboardingStep } from '@/lib/types'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('*, pods ( name )')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const [{ data: channels }, { data: contacts }, { data: assignments }, { data: onboardingSteps }] = await Promise.all([
    supabase.from('client_channels').select('*').eq('client_id', id).order('channel_name'),
    supabase.from('client_contacts').select('*').eq('client_id', id).order('is_primary', { ascending: false }),
    supabase.from('client_assignments').select('*, team_members ( id, first_name, last_name, role )').eq('client_id', id),
    supabase.from('onboarding_steps').select('*').eq('client_id', id).order('created_at'),
  ])

  function statusClass(status: string) {
    switch (status) {
      case 'active': return 'bg-status-active-bg text-status-active-text border-none'
      case 'onboarding': return 'bg-status-onboard-bg text-status-onboard-text border-none'
      default: return 'bg-status-inactive-bg text-status-inactive-text border-none'
    }
  }

  return (
    <div>
      <Link href="/clients" className="text-[12px] text-muted-foreground hover:underline mb-4 inline-block">← Clients</Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight">{client.name}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge className={`text-[11px] font-medium ${statusClass(client.status)}`}>{client.status}</Badge>
            {client.pods?.name && (
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-secondary text-muted-foreground">{client.pods.name}</span>
            )}
            {client.market && <span className="text-[12px] text-muted-foreground">· {client.market}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/clients/${id}/edit`}><Button variant="outline">Edit</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <ClientInfoSection client={client} />
        <ClientTeamSection clientId={id} assignments={assignments ?? []} />
        <ClientChannelsSection clientId={id} channels={channels ?? []} />
        <ClientContactsSection clientId={id} contacts={contacts ?? []} />
        <OnboardingStatusSection clientId={id} steps={(onboardingSteps ?? []) as OnboardingStep[]} />
      </div>
    </div>
  )
}
