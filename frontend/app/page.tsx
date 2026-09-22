'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isLoggedIn } from '@/lib/auth';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import WorkspaceGrid from '@/components/landing/WorkspaceGrid';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  const router = useRouter();
  /**
   * `show`: true = tampilkan landing page.
   *
   * Kalau user sudah login → router.replace langsung, TIDAK tampilkan landing.
   * Kalau belum login → set show=true → render landing.
   *
   * Tidak ada spinner — background gelap sesaat lebih baik dari flash landing
   * yang langsung hilang.
   */
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      router.replace(user?.role === 'ADMIN' ? '/admin/dashboard' : '/spaces');
      // Tidak set show=true, biarkan blank background sampai redirect
    } else {
      setShow(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) {
    // Background hitam sesaat — tidak ada spinner (spinner sendiri butuh paint)
    return <div className="min-h-screen" style={{ background: '#120d0b' }} />;
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <WorkspaceGrid />
      <Footer />
    </main>
  );
}
