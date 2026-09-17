'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminDiskonEditPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    nama_diskon: '', kode_diskon: '', persentase_diskon: '',
    tanggal_awal: '', tanggal_akhir: '',
  });

  useEffect(() => {
    if (id) loadDiskon(parseInt(id as string));
  }, [id]);

  async function loadDiskon(diskonId: number) {
    try {
      const res = await adminApi.getDiskonOne(diskonId);
      const d = res.data;
      setForm({
        nama_diskon: d.nama_diskon,
        kode_diskon: d.kode_diskon,
        persentase_diskon: String(d.persentase_diskon),
        tanggal_awal: d.tanggal_awal.split('T')[0],
        tanggal_akhir: d.tanggal_akhir.split('T')[0],
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.updateDiskon(parseInt(id as string), {
        ...form,
        persentase_diskon: parseFloat(form.persentase_diskon),
      });
      setSuccess('Diskon berhasil diperbarui');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/diskon" className="text-sm text-primary-600 hover:underline">← Kembali</Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Diskon</h1>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama Diskon</label>
            <input className="input" value={form.nama_diskon}
              onChange={(e) => setForm({ ...form, nama_diskon: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kode Diskon</label>
              <input className="input uppercase" value={form.kode_diskon}
                onChange={(e) => setForm({ ...form, kode_diskon: e.target.value.toUpperCase() })} required />
            </div>
            <div>
              <label className="label">Persentase (%)</label>
              <input type="number" className="input" min="1" max="100" value={form.persentase_diskon}
                onChange={(e) => setForm({ ...form, persentase_diskon: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tanggal Awal</label>
              <input type="date" className="input" value={form.tanggal_awal}
                onChange={(e) => setForm({ ...form, tanggal_awal: e.target.value })} required />
            </div>
            <div>
              <label className="label">Tanggal Akhir</label>
              <input type="date" className="input" value={form.tanggal_akhir}
                onChange={(e) => setForm({ ...form, tanggal_akhir: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/admin/diskon" className="btn-secondary flex-1 text-center">Batal</Link>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving && <LoadingSpinner size="sm" />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
