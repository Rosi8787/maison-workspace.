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

  /**
   * `authReady`: true setelah auth check selesai di client.
   *
   * Mengapa perlu ini:
   * - Server render: getToken() tidak bisa jalan (window = undefined)
   * - Hydration: React reconcile HTML server vs client
   * - Setelah hydration: baru bisa baca sessionStorage/cookie
   *
   * Dengan `authReady`, kita tahan render konten HANYA sampai
   * auth check selesai (sangat cepat — synchronous cookie read).
   * Tidak ada spinner, hanya background gelap sesaat.
   */
  const [authReady, setAuthReady] = useState(false);
  const [mobileOpen, setMobile]   = useState(false);

  useEffect(() => {
    // Cek auth — synchronous, tidak ada network call
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    if (!isMember()) {
      router.replace('/admin/dashboard');
      return;
    }
    // Auth OK → izinkan render
    setAuthReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close mobile menu on route change
  useEffect(() => { setMobile(false); }, [pathname]);

  // Render konten langsung dengan opacity transition — tidak block paint
  // authReady=false → opacity 0 (tidak terlihat) tapi ada di DOM → LCP dihitung
  // authReady=true  → opacity 1 dengan transisi 150ms
  // Redirect ke login tetap terjadi jika cookie tidak ada
  const user   = getUser();
  const member = user?.profile as Member | undefined;
  const name   = member?.nama_member?.split(' ')[0] || user?.username || '';

  return (
    <div
      className="min-h-screen"
      style={{ background: '#120d0b', opacity: authReady ? 1 : 0, transition: 'opacity 0.15s ease' }}
    >
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
          className="p-2 rounded-xl transition-colors"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden fixed inset-0 z-30"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setMobile(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="lg:hidden fixed top-14 bottom-0 left-0 z-40 w-64 flex flex-col"
              style={{ background: '#170f0c', borderRight: '1px solid rgba(255,255,255,0.07)' }}
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
                  onClick={() => logout()}
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
      <main className="lg:pl-64 min-h-screen" style={{ background: '#120d0b' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
