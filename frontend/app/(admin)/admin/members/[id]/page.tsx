'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, UserCircle } from 'lucide-react';
import { adminApi, uploadApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

function resolveUrl(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${path}`;
}

export default function AdminMemberEditPage() {
  const { id }    = useParams();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const [form, setForm] = useState({
    nama_member: '',
    instansi: '',
    alamat: '',
    telp: '',
    password: '',
    foto: '',
  });

  useEffect(() => {
    if (id) loadMember(parseInt(id as string));
  }, [id]);

  async function loadMember(memberId: number) {
    try {
      const res = await adminApi.getMember(memberId);
      const m   = res.data;
      setForm({
        nama_member: m.nama_member || '',
        instansi:    m.instansi    || '',
        alamat:      m.alamat      || '',
        telp:        m.telp        || '',
        password:    '',
        foto:        m.foto        || '',
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
      const res = await uploadApi.uploadMember(file);
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
      const data: any = { ...form };
      if (!data.password) delete data.password;
      await adminApi.updateMember(parseInt(id as string), data);
      setSuccess('Member updated successfully');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  );

  const avatarUrl = resolveUrl(form.foto);
  const initials  = (form.nama_member || 'M').split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

  return (
    <div className="max-w-2xl">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#7a6a5a' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a77a')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6a5a')}
        >
          <ArrowLeft size={14} /> Back to members
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>
          Edit Member
        </h1>
        <p className="text-sm mb-8" style={{ color: '#7a6a5a' }}>Update member information and credentials</p>
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
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={form.nama_member}
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
                {initials || <UserCircle size={32} />}
              </div>
            )}
            {/* Upload overlay button */}
            <label
              htmlFor="member-foto"
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: '#c9a77a', border: '2px solid #170f0c' }}
              title="Upload member photo"
            >
              {uploading
                ? <LoadingSpinner size="sm" color="#1a1008" />
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

          <div>
            <p className="text-base font-semibold" style={{ color: '#f4eee7' }}>
              {form.nama_member || 'Member'}
            </p>
            <p className="text-sm mt-0.5" style={{ color: '#7a6a5a' }}>{form.instansi}</p>
            {form.foto && (
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle size={12} style={{ color: '#4ade80' }} />
                <span className="text-xs" style={{ color: '#4ade80' }}>Photo uploaded</span>
              </div>
            )}
            <p className="text-xs mt-2" style={{ color: '#7a6a5a' }}>Click the camera icon to change photo</p>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="me-name">Full Name</label>
              <input
                id="me-name"
                className="input"
                value={form.nama_member}
                onChange={(e) => setForm({ ...form, nama_member: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="me-inst">Institution</label>
              <input
                id="me-inst"
                className="input"
                value={form.instansi}
                onChange={(e) => setForm({ ...form, instansi: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="me-addr">Address</label>
            <textarea
              id="me-addr"
              className="input resize-none"
              rows={2}
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="me-telp">Phone</label>
            <input
              id="me-telp"
              className="input"
              type="tel"
              value={form.telp}
              onChange={(e) => setForm({ ...form, telp: e.target.value })}
            />
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

          <div>
            <label className="label" htmlFor="me-pass">
              New Password{' '}
              <span style={{ color: '#7a6a5a', textTransform: 'none', letterSpacing: 0 }}>
                (leave blank to keep current)
              </span>
            </label>
            <input
              id="me-pass"
              type="password"
              className="input"
              value={form.password}
              minLength={6}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 6 characters"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/admin/members" className="btn-secondary flex-1 justify-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary flex-1"
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
