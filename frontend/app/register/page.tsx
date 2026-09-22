'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, ArrowRight, Upload, CheckCircle } from 'lucide-react';
import { authApi, uploadApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Tab = 'member' | 'admin';

export default function RegisterPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fotoPath, setFotoPath]         = useState('');        // foto member
  const [adminFotoPath, setAdminFotoPath] = useState('');      // foto admin (opsional)
  const [fotoUploading, setFotoUploading] = useState(false);
  const [adminFotoUploading, setAdminFotoUploading] = useState(false);

  const [member, setMember] = useState({
    nama_member: '', instansi: '', alamat: '', telp: '', username: '', password: '',
  });

  const [admin, setAdmin] = useState({
    nama_coworking: '', nama_pemilik: '', telp: '', alamat: '',
    deskripsi: '', username: '', password: '',
  });

  const handleFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoUploading(true);
    try {
      const res = await uploadApi.uploadMember(file);
      setFotoPath(res.data.url || res.data.path);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setFotoUploading(false);
    }
  };

  const handleAdminFotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAdminFotoUploading(true);
    try {
      const res = await uploadApi.uploadGeneral(file);
      setAdminFotoPath(res.data.url || res.data.path);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setAdminFotoUploading(false);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.registerMember({ ...member, foto: fotoPath || undefined });
      setSuccess('Registration successful! Redirecting to login…');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.registerAdmin({
        ...admin,
        foto: adminFotoPath || undefined,
      });
      setSuccess('Admin registered! Redirecting to login…');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4" style={{ background: '#120d0b' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold" style={{ color: '#f4eee7' }}>
            workspace<span style={{ color: '#c9a77a' }}>.</span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: '#7a6a5a' }}>
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: '#1c1410',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Tab bar */}
          <div
            className="flex"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            {([
              { key: 'member', label: 'Member', Icon: User },
              { key: 'admin', label: 'Space Owner', Icon: Building2 },
            ] as { key: Tab; label: string; Icon: React.ElementType }[]).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); setSuccess(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all duration-200"
                style={{
                  color: tab === key ? '#c9a77a' : '#7a6a5a',
                  borderBottom: tab === key ? '2px solid #c9a77a' : '2px solid transparent',
                  background: tab === key ? 'rgba(201,167,122,0.05)' : 'transparent',
                }}
                aria-selected={tab === key}
                role="tab"
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="p-7">
            <h1
              className="text-xl font-semibold mb-6 tracking-tight"
              style={{ color: '#f4eee7', letterSpacing: '-0.015em' }}
            >
              {tab === 'member' ? 'Create Member Account' : 'Register as Space Owner'}
            </h1>

            {error && <div className="mb-5"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
            {success && <div className="mb-5"><Alert type="success" message={success} /></div>}

            <AnimatePresence mode="wait">
              {/* ─── Member Form ─── */}
              {tab === 'member' && (
                <motion.form
                  key="member"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleMemberSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="m-name">Full Name *</label>
                      <input id="m-name" className="input" placeholder="Your full name"
                        value={member.nama_member}
                        onChange={(e) => setMember({ ...member, nama_member: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label" htmlFor="m-inst">Institution *</label>
                      <input id="m-inst" className="input" placeholder="Company / institution"
                        value={member.instansi}
                        onChange={(e) => setMember({ ...member, instansi: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="m-addr">Address *</label>
                    <textarea id="m-addr" className="input resize-none" rows={2} placeholder="Full address"
                      value={member.alamat}
                      onChange={(e) => setMember({ ...member, alamat: e.target.value })} required />
                  </div>

                  <div>
                    <label className="label" htmlFor="m-telp">Phone Number *</label>
                    <input id="m-telp" className="input" type="tel" placeholder="08xxxxxxxxxx"
                      value={member.telp}
                      onChange={(e) => setMember({ ...member, telp: e.target.value })} required />
                  </div>

                  {/* Photo upload */}
                  <div>
                    <label className="label">Profile Photo</label>
                    <label
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px dashed rgba(255,255,255,0.15)',
                      }}
                      htmlFor="m-foto"
                    >
                      {fotoUploading ? (
                        <LoadingSpinner size="sm" />
                      ) : fotoPath ? (
                        <CheckCircle size={16} style={{ color: '#4ade80' }} />
                      ) : (
                        <Upload size={16} style={{ color: '#7a6a5a' }} />
                      )}
                      <span className="text-sm" style={{ color: fotoPath ? '#4ade80' : '#7a6a5a' }}>
                        {fotoPath ? 'Photo uploaded' : 'Upload profile photo (optional)'}
                      </span>
                      <input id="m-foto" type="file" accept="image/*" className="sr-only"
                        onChange={handleFotoUpload} />
                    </label>
                  </div>

                  <div
                    className="h-px"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="m-user">Username *</label>
                      <input id="m-user" className="input" placeholder="Choose username"
                        value={member.username}
                        onChange={(e) => setMember({ ...member, username: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label" htmlFor="m-pass">Password *</label>
                      <input id="m-pass" type="password" className="input" placeholder="Min. 6 chars"
                        value={member.password}
                        onChange={(e) => setMember({ ...member, password: e.target.value })}
                        required minLength={6} />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full group mt-2">
                    {loading ? <><LoadingSpinner size="sm" />Processing…</> : (
                      <>Create Account <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>
                    )}
                  </button>
                </motion.form>
              )}

              {/* ─── Admin Form ─── */}
              {tab === 'admin' && (
                <motion.form
                  key="admin"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleAdminSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="a-ws">Coworking Name *</label>
                      <input id="a-ws" className="input" placeholder="Your space name"
                        value={admin.nama_coworking}
                        onChange={(e) => setAdmin({ ...admin, nama_coworking: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label" htmlFor="a-own">Owner Name *</label>
                      <input id="a-own" className="input" placeholder="Your name"
                        value={admin.nama_pemilik}
                        onChange={(e) => setAdmin({ ...admin, nama_pemilik: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="a-telp">Phone *</label>
                      <input id="a-telp" className="input" type="tel" placeholder="08xxxxxxxxxx"
                        value={admin.telp}
                        onChange={(e) => setAdmin({ ...admin, telp: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label" htmlFor="a-addr">Address *</label>
                      <input id="a-addr" className="input" placeholder="Location"
                        value={admin.alamat}
                        onChange={(e) => setAdmin({ ...admin, alamat: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="a-desc">Description</label>
                    <textarea id="a-desc" className="input resize-none" rows={2}
                      placeholder="Brief description of your coworking space"
                      value={admin.deskripsi}
                      onChange={(e) => setAdmin({ ...admin, deskripsi: e.target.value })} />
                  </div>

                  {/* Foto admin — opsional, bisa diubah nanti di halaman profile */}
                  <div>
                    <label className="label">Space / Profile Photo (optional)</label>
                    <label
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px dashed rgba(255,255,255,0.15)',
                      }}
                      htmlFor="a-foto"
                    >
                      {adminFotoUploading ? (
                        <LoadingSpinner size="sm" />
                      ) : adminFotoPath ? (
                        <CheckCircle size={16} style={{ color: '#4ade80' }} />
                      ) : (
                        <Upload size={16} style={{ color: '#7a6a5a' }} />
                      )}
                      <span className="text-sm" style={{ color: adminFotoPath ? '#4ade80' : '#7a6a5a' }}>
                        {adminFotoPath ? 'Photo uploaded' : 'Upload space photo (optional)'}
                      </span>
                      <input id="a-foto" type="file" accept="image/*" className="sr-only"
                        onChange={handleAdminFotoUpload} />
                    </label>
                  </div>

                  <div
                    className="h-px"
                    style={{ background: 'rgba(255,255,255,0.07)' }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="a-user">Username *</label>
                      <input id="a-user" className="input" placeholder="Choose username"
                        value={admin.username}
                        onChange={(e) => setAdmin({ ...admin, username: e.target.value })} required />
                    </div>
                    <div>
                      <label className="label" htmlFor="a-pass">Password *</label>
                      <input id="a-pass" type="password" className="input" placeholder="Min. 6 chars"
                        value={admin.password}
                        onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                        required minLength={6} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full group mt-2">
                    {loading ? <><LoadingSpinner size="sm" />Processing…</> : (
                      <>Register Space <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-sm" style={{ color: '#7a6a5a' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium transition-colors" style={{ color: '#c9a77a' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
