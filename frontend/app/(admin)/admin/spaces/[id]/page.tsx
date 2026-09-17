'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi, uploadApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminSpaceEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const [form, setForm] = useState({
    nama_space: '', tipe: 'Personal_Desk', kapasitas: '1',
    harga_per_jam: '', deskripsi: '', foto: '',
  });

  useEffect(() => {
    if (id) loadSpace(parseInt(id as string));
  }, [id]);

  async function loadSpace(spaceId: number) {
    try {
      const res = await adminApi.getSpace(spaceId);
      const s = res.data;
      setForm({
        nama_space: s.nama_space || '',
        tipe: s.tipe || 'Personal_Desk',
        kapasitas: String(s.kapasitas) || '1',
        harga_per_jam: String(s.harga_per_jam) || '',
        deskripsi: s.deskripsi || '',
        foto: s.foto || '',
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadSpace(file);
      setForm({ ...form, foto: res.data.path });
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.updateSpace(parseInt(id as string), {
        ...form,
        kapasitas: parseInt(form.kapasitas),
        harga_per_jam: parseFloat(form.harga_per_jam),
      });
      setSuccess('Space berhasil diperbarui');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/spaces" className="text-sm text-primary-600 hover:underline">← Kembali</Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Space</h1>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nama Space</label>
            <input className="input" value={form.nama_space}
              onChange={(e) => setForm({ ...form, nama_space: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tipe</label>
              <select className="input" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                <option value="Personal_Desk">Personal Desk</option>
                <option value="Private_Office">Private Office</option>
                <option value="Meeting_Room">Meeting Room</option>
              </select>
            </div>
            <div>
              <label className="label">Kapasitas</label>
              <input type="number" className="input" min="1" value={form.kapasitas}
                onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Harga/Jam (Rp)</label>
            <input type="number" className="input" min="0" value={form.harga_per_jam}
              onChange={(e) => setForm({ ...form, harga_per_jam: e.target.value })} />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea className="input resize-none" rows={3} value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          </div>
          <div>
            <label className="label">Foto</label>
            {form.foto && (
              <img src={`${API_URL}${form.foto}`} className="w-32 h-20 object-cover rounded mb-2" alt="Foto space" />
            )}
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleFotoUpload}
                className="text-sm text-gray-600 file:mr-2 file:py-1 file:px-3 file:border file:border-gray-300 file:rounded file:text-sm file:bg-white" />
              {uploading && <LoadingSpinner size="sm" />}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/admin/spaces" className="btn-secondary flex-1 text-center">Batal</Link>
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
