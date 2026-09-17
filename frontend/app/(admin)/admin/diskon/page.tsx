'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { Diskon } from '@/types';
import { formatDate, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

export default function AdminDiskonPage() {
  const [diskons, setDiskons] = useState<Diskon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    nama_diskon: '', kode_diskon: '', persentase_diskon: '',
    tanggal_awal: todayStr, tanggal_akhir: '',
  });

  useEffect(() => { loadDiskons(); }, []);

  async function loadDiskons() {
    try {
      const res = await adminApi.getDiskon();
      setDiskons(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createDiskon({
        ...form,
        persentase_diskon: parseFloat(form.persentase_diskon),
      });
      setSuccess('Diskon berhasil ditambahkan');
      setShowModal(false);
      setForm({ nama_diskon: '', kode_diskon: '', persentase_diskon: '', tanggal_awal: todayStr, tanggal_akhir: '' });
      loadDiskons();
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
      await adminApi.deleteDiskon(deleteTarget);
      setSuccess('Diskon berhasil dihapus');
      setDeleteTarget(null);
      loadDiskons();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  function isActive(d: Diskon) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(d.tanggal_awal) <= today && new Date(d.tanggal_akhir) >= today;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🏷️ Kelola Diskon</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Tambah Diskon</button>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Kode</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Diskon</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Periode</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {diskons.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada diskon</td></tr>
              ) : diskons.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.nama_diskon}</td>
                  <td className="px-4 py-3"><code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{d.kode_diskon}</code></td>
                  <td className="px-4 py-3 font-bold text-green-600">{d.persentase_diskon}%</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {formatDate(d.tanggal_awal)} – {formatDate(d.tanggal_akhir)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${isActive(d) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {isActive(d) ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/diskon/${d.id}`} className="text-primary-600 hover:underline text-xs font-medium">Edit</Link>
                      <button onClick={() => setDeleteTarget(d.id)} className="text-red-600 hover:underline text-xs font-medium">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Diskon Baru">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Nama Diskon *</label>
            <input className="input" value={form.nama_diskon}
              onChange={(e) => setForm({ ...form, nama_diskon: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Kode Diskon *</label>
              <input className="input uppercase" value={form.kode_diskon}
                onChange={(e) => setForm({ ...form, kode_diskon: e.target.value.toUpperCase() })} required />
            </div>
            <div>
              <label className="label">Persentase (%) *</label>
              <input type="number" className="input" min="1" max="100" value={form.persentase_diskon}
                onChange={(e) => setForm({ ...form, persentase_diskon: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tanggal Awal *</label>
              <input type="date" className="input" value={form.tanggal_awal}
                onChange={(e) => setForm({ ...form, tanggal_awal: e.target.value })} required />
            </div>
            <div>
              <label className="label">Tanggal Akhir *</label>
              <input type="date" className="input" value={form.tanggal_akhir} min={form.tanggal_awal}
                onChange={(e) => setForm({ ...form, tanggal_akhir: e.target.value })} required />
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
        <p>Yakin ingin menghapus diskon ini?</p>
      </Modal>
    </div>
  );
}
