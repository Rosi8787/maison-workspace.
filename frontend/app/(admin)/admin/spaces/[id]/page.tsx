'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, Building2, Users } from 'lucide-react';
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

export default function AdminSpaceEditPage() {
  const { id }    = useParams();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

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
      const s   = res.data;
      setForm({
        nama_space:    s.nama_space    || '',
        tipe:          s.tipe          || 'Personal_Desk',
        kapasitas:     String(s.kapasitas) || '1',
        harga_per_jam: String(s.harga_per_jam) || '',
        deskripsi:     s.deskripsi     || '',
        foto:          s.foto          || '',
      });
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadSpace(file);
      const url = res.data.url || res.data.path;
      setForm((f) => ({ ...f, foto: url }));
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.updateSpace(parseInt(id as string), {
        ...form,
        kapasitas:     parseInt(form.kapasitas),
        harga_per_jam: parseFloat(form.harga_per_jam),
      });
      setSuccess('Space updated successfully');
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  );

  const previewUrl = resolveUrl(form.foto);

  return (
    <div className="max-w-2xl">
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <Link
          href="/admin/spaces"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#7a6a5a' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a77a')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6a5a')}
        >
          <ArrowLeft size={14} /> Back to spaces
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>Edit Space</h1>
        <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Update space information and photo</p>
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
        {/* Photo section */}
        <div className="px-6 py-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="label mb-3">Space Photo</p>
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div
              className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Space preview" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={28} style={{ color: '#3d3028' }} />
              )}
            </div>
            {/* Upload button */}
            <div>
              <label
                htmlFor="space-foto"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.06)', border: `1px dashed rgba(255,255,255,0.15)`, color: '#b8a898' }}
              >
                {uploading ? <LoadingSpinner size="sm" /> : form.foto ? <CheckCircle size={15} style={{ color: '#4ade80' }} /> : <Upload size={15} />}
                <span className="text-sm">{form.foto ? 'Change photo' : 'Upload photo'}</span>
                <input id="space-foto" type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="sr-only" onChange={handleFotoUpload} disabled={uploading} />
              </label>
              <p className="text-xs mt-1.5" style={{ color: '#7a6a5a' }}>JPG, PNG or WebP, max 5MB</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="label" htmlFor="se-name">Space Name</label>
            <input id="se-name" className="input" value={form.nama_space} onChange={(e) => setForm({ ...form, nama_space: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="se-tipe">Type</label>
              <select id="se-tipe" className="input appearance-none" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                <option value="Personal_Desk"  style={{ background: '#1c1410' }}>Personal Desk</option>
                <option value="Private_Office" style={{ background: '#1c1410' }}>Private Office</option>
                <option value="Meeting_Room"   style={{ background: '#1c1410' }}>Meeting Room</option>
              </select>
            </div>
            <div>
              <label className="label flex items-center gap-1" htmlFor="se-cap">
                <Users size={10} /> Capacity
              </label>
              <input id="se-cap" type="number" className="input" min="1" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="se-price">Price / Hour (Rp)</label>
            <input id="se-price" type="number" className="input" min="0" value={form.harga_per_jam} onChange={(e) => setForm({ ...form, harga_per_jam: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="se-desc">Description</label>
            <textarea id="se-desc" className="input resize-none" rows={3} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/admin/spaces" className="btn-secondary flex-1 justify-center">Cancel</Link>
            <button type="submit" disabled={saving || uploading} className="btn-primary flex-1">
              {saving && <LoadingSpinner size="sm" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
