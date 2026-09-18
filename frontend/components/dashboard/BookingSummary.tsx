'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, Layers, Clock, ArrowRight } from 'lucide-react';
import { reservasiApi } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/auth';
import type { Reservasi } from '@/types';

interface SummaryCardProps {
  title: string;
  value: string | React.ReactNode;
  sub?: string;
  Icon: React.ElementType;
  accentColor?: string;
  href?: string;
  index?: number;
}

function SummaryCard({ title, value, sub, Icon, accentColor = '#c9a77a', href, index = 0 }: SummaryCardProps) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="group relative rounded-2xl p-5 transition-all duration-300"
      style={{
        background: 'rgba(34,26,20,0.80)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      whileHover={href ? { y: -3, transition: { duration: 0.2 } } : undefined}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}25` }}
      >
        <Icon size={17} style={{ color: accentColor }} />
      </div>

      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#7a6a5a' }}>
        {title}
      </p>

      <div className="text-base font-semibold mb-1 leading-snug" style={{ color: '#f4eee7' }}>
        {value}
      </div>

      {sub && <p className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>{sub}</p>}

      {href && (
        <div
          className="flex items-center gap-1 mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: accentColor }}
        >
          View details
          <ArrowRight size={11} />
        </div>
      )}

      {/* Subtle top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-px rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }}
      />
    </motion.div>
  );

  if (href) return <Link href={href} className="block">{inner}</Link>;
  return inner;
}

export default function BookingSummary() {
  const [upcoming, setUpcoming] = useState<Reservasi | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await reservasiApi.getMy();
        const all: Reservasi[] = res.data;
        setTotalCount(all.length);

        // Find the closest upcoming approved/active booking
        const now = new Date();
        const active = all
          .filter((r) => r.status === 'disetujui' || r.status === 'aktif')
          .sort(
            (a, b) =>
              new Date(a.tanggal_reservasi).getTime() -
              new Date(b.tanggal_reservasi).getTime()
          );
        setUpcoming(active[0] ?? null);
      } catch {
        // silently fail — summary is non-critical
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const upcomingSpace = upcoming?.detail_reservasi?.[0]?.space?.nama_space ?? 'Booked Space';
  const endHour = upcoming
    ? (() => {
        const [h, m] = (upcoming.jam_mulai ?? '00:00').split(':').map(Number);
        const end = new Date(0, 0, 0, h + (upcoming.durasi_jam ?? 0), m);
        return `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;
      })()
    : null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-36 rounded-2xl animate-pulse"
            style={{ background: 'rgba(34,26,20,0.60)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {/* Upcoming Booking */}
      <SummaryCard
        index={0}
        Icon={CalendarCheck}
        accentColor="#c9a77a"
        title="Upcoming Booking"
        href={upcoming ? `/reservation/${upcoming.id}` : '/reservation'}
        value={
          upcoming ? (
            <span>{upcomingSpace}</span>
          ) : (
            <span style={{ color: '#7a6a5a', fontSize: '0.875rem', fontWeight: 400 }}>
              No upcoming bookings
            </span>
          )
        }
        sub={
          upcoming
            ? `${formatDate(upcoming.tanggal_reservasi)} · ${formatTime(upcoming.jam_mulai)} – ${endHour}`
            : undefined
        }
      />

      {/* Active Membership */}
      <SummaryCard
        index={1}
        Icon={Layers}
        accentColor="#a07a4a"
        title="Active Membership"
        value="Premium Member"
        sub="Valid until 31 Dec 2026"
      />

      {/* Total Bookings */}
      <SummaryCard
        index={2}
        Icon={Clock}
        accentColor="#7a6a5a"
        title="Total Bookings"
        href="/history"
        value={`${totalCount} Booking${totalCount !== 1 ? 's' : ''}`}
        sub="All time"
      />
    </div>
  );
}
