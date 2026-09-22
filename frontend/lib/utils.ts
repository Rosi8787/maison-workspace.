/**
 * lib/utils.ts — Pure utility functions
 *
 * TIDAK ada 'use client' — file ini bisa diimport dari:
 * - Server Components (SSR pages)
 * - Client Components
 * - Middleware
 *
 * Alasan dipisah dari lib/auth.ts:
 * auth.ts punya 'use client' karena akses sessionStorage & document.cookie.
 * Fungsi-fungsi format/helper ini murni JavaScript, tidak butuh browser API,
 * sehingga server bisa menjalankannya langsung.
 */

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
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    const [h, m] = timeStr.split(':');
    return `${h.padStart(2, '0')}:${m}`;
  }
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

/**
 * Resolve URL gambar — bekerja di server dan client.
 * - URL Supabase (https://...) → langsung return
 * - Path lokal (/uploads/...) → prefix dengan API_URL
 */
export function getImageUrl(foto?: string | null): string | null {
  if (!foto) return null;
  if (foto.startsWith('http://') || foto.startsWith('https://')) return foto;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${base}${foto}`;
}
