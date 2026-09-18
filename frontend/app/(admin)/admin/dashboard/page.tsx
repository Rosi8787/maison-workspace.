'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, CalendarCheck, Clock, TrendingUp, Building2, Tag, BarChart3, UserCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatCurrency, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const BG = '#120d0b';
const CARD = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1);
  const currentYear  = String(now.getFullYear());

  useEffect(() => {
    async function load() {
      try {
        const [reportRes, reservasiRes, memberRes] = await Promise.all([
          adminApi.getMonthlyReport(currentMonth, currentYear),
          adminApi.getReservasi(),
          adminApi.getMembers(),
        ]);
        setStats({
          report:         reportRes.data,
          totalReservasi: reservasiRes.data.length,
          totalMember:    memberRes.data.length,
          pending:        reservasiRes.data.filter((r: any) => r.status === 'belum_dikonfirm').length,
        });
      } catch {
        // degrade gracefully
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>
          Overview of your coworking space
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { Icon: Users,        label: 'Total Members',       value: stats?.totalMember ?? '-',                        color: '#c9a77a', href: '/admin/members' },
          { Icon: CalendarCheck,label: 'Total Reservations',  value: stats?.totalReservasi ?? '-',                     color: '#60a5fa', href: '/admin/reservasi' },
          { Icon: Clock,        label: 'Pending Confirmation',value: stats?.pending ?? '-',                            color: '#fbbf24', href: '/admin/reservasi' },
          { Icon: TrendingUp,   label: 'Revenue This Month',  value: formatCurrency(stats?.report?.total_pendapatan ?? 0), color: '#4ade80', href: '/admin/reports', small: true },
        ].map(({ Icon, label, value, color, href, small }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <Link
              href={href}
              className="block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}25` }}
                >
                  <Icon size={17} style={{ color }} />
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#7a6a5a' }}>{label}</p>
              <p className={`font-semibold ${small ? 'text-lg' : 'text-3xl'}`} style={{ color: '#f4eee7' }}>{value}</p>
              {/* subtle top accent */}
              <div className="absolute top-0 left-4 right-4 h-px rounded-full" style={{ background: `linear-gradient(90deg,transparent,${color}30,transparent)` }} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: '#7a6a5a' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/admin/reservasi', Icon: CalendarCheck, label: 'Manage Reservations', desc: 'Confirm, check-in, check-out' },
            { href: '/admin/spaces',    Icon: Building2,     label: 'Manage Spaces',       desc: 'Add, edit, remove spaces' },
            { href: '/admin/members',   Icon: Users,         label: 'Manage Members',      desc: 'Member data management' },
            { href: '/admin/diskon',    Icon: Tag,           label: 'Discounts',           desc: 'Promo codes & discounts' },
            { href: '/admin/reports',   Icon: BarChart3,     label: 'Reports',             desc: 'Monthly revenue summary' },
            { href: '/admin/profile',   Icon: UserCircle,    label: 'Admin Profile',       desc: 'Update coworking info' },
          ].map(({ href, Icon, label, desc }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.35 }}
            >
              <Link
                href={href}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1 group"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ background: 'rgba(201,167,122,0.10)', border: '1px solid rgba(201,167,122,0.18)' }}
                >
                  <Icon size={16} style={{ color: '#c9a77a' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#f4eee7' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
