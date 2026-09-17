'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { reservasiApi } from '@/lib/api';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getStatusLabel, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function EticketPage() {
  const { id } = useParams();
  const [reservasi, setReservasi] = useState<Reservasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) loadEticket(parseInt(id as string));
  }, [id]);

  async function loadEticket(resId: number) {
    try {
      const res = await reservasiApi.getEticket(resId);
      setReservasi(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  if (error || !reservasi) return (
    <div><Alert type="error" message={error || 'E-ticket tidak ditemukan'} />
      <Link href="/reservation" className="btn-secondary mt-4 inline-block">← Kembali</Link>
    </div>
  );

  const detail = reservasi.detail_reservasi?.[0];

  return (
    <div className="max-w-lg mx-auto">
      {/* Action buttons — no-print */}
      <div className="flex gap-3 mb-6 no-print">
        <Link href={`/reservation/${reservasi.id}`} className="btn-secondary text-sm">← Kembali</Link>
        <button onClick={() => window.print()} className="btn-primary text-sm">🖨️ Cetak / Simpan PDF</button>
      </div>

      {/* E-ticket */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-primary-200" id="eticket">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">🎫 E-Ticket Reservasi</h1>
              <p className="text-primary-100 text-sm mt-1">Smart Coworking Space</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                reservasi.status === 'selesai' ? 'bg-white text-green-700' :
                reservasi.status === 'aktif' ? 'bg-green-400 text-white' :
                reservasi.status === 'disetujui' ? 'bg-blue-300 text-white' :
                'bg-yellow-300 text-gray-800'
              }`}>
                {getStatusLabel(reservasi.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Kode reservasi + QR */}
        <div className="p-6 flex items-center justify-between border-b bg-gray-50">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Kode Reservasi</p>
            <p className="text-2xl font-bold text-primary-600 font-mono tracking-wider">
              {reservasi.kode_reservasi}
            </p>
          </div>
          {reservasi.qr_code && (
            <div className="flex-shrink-0">
              <img
                src={reservasi.qr_code}
                alt="QR Code"
                className="w-24 h-24"
              />
              <p className="text-xs text-gray-400 text-center mt-1">Scan untuk Check-in</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {/* Member */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Informasi Member</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Nama</p>
                <p className="font-medium text-sm">{reservasi.member?.nama_member || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Instansi</p>
                <p className="font-medium text-sm">{reservasi.member?.instansi || '-'}</p>
              </div>
            </div>
          </div>

          <div className="border-t" />

          {/* Space */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Detail Reservasi</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">Ruang</p>
                <p className="font-medium text-sm">{detail?.space?.nama_space || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Tipe</p>
                <p className="font-medium text-sm">{detail?.space?.tipe?.replace(/_/g, ' ') || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Tanggal</p>
                <p className="font-medium text-sm">{formatDate(reservasi.tanggal_reservasi)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Jam Mulai</p>
                <p className="font-medium text-sm">{formatTime(reservasi.jam_mulai)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Durasi</p>
                <p className="font-medium text-sm">{reservasi.durasi_jam} jam</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Kapasitas</p>
                <p className="font-medium text-sm">{detail?.space?.kapasitas || '-'} orang</p>
              </div>
            </div>
          </div>

          <div className="border-t" />

          {/* Harga */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Pembayaran</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {formatCurrency(detail?.space?.harga_per_jam || 0)} × {reservasi.durasi_jam} jam
                </span>
                <span>
                  {formatCurrency(
                    parseFloat(String(detail?.space?.harga_per_jam || 0)) * reservasi.durasi_jam
                  )}
                </span>
              </div>
              {detail?.diskon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Diskon ({detail.diskon.persentase_diskon}%)</span>
                  <span>
                    -{formatCurrency(
                      parseFloat(String(detail.space.harga_per_jam || 0)) * reservasi.durasi_jam *
                      parseFloat(String(detail.diskon.persentase_diskon)) / 100
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total Bayar</span>
                <span className="text-primary-600">{formatCurrency(detail?.total_harga || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <p className="text-xs text-gray-400">
            Dicetak pada {new Date().toLocaleString('id-ID')} •
            {reservasi.owner?.nama_coworking}
          </p>
        </div>
      </div>
    </div>
  );
}
