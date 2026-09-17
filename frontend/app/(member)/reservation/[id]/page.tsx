'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { reservasiApi } from '@/lib/api';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

export default function ReservationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reservasi, setReservasi] = useState<Reservasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (id) loadReservasi(parseInt(id as string));
  }, [id]);

  async function loadReservasi(resId: number) {
    try {
      const res = await reservasiApi.getOne(resId);
      setReservasi(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!reservasi) return;
    setCancelling(true);
    try {
      await reservasiApi.cancel(reservasi.id);
      setShowCancelModal(false);
      loadReservasi(reservasi.id);
    } catch (err: any) {
      setError(getErrorMessage(err));
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  if (error || !reservasi) return (
    <div><Alert type="error" message={error || 'Reservasi tidak ditemukan'} />
      <Link href="/reservation" className="btn-secondary mt-4 inline-block">← Kembali</Link>
    </div>
  );

  const detail = reservasi.detail_reservasi?.[0];
  const canCancel = ['belum_dikonfirm', 'disetujui'].includes(reservasi.status);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/reservation" className="text-sm text-primary-600 hover:underline">← Kembali</Link>
        <h1 className="text-xl font-bold text-gray-900">Detail Reservasi</h1>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

      <div className="card space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500">Kode Reservasi</p>
            <p className="text-lg font-bold text-primary-600">{reservasi.kode_reservasi}</p>
          </div>
          <StatusBadge status={reservasi.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div>
            <p className="text-xs text-gray-500">Ruang</p>
            <p className="font-medium">{detail?.space?.nama_space || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tipe</p>
            <p className="font-medium">{detail?.space?.tipe?.replace('_', ' ') || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tanggal</p>
            <p className="font-medium">{formatDate(reservasi.tanggal_reservasi)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Jam Mulai</p>
            <p className="font-medium">{formatTime(reservasi.jam_mulai)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Durasi</p>
            <p className="font-medium">{reservasi.durasi_jam} jam</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Bayar</p>
            <p className="font-bold text-primary-600">{formatCurrency(detail?.total_harga || 0)}</p>
          </div>
        </div>

        {detail?.diskon && (
          <div className="p-3 bg-green-50 rounded-lg text-sm">
            <p className="text-green-700 font-medium">Diskon: {detail.diskon.nama_diskon} ({detail.diskon.persentase_diskon}%)</p>
          </div>
        )}

        {reservasi.checkin_at && (
          <div className="text-sm text-gray-600">
            <span>Check-in: {new Date(reservasi.checkin_at).toLocaleString('id-ID')}</span>
          </div>
        )}
        {reservasi.checkout_at && (
          <div className="text-sm text-gray-600">
            <span>Check-out: {new Date(reservasi.checkout_at).toLocaleString('id-ID')}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link href={`/reservation/${reservasi.id}/eticket`} className="btn-primary flex-1 text-center text-sm">
            🎫 Lihat E-Ticket
          </Link>
          {canCancel && (
            <button onClick={() => setShowCancelModal(true)} className="btn-danger text-sm">
              Batalkan
            </button>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Konfirmasi Pembatalan"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowCancelModal(false)} className="btn-secondary flex-1">Tidak</button>
            <button onClick={handleCancel} disabled={cancelling} className="btn-danger flex-1 flex items-center justify-center gap-2">
              {cancelling && <LoadingSpinner size="sm" />}
              Ya, Batalkan
            </button>
          </div>
        }
      >
        <p className="text-gray-700">
          Apakah Anda yakin ingin membatalkan reservasi <strong>{reservasi.kode_reservasi}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}
