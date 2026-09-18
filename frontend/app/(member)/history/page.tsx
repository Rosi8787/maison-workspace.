'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { History, Ticket, ArrowRight } from 'lucide-react';
import { reservasiApi } from '@/lib/api';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function HistoryPage() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [reservasi, setReservasi] = useState<Reservasi[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [bulan, setBulan]       = useState(currentMonth);

  useEffect(() => { loadHistory(bulan); }, [bulan]); // eslint-disable-line

  async function loadHistory(month: string) {
    setLoading(true);
    try {
      const res = await reservasiApi.getMyHistory(month);
      setReservasi(res.data);
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <DashboardHeader subtitle="Your complete booking history." />

      {/* Filter row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6 flex-wrap gap-4"
      >
        <div className="flex items-center gap-2">
          <History size={16} style={{ color: '#c9a77a' }} />
          <h2 className="text-base font-semibold" style={{ color: '#f4eee7' }}>
            Reservation History
          </h2>
        </div>
        <div>
          <label className="label sr-only" htmlFor="hist-month">Month</label>
          <input
            id="hist-month"
            type="month"
            className="input w-40"
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
          />
        </div>
      </motion.div>

      {error && <div className="mb-5"><Alert type="error" message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : reservasi.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
          style={{ color: '#7a6a5a' }}
        >
          <History size={40} className="mx-auto mb-3 opacity-25" />
          <p className="font-medium" style={{ color: '#b8a898' }}>No history for this period</p>
          <p className="text-sm mt-1">Try selecting a different month</p>
          <Link href="/reservation" className="btn-primary inline-flex mt-6">
            Make a Reservation
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {reservasi.map((r, i) => {
            const detail = r.detail_reservasi?.[0];
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="rounded-2xl p-5 transition-all duration-200 hover:bg-white/[0.02]"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: '#c9a77a' }}
                      >
                        {r.kode_reservasi}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#f4eee7' }}>
                      {detail?.space?.nama_space || '—'}
                    </p>
                    <p className="text-xs" style={{ color: '#7a6a5a' }}>
                      {formatDate(r.tanggal_reservasi)} · {formatTime(r.jam_mulai)} · {r.durasi_jam}h
                    </p>
                    {detail?.diskon && (
                      <p className="text-xs mt-1.5" style={{ color: '#4ade80' }}>
                        Discount: {detail.diskon.nama_diskon} ({detail.diskon.persentase_diskon}%)
                      </p>
                    )}
                  </div>

                  {/* Right: price + actions */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold mb-2" style={{ color: '#f4eee7' }}>
                      {formatCurrency(detail?.total_harga || 0)}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/reservation/${r.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#b8a898' }}
                      >
                        Detail <ArrowRight size={11} />
                      </Link>
                      {r.status !== 'dibatalkan' && (
                        <Link
                          href={`/reservation/${r.id}/eticket`}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          style={{ background: 'rgba(201,167,122,0.10)', border: '1px solid rgba(201,167,122,0.20)', color: '#c9a77a' }}
                        >
                          <Ticket size={11} /> E-Ticket
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
