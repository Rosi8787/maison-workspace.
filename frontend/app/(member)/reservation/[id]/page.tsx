/**
 * reservation/[id]/page.tsx — Server Component (SSR)
 *
 * SEBELUM: 'use client' + useEffect fetch + useState loading/error
 * SESUDAH: async Server Component — fetch di server, HTML langsung terisi data
 *
 * Pemisahan:
 * - ReservationDetailPage (ini): Server Component, fetch data, render HTML
 * - CancelButton (client): hanya tombol Cancel dengan modal konfirmasi
 *   → satu-satunya bagian yang butuh state & interaksi browser
 *
 * Design: TIDAK BERUBAH — semua style, warna, layout identik
 * Mobile: padding responsif sm:, touch-manipulation pada tombol
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Ticket } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import CancelButton from './CancelButton';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Reservation #${params.id} — Maison Workspace`,
  };
}

export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
  let reservasi: Reservasi;

  try {
    reservasi = await serverFetch<Reservasi>(`/reservasi/${params.id}`);
  } catch {
    notFound();
  }

  const detail    = reservasi!.detail_reservasi?.[0];
  const canCancel = ['belum_dikonfirm', 'disetujui'].includes(reservasi!.status);

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/reservation"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#7a6a5a' }}
        >
          <ArrowLeft size={14} /> Back to reservations
        </Link>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div
          className="px-4 sm:px-6 py-4 sm:py-5 flex items-start justify-between"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: '#7a6a5a' }}>Reservation Code</p>
            <p className="text-base sm:text-lg font-bold font-mono" style={{ color: '#c9a77a' }}>
              {reservasi!.kode_reservasi}
            </p>
          </div>
          <StatusBadge status={reservasi!.status} />
        </div>

        {/* Detail grid — responsif: 1 kolom di mobile, 2 kolom di sm+ */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-px"
          style={{ background: BORDER }}
        >
          {[
            { label: 'Space',      value: detail?.space?.nama_space || '-' },
            { label: 'Type',       value: detail?.space?.tipe?.replace(/_/g, ' ') || '-' },
            { label: 'Date',       value: formatDate(reservasi!.tanggal_reservasi) },
            { label: 'Start Time', value: formatTime(reservasi!.jam_mulai) },
            { label: 'Duration',   value: `${reservasi!.durasi_jam} hour${reservasi!.durasi_jam > 1 ? 's' : ''}` },
            { label: 'Total',      value: formatCurrency(detail?.total_harga || 0), accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="px-4 sm:px-5 py-3 sm:py-4" style={{ background: '#1c1410' }}>
              <p className="text-xs mb-1" style={{ color: '#7a6a5a' }}>{label}</p>
              <p
                className="text-sm font-medium"
                style={{ color: accent ? '#c9a77a' : '#f4eee7' }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Diskon */}
        {detail?.diskon && (
          <div
            className="mx-4 sm:mx-6 mt-4 sm:mt-5 px-3 sm:px-4 py-3 rounded-xl"
            style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)' }}
          >
            <p className="text-sm font-medium" style={{ color: '#4ade80' }}>
              Discount: {detail.diskon.nama_diskon} ({detail.diskon.persentase_diskon}% off)
            </p>
          </div>
        )}

        {/* Check-in / out times */}
        {reservasi!.checkin_at && (
          <div
            className="mx-4 sm:mx-6 mt-3 px-3 sm:px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#7a6a5a' }}>Check-in</p>
                <p style={{ color: '#b8a898' }}>
                  {new Date(reservasi!.checkin_at).toLocaleString('id-ID')}
                </p>
              </div>
              {reservasi!.checkout_at && (
                <div>
                  <p className="text-xs mb-0.5" style={{ color: '#7a6a5a' }}>Check-out</p>
                  <p style={{ color: '#b8a898' }}>
                    {new Date(reservasi!.checkout_at).toLocaleString('id-ID')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-wrap gap-3 mt-2">
          <Link
            href={`/reservation/${reservasi!.id}/eticket`}
            className="btn-primary flex-1 min-w-[140px] justify-center touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Ticket size={15} />
            View E-Ticket
          </Link>

          {/* CancelButton adalah Client Component — hanya ini yang butuh state */}
          {canCancel && (
            <CancelButton reservasiId={reservasi!.id} kode={reservasi!.kode_reservasi} />
          )}
        </div>
      </div>
    </div>
  );
}
