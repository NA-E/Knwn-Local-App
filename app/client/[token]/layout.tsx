import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal — Known Local',
  description: 'View your projects and upload files',
}

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple header */}
      <header className="border-b border-[#E6E3DC] bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1A1916] flex items-center justify-center">
            <span className="text-white text-[13px] font-semibold">KL</span>
          </div>
          <span className="text-[15px] font-semibold text-[#1A1916] tracking-tight">
            Known Local
          </span>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {children}
      </main>
    </div>
  )
}
