'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Tag, ArrowRight, CheckCircle, X } from 'lucide-react';
import { spacesApi, diskonApi, reservasiApi } from '@/lib/api';
import { Space, Diskon, Reservasi } from '@/types';
import { formatCurrency, getErrorMessage, formatDate, formatTime, getImageUrl } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function ReservationPage() {
  const searchParams       = useSearchParams();
  const router             = useRouter();
  const preselectedSpaceId = searchParams.get('space_id');

  const [spaces, setSpaces]       = useState<Space[]>([]);
  const [myReservasi, setMyReservasi] = useState<Reservasi[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  const [idSpace, setIdSpace]     = useState(preselectedSpaceId || '');
  const [tanggal, setTanggal]     = useState('');
  const [jamMulai, setJamMulai]   = useState('08:00');
  const [durasi, setDurasi]       = useState('1');
  const [kodeDiskon, setKodeDiskon] = useState('');
  const [diskon, setDiskon]       = useState<Diskon | null>(null);
  const [checkingDiskon, setCheckingDiskon] = useState(false);
  const [diskonError, setDiskonError] = useState('');

  const selectedSpace = spaces.find((s) => s.id === parseInt(idSpace));
  const todayStr      = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function load() {
      try {
        const [spacesRes, resRes] = await Promise.all([spacesApi.getAll(), reservasiApi.getMy()]);
        setSpaces(spacesRes.data);
        setMyReservasi(resRes.data);
      } catch (err: any) { setError(getErrorMessage(err)); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  // Pre-fill from query params
  useEffect(() => {
    const t = searchParams.get('tanggal');
    const j = searchParams.get('jam');
    const d = searchParams.get('durasi');
    if (t) setTanggal(t);
    if (j) setJamMulai(j);
    if (d) setDurasi(d);
  }, [searchParams]);

  async function handleCheckDiskon() {
    if (!kodeDiskon.trim()) return;
    setCheckingDiskon(true); setDiskonError(''); setDiskon(null);
    try { const res = await diskonApi.check(kodeDiskon); setDiskon(res.data); }
    catch (err: any) { setDiskonError(getErrorMessage(err)); }
    finally { setCheckingDiskon(false); }
  }

  const totalAwal   = selectedSpace ? parseFloat(String(selectedSpace.harga_per_jam)) * parseInt(durasi || '0') : 0;
  const potongan    = diskon ? (totalAwal * parseFloat(String(diskon.persentase_diskon))) / 100 : 0;
  const totalBayar  = totalAwal - potongan;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idSpace || !tanggal || !jamMulai || !durasi) { setError('All fields are required'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await reservasiApi.create({
        id_space:          parseInt(idSpace),
        tanggal_reservasi: tanggal,
        jam_mulai:         jamMulai,
        durasi_jam:        parseInt(durasi),
        kode_diskon:       kodeDiskon || undefined,
      });
      setSuccess('Reservation created successfully!');
      setTimeout(() => router.push(`/reservation/${res.data.id}`), 1500);
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setSubmitting(false); }
  }

  if (loading) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <DashboardHeader subtitle="Choose a space and set your schedule." />

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h2 className="text-base font-semibold mb-6 tracking-tight" style={{ color: '#f4eee7' }}>
              New Reservation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Space selector */}
              <div>
                <label className="label" htmlFor="res-space">Select Space *</label>
                <select
                  id="res-space"
                  className="input appearance-none"
                  value={idSpace}
                  onChange={(e) => setIdSpace(e.target.value)}
                  required
                >
                  <option value="" style={{ background: '#1c1410' }}>— Choose a space —</option>
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id} style={{ background: '#1c1410' }}>
                      {s.nama_space} — {formatCurrency(s.harga_per_jam)}/hr ({s.tipe.replace(/_/g,' ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected space preview */}
              {selectedSpace && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: 'rgba(201,167,122,0.07)', border: '1px solid rgba(201,167,122,0.18)' }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: '#261a0e' }}>
                    {selectedSpace.foto
                      ? <img src={getImageUrl(selectedSpace.foto) ?? ''} alt="" className="w-full h-full object-cover" /> // eslint-disable-line
                      : <div className="w-full h-full flex items-center justify-center"><Building2 size={20} style={{ color: '#3d3028' }} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#f4eee7' }}>{selectedSpace.nama_space}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>{selectedSpace.tipe.replace(/_/g,' ')}</p>
                  </div>
                  <span className="font-semibold text-sm flex-shrink-0" style={{ color: '#c9a77a' }}>
                    {formatCurrency(selectedSpace.harga_per_jam)}/hr
                  </span>
                </motion.div>
              )}

              {/* Date / Time / Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label" htmlFor="res-date">Date *</label>
                  <input id="res-date" type="date" className="input" min={todayStr} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                </div>
                <div>
                  <label className="label" htmlFor="res-time">Start Time *</label>
                  <input id="res-time" type="time" className="input" value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} required />
                </div>
                <div>
                  <label className="label" htmlFor="res-dur">Duration (hrs) *</label>
                  <input id="res-dur" type="number" className="input" min="1" max="24" value={durasi} onChange={(e) => setDurasi(e.target.value)} required />
                </div>
              </div>

              {/* Discount code */}
              <div>
                <label className="label" htmlFor="res-disc">Discount Code (optional)</label>
                <div className="flex gap-2">
                  <input
                    id="res-disc"
                    className="input flex-1"
                    placeholder="Enter promo code"
                    value={kodeDiskon}
                    onChange={(e) => { setKodeDiskon(e.target.value.toUpperCase()); setDiskon(null); setDiskonError(''); }}
                  />
                  <button
                    type="button"
                    onClick={handleCheckDiskon}
                    disabled={checkingDiskon || !kodeDiskon}
                    className="btn-glass flex-shrink-0"
                  >
                    {checkingDiskon ? <LoadingSpinner size="sm" /> : <Tag size={14} />}
                    Apply
                  </button>
                </div>
                {diskonError && <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>{diskonError}</p>}
                {diskon && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.20)' }}
                  >
                    <CheckCircle size={13} style={{ color: '#4ade80' }} />
                    <span className="text-xs" style={{ color: '#4ade80' }}>
                      {diskon.nama_diskon} — {diskon.persentase_diskon}% off
                    </span>
                    <button type="button" onClick={() => { setDiskon(null); setKodeDiskon(''); }} className="ml-auto">
                      <X size={12} style={{ color: '#4ade80' }} />
                    </button>
                  </motion.div>
                )}
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full group">
                {submitting ? <><LoadingSpinner size="sm" /> Processing…</> : <>
                  Confirm Reservation
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </>}
              </button>
            </form>
          </div>
        </motion.div>

        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Price breakdown */}
          {selectedSpace && (
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#7a6a5a' }}>
                Price Summary
              </h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between" style={{ color: '#b8a898' }}>
                  <span>{formatCurrency(selectedSpace.harga_per_jam)} × {durasi || 0} hr</span>
                  <span>{formatCurrency(totalAwal)}</span>
                </div>
                {diskon && (
                  <div className="flex justify-between" style={{ color: '#4ade80' }}>
                    <span>Discount ({diskon.persentase_diskon}%)</span>
                    <span>−{formatCurrency(potongan)}</span>
                  </div>
                )}
                <div
                  className="flex justify-between pt-2.5 font-semibold text-base"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: '#f4eee7' }}
                >
                  <span>Total</span>
                  <span style={{ color: '#c9a77a' }}>{formatCurrency(totalBayar)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Active reservations */}
          <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#7a6a5a' }}>
              My Reservations
            </h3>
            {myReservasi.length === 0 ? (
              <p className="text-xs" style={{ color: '#7a6a5a' }}>No reservations yet</p>
            ) : (
              <div className="space-y-2">
                {myReservasi.slice(0, 4).map((r) => (
                  <Link
                    key={r.id}
                    href={`/reservation/${r.id}`}
                    className="flex items-center justify-between p-3 rounded-xl transition-colors group"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="min-w-0 mr-3">
                      <p className="text-xs font-medium truncate" style={{ color: '#f4eee7' }}>
                        {r.detail_reservasi?.[0]?.space?.nama_space || r.kode_reservasi}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#7a6a5a' }}>
                        {formatDate(r.tanggal_reservasi)} · {formatTime(r.jam_mulai)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </Link>
                ))}
                {myReservasi.length > 4 && (
                  <Link href="/history" className="block text-center text-xs py-2" style={{ color: '#c9a77a' }}>
                    View all →
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
