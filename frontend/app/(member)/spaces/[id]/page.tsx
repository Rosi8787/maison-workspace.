'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { spacesApi } from '@/lib/api';
import { Space } from '@/types';
import { formatCurrency, getTipeSpaceLabel, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

export default function SpaceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  if (loading) return (
    <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
  );

  if (error || !space) return (
    <div>
      <Alert type="error" message={error || 'Space tidak ditemukan'} />
      <Link href="/spaces" className="btn-secondary mt-4 inline-block">← Kembali</Link>
    </div>
  );

  return (
    <div className="max-w-3xl">
      {/* Back */}
      <Link href="/spaces" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-6">
        ← Kembali ke daftar ruang
      </Link>

      <div className="card overflow-hidden p-0">
        {/* Image */}
        <div className="relative h-64 bg-gray-100">
          {space.foto ? (
            <img
              src={`${API_URL}${space.foto}`}
              alt={space.nama_space}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🏢</div>
          )}
          <span className="absolute top-4 left-4 bg-white text-primary-700 text-sm font-medium px-3 py-1 rounded-full shadow">
            {getTipeSpaceLabel(space.tipe)}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{space.nama_space}</h1>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(space.harga_per_jam)}</p>
              <p className="text-xs text-gray-500">per jam</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <span>👥</span>
              <span>Kapasitas: <strong>{space.kapasitas} orang</strong></span>
            </div>
            {space.owner && (
              <div className="flex items-center gap-2 text-gray-600">
                <span>🏢</span>
                <span>{space.owner.nama_coworking}</span>
              </div>
            )}
          </div>

          {space.deskripsi && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Fasilitas & Deskripsi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{space.deskripsi}</p>
            </div>
          )}

          {space.owner?.alamat && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">📍 {space.owner.alamat}</p>
              {space.owner.telp && (
                <p className="text-xs text-gray-500 mt-1">📞 {space.owner.telp}</p>
              )}
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/reservation?space_id=${space.id}`}
            className="btn-primary block text-center py-3 text-base"
          >
            🗓️ Buat Reservasi
          </Link>
        </div>
      </div>
    </div>
  );
}
