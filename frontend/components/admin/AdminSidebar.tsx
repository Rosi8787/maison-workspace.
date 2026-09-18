'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, UserCircle, Users, Building2,
  Tag, CalendarCheck, BarChart3, LogOut, ChevronRight,
} from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import type { SpaceOwner } from '@/types';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard',       Icon: LayoutDashboard },
  { href: '/admin/profile',   label: 'Admin Profile',   Icon: UserCircle },
  { href: '/admin/members',   label: 'Members',         Icon: Users },
  { href: '/admin/spaces',    label: 'Spaces',          Icon: Building2 },
  { href: '/admin/diskon',    label: 'Discounts',       Icon: Tag },
  { href: '/admin/reservasi', label: 'Reservations',    Icon: CalendarCheck },
  { href: '/admin/reports',   label: 'Reports',         Icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const user     = getUser();
  const owner    = user?.profile as SpaceOwner | undefined;
  const initials = (owner?.nama_coworking || 'A').slice(0, 2).toUpperCase();

  return (
    <aside
      className="w-64 min-h-screen flex flex-col fixed left-0 top-0 z-40"
      style={{
        background: '#170f0c',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" className="text-lg font-semibold tracking-tight" style={{ color: '#f4eee7' }}>
          workspace<span style={{ color: '#c9a77a' }}>.</span>
        </Link>
        <p className="text-xs mt-0.5 truncate" style={{ color: '#7a6a5a' }}>
          {owner?.nama_coworking || 'Admin Panel'}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
        {NAV_LINKS.map(({ href, label, Icon }, i) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color:      active ? '#f4eee7' : '#7a6a5a',
                  background: active ? 'rgba(201,167,122,0.12)' : 'transparent',
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={16} style={{ color: active ? '#c9a77a' : '#7a6a5a' }} className="flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={12} style={{ color: '#c9a77a' }} />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: 'rgba(201,167,122,0.15)', color: '#c9a77a' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#f4eee7' }}>
              {owner?.nama_pemilik || user?.username}
            </p>
            <p className="text-xs truncate" style={{ color: '#7a6a5a' }}>Administrator</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.push('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
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
