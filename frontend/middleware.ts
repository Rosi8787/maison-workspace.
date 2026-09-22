import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — Edge runtime.
 *
 * Membaca 2 cookie:
 * - auth_token: JWT token (string)
 * - auth_role: 'MEMBER' | 'ADMIN'
 *
 * Kedua cookie di-set oleh setAuth() di lib/auth.ts saat login,
 * dan di-clear oleh logout().
 *
 * Logika:
 * - Route member + tidak ada token → /login
 * - Route admin + tidak ada token → /login
 * - Route admin + token ada tapi role bukan ADMIN → /spaces
 * - Route login/register + sudah ada token → dashboard sesuai role
 */

const MEMBER_ROUTES = ['/spaces', '/reservation', '/history', '/profile'];
const ADMIN_ROUTES  = ['/admin'];
const AUTH_ROUTES   = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const role  = request.cookies.get('auth_role')?.value;

  // Token dianggap valid jika ada dan tidak kosong
  const hasToken = !!token && token.length > 10;

  // ── 1. Member routes ──────────────────────────────────────────────────
  const isMemberRoute = MEMBER_ROUTES.some((p) => pathname.startsWith(p));
  if (isMemberRoute && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // ── 2. Admin routes ───────────────────────────────────────────────────
  const isAdminRoute = ADMIN_ROUTES.some((p) => pathname.startsWith(p));
  if (isAdminRoute && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  if (isAdminRoute && hasToken && role !== 'ADMIN') {
    const url = request.nextUrl.clone();
    url.pathname = '/spaces';
    return NextResponse.redirect(url);
  }

  // ── 3. Login / Register — jika sudah punya token, ke dashboard ───────
  const isAuthPage = AUTH_ROUTES.some((p) => pathname === p);
  if (isAuthPage && hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = role === 'ADMIN' ? '/admin/dashboard' : '/spaces';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher eksplisit per route — lebih aman dari regex
  // Tidak ada risiko skip route karena path mengandung titik
  matcher: [
    '/spaces',
    '/spaces/:path*',
    '/reservation',
    '/reservation/:path*',
    '/history',
    '/history/:path*',
    '/profile',
    '/profile/:path*',
    '/admin',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
