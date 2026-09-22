'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, Building2, UserCircle, Phone, MapPin, FileText } from 'lucide-react';
import { adminApi, uploadApi } from '@/lib/api';
import { SpaceOwner } from '@/types';
import { getErrorMessage, getImageUrl } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function AdminProfilePage() {
  const [profile, setProfile]   = useState<SpaceOwner | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const [form, setForm] = useState({
    nama_coworking: '',
    nama_pemilik: '',
    telp: '',
    alamat: '',
    deskripsi: '',
    foto: '',
  });

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      const res = await adminApi.getProfile();
      const d   = res.data;
      setProfile(d);
      setForm({
        nama_coworking: d.nama_coworking || '',
        nama_pemilik:   d.nama_pemilik   || '',
        telp:           d.telp           || '',
        alamat:         d.alamat         || '',
        deskripsi:      d.deskripsi      || '',
        foto:           d.foto           || '',
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
    setError('');
    try {
      const res = await uploadApi.uploadGeneral(file);
      // backend returns { url, path } — path is the Supabase public URL
      const url = res.data.url || res.data.path;
      setForm((f) => ({ ...f, foto: url }));
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
      await adminApi.updateProfile(form);
      setSuccess('Profile updated successfully');
      loadProfile();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  );

  const avatarUrl  = getImageUrl(form.foto);
  const initials   = (form.nama_coworking || 'A').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>
          Admin Profile
        </h1>
        <p className="text-sm mb-8" style={{ color: '#7a6a5a' }}>Manage your coworking space information</p>
      </motion.div>

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        {/* ── Avatar section ── */}
        <div className="px-6 py-6 flex items-center gap-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          {/* Avatar preview */}
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={form.nama_coworking}
                className="w-20 h-20 rounded-2xl object-cover"
                style={{ border: '2px solid rgba(201,167,122,0.30)' }}
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
            {/* Upload button overlay */}
            <label
              htmlFor="admin-foto"
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors"
              style={{
                background: '#c9a77a',
                border: '2px solid #170f0c',
              }}
              title="Upload foto"
            >
              {uploading
                ? <LoadingSpinner size="sm" color="#1a1008" />
                : <Upload size={12} style={{ color: '#1a1008' }} />
              }
              <input
                id="admin-foto"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="sr-only"
                onChange={handleFotoUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div>
            <p className="text-base font-semibold" style={{ color: '#f4eee7' }}>
              {form.nama_coworking || 'Coworking Space'}
            </p>
            <p className="text-sm mt-0.5" style={{ color: '#7a6a5a' }}>
              {form.nama_pemilik || 'Owner'}
            </p>
            {form.foto && (
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle size={12} style={{ color: '#4ade80' }} />
                <span className="text-xs" style={{ color: '#4ade80' }}>Photo uploaded</span>
              </div>
            )}
            <p className="text-xs mt-2" style={{ color: '#7a6a5a' }}>
              Click the camera icon to change photo
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-1.5" htmlFor="ap-coworking">
                <Building2 size={10} /> Coworking Name *
              </label>
              <input
                id="ap-coworking"
                className="input"
                value={form.nama_coworking}
                onChange={(e) => setForm({ ...form, nama_coworking: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label flex items-center gap-1.5" htmlFor="ap-owner">
                <UserCircle size={10} /> Owner Name *
              </label>
              <input
                id="ap-owner"
                className="input"
                value={form.nama_pemilik}
                onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-1.5" htmlFor="ap-telp">
                <Phone size={10} /> Phone *
              </label>
              <input
                id="ap-telp"
                className="input"
                type="tel"
                value={form.telp}
                onChange={(e) => setForm({ ...form, telp: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label flex items-center gap-1.5" htmlFor="ap-alamat">
                <MapPin size={10} /> Address *
              </label>
              <input
                id="ap-alamat"
                className="input"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-1.5" htmlFor="ap-desc">
              <FileText size={10} /> Description
            </label>
            <textarea
              id="ap-desc"
              className="input resize-none"
              rows={3}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              placeholder="Brief description of your coworking space…"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary"
            >
              {saving && <LoadingSpinner size="sm" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
