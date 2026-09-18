'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { setAuth, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      const res = await authApi.login({ username, password });
      setAuth(res.data);
      const role = res.data.user.role;
      router.push(role === 'ADMIN' ? '/admin/dashboard' : '/spaces');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#120d0b' }}
    >
      {/* ── Left panel — decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(0.8)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(18,13,11,0.6) 0%, rgba(18,13,11,0.2) 100%)',
          }}
        />
        {/* Brand overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="text-2xl font-semibold tracking-tight" style={{ color: '#f4eee7' }}>
            workspace<span style={{ color: '#c9a77a' }}>.</span>
          </Link>
          <div>
            <blockquote
              className="text-2xl font-light leading-snug mb-4"
              style={{ color: '#f4eee7', letterSpacing: '-0.01em' }}
            >
              "A space designed<br />for the way you work."
            </blockquote>
            <p className="text-sm" style={{ color: '#b8a898' }}>
              Premium coworking — Jakarta, Indonesia
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="text-2xl font-semibold" style={{ color: '#f4eee7' }}>
              workspace<span style={{ color: '#c9a77a' }}>.</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1
              className="text-3xl font-semibold mb-2 tracking-tight"
              style={{ color: '#f4eee7', letterSpacing: '-0.02em' }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: '#7a6a5a' }}>
              Sign in to your workspace account
            </p>
          </div>

          {error && (
            <div className="mb-5">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                className="input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div>
              <label className="label" htmlFor="login-password">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input pr-11"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#7a6a5a' }}
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full group mt-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: '#7a6a5a' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium transition-colors" style={{ color: '#c9a77a' }}>
              Create one
            </Link>
          </div>

          {/* Demo hint */}
          <div
            className="mt-8 p-4 rounded-xl text-xs space-y-1"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#7a6a5a',
            }}
          >
            <p className="font-medium mb-2" style={{ color: '#b8a898' }}>Demo credentials</p>
            <p>Admin: <span style={{ color: '#b8a898' }}>admin / admin123</span></p>
            <p>Member: <span style={{ color: '#b8a898' }}>member1 / member123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
