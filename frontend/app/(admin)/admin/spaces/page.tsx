'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Building2, Users, Pencil, Trash2, Upload, CheckCircle } from 'lucide-react';
import { adminApi, uploadApi } from '@/lib/api';
import { Space } from '@/types';
import { formatCurrency, getTipeSpaceLabel, getErrorMessage, getImageUrl } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

const CARD    = 'rgba(34,26,20,0.80)';
const BORDER  = 'rgba(255,255,255,0.08)';

export default function AdminSpacesPage() {
  const [spaces, setSpaces]           = useState<Space[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [creating, setCreating]       = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [uploading, setUploading]     = useState(false);

  const [form, setForm] = useState({
    nama_space: '', tipe: 'Personal_Desk' as any,
    kapasitas: '1', harga_per_jam: '', deskripsi: '', foto: '',
  });

  useEffect(() => { loadSpaces(); }, []);

  async function loadSpaces() {
    try {
      const res = await adminApi.getSpaces();
      setSpaces(res.data);
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadSpace(file);
      setForm((f) => ({ ...f, foto: res.data.path }));
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setUploading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createSpace({ ...form, kapasitas: parseInt(form.kapasitas), harga_per_jam: parseFloat(form.harga_per_jam) });
      setSuccess('Space added successfully');
      setShowModal(false);
      setForm({ nama_space: '', tipe: 'Personal_Desk', kapasitas: '1', harga_per_jam: '', deskripsi: '', foto: '' });
      loadSpaces();
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setCreating(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteSpace(deleteTarget);
      setSuccess('Space deleted');
      setDeleteTarget(null);
      loadSpaces();
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setDeleting(false); }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>
            Spaces
          </h1>
          <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Manage your coworking spaces</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> Add Space
        </button>
      </div>

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-20" style={{ color: '#7a6a5a' }}>
          <Building2 size={40} className="mx-auto mb-3 opacity-25" />
          <p className="font-medium" style={{ color: '#b8a898' }}>No spaces yet</p>
          <p className="text-sm mt-1">Add your first coworking space</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {spaces.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {s.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getImageUrl(s.foto) ?? ''} alt={s.nama_space} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: '#261a0e' }}>
                    <Building2 size={32} style={{ color: '#3d3028' }} />
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,transparent 50%,rgba(18,13,11,0.6) 100%)' }} />
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(18,13,11,0.80)', border: '1px solid rgba(255,255,255,0.12)', color: '#c9a77a', backdropFilter: 'blur(8px)' }}
                >
                  {getTipeSpaceLabel(s.tipe)}
                </span>
              </div>
              {/* Body */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#f4eee7' }}>{s.nama_space}</h3>
                <div className="flex items-center justify-between text-xs mb-4" style={{ color: '#7a6a5a' }}>
                  <span className="flex items-center gap-1"><Users size={11} /> {s.kapasitas}</span>
                  <span style={{ color: '#c9a77a' }}>{formatCurrency(s.harga_per_jam)}/hr</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/spaces/${s.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: '#b8a898' }}
                  >
                    <Pencil size={11} /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(s.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                    style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', color: '#f87171' }}
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Space">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label" htmlFor="sp-name">Space Name *</label>
            <input id="sp-name" className="input" value={form.nama_space} onChange={(e) => setForm({ ...form, nama_space: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="sp-tipe">Type *</label>
              <select id="sp-tipe" className="input appearance-none" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                <option value="Personal_Desk" style={{ background: '#1c1410' }}>Personal Desk</option>
                <option value="Private_Office" style={{ background: '#1c1410' }}>Private Office</option>
                <option value="Meeting_Room" style={{ background: '#1c1410' }}>Meeting Room</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="sp-cap">Capacity *</label>
              <input id="sp-cap" type="number" className="input" min="1" value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="sp-price">Price / Hour (Rp) *</label>
            <input id="sp-price" type="number" className="input" min="0" value={form.harga_per_jam} onChange={(e) => setForm({ ...form, harga_per_jam: e.target.value })} required />
          </div>
          <div>
            <label className="label" htmlFor="sp-desc">Description</label>
            <textarea id="sp-desc" className="input resize-none" rows={2} value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          </div>
          <div>
            <label className="label">Photo</label>
            <label
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)' }}
              htmlFor="sp-foto"
            >
              {uploading ? <LoadingSpinner size="sm" /> : form.foto ? <CheckCircle size={15} style={{ color: '#4ade80' }} /> : <Upload size={15} style={{ color: '#7a6a5a' }} />}
              <span className="text-sm" style={{ color: form.foto ? '#4ade80' : '#7a6a5a' }}>
                {form.foto ? 'Photo uploaded' : 'Upload space photo'}
              </span>
              <input id="sp-foto" type="file" accept="image/*" className="sr-only" onChange={handleFotoUpload} />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary flex-1">
              {creating && <LoadingSpinner size="sm" />} Add Space
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Space"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
              {deleting && <LoadingSpinner size="sm" />} Delete
            </button>
          </div>
        }
      >
        <p style={{ color: '#b8a898' }}>Are you sure you want to delete this space? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
