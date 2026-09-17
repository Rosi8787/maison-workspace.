'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { Member } from '@/types';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  const [createForm, setCreateForm] = useState({
    nama_member: '', instansi: '', alamat: '', telp: '', username: '', password: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => { loadMembers(); }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await adminApi.getMembers();
      setMembers(res.data);
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
      await adminApi.createMember(createForm);
      setSuccess('Member berhasil ditambahkan');
      setShowCreateModal(false);
      setCreateForm({ nama_member: '', instansi: '', alamat: '', telp: '', username: '', password: '' });
      loadMembers();
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
      await adminApi.deleteMember(deleteTarget);
      setSuccess('Member berhasil dihapus');
      setDeleteTarget(null);
      loadMembers();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const filtered = members.filter((m) =>
    m.nama_member.toLowerCase().includes(search.toLowerCase()) ||
    m.instansi.toLowerCase().includes(search.toLowerCase()) ||
    m.user?.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">👥 Kelola Member</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">+ Tambah Member</button>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {/* Search */}
      <div className="mb-4">
        <input className="input max-w-xs" placeholder="Cari member..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Instansi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Telepon</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Username</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada member</td></tr>
              ) : filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.foto ? (
                        <img src={`${API_URL}${m.foto}`} className="w-8 h-8 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">👤</div>
                      )}
                      <span className="font-medium">{m.nama_member}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.instansi}</td>
                  <td className="px-4 py-3 text-gray-600">{m.telp}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{m.user?.username}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/members/${m.id}`} className="text-primary-600 hover:underline text-xs font-medium">Edit</Link>
                      <button onClick={() => setDeleteTarget(m.id)}
                        className="text-red-600 hover:underline text-xs font-medium">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Tambah Member Baru">
        <form onSubmit={handleCreate} className="space-y-4" id="create-member-form">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nama *</label>
              <input className="input" value={createForm.nama_member}
                onChange={(e) => setCreateForm({ ...createForm, nama_member: e.target.value })} required />
            </div>
            <div>
              <label className="label">Instansi *</label>
              <input className="input" value={createForm.instansi}
                onChange={(e) => setCreateForm({ ...createForm, instansi: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Alamat *</label>
            <input className="input" value={createForm.alamat}
              onChange={(e) => setCreateForm({ ...createForm, alamat: e.target.value })} required />
          </div>
          <div>
            <label className="label">Telepon *</label>
            <input className="input" value={createForm.telp}
              onChange={(e) => setCreateForm({ ...createForm, telp: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Username *</label>
              <input className="input" value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} required />
            </div>
            <div>
              <label className="label">Password *</label>
              <input type="password" className="input" value={createForm.password} minLength={6}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Batal</button>
            <button type="submit" disabled={creating} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {creating && <LoadingSpinner size="sm" />}
              Tambah
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
        <p className="text-gray-700">Yakin ingin menghapus member ini? Data reservasi terkait tidak akan terhapus.</p>
      </Modal>
    </div>
  );
}
