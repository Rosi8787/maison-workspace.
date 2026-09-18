'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CalendarCheck, Printer } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { MonthlyReport, IncomeReport } from '@/types';
import { formatCurrency, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';

const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];
const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function AdminReportsPage() {
  const now = new Date();
  const [tab, setTab]             = useState<'monthly' | 'income'>('monthly');
  const [bulan, setBulan]         = useState(String(now.getMonth() + 1));
  const [tahun, setTahun]         = useState(String(now.getFullYear()));
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [incomeReport, setIncomeReport]   = useState<IncomeReport | null>(null);

  async function loadMonthly() {
    setLoading(true); setError('');
    try { const res = await adminApi.getMonthlyReport(bulan, tahun); setMonthlyReport(res.data); }
    catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function loadIncome() {
    setLoading(true); setError('');
    try { const res = await adminApi.getIncomeReport(tahun); setIncomeReport(res.data); }
    catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>Reports</h1>
        <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Revenue and reservation analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: 'monthly', label: 'Monthly Report', Icon: CalendarCheck },
          { key: 'income',  label: 'Income Report',  Icon: BarChart3 },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: tab === key ? '#c9a77a' : 'rgba(255,255,255,0.06)',
              color:      tab === key ? '#1a1008' : '#7a6a5a',
              border:     tab === key ? '1px solid #c9a77a' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {error && <div className="mb-5"><Alert type="error" message={error} /></div>}

      {/* ─── Monthly ─── */}
      {tab === 'monthly' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl p-5 mb-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="label">Month</label>
                <select className="input w-44 appearance-none" value={bulan} onChange={(e) => setBulan(e.target.value)}>
                  {MONTHS.slice(1).map((m, i) => (
                    <option key={i+1} value={String(i+1)} style={{ background: '#1c1410' }}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Year</label>
                <input type="number" className="input w-28" value={tahun} min="2020" onChange={(e) => setTahun(e.target.value)} />
              </div>
              <button onClick={loadMonthly} disabled={loading} className="btn-primary">
                {loading ? <LoadingSpinner size="sm" /> : null} View Report
              </button>
              {monthlyReport && (
                <button onClick={() => window.print()} className="btn-glass flex items-center gap-2 no-print">
                  <Printer size={14} /> Print
                </button>
              )}
            </div>
          </div>

          {monthlyReport && (
            <div className="space-y-5">
              {/* Summary row */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label: 'Total',     value: monthlyReport.summary.total_reservasi, color: '#b8a898' },
                  { label: 'Done',      value: monthlyReport.summary.selesai,         color: '#4ade80' },
                  { label: 'Active',    value: monthlyReport.summary.aktif,           color: '#60a5fa' },
                  { label: 'Approved',  value: monthlyReport.summary.disetujui,       color: '#fbbf24' },
                  { label: 'Pending',   value: monthlyReport.summary.belum_dikonfirm, color: '#fb923c' },
                  { label: 'Cancelled', value: monthlyReport.summary.dibatalkan,      color: '#f87171' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-1" style={{ color: '#7a6a5a' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue card */}
              <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#7a6a5a' }}>
                  Revenue — {MONTHS[monthlyReport.periode.bulan]} {monthlyReport.periode.tahun}
                </p>
                <p className="text-3xl font-bold" style={{ color: '#c9a77a' }}>
                  {formatCurrency(monthlyReport.total_pendapatan)}
                </p>
              </div>

              {/* Table */}
              <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="px-5 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <p className="text-sm font-medium" style={{ color: '#f4eee7' }}>
                    Reservation Detail — {MONTHS[monthlyReport.periode.bulan]} {monthlyReport.periode.tahun}
                  </p>
                </div>
                <div
                  className="grid grid-cols-6 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ borderBottom: `1px solid ${BORDER}`, color: '#7a6a5a' }}
                >
                  <span>Code</span><span>Member</span><span>Space</span><span>Date</span><span>Total</span><span>Status</span>
                </div>
                {monthlyReport.data.length === 0 ? (
                  <div className="text-center py-10" style={{ color: '#7a6a5a' }}>No data</div>
                ) : monthlyReport.data.map((r, i) => (
                  <div key={r.id}
                    className="grid grid-cols-6 items-center px-5 py-3.5 text-sm"
                    style={{ borderBottom: i < monthlyReport.data.length - 1 ? `1px solid rgba(255,255,255,0.05)` : 'none' }}
                  >
                    <span className="font-mono text-xs" style={{ color: '#c9a77a' }}>{r.kode_reservasi}</span>
                    <span style={{ color: '#b8a898' }}>{r.member?.nama_member}</span>
                    <span style={{ color: '#b8a898' }}>{r.detail_reservasi?.[0]?.space?.nama_space}</span>
                    <span className="text-xs" style={{ color: '#7a6a5a' }}>{new Date(r.tanggal_reservasi).toLocaleDateString('id-ID')}</span>
                    <span className="font-medium" style={{ color: '#f4eee7' }}>{formatCurrency(r.detail_reservasi?.[0]?.total_harga || 0)}</span>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── Income ─── */}
      {tab === 'income' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl p-5 mb-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="label">Year</label>
                <input type="number" className="input w-28" value={tahun} min="2020" onChange={(e) => setTahun(e.target.value)} />
              </div>
              <button onClick={loadIncome} disabled={loading} className="btn-primary">
                {loading ? <LoadingSpinner size="sm" /> : null} View Report
              </button>
            </div>
          </div>

          {incomeReport && (
            <div className="space-y-5">
              <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#7a6a5a' }}>Total Revenue {incomeReport.tahun}</p>
                <p className="text-3xl font-bold" style={{ color: '#c9a77a' }}>{formatCurrency(incomeReport.total_pendapatan)}</p>
              </div>

              {/* Bar chart */}
              <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <h3 className="text-sm font-semibold mb-5" style={{ color: '#f4eee7' }}>Monthly Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(incomeReport.per_bulan).map(([month, income]) => {
                    const max = Math.max(...Object.values(incomeReport.per_bulan));
                    const pct = max > 0 ? (income / max) * 100 : 0;
                    return (
                      <div key={month} className="flex items-center gap-3">
                        <span className="text-xs w-20 text-right flex-shrink-0" style={{ color: '#7a6a5a' }}>{MONTHS[parseInt(month)]}</span>
                        <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #a07a4a, #c9a77a)' }}
                          />
                        </div>
                        <span className="text-xs w-32 text-right flex-shrink-0 font-medium" style={{ color: '#c9a77a' }}>
                          {formatCurrency(income)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Per type */}
              <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: '#f4eee7' }}>By Space Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(incomeReport.per_tipe_space).map(([tipe, income]) => (
                    <div key={tipe} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-xs font-medium mb-2" style={{ color: '#7a6a5a' }}>{tipe.replace(/_/g, ' ')}</p>
                      <p className="text-xl font-bold" style={{ color: '#c9a77a' }}>{formatCurrency(income)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
