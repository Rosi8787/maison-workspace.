'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Building2, Phone, MapPin } from 'lucide-react';
import { authApi } from '@/lib/api';
import { getUser, getErrorMessage } from '@/lib/auth';
import type { Member } from '@/types';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const CARD   = 'rgba(34,26,20,0.80)';
const BORDER = 'rgba(255,255,255,0.08)';

/** Resolve foto path ke full URL — handles Supabase https URLs + legacy /uploads/ paths */
function resolveUrl(path: string | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;            // Supabase public URL
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${path}`; // legacy local
}

export default function ProfilePage() {
  const [member, setMember]   = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const user = getUser();

  useEffect(() => {
    async function load() {
      try {
        const res = await authApi.getProfile();
        setMember(res.data.member as Member);
      } catch (err: any) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
  );

  const avatarUrl = resolveUrl(member?.foto);
  const initials  = (member?.nama_member || user?.username || 'U')
    .split(' ').slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');

  return (
    <div className="max-w-2xl">
      <DashboardHeader subtitle="Your account information." />

      {error && (
        <div className="mb-5">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
      >
        {/* ── Avatar ── */}
        <div className="px-6 py-6 flex items-center gap-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={member?.nama_member ?? 'Profile photo'}
                className="w-20 h-20 rounded-2xl object-cover"
                style={{ border: '2px solid rgba(201,167,122,0.30)' }}
                onError={(e) => {
                  // Fallback jika URL gambar broken
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold"
                style={{
                  background: 'rgba(201,167,122,0.12)',
                  border: '2px solid rgba(201,167,122,0.25)',
                  color: '#c9a77a',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2
              className="text-lg font-semibold tracking-tight"
              style={{ color: '#f4eee7', letterSpacing: '-0.015em' }}
            >
              {member?.nama_member}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: '#7a6a5a' }}>
              @{user?.username}
            </p>
            <span
              className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(96,165,250,0.10)',
                border: '1px solid rgba(96,165,250,0.25)',
                color: '#60a5fa',
              }}
            >
              Member
            </span>
          </div>
        </div>

        {/* ── Info fields ── */}
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { Icon: UserCircle, label: 'Full Name',   value: member?.nama_member },
            { Icon: Building2,  label: 'Institution', value: member?.instansi },
            { Icon: Phone,      label: 'Phone',       value: member?.telp },
            { Icon: MapPin,     label: 'Address',     value: member?.alamat, full: true },
          ].map(({ Icon, label, value, full }) => (
            <div key={label} className={full ? 'sm:col-span-2' : ''}>
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={13} style={{ color: '#c9a77a' }} />
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#7a6a5a' }}>
                  {label}
                </p>
              </div>
              <p className="text-sm font-medium pl-5" style={{ color: '#f4eee7' }}>
                {value || '—'}
              </p>
            </div>
          ))}
        </div>

        {/* ── Note ── */}
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="text-xs" style={{ color: '#7a6a5a' }}>
            To update your profile information, please contact your coworking space administrator.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
