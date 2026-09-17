'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi, uploadApi } from '@/lib/api';
import { Space } from '@/types';
import { formatCurrency, getTipeSpaceLabel, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const [form, setForm] = useState({
    nama_space: '', tipe: 'Personal_Desk' as any, kapasitas: '1',
    harga_per_jam: '', deskripsi: '', foto: '',
  });

  useEffect(() => { loadSpaces(); }, []);

  async function loadSpaces() {
    try {
      const res = await adminApi.getSpaces();
      setSpaces(res.data);
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createSpace({
        ...form,
        kapasitas: parseInt(form.kapasitas),
        harga_per_jam: parseFloat(form.harga_per_jam),
      });
      setSuccess('Space berhasil ditambahkan');
      setShowModal(false);
      setForm({ nama_space: '', tipe: 'Personal_Desk', kapasitas: '1', harga_per_jam: '', deskripsi: '', foto: '' });
      loadSpaces();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteSpace(deleteTarget);
      setSuccess('Space berhasil dihapus');
      setDeleteTarget(null);
      loadSpaces();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🏢 Kelola Space</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Tambah Space</button>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.length === 0 ? (
            <p className="text-gray-400 col-span-3 text-center py-8">Belum ada space. Tambah space pertama!</p>
          ) : spaces.map((s) => (
            <div key={s.id} className="card overflow-hidden p-0">
              <div className="h-36 bg-gray-100 relative">
                {s.foto ? (
                  <img src={`${API_URL}${s.foto}`} className="w-full h-full object-cover" alt={s.nama_space} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🏢</div>
                )}
                <span className="absolute top-2 left-2 bg-white text-xs text-primary-700 font-medium px-2 py-0.5 rounded-full">
                  {getTipeSpaceLabel(s.tipe)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{s.nama_space}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                  <span>👥 {s.kapasitas} orang</span>
                  <span className="font-medium">{formatCurrency(s.harga_per_jam)}/jam</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/admin/spaces/${s.id}`} className="btn-secondary text-xs flex-1 text-center py-1.5">Edit</Link>
                  <button onClick={() => setDeleteTarget(s.id)} className="btn-danger text-xs flex-1 py-1.5">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Space Baru">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Nama Space *</label>
            <input className="input" value={form.nama_space}
              onChange={(e) => setForm({ ...form, nama_space: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tipe *</label>
              <select className="input" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                <option value="Personal_Desk">Personal Desk</option>
                <option value="Private_Office">Private Office</option>
                <option value="Meeting_Room">Meeting Room</option>
              </select>
            </div>
            <div>
              <label className="label">Kapasitas *</label>
              <input type="number" className="input" min="1" value={form.kapasitas}
                onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Harga/Jam (Rp) *</label>
            <input type="number" className="input" min="0" value={form.harga_per_jam}
              onChange={(e) => setForm({ ...form, harga_per_jam: e.target.value })} required />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea className="input resize-none" rows={2} value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          </div>
          <div>
            <label className="label">Foto</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleFotoUpload}
                className="text-sm text-gray-600 file:mr-2 file:py-1 file:px-3 file:border file:border-gray-300 file:rounded file:text-sm file:bg-white" />
              {uploading && <LoadingSpinner size="sm" />}
              {form.foto && <span className="text-xs text-green-600">✓</span>}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={creating} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {creating && <LoadingSpinner size="sm" />} Tambah
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">Batal</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 flex items-center justify-center gap-2">
              {deleting && <LoadingSpinner size="sm" />} Hapus
            </button>
          </div>
        }>
        <p>Yakin ingin menghapus space ini?</p>
      </Modal>
    </div>
  );
}
