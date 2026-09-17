'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/api';
import { MonthlyReport, IncomeReport } from '@/types';
import { formatCurrency, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';

const MONTH_NAMES = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function AdminReportsPage() {
  const now = new Date();
  const [tab, setTab] = useState<'monthly' | 'income'>('monthly');
  const [bulan, setBulan] = useState(String(now.getMonth() + 1));
  const [tahun, setTahun] = useState(String(now.getFullYear()));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [incomeReport, setIncomeReport] = useState<IncomeReport | null>(null);

  async function loadMonthly() {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getMonthlyReport(bulan, tahun);
      setMonthlyReport(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function loadIncome() {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getIncomeReport(tahun);
      setIncomeReport(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📈 Laporan</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['monthly', 'income'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}>
            {t === 'monthly' ? '📅 Laporan Bulanan' : '💰 Rekap Pendapatan'}
          </button>
        ))}
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

      {/* Monthly Report */}
      {tab === 'monthly' && (
        <div>
          <div className="card mb-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="label">Bulan</label>
                <select className="input" value={bulan} onChange={(e) => setBulan(e.target.value)}>
                  {MONTH_NAMES.slice(1).map((m, i) => (
                    <option key={i + 1} value={String(i + 1)}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Tahun</label>
                <input type="number" className="input w-28" value={tahun} min="2020"
                  onChange={(e) => setTahun(e.target.value)} />
              </div>
              <button onClick={loadMonthly} disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <LoadingSpinner size="sm" /> : null}
                Tampilkan
              </button>
              {monthlyReport && (
                <button onClick={() => window.print()} className="btn-secondary">🖨️ Cetak</button>
              )}
            </div>
          </div>

          {monthlyReport && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total', value: monthlyReport.summary.total_reservasi, color: 'bg-gray-100' },
                  { label: 'Selesai', value: monthlyReport.summary.selesai, color: 'bg-green-100' },
                  { label: 'Aktif', value: monthlyReport.summary.aktif, color: 'bg-blue-100' },
                  { label: 'Disetujui', value: monthlyReport.summary.disetujui, color: 'bg-yellow-100' },
                  { label: 'Belum Konfirm', value: monthlyReport.summary.belum_dikonfirm, color: 'bg-orange-100' },
                  { label: 'Dibatalkan', value: monthlyReport.summary.dibatalkan, color: 'bg-red-100' },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-lg p-4 text-center`}>
                    <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-600 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="card">
                <p className="text-sm text-gray-600">Total Pendapatan ({MONTH_NAMES[monthlyReport.periode.bulan]} {monthlyReport.periode.tahun})</p>
                <p className="text-3xl font-bold text-primary-600">{formatCurrency(monthlyReport.total_pendapatan)}</p>
              </div>

              {/* Data table */}
              <div className="card overflow-hidden p-0">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <p className="font-medium text-sm text-gray-700">
                    Detail Reservasi — {MONTH_NAMES[monthlyReport.periode.bulan]} {monthlyReport.periode.tahun}
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600">Kode</th>
                      <th className="text-left px-4 py-3 text-gray-600">Member</th>
                      <th className="text-left px-4 py-3 text-gray-600">Ruang</th>
                      <th className="text-left px-4 py-3 text-gray-600">Tanggal</th>
                      <th className="text-left px-4 py-3 text-gray-600">Total</th>
                      <th className="text-left px-4 py-3 text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {monthlyReport.data.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada data</td></tr>
                    ) : monthlyReport.data.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-3 font-mono text-xs">{r.kode_reservasi}</td>
                        <td className="px-4 py-3">{r.member?.nama_member}</td>
                        <td className="px-4 py-3">{r.detail_reservasi?.[0]?.space?.nama_space}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(r.tanggal_reservasi).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(r.detail_reservasi?.[0]?.total_harga || 0)}</td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Income Report */}
      {tab === 'income' && (
        <div>
          <div className="card mb-6">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="label">Tahun</label>
                <input type="number" className="input w-28" value={tahun} min="2020"
                  onChange={(e) => setTahun(e.target.value)} />
              </div>
              <button onClick={loadIncome} disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <LoadingSpinner size="sm" /> : null}
                Tampilkan
              </button>
            </div>
          </div>

          {incomeReport && (
            <div className="space-y-6">
              <div className="card">
                <p className="text-sm text-gray-600">Total Pendapatan Tahun {incomeReport.tahun}</p>
                <p className="text-3xl font-bold text-primary-600">{formatCurrency(incomeReport.total_pendapatan)}</p>
              </div>

              {/* Per bulan */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Pendapatan Per Bulan</h3>
                <div className="space-y-2">
                  {Object.entries(incomeReport.per_bulan).map(([month, income]) => {
                    const maxIncome = Math.max(...Object.values(incomeReport.per_bulan));
                    const pct = maxIncome > 0 ? (income / maxIncome) * 100 : 0;
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16 text-right">{MONTH_NAMES[parseInt(month)]}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div className="bg-primary-500 h-full rounded-full transition-all"
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-medium w-36 text-right">{formatCurrency(income)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per tipe space */}
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4">Distribusi Per Tipe Space</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(incomeReport.per_tipe_space).map(([tipe, income]) => (
                    <div key={tipe} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700">{tipe.replace(/_/g, ' ')}</p>
                      <p className="text-xl font-bold text-primary-600 mt-1">{formatCurrency(income)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
