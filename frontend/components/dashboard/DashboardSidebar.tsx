'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  CalendarCheck,
  History,
  UserCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import type { Member } from '@/types';

const NAV_ITEMS = [
  { href: '/spaces',            label: 'Find Workspace', Icon: Search },
  { href: '/reservation',       label: 'My Booking',     Icon: CalendarCheck },
  { href: '/history',           label: 'History',        Icon: History },
  { href: '/profile',           label: 'Profile',        Icon: UserCircle },
];

export default function DashboardSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const user      = getUser();
  const member    = user?.profile as Member | undefined;
  const initials  = (member?.nama_member || user?.username || 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-40"
      style={{
        background: '#170f0c',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* ── Logo ── */}
      <div className="px-6 pt-7 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: '#f4eee7' }}>
          workspace<span style={{ color: '#c9a77a' }}>.</span>
        </Link>
        <p className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>Member Portal</p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto" aria-label="Member navigation">
        {NAV_ITEMS.map(({ href, label, Icon }, i) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <Link
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                style={{
                  color:      active ? '#f4eee7'  : '#7a6a5a',
                  background: active ? 'rgba(201,167,122,0.12)' : 'transparent',
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  size={17}
                  style={{ color: active ? '#c9a77a' : '#7a6a5a' }}
                  className="flex-shrink-0 transition-colors"
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight size={13} style={{ color: '#c9a77a' }} />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ── User + Logout ── */}
      <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {/* User pill */}
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2 transition-colors hover:bg-white/05"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: 'rgba(201,167,122,0.18)', color: '#c9a77a' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#f4eee7' }}>
              {member?.nama_member || user?.username}
            </p>
            <p className="text-xs truncate" style={{ color: '#7a6a5a' }}>
              {member?.instansi || 'Member'}
            </p>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-900/20"
          style={{ color: '#7a6a5a' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f87171')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6a5a')}
        >
          <LogOut size={16} className="flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
