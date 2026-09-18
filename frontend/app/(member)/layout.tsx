'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { isLoggedIn, isMember, getUser, logout } from '@/lib/auth';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import {
  Search, CalendarCheck, History, UserCircle, LogOut, Menu, X,
} from 'lucide-react';
import Link from 'next/link';
import type { Member } from '@/types';

const NAV_ITEMS = [
  { href: '/spaces',      label: 'Find Workspace', Icon: Search },
  { href: '/reservation', label: 'My Booking',     Icon: CalendarCheck },
  { href: '/history',     label: 'History',        Icon: History },
  { href: '/profile',     label: 'Profile',        Icon: UserCircle },
];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady]       = useState(false);
  const [mobileOpen, setMobile] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    if (!isMember())   { router.push('/admin/dashboard'); return; }
    setReady(true);
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => { setMobile(false); }, [pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#120d0b' }}>
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(201,167,122,0.4)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  const user   = getUser();
  const member = user?.profile as Member | undefined;
  const name   = member?.nama_member?.split(' ')[0] || user?.username || '';

  return (
    <div className="min-h-screen" style={{ background: '#120d0b' }}>
      {/* ── Desktop sidebar ── */}
      <DashboardSidebar />

      {/* ── Mobile top bar ── */}
      <header
        className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14"
        style={{
          background: 'rgba(18,13,11,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <Link href="/" className="text-base font-semibold" style={{ color: '#f4eee7' }}>
          workspace<span style={{ color: '#c9a77a' }}>.</span>
        </Link>
        <button
          onClick={() => setMobile((v) => !v)}
          className="p-2 rounded-xl transition-colors hover:bg-white/08"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen
            ? <X size={20} style={{ color: '#f4eee7' }} />
            : <Menu size={20} style={{ color: '#f4eee7' }} />}
        </button>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-30"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setMobile(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden fixed top-14 bottom-0 left-0 z-40 w-64 flex flex-col"
              style={{
                background: '#170f0c',
                borderRight: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ href, label, Icon }) => {
                  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        color:      active ? '#f4eee7' : '#7a6a5a',
                        background: active ? 'rgba(201,167,122,0.12)' : 'transparent',
                      }}
                    >
                      <Icon size={17} style={{ color: active ? '#c9a77a' : '#7a6a5a' }} />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="px-3 py-2 text-sm font-medium" style={{ color: '#f4eee7' }}>{name}</p>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ color: '#7a6a5a' }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main
        className="lg:pl-64 min-h-screen"
        style={{ background: '#120d0b' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
