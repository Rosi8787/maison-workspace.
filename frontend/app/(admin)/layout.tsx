'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn, isAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }
    if (!isAdmin())    { router.replace('/spaces'); return; }
    setAuthReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Render konten langsung (LCP lebih cepat) dengan opacity transition
  // Redirect tetap terjadi jika tidak auth, tapi browser sudah paint awal
  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#120d0b', opacity: authReady ? 1 : 0, transition: 'opacity 0.15s ease' }}
    >
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen" style={{ background: '#120d0b' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
