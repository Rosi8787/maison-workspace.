'use client';

import { User, AuthUser } from '@/types';

export function setAuth(data: AuthUser) {
  if (typeof window === 'undefined') return;
  // sessionStorage: isolasi per-tab, admin di tab A tidak menimpa member di tab B
  sessionStorage.setItem('access_token', data.access_token);
  sessionStorage.setItem('user', JSON.stringify(data.user));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('access_token');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const u = sessionStorage.getItem('user');
  if (!u) return null;
  try {
    return JSON.parse(u) as User;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'ADMIN';
}

export function isMember(): boolean {
  const user = getUser();
  return user?.role === 'MEMBER';
}

export function logout() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('user');
  window.location.href = '/login';
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '-';
  // jam_mulai sekarang String "HH:MM" langsung dari backend
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(':');
    return `${h.padStart(2, '0')}:${m}`;
  }
  // fallback: parse sebagai DateTime
  const date = new Date(timeStr);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    belum_dikonfirm: 'Belum Dikonfirmasi',
    disetujui: 'Disetujui',
    aktif: 'Aktif / Digunakan',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    belum_dikonfirm: 'bg-yellow-100 text-yellow-800',
    disetujui: 'bg-blue-100 text-blue-800',
    aktif: 'bg-green-100 text-green-800',
    selesai: 'bg-gray-100 text-gray-800',
    dibatalkan: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getTipeSpaceLabel(tipe: string): string {
  const labels: Record<string, string> = {
    Personal_Desk: 'Personal Desk',
    Private_Office: 'Private Office',
    Meeting_Room: 'Meeting Room',
  };
  return labels[tipe] || tipe;
}

export function getErrorMessage(error: any): string {
  if (error?.response?.data?.message) {
    const msg = error.response.data.message;
    if (Array.isArray(msg)) return msg.join(', ');
    return msg;
  }
  return error?.message || 'Terjadi kesalahan';
}
