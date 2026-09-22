'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, LogIn, LogOut, QrCode } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import QrScannerModal from '@/components/admin/QrScannerModal';

const STATUS_OPTIONS = [
  { value: '',                label: 'All Status' },
  { value: 'belum_dikonfirm', label: 'Pending' },
  { value: 'disetujui',       label: 'Approved' },
  { value: 'aktif',           label: 'Active' },
  { value: 'selesai',         label: 'Done' },
  { value: 'dibatalkan',      label: 'Cancelled' },
];

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function AdminReservasiPage() {
  const [reservasi, setReservasi]     = useState<Reservasi[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulanFilter, setBulanFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [statusModal, setStatusModal] = useState<{ id: number; currentStatus: string } | null>(null);
  const [newStatus, setNewStatus]     = useState('');
  const [qrScanOpen, setQrScanOpen]   = useState(false);

  useEffect(() => { loadReservasi(); }, [statusFilter, bulanFilter]); // eslint-disable-line

  async function loadReservasi() {
    setLoading(true);
    try {
      const res = await adminApi.getReservasi(statusFilter || undefined, bulanFilter || undefined);
      setReservasi(res.data);
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleCheckIn(id: number) {
    setActionLoading(id);
    try { await adminApi.checkIn(id); setSuccess('Check-in successful'); loadReservasi(); }
    catch (err: any) { setError(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  }

  async function handleCheckOut(id: number) {
    setActionLoading(id);
    try { await adminApi.checkOut(id); setSuccess('Check-out successful'); loadReservasi(); }
    catch (err: any) { setError(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  }

  async function handleStatusChange() {
    if (!statusModal || !newStatus) return;
    setActionLoading(statusModal.id);
    try { await adminApi.updateReservasiStatus(statusModal.id, newStatus); setSuccess('Status updated'); setStatusModal(null); loadReservasi(); }
    catch (err: any) { setError(getErrorMessage(err)); }
    finally { setActionLoading(null); }
  }

  const hasFilter = statusFilter || bulanFilter;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>Reservations</h1>
            <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Manage and track all workspace bookings</p>
          </div>
          {/* Tombol Scan QR */}
          <button
            onClick={() => setQrScanOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <QrCode size={15} />
            Scan QR Check-In
          </button>
        </div>
      </div>

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {/* Filters */}
      <div
        className="flex flex-wrap items-end gap-3 mb-6 p-4 rounded-2xl"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <Filter size={15} style={{ color: '#7a6a5a' }} className="mt-0.5" />
        <div>
          <label className="label">Status</label>
          <select className="input w-44 appearance-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} style={{ background: '#1c1410' }}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Month</label>
          <input type="month" className="input w-40" value={bulanFilter} onChange={(e) => setBulanFilter(e.target.value)} />
        </div>
        {hasFilter && (
          <button
            onClick={() => { setStatusFilter(''); setBulanFilter(''); }}
            className="btn-secondary text-sm flex items-center gap-1.5 self-end"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          {/* Head */}
          <div
            className="grid grid-cols-7 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
            style={{ borderBottom: `1px solid ${BORDER}`, color: '#7a6a5a' }}
          >
            <span>Code</span>
            <span className="col-span-2">Member</span>
            <span>Space</span>
            <span>Date & Time</span>
            <span>Total</span>
            <span>Actions</span>
          </div>

          {reservasi.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#7a6a5a' }}>No reservations found</div>
          ) : reservasi.map((r, i) => {
            const detail    = r.detail_reservasi?.[0];
            const isLoading = actionLoading === r.id;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                className="grid grid-cols-7 items-center px-5 py-4 text-sm transition-colors hover:bg-white/[0.02]"
                style={{ borderBottom: i < reservasi.length - 1 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}
              >
                <span className="font-mono text-xs font-bold" style={{ color: '#c9a77a' }}>{r.kode_reservasi}</span>
                <div className="col-span-2">
                  <p className="font-medium text-sm" style={{ color: '#f4eee7' }}>{r.member?.nama_member}</p>
                  <p className="text-xs" style={{ color: '#7a6a5a' }}>{r.member?.telp}</p>
                </div>
                <span style={{ color: '#b8a898' }}>{detail?.space?.nama_space || '-'}</span>
                <div className="text-xs" style={{ color: '#b8a898' }}>
                  <p>{formatDate(r.tanggal_reservasi)}</p>
                  <p>{formatTime(r.jam_mulai)} · {r.durasi_jam}h</p>
                </div>
                <span className="font-medium" style={{ color: '#f4eee7' }}>{formatCurrency(detail?.total_harga || 0)}</span>
                <div className="flex flex-wrap gap-1 items-center">
                  <StatusBadge status={r.status} />
                  <button
                    onClick={() => { setStatusModal({ id: r.id, currentStatus: r.status }); setNewStatus(r.status); }}
                    className="text-xs px-2 py-1 rounded-lg transition-colors"
                    style={{ background: 'rgba(96,165,250,0.10)', color: '#60a5fa' }}
                  >
                    Status
                  </button>
                  {r.status === 'disetujui' && (
                    <button onClick={() => handleCheckIn(r.id)} disabled={isLoading}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(74,222,128,0.10)', color: '#4ade80' }}
                    >
                      {isLoading ? <LoadingSpinner size="sm" /> : <><LogIn size={11} /> In</>}
                    </button>
                  )}
                  {r.status === 'aktif' && (
                    <button onClick={() => handleCheckOut(r.id)} disabled={isLoading}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(251,191,36,0.10)', color: '#fbbf24' }}
                    >
                      {isLoading ? <LoadingSpinner size="sm" /> : <><LogOut size={11} /> Out</>}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Status Modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Change Reservation Status"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setStatusModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleStatusChange} className="btn-primary flex-1">
              {actionLoading && <LoadingSpinner size="sm" />} Save
            </button>
          </div>
        }
      >
        <div>
          <label className="label">New Status</label>
          <select className="input appearance-none" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
              <option key={s.value} value={s.value} style={{ background: '#1c1410' }}>{s.label}</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={qrScanOpen}
        onClose={() => setQrScanOpen(false)}
        onSuccess={(msg) => {
          setSuccess(msg);
          setQrScanOpen(false);
          loadReservasi(); // refresh list setelah check-in via QR
        }}
      />
    </div>
  );
}
