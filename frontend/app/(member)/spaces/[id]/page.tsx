'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MapPin, Phone, Building2, ArrowRight } from 'lucide-react';
import { spacesApi } from '@/lib/api';
import { Space } from '@/types';
import { formatCurrency, getTipeSpaceLabel, getErrorMessage, getImageUrl } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const CARD    = 'rgba(34,26,20,0.80)';
const BORDER  = 'rgba(255,255,255,0.08)';

export default function SpaceDetailPage() {
  const { id } = useParams();
  const [space, setSpace]   = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (id) loadSpace(parseInt(id as string));
  }, [id]);

  async function loadSpace(spaceId: number) {
    try {
      const res = await spacesApi.getOne(spaceId);
      setSpace(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
  );

  if (error || !space) return (
    <div className="max-w-2xl">
      <Alert type="error" message={error || 'Space not found'} />
      <Link href="/spaces" className="btn-secondary mt-4 inline-flex">
        <ArrowLeft size={14} /> Back to spaces
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Link
          href="/spaces"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#7a6a5a' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a77a')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6a5a')}
        >
          <ArrowLeft size={14} /> Back to spaces
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        {/* Hero image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
          {space.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getImageUrl(space.foto) ?? ''}
              alt={space.nama_space}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#261a0e' }}>
              <Building2 size={48} style={{ color: '#3d3028' }} />
            </div>
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(18,13,11,0.80) 100%)' }}
          />
          {/* Type badge */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(18,13,11,0.80)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#c9a77a',
                backdropFilter: 'blur(10px)',
              }}
            >
              {getTipeSpaceLabel(space.tipe)}
            </span>
          </div>
          {/* Price overlay bottom */}
          <div className="absolute bottom-4 right-4 text-right">
            <p className="text-2xl font-bold" style={{ color: '#f4eee7' }}>{formatCurrency(space.harga_per_jam)}</p>
            <p className="text-xs" style={{ color: '#b8a898' }}>per hour</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-xl font-semibold mb-1 tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.015em' }}>
                {space.nama_space}
              </h1>
              <div className="flex items-center gap-4 text-sm" style={{ color: '#7a6a5a' }}>
                <span className="flex items-center gap-1.5">
                  <Users size={13} /> {space.kapasitas} people
                </span>
                {space.owner && (
                  <span className="flex items-center gap-1.5">
                    <Building2 size={13} /> {space.owner.nama_coworking}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* Description */}
          {space.deskripsi && (
            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#7a6a5a' }}>
                Description
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#b8a898' }}>{space.deskripsi}</p>
            </div>
          )}

          {/* Location info */}
          {(space.owner?.alamat || space.owner?.telp) && (
            <div
              className="rounded-xl p-4 mb-6 space-y-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {space.owner.alamat && (
                <p className="flex items-start gap-2 text-sm" style={{ color: '#7a6a5a' }}>
                  <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: '#c9a77a' }} />
                  {space.owner.alamat}
                </p>
              )}
              {space.owner.telp && (
                <p className="flex items-center gap-2 text-sm" style={{ color: '#7a6a5a' }}>
                  <Phone size={13} className="flex-shrink-0" style={{ color: '#c9a77a' }} />
                  {space.owner.telp}
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/reservation?space_id=${space.id}`}
            className="btn-primary w-full justify-center group"
          >
            Book This Space
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
