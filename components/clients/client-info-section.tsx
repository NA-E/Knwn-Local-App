export function ClientInfoSection({ client }: { client: any }) {
  function row(label: string, value: string | null, opts?: { link?: boolean }) {
    return (
      <div className="flex justify-between items-baseline py-1 text-[12.5px]">
        <span className="text-muted-foreground">{label}</span>
        {opts?.link && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="text-brand-accent hover:underline text-[12px]">Open ↗</a>
        ) : (
          <span>{value ?? '—'}</span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-[10px] p-5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#A8A59D] mb-3">Client Info</div>
      {row('Package', client.package)}
      {row('Contract Start', client.contract_start_date)}
      {row('Posting Schedule', client.posting_schedule)}
      {row('Script Format', client.script_format)}
      {row('Communication', client.communication_method)}
      {row('Special Notes', client.special_instructions)}
      <div className="border-t border-[#EDEAE2] mt-3 pt-3">
        {row('Dropbox', client.dropbox_upload_url, { link: true })}
        {row('B-Roll Library', client.broll_library_url, { link: true })}
        {row('Slack Channel', client.slack_channel_url, { link: true })}
        {row('YouTube', client.youtube_channel_url, { link: true })}
        {row('Website', client.website, { link: true })}
      </div>
    </div>
  )
}
