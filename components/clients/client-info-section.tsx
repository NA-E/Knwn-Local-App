const HEALTH_LABELS: Record<string, { label: string; color: string }> = {
  on_track: { label: 'On Track', color: 'bg-[#6BBF8E] text-white' },
  at_risk: { label: 'At Risk', color: 'bg-amber-400 text-white' },
  off_track: { label: 'Off Track', color: 'bg-red-400 text-white' },
}

export function ClientInfoSection({ client }: { client: any }) {
  function row(label: string, value: string | null, opts?: { link?: boolean; pre?: boolean }) {
    return (
      <div className="flex justify-between items-baseline py-1 text-[12.5px]">
        <span className="text-muted-foreground">{label}</span>
        {opts?.link && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="text-brand-accent hover:underline text-[12px]">Open ↗</a>
        ) : (
          <span className={opts?.pre ? 'whitespace-pre-wrap text-right' : undefined}>{value ?? '—'}</span>
        )}
      </div>
    )
  }

  const health = client.health ? HEALTH_LABELS[client.health] : null

  return (
    <div className="bg-card border border-border rounded-[10px] p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D] mb-3">Client Info</div>
      <div className="flex justify-between items-baseline py-1 text-[12.5px]">
        <span className="text-muted-foreground">Health</span>
        {health ? (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${health.color}`}>{health.label}</span>
        ) : (
          <span>—</span>
        )}
      </div>
      {row('Package', client.package)}
      {row('Contract Start', client.contract_start_date)}
      {row('Posting Schedule', client.posting_schedule)}
      {row('Script Format', client.script_format)}
      {row('Communication', client.communication_method)}
      {row('Approval Emails', client.approval_emails, { pre: true })}
      {row('Special Notes', client.special_instructions, { pre: true })}
      <div className="border-t border-[#EDEAE2] mt-3 pt-3">
        {row('Brand Voice Guide', client.brand_voice_guide_url, { link: true })}
        {row('Area Guide', client.area_guide_url, { link: true })}
        {row('Dropbox', client.dropbox_upload_url, { link: true })}
        {row('Slack Channel', client.slack_channel_url, { link: true })}
        {row('Website', client.website, { link: true })}
      </div>
    </div>
  )
}
