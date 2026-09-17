'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn, isAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    if (!isAdmin()) {
      router.push('/spaces');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
