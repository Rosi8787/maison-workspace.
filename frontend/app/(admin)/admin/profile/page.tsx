'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { SpaceOwner } from '@/types';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<SpaceOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    nama_coworking: '', nama_pemilik: '', telp: '', alamat: '', deskripsi: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await adminApi.getProfile();
      setProfile(res.data);
      setForm({
        nama_coworking: res.data.nama_coworking || '',
        nama_pemilik: res.data.nama_pemilik || '',
        telp: res.data.telp || '',
        alamat: res.data.alamat || '',
        deskripsi: res.data.deskripsi || '',
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
      await adminApi.updateProfile(form);
      setSuccess('Profil berhasil diperbarui');
      loadProfile();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Profil Admin</h1>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nama Coworking *</label>
              <input className="input" value={form.nama_coworking}
                onChange={(e) => setForm({ ...form, nama_coworking: e.target.value })} required />
            </div>
            <div>
              <label className="label">Nama Pemilik *</label>
              <input className="input" value={form.nama_pemilik}
                onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">No. Telepon *</label>
              <input className="input" type="tel" value={form.telp}
                onChange={(e) => setForm({ ...form, telp: e.target.value })} required />
            </div>
            <div>
              <label className="label">Alamat *</label>
              <input className="input" value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea className="input resize-none" rows={3} value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <LoadingSpinner size="sm" />}
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
