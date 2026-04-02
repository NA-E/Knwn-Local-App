'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(auth)/login/actions'
import type { TeamRole } from '@/lib/types'
import { ROLE_LABELS, ADMIN_ROLES } from '@/lib/constants/roles'

interface SidebarProps {
  role: TeamRole
  userName: string
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = ADMIN_ROLES.includes(role)

  function navItem(href: string, label: string) {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={`block px-3 py-[7px] rounded-md text-[12.5px] transition-colors ${
          active
            ? 'bg-[#262622] text-white font-medium'
            : 'text-white/55 hover:bg-[#1E1E1B] hover:text-white/85'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <aside className="fixed left-0 top-0 w-[220px] h-screen bg-[#141412] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        <div className="text-[12px] font-bold text-white tracking-[0.12em] uppercase">Known Local</div>
        <div className="text-[10.5px] text-white/25 tracking-[0.04em] mt-0.5">Ops Platform</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItem('/dashboard', 'Dashboard')}

        <div className="pt-3">
          <div className="px-3 mb-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/25">Clients</div>
          {navItem('/clients', 'Client List')}
          {navItem('/clients/new', 'Add Client')}
        </div>

        <div className="pt-3">
          <div className="px-3 mb-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/25">Projects</div>
          {navItem('/pipeline', 'Pipeline')}
          {navItem('/board', 'My Board')}
        </div>

        {isAdmin && (
          <div className="pt-3">
            <div className="px-3 mb-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/25">Admin</div>
            {navItem('/team', 'Team')}
            {navItem('/pods', 'Pods')}
          </div>
        )}
      </nav>

      {/* User */}
      <div className="px-5 py-3.5 border-t border-white/8">
        <div className="text-[12px] font-medium text-white/75">{userName}</div>
        <div className="text-[11px] text-white/30 mt-0.5">{ROLE_LABELS[role]}</div>
        <button
          onClick={() => logout()}
          className="mt-2 text-[11px] text-white/30 hover:text-white/60 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
