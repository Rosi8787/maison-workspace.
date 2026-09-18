'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Timer, Building2, Users, CheckCircle, ArrowRight, X,
} from 'lucide-react';
import { spacesApi } from '@/lib/api';
import { formatCurrency, getTipeSpaceLabel, getErrorMessage, getImageUrl } from '@/lib/auth';
import { TIME_OPTIONS, DURATION_OPTIONS } from '@/lib/mock-data';
import type { Space, TipeSpace } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TYPE_FILTERS: { label: string; value: TipeSpace | '' }[] = [
  { label: 'All Types', value: '' },
  { label: 'Personal Desk', value: 'Personal_Desk' },
  { label: 'Private Office', value: 'Private_Office' },
  { label: 'Meeting Room', value: 'Meeting_Room' },
];

export default function DashboardBookingPanel() {
  const router = useRouter();
  const today  = new Date().toISOString().split('T')[0];

  // Filter state
  const [date, setDate]         = useState(today);
  const [time, setTime]         = useState('09:00');
  const [duration, setDuration] = useState(2);
  const [typeFilter, setTypeFilter] = useState<TipeSpace | ''>('');

  // Space state
  const [spaces, setSpaces]         = useState<Space[]>([]);
  const [filtered, setFiltered]     = useState<Space[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);
  const [checked, setChecked]       = useState(false);
  const [error, setError]           = useState('');

  // Initial load
  useEffect(() => {
    loadSpaces();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply type filter
  useEffect(() => {
    setFiltered(typeFilter ? spaces.filter((s) => s.tipe === typeFilter) : spaces);
  }, [typeFilter, spaces]);

  async function loadSpaces() {
    setLoading(true);
    setError('');
    try {
      const res = await spacesApi.getAll();
      setSpaces(res.data);
      setFiltered(res.data);
    } catch (e: any) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setChecked(false);
    try {
      const res = await spacesApi.getAvailability(date, time, duration);
      let data: Space[] = res.data;
      if (typeFilter) data = data.filter((s) => s.tipe === typeFilter);
      setSpaces(res.data);
      setFiltered(data);
      setChecked(true);
    } catch (e: any) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  function handleBook() {
    if (!selectedId) return;
    const params = new URLSearchParams({
      space_id: String(selectedId),
      tanggal: date,
      jam: time,
      durasi: String(duration),
    });
    router.push(`/reservation?${params.toString()}`);
  }

  const selectedSpace = spaces.find((s) => s.id === selectedId);

  return (
    <div className="space-y-6">
      {/* ── Section title ── */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.015em' }}>
          Book a Workspace
        </h2>
        <p className="text-sm mt-0.5" style={{ color: '#7a6a5a' }}>
          Select your date, time, and preferred space.
        </p>
      </div>

      {/* ── Filter bar ── */}
      <form
        onSubmit={handleCheck}
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(34,26,20,0.80)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Date */}
          <div>
            <label className="label flex items-center gap-1.5" htmlFor="db-date">
              <Calendar size={10} /> Date
            </label>
            <input id="db-date" type="date" className="input" min={today}
              value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {/* Time */}
          <div>
            <label className="label flex items-center gap-1.5" htmlFor="db-time">
              <Clock size={10} /> Start Time
            </label>
            <select id="db-time" className="input appearance-none cursor-pointer"
              value={time} onChange={(e) => setTime(e.target.value)}>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t} style={{ background: '#1c1410' }}>{t}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="label flex items-center gap-1.5" htmlFor="db-dur">
              <Timer size={10} /> Duration
            </label>
            <select id="db-dur" className="input appearance-none cursor-pointer"
              value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
              {DURATION_OPTIONS.map((d) => (
                <option key={d.value} value={d.value} style={{ background: '#1c1410' }}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="label flex items-center gap-1.5" htmlFor="db-type">
              <Building2 size={10} /> Space Type
            </label>
            <select id="db-type" className="input appearance-none cursor-pointer"
              value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TipeSpace | '')}>
              {TYPE_FILTERS.map((t) => (
                <option key={t.value} value={t.value} style={{ background: '#1c1410' }}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : null}
            Check Availability
          </button>
          {checked && (
            <button type="button" className="btn-secondary text-xs"
              onClick={() => { setChecked(false); loadSpaces(); }}>
              <X size={12} /> Clear
            </button>
          )}
          {checked && (
            <span className="text-xs" style={{ color: '#7a6a5a' }}>
              Showing availability for {date} at {time}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-3 text-xs" style={{ color: '#f87171' }}>{error}</p>
        )}
      </form>

      {/* ── Space grid ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: '#7a6a5a' }}>
          <Building2 size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No spaces found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((space, i) => {
            const isSelected  = selectedId === space.id;
            const unavailable = checked && space.tersedia === false;
            return (
              <motion.button
                key={space.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !unavailable && setSelectedId(isSelected ? null : space.id)}
                disabled={unavailable}
                className="text-left rounded-2xl overflow-hidden transition-all duration-200 group"
                style={{
                  background: isSelected ? 'rgba(201,167,122,0.10)' : 'rgba(34,26,20,0.80)',
                  border: isSelected
                    ? '1px solid rgba(201,167,122,0.40)'
                    : '1px solid rgba(255,255,255,0.08)',
                  opacity: unavailable ? 0.45 : 1,
                  cursor: unavailable ? 'not-allowed' : 'pointer',
                  boxShadow: isSelected ? '0 0 0 1px rgba(201,167,122,0.20)' : 'none',
                }}
                aria-pressed={isSelected}
                aria-label={`Select ${space.nama_space}`}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {space.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getImageUrl(space.foto) ?? ''}
                      alt={space.nama_space}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: '#261a0e' }}
                    >
                      <Building2 size={28} style={{ color: '#3d3028' }} />
                    </div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg,transparent 50%,rgba(18,13,11,0.6) 100%)' }}
                  />
                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
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
                  {checked && (
                    <div
                      className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: space.tersedia ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                        border: `1px solid ${space.tersedia ? 'rgba(74,222,128,0.30)' : 'rgba(248,113,113,0.30)'}`,
                        color: space.tersedia ? '#4ade80' : '#f87171',
                      }}
                    >
                      {space.tersedia ? 'Available' : 'Full'}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute bottom-2.5 right-2.5">
                      <CheckCircle size={18} style={{ color: '#c9a77a' }} />
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-1" style={{ color: '#f4eee7' }}>
                    {space.nama_space}
                  </h3>
                  {space.deskripsi && (
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: '#7a6a5a' }}>
                      {space.deskripsi}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#7a6a5a' }}>
                      <Users size={12} /> {space.kapasitas}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: '#c9a77a' }}>
                      {formatCurrency(space.harga_per_jam)}/hr
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ── Selected summary + CTA ── */}
      <AnimatePresence>
        {selectedSpace && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="sticky bottom-4 z-20"
          >
            <div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl px-5 py-4"
              style={{
                background: 'rgba(28,20,16,0.95)',
                border: '1px solid rgba(201,167,122,0.25)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
            >
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#7a6a5a' }}>Selected</p>
                <p className="text-sm font-semibold" style={{ color: '#f4eee7' }}>
                  {selectedSpace.nama_space}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>
                  {date} · {time} · {duration}h ·{' '}
                  <span style={{ color: '#c9a77a' }}>
                    {formatCurrency(Number(selectedSpace.harga_per_jam) * duration)}
                  </span>
                </p>
              </div>
              <button
                onClick={handleBook}
                className="btn-primary flex-shrink-0 group"
              >
                Proceed to Book
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
