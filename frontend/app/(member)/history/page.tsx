'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { reservasiApi } from '@/lib/api';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import StatusBadge from '@/components/ui/StatusBadge';

export default function HistoryPage() {
  const [reservasi, setReservasi] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter bulan
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [bulan, setBulan] = useState(currentMonth);

  useEffect(() => {
    loadHistory(bulan);
  }, [bulan]);

  async function loadHistory(month: string) {
    setLoading(true);
    try {
      const res = await reservasiApi.getMyHistory(month);
      setReservasi(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 Histori Reservasi</h1>
          <p className="text-gray-500 mt-1">Riwayat pemesanan ruang Anda</p>
        </div>
        <div>
          <input type="month" className="input"
            value={bulan} onChange={(e) => setBulan(e.target.value)} />
        </div>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : reservasi.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-lg font-medium">Tidak ada histori reservasi</p>
          <p className="text-sm mt-1">Belum ada reservasi pada bulan ini</p>
          <Link href="/reservation" className="btn-primary inline-block mt-4">Buat Reservasi</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservasi.map((r) => {
            const detail = r.detail_reservasi?.[0];
            return (
              <div key={r.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-primary-600 text-sm font-mono">{r.kode_reservasi}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="font-medium text-gray-900">{detail?.space?.nama_space || '-'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(r.tanggal_reservasi)} • {formatTime(r.jam_mulai)} • {r.durasi_jam} jam
                    </p>
                    {detail?.diskon && (
                      <p className="text-xs text-green-600 mt-1">
                        Diskon: {detail.diskon.nama_diskon} ({detail.diskon.persentase_diskon}%)
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(detail?.total_harga || 0)}</p>
                    <div className="flex gap-2 mt-2">
                      <Link href={`/reservation/${r.id}`} className="text-xs text-primary-600 hover:underline">
                        Detail
                      </Link>
                      {r.status !== 'dibatalkan' && (
                        <Link href={`/reservation/${r.id}/eticket`} className="text-xs text-primary-600 hover:underline">
                          E-Ticket
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
