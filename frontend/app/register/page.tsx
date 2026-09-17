'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, uploadApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Tab = 'member' | 'admin';

export default function RegisterPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fotoUploading, setFotoUploading] = useState(false);
  const [fotoPath, setFotoPath] = useState('');

  // Member form
  const [member, setMember] = useState({
    nama_member: '', instansi: '', alamat: '', telp: '',
    username: '', password: '',
  });

  // Admin form
  const [admin, setAdmin] = useState({
    nama_coworking: '', nama_pemilik: '', telp: '', alamat: '',
    deskripsi: '', username: '', password: '',
  });

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoUploading(true);
    try {
      const res = await uploadApi.uploadMember(file);
      setFotoPath(res.data.path);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setFotoUploading(false);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.registerMember({ ...member, foto: fotoPath || undefined });
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.registerAdmin(admin);
      setSuccess('Registrasi admin berhasil! Silakan login.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-500 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b">
            {(['member', 'admin'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  tab === t
                    ? 'text-primary-700 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'member' ? '👤 Daftar sebagai Member' : '🏢 Daftar sebagai Admin'}
              </button>
            ))}
          </div>

          <div className="p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-6">
              {tab === 'member' ? 'Registrasi Member' : 'Registrasi Admin Space'}
            </h1>

            {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
            {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

            {/* Member Form */}
            {tab === 'member' && (
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nama Lengkap *</label>
                    <input className="input" placeholder="Nama lengkap" value={member.nama_member}
                      onChange={(e) => setMember({ ...member, nama_member: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Instansi *</label>
                    <input className="input" placeholder="Perusahaan/Instansi" value={member.instansi}
                      onChange={(e) => setMember({ ...member, instansi: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="label">Alamat *</label>
                  <textarea className="input resize-none" rows={2} placeholder="Alamat lengkap" value={member.alamat}
                    onChange={(e) => setMember({ ...member, alamat: e.target.value })} required />
                </div>
                <div>
                  <label className="label">No. Telepon *</label>
                  <input className="input" type="tel" placeholder="08xxxxxxxxxx" value={member.telp}
                    onChange={(e) => setMember({ ...member, telp: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Foto Profil</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/*" onChange={handleFotoUpload}
                      className="text-sm text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-gray-300 file:rounded file:text-sm file:bg-white hover:file:bg-gray-50" />
                    {fotoUploading && <LoadingSpinner size="sm" />}
                    {fotoPath && <span className="text-xs text-green-600">✓ Uploaded</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <label className="label">Username *</label>
                    <input className="input" placeholder="Username" value={member.username}
                      onChange={(e) => setMember({ ...member, username: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Password *</label>
                    <input type="password" className="input" placeholder="Min. 6 karakter" value={member.password}
                      onChange={(e) => setMember({ ...member, password: e.target.value })} required minLength={6} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading && <LoadingSpinner size="sm" />}
                  {loading ? 'Memproses...' : 'Daftar Sekarang'}
                </button>
              </form>
            )}

            {/* Admin Form */}
            {tab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nama Coworking *</label>
                    <input className="input" placeholder="Nama coworking space" value={admin.nama_coworking}
                      onChange={(e) => setAdmin({ ...admin, nama_coworking: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Nama Pemilik *</label>
                    <input className="input" placeholder="Nama pemilik" value={admin.nama_pemilik}
                      onChange={(e) => setAdmin({ ...admin, nama_pemilik: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">No. Telepon *</label>
                    <input className="input" type="tel" placeholder="08xxxxxxxxxx" value={admin.telp}
                      onChange={(e) => setAdmin({ ...admin, telp: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Alamat *</label>
                    <input className="input" placeholder="Alamat" value={admin.alamat}
                      onChange={(e) => setAdmin({ ...admin, alamat: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="label">Deskripsi</label>
                  <textarea className="input resize-none" rows={2} placeholder="Deskripsi coworking space" value={admin.deskripsi}
                    onChange={(e) => setAdmin({ ...admin, deskripsi: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <label className="label">Username *</label>
                    <input className="input" placeholder="Username" value={admin.username}
                      onChange={(e) => setAdmin({ ...admin, username: e.target.value })} required />
                  </div>
                  <div>
                    <label className="label">Password *</label>
                    <input type="password" className="input" placeholder="Min. 6 karakter" value={admin.password}
                      onChange={(e) => setAdmin({ ...admin, password: e.target.value })} required minLength={6} />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading && <LoadingSpinner size="sm" />}
                  {loading ? 'Memproses...' : 'Daftar Admin'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
