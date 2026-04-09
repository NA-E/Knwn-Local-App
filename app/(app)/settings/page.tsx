import { PageHeader } from '@/components/shared/page-header'

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" meta="Admin" />

      <div className="bg-card border border-border rounded-[10px] p-6">
        <p className="text-[13px] text-muted-foreground">
          Settings page coming soon. This will include team management, integrations, and app configuration.
        </p>
      </div>
    </div>
  )
}
