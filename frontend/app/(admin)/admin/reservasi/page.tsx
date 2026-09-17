'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Reservasi } from '@/types';
import { formatCurrency, formatDate, formatTime, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'belum_dikonfirm', label: 'Belum Dikonfirmasi' },
  { value: 'disetujui', label: 'Disetujui' },
  { value: 'aktif', label: 'Aktif' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
];

export default function AdminReservasiPage() {
  const [reservasi, setReservasi] = useState<Reservasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bulanFilter, setBulanFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Status change modal
  const [statusModal, setStatusModal] = useState<{ id: number; currentStatus: string } | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    loadReservasi();
  }, [statusFilter, bulanFilter]);

  async function loadReservasi() {
    setLoading(true);
    try {
      const res = await adminApi.getReservasi(statusFilter || undefined, bulanFilter || undefined);
      setReservasi(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn(id: number) {
    setActionLoading(id);
    try {
      await adminApi.checkIn(id);
      setSuccess('Check-in berhasil');
      loadReservasi();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCheckOut(id: number) {
    setActionLoading(id);
    try {
      await adminApi.checkOut(id);
      setSuccess('Check-out berhasil');
      loadReservasi();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleStatusChange() {
    if (!statusModal || !newStatus) return;
    setActionLoading(statusModal.id);
    try {
      await adminApi.updateReservasiStatus(statusModal.id, newStatus);
      setSuccess('Status berhasil diubah');
      setStatusModal(null);
      loadReservasi();
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📅 Kelola Reservasi</h1>

      {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input type="month" className="input w-auto" value={bulanFilter}
          onChange={(e) => setBulanFilter(e.target.value)} placeholder="Filter bulan" />
        {(statusFilter || bulanFilter) && (
          <button onClick={() => { setStatusFilter(''); setBulanFilter(''); }}
            className="btn-secondary text-sm">Reset Filter</button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Kode</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Ruang</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Tanggal & Jam</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reservasi.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">Tidak ada reservasi</td></tr>
              ) : reservasi.map((r) => {
                const detail = r.detail_reservasi?.[0];
                const isLoading = actionLoading === r.id;
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-primary-600 font-bold">{r.kode_reservasi}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.member?.nama_member}</p>
                      <p className="text-xs text-gray-400">{r.member?.telp}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{detail?.space?.nama_space || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      <p>{formatDate(r.tanggal_reservasi)}</p>
                      <p>{formatTime(r.jam_mulai)} • {r.durasi_jam} jam</p>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(detail?.total_harga || 0)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {/* Ubah status */}
                        <button
                          onClick={() => { setStatusModal({ id: r.id, currentStatus: r.status }); setNewStatus(r.status); }}
                          className="text-xs text-blue-600 hover:underline font-medium">
                          Status
                        </button>
                        {/* Check-in: hanya jika disetujui */}
                        {r.status === 'disetujui' && (
                          <button onClick={() => handleCheckIn(r.id)} disabled={isLoading}
                            className="text-xs text-green-600 hover:underline font-medium flex items-center gap-1">
                            {isLoading ? <LoadingSpinner size="sm" /> : 'Check-in'}
                          </button>
                        )}
                        {/* Check-out: hanya jika aktif */}
                        {r.status === 'aktif' && (
                          <button onClick={() => handleCheckOut(r.id)} disabled={isLoading}
                            className="text-xs text-orange-600 hover:underline font-medium flex items-center gap-1">
                            {isLoading ? <LoadingSpinner size="sm" /> : 'Check-out'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Change Modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Ubah Status Reservasi"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setStatusModal(null)} className="btn-secondary flex-1">Batal</button>
            <button onClick={handleStatusChange} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {actionLoading && <LoadingSpinner size="sm" />} Simpan
            </button>
          </div>
        }
      >
        <div>
          <label className="label">Status Baru</label>
          <select className="input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {STATUS_OPTIONS.filter((s) => s.value).map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
