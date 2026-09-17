'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn, isMember } from '@/lib/auth';
import MemberNav from '@/components/member/MemberNav';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    if (!isMember()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
