'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Ticket, X } from 'lucide-react';
import { reservasiApi } from '@/lib/api';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function ReservationDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const [reservasi, setReservasi] = useState<Reservasi | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    if (id) loadReservasi(parseInt(id as string));
  }, [id]);

  async function loadReservasi(resId: number) {
    try { const res = await reservasiApi.getOne(resId); setReservasi(res.data); }
    catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleCancel() {
    if (!reservasi) return;
    setCancelling(true);
    try {
      await reservasiApi.cancel(reservasi.id);
      setShowCancel(false);
      loadReservasi(reservasi.id);
    } catch (err: any) { setError(getErrorMessage(err)); setShowCancel(false); }
    finally { setCancelling(false); }
  }

  if (loading) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;

  if (error || !reservasi) return (
    <div className="max-w-2xl">
      <Alert type="error" message={error || 'Reservation not found'} />
      <Link href="/reservation" className="btn-secondary mt-4 inline-flex">
        <ArrowLeft size={14} /> Back
      </Link>
    </div>
  );

  const detail    = reservasi.detail_reservasi?.[0];
  const canCancel = ['belum_dikonfirm', 'disetujui'].includes(reservasi.status);

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <Link
          href="/reservation"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#7a6a5a' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a77a')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6a5a')}
        >
          <ArrowLeft size={14} /> Back to reservations
        </Link>
      </motion.div>

      {error && <div className="mb-5"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div>
            <p className="text-xs mb-1" style={{ color: '#7a6a5a' }}>Reservation Code</p>
            <p className="text-lg font-bold font-mono" style={{ color: '#c9a77a' }}>{reservasi.kode_reservasi}</p>
          </div>
          <StatusBadge status={reservasi.status} />
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 gap-px" style={{ background: BORDER }}>
          {[
            { label: 'Space',     value: detail?.space?.nama_space || '-' },
            { label: 'Type',      value: detail?.space?.tipe?.replace(/_/g, ' ') || '-' },
            { label: 'Date',      value: formatDate(reservasi.tanggal_reservasi) },
            { label: 'Start Time',value: formatTime(reservasi.jam_mulai) },
            { label: 'Duration',  value: `${reservasi.durasi_jam} hour${reservasi.durasi_jam > 1 ? 's' : ''}` },
            { label: 'Total',     value: formatCurrency(detail?.total_harga || 0), accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="px-5 py-4" style={{ background: '#1c1410' }}>
              <p className="text-xs mb-1" style={{ color: '#7a6a5a' }}>{label}</p>
              <p className="text-sm font-medium" style={{ color: accent ? '#c9a77a' : '#f4eee7' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Discount */}
        {detail?.diskon && (
          <div className="mx-6 mt-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)' }}>
            <p className="text-sm font-medium" style={{ color: '#4ade80' }}>
              Discount applied: {detail.diskon.nama_diskon} ({detail.diskon.persentase_diskon}% off)
            </p>
          </div>
        )}

        {/* Check-in / Check-out times */}
        {reservasi.checkin_at && (
          <div className="mx-6 mt-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#7a6a5a' }}>Check-in</p>
                <p style={{ color: '#b8a898' }}>{new Date(reservasi.checkin_at).toLocaleString('id-ID')}</p>
              </div>
              {reservasi.checkout_at && (
                <div>
                  <p className="text-xs mb-0.5" style={{ color: '#7a6a5a' }}>Check-out</p>
                  <p style={{ color: '#b8a898' }}>{new Date(reservasi.checkout_at).toLocaleString('id-ID')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-5 flex gap-3 mt-2">
          <Link
            href={`/reservation/${reservasi.id}/eticket`}
            className="btn-primary flex-1 justify-center group"
          >
            <Ticket size={15} />
            View E-Ticket
          </Link>
          {canCancel && (
            <button
              onClick={() => setShowCancel(true)}
              className="btn-danger flex items-center gap-2"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </motion.div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        title="Cancel Reservation"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowCancel(false)} className="btn-secondary flex-1">Keep It</button>
            <button onClick={handleCancel} disabled={cancelling} className="btn-danger flex-1">
              {cancelling && <LoadingSpinner size="sm" />} Yes, Cancel
            </button>
          </div>
        }
      >
        <p className="text-sm" style={{ color: '#b8a898' }}>
          Are you sure you want to cancel reservation{' '}
          <span className="font-mono font-semibold" style={{ color: '#f4eee7' }}>{reservasi.kode_reservasi}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
