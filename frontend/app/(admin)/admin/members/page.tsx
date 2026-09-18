'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Search, UserCircle, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { getErrorMessage, getImageUrl } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

const CARD    = 'rgba(34,26,20,0.80)';
const BORDER  = 'rgba(255,255,255,0.08)';

export default function AdminMembersPage() {
  const [members, setMembers]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [showCreateModal, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [creating, setCreating]     = useState(false);
  const [search, setSearch]         = useState('');

  const [createForm, setCreateForm] = useState({
    nama_member: '', instansi: '', alamat: '', telp: '', username: '', password: '',
  });

  useEffect(() => { loadMembers(); }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await adminApi.getMembers();
      setMembers(res.data);
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createMember(createForm);
      setSuccess('Member added successfully');
      setShowCreate(false);
      setCreateForm({ nama_member: '', instansi: '', alamat: '', telp: '', username: '', password: '' });
      loadMembers();
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setCreating(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteMember(deleteTarget);
      setSuccess('Member deleted');
      setDeleteTarget(null);
      loadMembers();
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setDeleting(false); }
  }

  const filtered = members.filter((m) =>
    m.nama_member?.toLowerCase().includes(search.toLowerCase()) ||
    m.instansi?.toLowerCase().includes(search.toLowerCase()) ||
    m.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>Members</h1>
          <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Manage member accounts</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={15} /> Add Member
        </button>
      </div>

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {/* Search */}
      <div className="relative mb-6 max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6a5a' }} />
        <input
          className="input pl-9"
          placeholder="Search members…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {/* Table head */}
          <div
            className="grid grid-cols-5 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ borderBottom: `1px solid ${BORDER}`, color: '#7a6a5a' }}
          >
            <span className="col-span-2">Name</span>
            <span>Institution</span>
            <span>Phone</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#7a6a5a' }}>No members found</div>
          ) : filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-5 items-center px-5 py-3.5 text-sm transition-colors"
              style={{ borderBottom: i < filtered.length - 1 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}
            >
              {/* Name + avatar */}
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'rgba(201,167,122,0.12)' }}>
                  {m.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getImageUrl(m.foto) ?? ''} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle size={18} style={{ color: '#c9a77a' }} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#f4eee7' }}>{m.nama_member}</p>
                  <p className="text-xs" style={{ color: '#7a6a5a' }}>{m.user?.username}</p>
                </div>
              </div>
              <span style={{ color: '#b8a898' }}>{m.instansi}</span>
              <span style={{ color: '#b8a898' }}>{m.telp}</span>
              <div className="flex gap-2">
                <Link
                  href={`/admin/members/${m.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#b8a898' }}
                >
                  <Pencil size={11} /> Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget(m.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171' }}
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreate(false)} title="Add New Member">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Full Name *</label>
              <input className="input" value={createForm.nama_member} onChange={(e) => setCreateForm({ ...createForm, nama_member: e.target.value })} required />
            </div>
            <div>
              <label className="label">Institution *</label>
              <input className="input" value={createForm.instansi} onChange={(e) => setCreateForm({ ...createForm, instansi: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="label">Address *</label>
            <input className="input" value={createForm.alamat} onChange={(e) => setCreateForm({ ...createForm, alamat: e.target.value })} required />
          </div>
          <div>
            <label className="label">Phone *</label>
            <input className="input" type="tel" value={createForm.telp} onChange={(e) => setCreateForm({ ...createForm, telp: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Username *</label>
              <input className="input" value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} required />
            </div>
            <div>
              <label className="label">Password *</label>
              <input type="password" className="input" minLength={6} value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary flex-1">
              {creating && <LoadingSpinner size="sm" />} Add Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Member"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
              {deleting && <LoadingSpinner size="sm" />} Delete
            </button>
          </div>
        }
      >
        <p style={{ color: '#b8a898' }}>Are you sure you want to delete this member? Reservation data will be preserved.</p>
      </Modal>
    </div>
  );
}
