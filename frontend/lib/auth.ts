'use client';

import { User, AuthUser } from '@/types';

// ─── Cookie helpers ───────────────────────────────────────────────────────────

/** Baca satu cookie by exact name. Return null kalau tidak ada. */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  // Escape nama cookie untuk dipakai di regex
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + escapedName + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** Set cookie dengan nilai yang di-encode. */
function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Hapus cookie. */
function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

// ─── Auth storage ─────────────────────────────────────────────────────────────

const SS_TOKEN = 'access_token';
const SS_USER  = 'user';
const CK_TOKEN = 'auth_token';
const CK_ROLE  = 'auth_role';
// auth_user TIDAK disimpan ke cookie — user object bisa > 4KB dan melebihi limit cookie.
// Hanya token + role yang ke cookie (keduanya kecil).

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 hari

export function setAuth(data: AuthUser) {
  if (typeof window === 'undefined') return;

  // sessionStorage — per-tab, hilang saat tab ditutup (intentional untuk keamanan)
  sessionStorage.setItem(SS_TOKEN, data.access_token);
  sessionStorage.setItem(SS_USER,  JSON.stringify(data.user));

  // Cookie — persist antar tab & restart browser, hanya data kecil
  setCookie(CK_TOKEN, data.access_token, COOKIE_MAX_AGE);
  setCookie(CK_ROLE,  data.user.role,    COOKIE_MAX_AGE);
}

/**
 * Ambil token JWT.
 * Priority: sessionStorage → cookie (fallback untuk tab baru)
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const ss = sessionStorage.getItem(SS_TOKEN);
  if (ss) return ss;
  // Tab baru: sessionStorage kosong tapi cookie ada
  const ck = getCookie(CK_TOKEN);
  if (ck) {
    // Sinkronkan ke sessionStorage — hanya token, user diambil terpisah via getUser()
    sessionStorage.setItem(SS_TOKEN, ck);
    return ck;
  }
  return null;
}

/**
 * Ambil data user.
 * Priority: sessionStorage → null (user object tidak disimpan ke cookie)
 *
 * Jika sessionStorage kosong (tab baru), getUser() return null tapi
 * isLoggedIn() tetap true karena token ada di cookie.
 * getUser() akan terisi setelah API call pertama yang mengembalikan data user.
 *
 * Untuk keperluan role check, gunakan getRoleFromCookie() sebagai fallback.
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const ss = sessionStorage.getItem(SS_USER);
  if (!ss) return null;
  try { return JSON.parse(ss) as User; } catch { return null; }
}

/** Simpan user ke sessionStorage (dipanggil setelah API getProfile berhasil). */
export function setUser(user: User) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SS_USER, JSON.stringify(user));
}

/** Baca role langsung dari cookie — lebih cepat dan tidak butuh parse JSON. */
export function getRoleFromCookie(): string | null {
  return getCookie(CK_ROLE);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  // Coba dari sessionStorage user object
  const user = getUser();
  if (user) return user.role === 'ADMIN';
  // Fallback: baca role cookie langsung (untuk tab baru)
  return getRoleFromCookie() === 'ADMIN';
}

export function isMember(): boolean {
  const user = getUser();
  if (user) return user.role === 'MEMBER';
  return getRoleFromCookie() === 'MEMBER';
}

export function logout() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SS_TOKEN);
  sessionStorage.removeItem(SS_USER);
  deleteCookie(CK_TOKEN);
  deleteCookie(CK_ROLE);
  window.location.href = '/login';
}

// ─── Re-export pure utils ─────────────────────────────────────────────────────
// Server Components import langsung dari '@/lib/utils'.
// Client Components boleh import dari sini untuk backward compat.
export {
  formatCurrency,
  formatDate,
  formatTime,
  getStatusLabel,
  getStatusColor,
  getTipeSpaceLabel,
  getErrorMessage,
  getImageUrl,
} from './utils';
