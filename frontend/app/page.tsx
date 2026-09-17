'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isLoggedIn } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    const user = getUser();
    if (user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/spaces');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Memuat...</p>
      </div>
    </div>
  );
}
