/**
 * eticket/page.tsx — Server Component (SSR)
 *
 * SEBELUM: 'use client' + useEffect + setState loading
 * SESUDAH: async Server Component — HTML lengkap dikirim dari server
 *
 * Keuntungan SSR di halaman ini sangat signifikan:
 * - E-ticket bisa di-share URL-nya dan langsung tampil (tanpa loading)
 * - Bisa di-print langsung tanpa menunggu JS hydration
 * - QR code dari server sudah dalam response — tidak ada blank QR saat print
 *
 * Pemisahan client/server:
 * - EticketPage (ini): Server Component — fetch + render semua konten
 * - PrintButton (client): hanya window.print() — perlu browser API
 *
 * Design: IDENTIK — semua warna, layout, animasi dipertahankan
 * Mobile: responsive padding, teks ukuran adaptif
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Ticket } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getStatusLabel } from '@/lib/utils';
import PrintButton from './PrintButton';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

const STATUS_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  selesai:         { bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.30)',  color: '#4ade80' },
  aktif:           { bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.30)',  color: '#60a5fa' },
  disetujui:       { bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.25)',  color: '#60a5fa' },
  belum_dikonfirm: { bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.25)',  color: '#fbbf24' },
  dibatalkan:      { bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', color: '#f87171' },
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `E-Ticket #${params.id} — Maison Workspace`,
  };
}

export default async function EticketPage({ params }: { params: { id: string } }) {
  let reservasi: Reservasi & { qr_code?: string };

  try {
    // Fetch e-ticket — endpoint ini generate QR di server, sudah include qr_code base64
    reservasi = await serverFetch<Reservasi & { qr_code?: string }>(
      `/reservasi/${params.id}/e-ticket`,
    );
  } catch {
    notFound();
  }

  const detail      = reservasi!.detail_reservasi?.[0];
  const statusStyle = STATUS_COLORS[reservasi!.status] ?? STATUS_COLORS['belum_dikonfirm'];
  const subtotal    = parseFloat(String(detail?.space?.harga_per_jam || 0)) * reservasi!.durasi_jam;
  const discount    = detail?.diskon
    ? subtotal * parseFloat(String(detail.diskon.persentase_diskon)) / 100
    : 0;

  return (
    <div className="max-w-lg mx-auto">

      {/* Action bar — no-print, PrintButton butuh browser API */}
      <div className="flex items-center gap-3 mb-6 no-print">
        <Link
          href={`/reservation/${reservasi!.id}`}
          className="btn-secondary text-sm touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <ArrowLeft size={14} /> Back
        </Link>
        {/* PrintButton adalah satu-satunya Client Component di halaman ini */}
        <PrintButton />
      </div>

      {/* E-Ticket card */}
      <div
        id="eticket"
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        {/* Header */}
        <div
          className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-wrap gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(201,167,122,0.18) 0%, rgba(160,122,74,0.10) 100%)',
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(201,167,122,0.15)',
                border: '1px solid rgba(201,167,122,0.25)',
              }}
            >
              <Ticket size={17} style={{ color: '#c9a77a' }} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold" style={{ color: '#f4eee7' }}>
                E-Ticket Reservation
              </h1>
              <p className="text-xs" style={{ color: '#7a6a5a' }}>
                {reservasi!.owner?.nama_coworking || 'Coworking Space'}
              </p>
            </div>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
            style={{
              background: statusStyle.bg,
              border: `1px solid ${statusStyle.border}`,
              color: statusStyle.color,
            }}
          >
            {getStatusLabel(reservasi!.status)}
          </span>
        </div>

        {/* Kode + QR */}
        <div
          className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between flex-wrap gap-4"
          style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}
        >
          <div className="min-w-0">
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: '#7a6a5a' }}
            >
              Reservation Code
            </p>
            <p
              className="text-xl sm:text-2xl font-bold font-mono tracking-widest break-all"
              style={{ color: '#c9a77a' }}
            >
              {reservasi!.kode_reservasi}
            </p>
          </div>
          {reservasi!.qr_code && (
            <div className="text-center flex-shrink-0">
              {/* QR sudah ada dari server — tidak blank saat print */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reservasi!.qr_code}
                alt="QR Code for check-in"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl"
                style={{ border: '1px solid rgba(255,255,255,0.10)' }}
              />
              <p className="text-xs mt-1.5" style={{ color: '#7a6a5a' }}>Scan to check-in</p>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-5">

          {/* Member info */}
          <section>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#7a6a5a' }}
            >
              Member Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Name',        value: reservasi!.member?.nama_member },
                { label: 'Institution', value: reservasi!.member?.instansi },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs mb-0.5" style={{ color: '#7a6a5a' }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: '#f4eee7' }}>{value || '—'}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px" style={{ background: BORDER }} />

          {/* Reservation detail */}
          <section>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#7a6a5a' }}
            >
              Reservation Detail
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Space',    value: detail?.space?.nama_space },
                { label: 'Type',     value: detail?.space?.tipe?.replace(/_/g, ' ') },
                { label: 'Date',     value: formatDate(reservasi!.tanggal_reservasi) },
                { label: 'Start',    value: formatTime(reservasi!.jam_mulai) },
                { label: 'Duration', value: `${reservasi!.durasi_jam} hr${reservasi!.durasi_jam > 1 ? 's' : ''}` },
                { label: 'Capacity', value: `${detail?.space?.kapasitas || '—'} people` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs mb-0.5" style={{ color: '#7a6a5a' }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: '#f4eee7' }}>{value || '—'}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px" style={{ background: BORDER }} />

          {/* Payment */}
          <section>
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#7a6a5a' }}
            >
              Payment
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between" style={{ color: '#b8a898' }}>
                <span>
                  {formatCurrency(detail?.space?.harga_per_jam || 0)} × {reservasi!.durasi_jam} hr
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {detail?.diskon && (
                <div className="flex justify-between" style={{ color: '#4ade80' }}>
                  <span>Discount ({detail.diskon.persentase_diskon}%)</span>
                  <span>−{formatCurrency(discount)}</span>
                </div>
              )}
              <div
                className="flex justify-between font-bold text-base pt-2"
                style={{ borderTop: `1px solid ${BORDER}`, color: '#f4eee7' }}
              >
                <span>Total</span>
                <span style={{ color: '#c9a77a' }}>
                  {formatCurrency(detail?.total_harga || 0)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="px-4 sm:px-6 py-3 text-center"
          style={{ borderTop: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.02)' }}
        >
          <p className="text-xs" style={{ color: '#7a6a5a' }}>
            {reservasi!.owner?.nama_coworking} · Maison Workspace
          </p>
        </div>
      </div>
    </div>
  );
}
