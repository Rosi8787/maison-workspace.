/**
 * spaces/[id]/page.tsx — Server Component (SSR)
 *
 * SEBELUM: 'use client' + useState + useEffect → fetch setelah browser load
 *   → halaman blank selama loading, tidak ada SEO, data fetch 2x round-trip
 *
 * SESUDAH: async Server Component → fetch di server saat request masuk
 *   → HTML sudah berisi data saat dikirim ke browser
 *   → Tidak ada loading spinner untuk data utama
 *   → Design TIDAK BERUBAH — hanya pola data fetching yang berubah
 *   → Animasi (framer-motion) dipindah ke Client Component kecil: SpaceMotionWrapper
 *   → Tombol "Book This Space" dipindah ke BookButton (client) karena butuh Link interaktif
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Users, MapPin, Phone, Building2, ArrowLeft } from 'lucide-react';
import { publicFetch } from '@/lib/server-fetch';
import { Space } from '@/types';
import { formatCurrency, getTipeSpaceLabel, getImageUrl } from '@/lib/utils';
import SpaceDetailClient from './SpaceDetailClient';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

// generateMetadata untuk SEO per space
export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const space = await publicFetch<Space>(`/spaces/${params.id}`);
    return {
      title: `${space.nama_space} — Maison Workspace`,
      description: space.deskripsi || `Book ${space.nama_space} at ${formatCurrency(space.harga_per_jam)}/hour`,
    };
  } catch {
    return { title: 'Space — Maison Workspace' };
  }
}

export default async function SpaceDetailPage({ params }: { params: { id: string } }) {
  let space: Space;

  try {
    // Fetch langsung di server — tidak butuh useEffect, tidak ada loading state
    space = await publicFetch<Space>(`/spaces/${params.id}`);
  } catch {
    notFound(); // render Next.js 404 page
  }

  return (
    <div className="max-w-3xl">
      {/* Back link — Server Component, tidak butuh onClick */}
      <div className="mb-6">
        <Link
          href="/spaces"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#7a6a5a' }}
        >
          <ArrowLeft size={14} /> Back to spaces
        </Link>
      </div>

      {/* SpaceDetailClient: wrapper animasi framer-motion (harus client) */}
      <SpaceDetailClient>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          {/* Hero image */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
            {space!.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageUrl(space!.foto) ?? ''}
                alt={space!.nama_space}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: '#261a0e' }}
              >
                <Building2 size={48} style={{ color: '#3d3028' }} />
              </div>
            )}
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(18,13,11,0.80) 100%)' }}
            />
            {/* Type badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(18,13,11,0.80)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#c9a77a',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {getTipeSpaceLabel(space!.tipe)}
              </span>
            </div>
            {/* Price overlay */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-right">
              <p className="text-xl sm:text-2xl font-bold" style={{ color: '#f4eee7' }}>
                {formatCurrency(space!.harga_per_jam)}
              </p>
              <p className="text-xs" style={{ color: '#b8a898' }}>per hour</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Title row */}
            <div className="mb-5">
              <h1
                className="text-lg sm:text-xl font-semibold mb-1 tracking-tight"
                style={{ color: '#f4eee7', letterSpacing: '-0.015em' }}
              >
                {space!.nama_space}
              </h1>
              <div
                className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm"
                style={{ color: '#7a6a5a' }}
              >
                <span className="flex items-center gap-1.5">
                  <Users size={13} /> {space!.kapasitas} people
                </span>
                {space!.owner && (
                  <span className="flex items-center gap-1.5">
                    <Building2 size={13} /> {space!.owner.nama_coworking}
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.07)' }} />

            {/* Description */}
            {space!.deskripsi && (
              <div className="mb-5">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: '#7a6a5a' }}
                >
                  Description
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#b8a898' }}>
                  {space!.deskripsi}
                </p>
              </div>
            )}

            {/* Location */}
            {(space!.owner?.alamat || space!.owner?.telp) && (
              <div
                className="rounded-xl p-3 sm:p-4 mb-5 sm:mb-6 space-y-2"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {space!.owner?.alamat && (
                  <p className="flex items-start gap-2 text-sm" style={{ color: '#7a6a5a' }}>
                    <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#c9a77a' }} />
                    {space!.owner.alamat}
                  </p>
                )}
                {space!.owner?.telp && (
                  <p className="flex items-center gap-2 text-sm" style={{ color: '#7a6a5a' }}>
                    <Phone size={13} className="flex-shrink-0" style={{ color: '#c9a77a' }} />
                    {space!.owner.telp}
                  </p>
                )}
              </div>
            )}

            {/* CTA — Link is enough, no client state needed */}
            <Link
              href={`/reservation?space_id=${space!.id}`}
              className="btn-primary w-full justify-center group touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Book This Space
            </Link>
          </div>
        </div>
      </SpaceDetailClient>
    </div>
  );
}
