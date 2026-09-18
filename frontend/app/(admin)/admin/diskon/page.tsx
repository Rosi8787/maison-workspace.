'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Tag, Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Diskon } from '@/types';
import { formatDate, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

function isActive(d: Diskon) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(d.tanggal_awal) <= today && new Date(d.tanggal_akhir) >= today;
}

export default function AdminDiskonPage() {
  const [diskons, setDiskons]           = useState<Diskon[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [creating, setCreating]         = useState(false);
  const [deleting, setDeleting]         = useState(false);
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
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await adminApi.createDiskon({ ...form, persentase_diskon: parseFloat(form.persentase_diskon) });
      setSuccess('Discount added');
      setShowModal(false);
      setForm({ nama_diskon: '', kode_diskon: '', persentase_diskon: '', tanggal_awal: todayStr, tanggal_akhir: '' });
      loadDiskons();
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setCreating(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.deleteDiskon(deleteTarget);
      setSuccess('Discount deleted');
      setDeleteTarget(null);
      loadDiskons();
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setDeleting(false); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>Discounts</h1>
          <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Manage promo codes and discount rates</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={15} /> Add Discount</button>
      </div>

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {/* Head */}
          <div
            className="grid grid-cols-6 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ borderBottom: `1px solid ${BORDER}`, color: '#7a6a5a' }}
          >
            <span className="col-span-2">Name</span>
            <span>Code</span>
            <span>Discount</span>
            <span>Period</span>
            <span>Actions</span>
          </div>

          {diskons.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#7a6a5a' }}>
              <Tag size={32} className="mx-auto mb-2 opacity-25" />
              No discounts yet
            </div>
          ) : diskons.map((d, i) => {
            const active = isActive(d);
            return (
              <motion.div
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-6 items-center px-5 py-3.5 text-sm"
                style={{ borderBottom: i < diskons.length - 1 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}
              >
                <span className="col-span-2 font-medium" style={{ color: '#f4eee7' }}>{d.nama_diskon}</span>
                <span>
                  <code
                    className="px-2 py-0.5 rounded-lg text-xs font-mono"
                    style={{ background: 'rgba(201,167,122,0.12)', color: '#c9a77a' }}
                  >
                    {d.kode_diskon}
                  </code>
                </span>
                <span className="font-bold" style={{ color: '#4ade80' }}>{d.persentase_diskon}%</span>
                <span className="text-xs" style={{ color: '#7a6a5a' }}>
                  {formatDate(d.tanggal_awal)}<br />{formatDate(d.tanggal_akhir)}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium mr-1"
                    style={{
                      background: active ? 'rgba(74,222,128,0.10)' : 'rgba(148,163,184,0.10)',
                      border: `1px solid ${active ? 'rgba(74,222,128,0.25)' : 'rgba(148,163,184,0.20)'}`,
                      color: active ? '#4ade80' : '#94a3b8',
                    }}
                  >
                    {active ? 'Active' : 'Inactive'}
                  </span>
                  <Link
                    href={`/admin/diskon/${d.id}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(255,255,255,0.06)', color: '#b8a898' }}
                  >
                    <Pencil size={10} /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(d.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171' }}
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Discount">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Discount Name *</label>
            <input className="input" value={form.nama_diskon} onChange={(e) => setForm({ ...form, nama_diskon: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Discount Code *</label>
              <input className="input uppercase" value={form.kode_diskon} onChange={(e) => setForm({ ...form, kode_diskon: e.target.value.toUpperCase() })} required />
            </div>
            <div>
              <label className="label">Percentage (%) *</label>
              <input type="number" className="input" min="1" max="100" value={form.persentase_diskon} onChange={(e) => setForm({ ...form, persentase_diskon: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Date *</label>
              <input type="date" className="input" value={form.tanggal_awal} onChange={(e) => setForm({ ...form, tanggal_awal: e.target.value })} required />
            </div>
            <div>
              <label className="label">End Date *</label>
              <input type="date" className="input" value={form.tanggal_akhir} min={form.tanggal_awal} onChange={(e) => setForm({ ...form, tanggal_akhir: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={creating} className="btn-primary flex-1">
              {creating && <LoadingSpinner size="sm" />} Add Discount
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Discount"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1">
              {deleting && <LoadingSpinner size="sm" />} Delete
            </button>
          </div>
        }
      >
        <p style={{ color: '#b8a898' }}>Are you sure you want to delete this discount?</p>
      </Modal>
    </div>
  );
}
