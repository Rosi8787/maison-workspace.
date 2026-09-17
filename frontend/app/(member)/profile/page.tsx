'use client';

import { useState, useEffect } from 'react';
import { authApi, uploadApi } from '@/lib/api';
import { getUser, setAuth, getErrorMessage } from '@/lib/auth';
import { Member } from '@/types';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    nama_member: '',
    instansi: '',
    alamat: '',
    telp: '',
    foto: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await authApi.getProfile();
      const m = res.data.member as Member;
      setMember(m);
      setForm({
        nama_member: m.nama_member || '',
        instansi: m.instansi || '',
        alamat: m.alamat || '',
        telp: m.telp || '',
        foto: m.foto || '',
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
      const res = await uploadApi.uploadMember(file);
      setForm({ ...form, foto: res.data.path });
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  // Profile update tidak ada endpoint PUT /api/members/me, gunakan PUT admin/members/:id
  // Untuk member, tampilkan data profil saja karena update profile member dilakukan via admin
  // Atau jika ada endpoint khusus, gunakan itu
  // Sesuai requirement: M1 = register, tidak ada explicit update profile untuk member di API reference
  // Tampilkan profil saja dengan opsi minta admin untuk update

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">👤 Profil Saya</h1>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      <div className="card">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6 pb-6 border-b">
          <div className="relative">
            {form.foto ? (
              <img
                src={`${API_URL}${form.foto}`}
                alt="Foto profil"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl">
                👤
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{member?.nama_member}</h2>
            <p className="text-sm text-gray-500">{member?.instansi}</p>
            <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              Member
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Nama Lengkap</p>
            <p className="font-medium">{member?.nama_member}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Instansi</p>
            <p className="font-medium">{member?.instansi}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">No. Telepon</p>
            <p className="font-medium">{member?.telp}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 mb-1">Alamat</p>
            <p className="font-medium">{member?.alamat}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-gray-400">
            Untuk mengubah data profil, hubungi admin coworking space Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
