'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminMemberEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    nama_member: '', instansi: '', alamat: '', telp: '', password: '',
  });

  useEffect(() => {
    if (id) loadMember(parseInt(id as string));
  }, [id]);

  async function loadMember(memberId: number) {
    try {
      const res = await adminApi.getMember(memberId);
      const m = res.data;
      setForm({
        nama_member: m.nama_member || '',
        instansi: m.instansi || '',
        alamat: m.alamat || '',
        telp: m.telp || '',
        password: '',
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
      const data: any = { ...form };
      if (!data.password) delete data.password;
      await adminApi.updateMember(parseInt(id as string), data);
      setSuccess('Member berhasil diperbarui');
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
        <Link href="/admin/members" className="text-sm text-primary-600 hover:underline">← Kembali</Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Member</h1>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nama Lengkap</label>
              <input className="input" value={form.nama_member}
                onChange={(e) => setForm({ ...form, nama_member: e.target.value })} />
            </div>
            <div>
              <label className="label">Instansi</label>
              <input className="input" value={form.instansi}
                onChange={(e) => setForm({ ...form, instansi: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Alamat</label>
            <textarea className="input resize-none" rows={2} value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
          </div>
          <div>
            <label className="label">No. Telepon</label>
            <input className="input" value={form.telp}
              onChange={(e) => setForm({ ...form, telp: e.target.value })} />
          </div>
          <div>
            <label className="label">Password Baru (kosongkan jika tidak diubah)</label>
            <input type="password" className="input" value={form.password} minLength={6}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 6 karakter" />
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/admin/members" className="btn-secondary flex-1 text-center">Batal</Link>
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
