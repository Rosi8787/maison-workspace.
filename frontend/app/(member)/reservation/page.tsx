'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { spacesApi, diskonApi, reservasiApi } from '@/lib/api';
import { Space, Diskon, Reservasi } from '@/types';
import { formatCurrency, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedSpaceId = searchParams.get('space_id');

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [myReservasi, setMyReservasi] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [idSpace, setIdSpace] = useState(preselectedSpaceId || '');
  const [tanggal, setTanggal] = useState('');
  const [jamMulai, setJamMulai] = useState('08:00');
  const [durasi, setDurasi] = useState('1');
  const [kodeDiskon, setKodeDiskon] = useState('');
  const [diskon, setDiskon] = useState<Diskon | null>(null);
  const [checkingDiskon, setCheckingDiskon] = useState(false);
  const [diskonError, setDiskonError] = useState('');

  const selectedSpace = spaces.find((s) => s.id === parseInt(idSpace));

  useEffect(() => {
    async function load() {
      try {
        const [spacesRes, resRes] = await Promise.all([
          spacesApi.getAll(),
          reservasiApi.getMy(),
        ]);
        setSpaces(spacesRes.data);
        setMyReservasi(resRes.data);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleCheckDiskon() {
    if (!kodeDiskon.trim()) return;
    setCheckingDiskon(true);
    setDiskonError('');
    setDiskon(null);
    try {
      const res = await diskonApi.check(kodeDiskon);
      setDiskon(res.data);
    } catch (err: any) {
      setDiskonError(getErrorMessage(err));
    } finally {
      setCheckingDiskon(false);
    }
  }

  const totalHargaAwal = selectedSpace
    ? parseFloat(String(selectedSpace.harga_per_jam)) * parseInt(durasi || '0')
    : 0;
  const potongan = diskon
    ? (totalHargaAwal * parseFloat(String(diskon.persentase_diskon))) / 100
    : 0;
  const totalBayar = totalHargaAwal - potongan;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!idSpace || !tanggal || !jamMulai || !durasi) {
      setError('Semua field wajib diisi');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await reservasiApi.create({
        id_space: parseInt(idSpace),
        tanggal_reservasi: tanggal,
        jam_mulai: jamMulai,
        durasi_jam: parseInt(durasi),
        kode_diskon: kodeDiskon || undefined,
      });
      setSuccess('Reservasi berhasil dibuat!');
      setTimeout(() => router.push(`/reservation/${res.data.id}`), 1500);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-2">
        <div className="card">
          <h1 className="text-xl font-bold text-gray-900 mb-6">🗓️ Buat Reservasi</h1>

          {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
          {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Pilih Ruang *</label>
              <select className="input" value={idSpace} onChange={(e) => setIdSpace(e.target.value)} required>
                <option value="">-- Pilih ruang --</option>
                {spaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama_space} — {formatCurrency(s.harga_per_jam)}/jam ({s.tipe.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="label">Tanggal *</label>
                <input type="date" className="input" min={todayStr}
                  value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
              </div>
              <div>
                <label className="label">Jam Mulai *</label>
                <input type="time" className="input"
                  value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} required />
              </div>
              <div>
                <label className="label">Durasi (jam) *</label>
                <input type="number" className="input" min="1" max="24"
                  value={durasi} onChange={(e) => setDurasi(e.target.value)} required />
              </div>
            </div>

            {/* Diskon */}
            <div>
              <label className="label">Kode Diskon (opsional)</label>
              <div className="flex gap-2">
                <input className="input flex-1" placeholder="Masukkan kode diskon"
                  value={kodeDiskon} onChange={(e) => setKodeDiskon(e.target.value.toUpperCase())} />
                <button type="button" onClick={handleCheckDiskon} disabled={checkingDiskon || !kodeDiskon}
                  className="btn-secondary flex items-center gap-1">
                  {checkingDiskon ? <LoadingSpinner size="sm" /> : 'Cek'}
                </button>
              </div>
              {diskonError && <p className="text-xs text-red-600 mt-1">{diskonError}</p>}
              {diskon && (
                <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                  ✓ {diskon.nama_diskon} — diskon {diskon.persentase_diskon}%
                </div>
              )}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {submitting && <LoadingSpinner size="sm" />}
              {submitting ? 'Memproses...' : 'Konfirmasi Reservasi'}
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar: harga + reservasi aktif */}
      <div className="space-y-6">
        {/* Kalkulasi Harga */}
        {selectedSpace && (
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">💰 Rincian Harga</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{formatCurrency(selectedSpace.harga_per_jam)} × {durasi || 0} jam</span>
                <span>{formatCurrency(totalHargaAwal)}</span>
              </div>
              {diskon && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon ({diskon.persentase_diskon}%)</span>
                  <span>-{formatCurrency(potongan)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Total Bayar</span>
                <span className="text-primary-600">{formatCurrency(totalBayar)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Reservasi Aktif */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3">📋 Reservasi Aktif</h3>
          {myReservasi.length === 0 ? (
            <p className="text-xs text-gray-400">Tidak ada reservasi aktif</p>
          ) : (
            <div className="space-y-2">
              {myReservasi.slice(0, 3).map((r) => (
                <Link key={r.id} href={`/reservation/${r.id}`}
                  className="block p-2 rounded border hover:bg-gray-50 text-sm">
                  <p className="font-medium text-xs text-gray-700">{r.kode_reservasi}</p>
                  <p className="text-xs text-gray-500">{r.detail_reservasi?.[0]?.space?.nama_space}</p>
                  <StatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
