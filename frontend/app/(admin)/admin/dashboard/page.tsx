'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { formatCurrency, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1);
  const currentYear = String(now.getFullYear());

  useEffect(() => {
    async function loadStats() {
      try {
        const [reportRes, reservasiRes, memberRes] = await Promise.all([
          adminApi.getMonthlyReport(currentMonth, currentYear),
          adminApi.getReservasi(),
          adminApi.getMembers(),
        ]);
        setStats({
          report: reportRes.data,
          totalReservasi: reservasiRes.data.length,
          totalMember: memberRes.data.length,
          pending: reservasiRes.data.filter((r: any) => r.status === 'belum_dikonfirm').length,
        });
      } catch (err) {
        // Dashboard degradasi gracefully
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">📊 Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="👥" title="Total Member"
          value={stats?.totalMember ?? '-'} color="blue"
          href="/admin/members"
        />
        <StatCard
          icon="📅" title="Total Reservasi"
          value={stats?.totalReservasi ?? '-'} color="green"
          href="/admin/reservasi"
        />
        <StatCard
          icon="⏳" title="Menunggu Konfirmasi"
          value={stats?.pending ?? '-'} color="yellow"
          href="/admin/reservasi?status=belum_dikonfirm"
        />
        <StatCard
          icon="💰" title="Pendapatan Bulan Ini"
          value={formatCurrency(stats?.report?.total_pendapatan ?? 0)} color="primary"
          href="/admin/reports"
          small
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/reservasi', icon: '📅', label: 'Kelola Reservasi', desc: 'Konfirmasi, check-in, check-out' },
          { href: '/admin/spaces', icon: '🏢', label: 'Kelola Space', desc: 'Tambah, edit, hapus ruang' },
          { href: '/admin/members', icon: '👥', label: 'Kelola Member', desc: 'Manajemen data member' },
          { href: '/admin/diskon', icon: '🏷️', label: 'Kelola Diskon', desc: 'Promo dan kode diskon' },
          { href: '/admin/reports', icon: '📈', label: 'Laporan', desc: 'Rekap pendapatan bulanan' },
          { href: '/admin/profile', icon: '⚙️', label: 'Profil Admin', desc: 'Update info coworking space' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="card hover:shadow-md transition-shadow flex items-start gap-4 cursor-pointer">
            <span className="text-3xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, href, small = false }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    primary: 'bg-primary-600',
  };
  return (
    <Link href={href} className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`font-bold mt-1 text-gray-900 ${small ? 'text-lg' : 'text-3xl'}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center text-2xl text-white`}>
          {icon}
        </div>
      </div>
    </Link>
  );
}
