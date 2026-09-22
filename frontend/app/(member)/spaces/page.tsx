'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Timer, Building2, Users, Search, X, ArrowRight,
} from 'lucide-react';
import { spacesApi } from '@/lib/api';
import { formatCurrency, getTipeSpaceLabel, getErrorMessage, getImageUrl } from '@/lib/auth';
import { TIME_OPTIONS, DURATION_OPTIONS } from '@/lib/mock-data';
import { cachedFetch, getCache, invalidateCache } from '@/lib/cache';
import type { Space, TipeSpace } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import BookingSummary from '@/components/dashboard/BookingSummary';

const TYPE_FILTERS: { label: string; value: TipeSpace | '' }[] = [
  { label: 'All Types',      value: '' },
  { label: 'Personal Desk',  value: 'Personal_Desk' },
  { label: 'Private Office', value: 'Private_Office' },
  { label: 'Meeting Room',   value: 'Meeting_Room' },
];

export default function SpacesPage() {
  const today = new Date().toISOString().split('T')[0];

  const CACHE_KEY = 'spaces-all';

  // Baca cache synchronous sebagai initial state — tidak ada loading jika cache ada
  const cached = getCache<Space[]>(CACHE_KEY, 60);
  const [spaces, setSpaces]           = useState<Space[]>(cached ?? []);
  const [filtered, setFiltered]       = useState<Space[]>(cached ?? []);
  const [filterTipe, setFilterTipe]   = useState<TipeSpace | ''>('');
  const [loading, setLoading]         = useState(!cached); // tidak loading jika ada cache
  const [error, setError]             = useState('');
  const [availabilityMode, setAvMode] = useState(false);

  // Filter form
  const [tanggal, setTanggal]   = useState('');
  const [jamMulai, setJamMulai] = useState('09:00');
  const [durasi, setDurasi]     = useState(2);

  useEffect(() => { loadSpaces(); }, []);

  useEffect(() => {
    setFiltered(filterTipe ? spaces.filter((s) => s.tipe === filterTipe) : spaces);
  }, [filterTipe, spaces]);

  async function loadSpaces() {
    // Jika ada cache, set loading false agar tidak tampil spinner
    // Tetap fetch baru di background untuk update data
    if (!getCache(CACHE_KEY, 60)) setLoading(true);
    try {
      const data = await cachedFetch<Space[]>(CACHE_KEY, () => spacesApi.getAll(), 60);
      setSpaces(data);
      setFiltered(filterTipe ? data.filter((s) => s.tipe === filterTipe) : data);
    } catch (e: any) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckAvailability(e: React.FormEvent) {
    e.preventDefault();
    if (!tanggal) return;
    setLoading(true);
    try {
      const res = await spacesApi.getAvailability(tanggal, jamMulai, durasi);
      let data: Space[] = res.data;
      if (filterTipe) data = data.filter((s) => s.tipe === filterTipe);
      setSpaces(res.data);
      setFiltered(data);
      setAvMode(true);
    } catch (e: any) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  function clearAvailability() {
    setTanggal(''); setJamMulai('09:00'); setDurasi(2);
    setAvMode(false);
    loadSpaces();
  }

  return (
    <div>
      {/* Header */}
      <DashboardHeader subtitle="Browse and book the perfect workspace for your day." />

      {/* Summary cards */}
      <BookingSummary />

      {/* ── Availability checker ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="rounded-2xl p-5 mb-6"
        style={{
          background: 'rgba(34,26,20,0.80)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: '#f4eee7' }}>
          <Search size={15} style={{ color: '#c9a77a' }} />
          Check Availability
        </h2>

        <form onSubmit={handleCheckAvailability} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="label flex items-center gap-1.5" htmlFor="sp-date">
              <Calendar size={10} /> Date
            </label>
            <input id="sp-date" type="date" className="input" min={today}
              value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>

          <div>
            <label className="label flex items-center gap-1.5" htmlFor="sp-time">
              <Clock size={10} /> Start Time
            </label>
            <select id="sp-time" className="input appearance-none cursor-pointer"
              value={jamMulai} onChange={(e) => setJamMulai(e.target.value)}>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t} style={{ background: '#1c1410' }}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label flex items-center gap-1.5" htmlFor="sp-dur">
              <Timer size={10} /> Duration
            </label>
            <select id="sp-dur" className="input appearance-none cursor-pointer"
              value={durasi} onChange={(e) => setDurasi(Number(e.target.value))}>
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value} style={{ background: '#1c1410' }}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={!tanggal || loading}>
              Check
            </button>
            {availabilityMode && (
              <button type="button" onClick={clearAvailability} className="btn-secondary px-3 py-2.5">
                <X size={14} />
              </button>
            )}
          </div>
        </form>

        {availabilityMode && (
          <p className="mt-3 text-xs" style={{ color: '#c9a77a' }}>
            Showing availability for {tanggal} at {jamMulai}, {durasi}h
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs" style={{ color: '#f87171' }}>{error}</p>
        )}
      </motion.div>

      {/* ── Type filter pills ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
        role="group"
        aria-label="Filter by space type"
      >
        {TYPE_FILTERS.map((opt) => {
          const isActive = filterTipe === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setFilterTipe(opt.value)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
              style={{
                background: isActive ? '#c9a77a' : 'rgba(255,255,255,0.06)',
                color:      isActive ? '#1a1008' : '#7a6a5a',
                border:     isActive ? '1px solid #c9a77a' : '1px solid rgba(255,255,255,0.10)',
                boxShadow:  isActive ? '0 2px 12px rgba(201,167,122,0.25)' : 'none',
              }}
              aria-pressed={isActive}
            >
              {opt.label}
            </button>
          );
        })}
      </motion.div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#7a6a5a' }}>
          <Building2 size={40} className="mx-auto mb-3 opacity-25" />
          <p className="text-base font-medium" style={{ color: '#b8a898' }}>No spaces available</p>
          <p className="text-sm mt-1">Try adjusting your filters or date</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((space, i) => (
              <SpaceCard key={space.id} space={space} index={i} availabilityMode={availabilityMode} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── SpaceCard ─────────────────────────── */

function SpaceCard({
  space,
  index,
  availabilityMode,
}: {
  space: Space;
  index: number;
  availabilityMode: boolean;
}) {
  const unavailable = availabilityMode && space.tersedia === false;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: unavailable ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={unavailable ? undefined : {
        y: -6,
        rotate: -0.4,
        transition: { duration: 0.2, ease: [0.34, 1.3, 0.64, 1] },
      }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(34,26,20,0.80)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {space.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getImageUrl(space.foto) ?? ''}
            alt={space.nama_space}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'rgba(38,26,14,0.9)' }}
          >
            <Building2 size={32} style={{ color: '#3d3028' }} />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg,transparent 40%,rgba(18,13,11,0.65) 100%)' }}
        />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(18,13,11,0.80)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#c9a77a',
              backdropFilter: 'blur(8px)',
            }}
          >
            {getTipeSpaceLabel(space.tipe)}
          </span>
        </div>

        {/* Availability badge */}
        {availabilityMode && (
          <div className="absolute top-3 right-3">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: space.tersedia ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                border: `1px solid ${space.tersedia ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)'}`,
                color: space.tersedia ? '#4ade80' : '#f87171',
                backdropFilter: 'blur(8px)',
              }}
            >
              {space.tersedia ? 'Available' : 'Full'}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-sm font-semibold mb-1.5" style={{ color: '#f4eee7' }}>
          {space.nama_space}
        </h3>
        {space.deskripsi && (
          <p className="text-xs mb-4 line-clamp-2 leading-relaxed" style={{ color: '#7a6a5a' }}>
            {space.deskripsi}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#7a6a5a' }}>
            <Users size={12} />
            {space.kapasitas} people
          </span>
          <span className="text-sm font-semibold" style={{ color: '#c9a77a' }}>
            {formatCurrency(space.harga_per_jam)}/hr
          </span>
        </div>

        <Link
          href={`/spaces/${space.id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group/btn"
          style={{
            background: 'rgba(201,167,122,0.10)',
            border: '1px solid rgba(201,167,122,0.20)',
            color: '#c9a77a',
          }}
          aria-label={`View details for ${space.nama_space}`}
        >
          View Details
          <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>

      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: '0 0 0 1px rgba(201,167,122,0.22)' }}
      />
    </motion.article>
  );
}
