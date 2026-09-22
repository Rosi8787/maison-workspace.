/**
 * lib/cache.ts — Client-side in-memory + sessionStorage cache
 *
 * Tujuan: halaman tampil LANGSUNG dengan data yang sudah di-fetch sebelumnya,
 * sambil refresh data baru di background (stale-while-revalidate pattern).
 *
 * Tidak mengubah logika bisnis apapun — hanya lapisan caching di atas fetch yang sudah ada.
 *
 * Cara pakai:
 *   const data = await cachedFetch('spaces-all', () => spacesApi.getAll(), 60);
 *   → Jika ada cache < 60 detik → return cache LANGSUNG (tidak ada loading)
 *   → Jika cache stale / tidak ada → fetch, simpan, return
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number; // Unix ms
}

// In-memory cache — lebih cepat dari sessionStorage, tapi hilang saat refresh
const memCache = new Map<string, CacheEntry<any>>();

/**
 * Fetch dengan cache.
 * @param key       Unique cache key
 * @param fetcher   Fungsi fetch (return Promise)
 * @param ttlSec    Time-to-live dalam detik (default 30 detik)
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<{ data: T }>,
  ttlSec = 30,
): Promise<T> {
  const now = Date.now();
  const ttlMs = ttlSec * 1000;

  // 1. Cek in-memory cache dulu (paling cepat)
  const mem = memCache.get(key);
  if (mem && now - mem.timestamp < ttlMs) {
    return mem.data as T;
  }

  // 2. Cek sessionStorage (survive navigasi tapi bukan refresh)
  try {
    const stored = sessionStorage.getItem(`cache_${key}`);
    if (stored) {
      const entry: CacheEntry<T> = JSON.parse(stored);
      if (now - entry.timestamp < ttlMs) {
        // Restore ke memCache juga
        memCache.set(key, entry);
        return entry.data;
      }
    }
  } catch { /* sessionStorage tidak tersedia */ }

  // 3. Fetch baru
  const res = await fetcher();
  const entry: CacheEntry<T> = { data: res.data, timestamp: now };

  // Simpan ke memCache
  memCache.set(key, entry);

  // Simpan ke sessionStorage (async, tidak block return)
  try {
    sessionStorage.setItem(`cache_${key}`, JSON.stringify(entry));
  } catch { /* quota exceeded — skip */ }

  return res.data;
}

/** Hapus cache untuk key tertentu (misal setelah create/update/delete) */
export function invalidateCache(key: string) {
  memCache.delete(key);
  try { sessionStorage.removeItem(`cache_${key}`); } catch { /* ok */ }
}

/** Hapus semua cache */
export function clearAllCache() {
  memCache.clear();
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith('cache_'))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch { /* ok */ }
}

/**
 * Hook-style: baca cache synchronously (tidak async).
 * Dipakai untuk initialState — data langsung ada, tidak perlu loading state awal.
 */
export function getCache<T>(key: string, ttlSec = 30): T | null {
  const now = Date.now();
  const ttlMs = ttlSec * 1000;

  const mem = memCache.get(key);
  if (mem && now - mem.timestamp < ttlMs) return mem.data as T;

  try {
    const stored = sessionStorage.getItem(`cache_${key}`);
    if (stored) {
      const entry: CacheEntry<T> = JSON.parse(stored);
      if (now - entry.timestamp < ttlMs) {
        memCache.set(key, entry);
        return entry.data;
      }
    }
  } catch { /* ok */ }

  return null;
}
