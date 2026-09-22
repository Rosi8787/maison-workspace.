/**
 * server-fetch.ts — Helper fetch untuk Server Components
 *
 * Kenapa file ini diperlukan:
 * - axios & sessionStorage tidak bisa dipakai di Server Component (browser-only)
 * - Server Components menggunakan native `fetch` dengan cookie dari `next/headers`
 * - File ini membaca token dari cookie (yang disimpan saat login) dan
 *   melampirkannya ke header Authorization untuk fetch ke NestJS backend
 */

import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Fetch ke backend dengan Authorization header dari cookie.
 * Hanya bisa dipanggil dari Server Components / Route Handlers.
 */
export async function serverFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers,
    // cache: 'no-store' — data selalu fresh (tidak di-cache), cocok untuk data reservasi & user
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `HTTP ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Fetch publik tanpa auth — untuk data spaces, diskon, dll.
 */
export async function publicFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}
