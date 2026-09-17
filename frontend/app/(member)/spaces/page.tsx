'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { spacesApi } from '@/lib/api';
import { Space, TipeSpace } from '@/types';
import { formatCurrency, getTipeSpaceLabel, getErrorMessage } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';

const TIPE_OPTIONS: { label: string; value: TipeSpace | '' }[] = [
  { label: 'Semua Tipe', value: '' },
  { label: 'Personal Desk', value: 'Personal_Desk' },
  { label: 'Private Office', value: 'Private_Office' },
  { label: 'Meeting Room', value: 'Meeting_Room' },
];

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filtered, setFiltered] = useState<Space[]>([]);
  const [filterTipe, setFilterTipe] = useState<TipeSpace | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Availability filter
  const [tanggal, setTanggal] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [durasi, setDurasi] = useState('');
  const [availabilityMode, setAvailabilityMode] = useState(false);

  useEffect(() => {
    loadSpaces();
  }, []);

  async function loadSpaces() {
    setLoading(true);
    try {
      const res = await spacesApi.getAll();
      setSpaces(res.data);
      setFiltered(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let result = spaces;
    if (filterTipe) {
      result = result.filter((s) => s.tipe === filterTipe);
    }
    setFiltered(result);
  }, [filterTipe, spaces]);

  async function handleCheckAvailability(e: React.FormEvent) {
    e.preventDefault();
    if (!tanggal || !jamMulai || !durasi) return;
    setLoading(true);
    try {
      const res = await spacesApi.getAvailability(tanggal, jamMulai, parseInt(durasi));
      let data: Space[] = res.data;
      if (filterTipe) data = data.filter((s) => s.tipe === filterTipe);
      setFiltered(data);
      setAvailabilityMode(true);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function clearAvailability() {
    setTanggal('');
    setJamMulai('');
    setDurasi('');
    setAvailabilityMode(false);
    setFiltered(spaces);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ruang Coworking</h1>
        <p className="text-gray-500 mt-1">Temukan ruang yang sesuai kebutuhan Anda</p>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}

      {/* Availability Checker */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">🔍 Cek Ketersediaan</h2>
        <form onSubmit={handleCheckAvailability} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="label">Tanggal</label>
            <input type="date" className="input" min={todayStr}
              value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
          </div>
          <div>
            <label className="label">Jam Mulai</label>
            <input type="time" className="input"
              value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} />
          </div>
          <div>
            <label className="label">Durasi (jam)</label>
            <input type="number" className="input" min="1" max="24" placeholder="1"
              value={durasi} onChange={(e) => setDurasi(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary flex-1">Cek</button>
            {availabilityMode && (
              <button type="button" onClick={clearAvailability} className="btn-secondary px-3">✕</button>
            )}
          </div>
        </form>
        {availabilityMode && (
          <p className="text-xs text-blue-600 mt-2">
            Menampilkan ketersediaan untuk {tanggal} jam {jamMulai} selama {durasi} jam
          </p>
        )}
      </div>

      {/* Filter Tipe */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TIPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilterTipe(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterTipe === opt.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏢</p>
          <p className="text-lg font-medium">Tidak ada ruang tersedia</p>
          <p className="text-sm mt-1">Coba ubah filter atau tanggal</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((space) => (
            <SpaceCard key={space.id} space={space} availabilityMode={availabilityMode} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpaceCard({ space, availabilityMode }: { space: Space; availabilityMode: boolean }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <div className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
      availabilityMode && space.tersedia === false ? 'opacity-60' : ''
    }`}>
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        {space.foto ? (
          <img
            src={`${API_URL}${space.foto}`}
            alt={space.nama_space}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🏢</div>
        )}
        {availabilityMode && (
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
            space.tersedia ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {space.tersedia ? 'Tersedia' : 'Penuh'}
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white text-primary-700 text-xs font-medium px-2 py-1 rounded-full shadow">
          {getTipeSpaceLabel(space.tipe)}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{space.nama_space}</h3>
        {space.deskripsi && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{space.deskripsi}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>👥 {space.kapasitas} orang</span>
          <span className="font-semibold text-primary-700">
            {formatCurrency(space.harga_per_jam)}/jam
          </span>
        </div>
        <Link
          href={`/spaces/${space.id}`}
          className="btn-primary block text-center text-sm py-2"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}
