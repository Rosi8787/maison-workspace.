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
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getUser();
      if (user?.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/spaces');
      }
    } else {
      setChecked(true);
    }
  }, [router]);

  // While checking auth, render nothing (avoids flash)
  if (!checked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#120d0b' }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(201,167,122,0.5)', borderTopColor: 'transparent' }}
        />
      </div>
    );
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
