import { notFound } from 'next/navigation'
import { getClientByPortalToken } from '@/lib/actions/client-portal'
import { ExternalLink, Upload, FolderOpen } from 'lucide-react'

/** Client-friendly status labels — hide internal workflow details */
const CLIENT_STATUS_MAP: Record<string, string> = {
  idea: 'Planned',
  on_hold: 'On Hold',
  brief: 'In Planning',
  scriptwriting: 'Script In Progress',
  review_script: 'Script In Review',
  fix_script: 'Script In Progress',
  script_ready_to_send: 'Script Ready',
  script_sent_to_client: 'Script Sent to You',
  client_uploaded: 'Footage Received',
  editing: 'Editing In Progress',
  ready_for_internal_review: 'In Review',
  internal_adjustments_needed: 'Editing In Progress',
  edit_ready_to_send: 'Edit Ready',
  edit_sent_to_client: 'Edit Ready for Review',
  client_adjustments_needed: 'Editing In Progress',
  ready_to_post: 'Ready to Publish',
  posted_scheduled: 'Published',
  cancelled: 'Cancelled',
}

/** Statuses hidden from client portal */
const HIDDEN_STATUSES = ['cancelled', 'idea']

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const data = await getClientByPortalToken(token)

  if (!data) notFound()

  const { client, channels } = data
  const projects = data.projects
    .filter(p => !HIDDEN_STATUSES.includes(p.status))
    .map(p => ({ ...p, status_label: CLIENT_STATUS_MAP[p.status] ?? p.status_label }))

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-[20px] font-semibold text-[#1A1916] tracking-tight">
          Welcome, {client.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <StatusBadge status={client.status} />
        </div>
      </div>

      {/* Upload Link */}
      {client.dropbox_upload_url && (
        <section className="bg-white border border-[#E6E3DC] rounded-[10px] p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FEF0DE] flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5 text-[#C8782A]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-semibold text-[#1A1916]">
                Upload Files
              </h2>
              <p className="text-[13px] text-[#78756C] mt-1">
                Upload your raw footage, B-roll, and assets directly to your Dropbox folder.
              </p>
              <a
                href={client.dropbox_upload_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#1A1916] text-white text-[13px] font-medium rounded-[6px] hover:opacity-85 transition-opacity"
              >
                <Upload className="w-4 h-4" />
                Upload Files to Dropbox
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Your Projects */}
      <section>
        <h2 className="text-[15px] font-semibold text-[#1A1916] mb-4">
          Your Projects
        </h2>
        {projects.length === 0 ? (
          <div className="bg-white border border-[#E6E3DC] rounded-[10px] p-6 text-center">
            <p className="text-[13px] text-[#78756C]">
              No projects yet. Your team will start adding projects soon.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E6E3DC] rounded-[10px] overflow-hidden">
            {/* Table header */}
            <div className="bg-[#F7F6F1] border-b border-[#E6E3DC] grid grid-cols-[1fr_160px_80px_100px] px-4 py-2.5">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#A8A59D]">
                Title
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#A8A59D]">
                Status
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#A8A59D]">
                Edit #
              </span>
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#A8A59D]">
                Action
              </span>
            </div>

            {/* Project rows */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-[1fr_160px_80px_100px] px-4 py-3 border-b border-[#EDEAE2] last:border-b-0 hover:bg-[#FAFAF7] transition-colors"
              >
                <span className="text-[13px] text-[#1A1916] truncate pr-4">
                  {project.title}
                </span>
                <span className="text-[12px] text-[#78756C]">
                  {project.status_label}
                </span>
                <span className="text-[12px] text-[#78756C]">
                  {project.edit_version > 0 ? `v${project.edit_version}` : '—'}
                </span>
                <div>
                  {project.status === 'edit_sent_to_client' && project.edit_url ? (
                    <a
                      href={project.edit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-[#C8782A] hover:underline"
                    >
                      Review Edit
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[12px] text-[#A8A59D]">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Channels */}
      {channels.length > 0 && (
        <section>
          <h2 className="text-[15px] font-semibold text-[#1A1916] mb-4">
            Your Channels
          </h2>
          <div className="grid gap-3">
            {channels.map((channel, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E6E3DC] rounded-[8px] px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-4 h-4 text-[#78756C]" />
                  <span className="text-[13px] text-[#1A1916]">
                    {channel.channel_name}
                  </span>
                  <span className="text-[12px] text-[#A8A59D]">
                    {channel.videos_per_week} video{channel.videos_per_week !== 1 ? 's' : ''}/week
                  </span>
                </div>
                {channel.channel_url && (
                  <a
                    href={channel.channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#C8782A] hover:underline flex items-center gap-1"
                  >
                    View
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      <section className="bg-white border border-[#E6E3DC] rounded-[10px] p-6">
        <h2 className="text-[15px] font-semibold text-[#1A1916] mb-2">
          Resources
        </h2>
        <p className="text-[13px] text-[#78756C]">
          Resources and brand documents will appear here.
        </p>
      </section>
    </div>
  )
}

// ---------- Status Badge ----------

function StatusBadge({ status }: { status: string }) {
  let colors = 'bg-[#EEEBE3] text-[#68655E]'
  if (status === 'active') colors = 'bg-[#D9F5E8] text-[#1A6B40]'
  if (status === 'onboarding') colors = 'bg-[#FEF3D0] text-[#78580A]'

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${colors}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
