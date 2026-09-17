'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { setAuth, getToken, getErrorMessage } from '@/lib/auth';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ username, password });
      // Bersihkan session lama sebelum set session baru
      // Ini mencegah crash ketika ganti akun tanpa logout dulu
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setAuth(res.data);
      const role = res.data.user.role;
      if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/spaces');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🏢</div>
            <h1 className="text-2xl font-bold text-gray-900">Smart Coworking</h1>
            <p className="text-gray-500 text-sm mt-1">Masuk ke akun Anda</p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                className="input"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary-600 font-medium hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>

          {/* Demo accounts hint */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-medium mb-1">Akun demo:</p>
            <p>Admin: admin / admin123</p>
            <p>Member: member1 / member123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
