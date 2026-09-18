'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function AdminDiskonEditPage() {
  const { id }  = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    nama_diskon: '', kode_diskon: '', persentase_diskon: '',
    tanggal_awal: '', tanggal_akhir: '',
  });

  useEffect(() => {
    if (id) loadDiskon(parseInt(id as string));
  }, [id]);

  async function loadDiskon(diskonId: number) {
    try {
      const res = await adminApi.getDiskonOne(diskonId);
      const d   = res.data;
      setForm({
        nama_diskon:       d.nama_diskon,
        kode_diskon:       d.kode_diskon,
        persentase_diskon: String(d.persentase_diskon),
        tanggal_awal:      d.tanggal_awal.split('T')[0],
        tanggal_akhir:     d.tanggal_akhir.split('T')[0],
      });
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminApi.updateDiskon(parseInt(id as string), {
        ...form,
        persentase_diskon: parseFloat(form.persentase_diskon),
      });
      setSuccess('Discount updated successfully');
    } catch (err: any) { setError(getErrorMessage(err)); }
    finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  );

  return (
    <div className="max-w-lg">
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-6">
        <Link
          href="/admin/diskon"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: '#7a6a5a' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#c9a77a')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#7a6a5a')}
        >
          <ArrowLeft size={14} /> Back to discounts
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}>Edit Discount</h1>
        <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Update discount code and validity period</p>
      </motion.div>

      {error   && <div className="mb-5"><Alert type="error"   message={error}   onClose={() => setError('')}   /></div>}
      {success && <div className="mb-5"><Alert type="success" message={success} onClose={() => setSuccess('')} /></div>}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className="label" htmlFor="de-name">Discount Name</label>
            <input
              id="de-name"
              className="input"
              value={form.nama_diskon}
              onChange={(e) => setForm({ ...form, nama_diskon: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="de-code">Discount Code</label>
              <input
                id="de-code"
                className="input uppercase"
                value={form.kode_diskon}
                onChange={(e) => setForm({ ...form, kode_diskon: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="de-pct">Percentage (%)</label>
              <input
                id="de-pct"
                type="number"
                className="input"
                min="1"
                max="100"
                value={form.persentase_diskon}
                onChange={(e) => setForm({ ...form, persentase_diskon: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="de-start">Start Date</label>
              <input
                id="de-start"
                type="date"
                className="input"
                value={form.tanggal_awal}
                onChange={(e) => setForm({ ...form, tanggal_awal: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="de-end">End Date</label>
              <input
                id="de-end"
                type="date"
                className="input"
                value={form.tanggal_akhir}
                min={form.tanggal_awal}
                onChange={(e) => setForm({ ...form, tanggal_akhir: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Code preview */}
          {form.kode_diskon && (
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'rgba(201,167,122,0.07)', border: '1px solid rgba(201,167,122,0.18)' }}
            >
              <span className="text-xs" style={{ color: '#7a6a5a' }}>Code preview</span>
              <code className="text-sm font-bold font-mono" style={{ color: '#c9a77a' }}>
                {form.kode_diskon}
              </code>
              <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>
                {form.persentase_diskon}% off
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Link href="/admin/diskon" className="btn-secondary flex-1 justify-center">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving && <LoadingSpinner size="sm" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
