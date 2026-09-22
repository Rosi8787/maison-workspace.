'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Building2, Phone, MapPin, Upload, CheckCircle } from 'lucide-react';
import { authApi, uploadApi } from '@/lib/api';
import { getUser, getErrorMessage, getImageUrl } from '@/lib/auth';
import type { Member } from '@/types';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function ProfilePage() {
  const [member, setMember]           = useState<Member | null>(null);
  const [loading, setLoading]         = useState(true);
  const [uploading, setUploading]     = useState(false);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [fotoUrl, setFotoUrl]         = useState('');
  const user = getUser();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await authApi.getProfile();
      const m = res.data.member as Member;
      setMember(m);
      setFotoUrl(m?.foto || '');
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
    setError('');
    try {
      // Upload ke Supabase Storage bucket 'members'
      const uploadRes = await uploadApi.uploadMember(file);
      const newUrl = uploadRes.data.url || uploadRes.data.path;

      // Simpan URL ke profil via PATCH /api/auth/profile/foto
      await authApi.updateFoto(newUrl);

      setFotoUrl(newUrl);
      setSuccess('Foto profil berhasil diperbarui');
      // Refresh data profil
      loadProfile();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      // Reset input agar file yang sama bisa dipilih lagi
      e.target.value = '';
    }
  }

  if (loading) return (
    <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
  );

  const avatarUrl = getImageUrl(fotoUrl);
  const initials  = (member?.nama_member || user?.username || 'U')
    .split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

  return (
    <div className="max-w-2xl">
      <DashboardHeader subtitle="Your account information." />

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        {/* ── Avatar + upload ── */}
        <div className="px-6 py-6 flex items-center gap-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {/* Avatar dengan tombol upload overlay */}
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={member?.nama_member ?? 'Profile photo'}
                className="w-20 h-20 rounded-2xl object-cover"
                style={{ border: '2px solid rgba(201,167,122,0.30)' }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold"
                style={{
                  background: 'rgba(201,167,122,0.12)',
                  border: '2px solid rgba(201,167,122,0.25)',
                  color: '#c9a77a',
                }}
              >
                {initials}
              </div>
            )}

            {/* Upload overlay button */}
            <label
              htmlFor="member-foto"
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: '#c9a77a', border: '2px solid #170f0c' }}
              title="Ganti foto profil"
            >
              {uploading
                ? <LoadingSpinner size="sm" />
                : <Upload size={12} style={{ color: '#1a1008' }} />
              }
              <input
                id="member-foto"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="sr-only"
                onChange={handleFotoUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="min-w-0">
            <h2
              className="text-lg font-semibold tracking-tight"
              style={{ color: '#f4eee7', letterSpacing: '-0.015em' }}
            >
              {member?.nama_member}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#7a6a5a' }}>
              @{user?.username}
            </p>
            <span
              className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(96,165,250,0.10)',
                border: '1px solid rgba(96,165,250,0.25)',
                color: '#60a5fa',
              }}
            >
              Member
            </span>
            {fotoUrl && (
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle size={11} style={{ color: '#4ade80' }} />
                <span className="text-xs" style={{ color: '#4ade80' }}>Photo set</span>
              </div>
            )}
            <p className="text-xs mt-1" style={{ color: '#7a6a5a' }}>
              Click the camera icon to change photo
            </p>
          </div>
        </div>

        {/* ── Info fields ── */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { Icon: UserCircle, label: 'Full Name',   value: member?.nama_member },
            { Icon: Building2,  label: 'Institution', value: member?.instansi },
            { Icon: Phone,      label: 'Phone',       value: member?.telp },
            { Icon: MapPin,     label: 'Address',     value: member?.alamat, full: true },
          ].map(({ Icon, label, value, full }) => (
            <div key={label} className={full ? 'sm:col-span-2' : ''}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={13} style={{ color: '#c9a77a' }} />
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#7a6a5a' }}>
                  {label}
                </p>
              </div>
              <p className="text-sm font-medium pl-5" style={{ color: '#f4eee7' }}>
                {value || '—'}
              </p>
            </div>
          ))}
        </div>

        {/* ── Note ── */}
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-xs" style={{ color: '#7a6a5a' }}>
            To update other profile information (name, institution, address), please contact your coworking space administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
