'use client';
/**
 * PrintButton — Client Component
 *
 * window.print() adalah browser API, tidak bisa dipanggil di Server Component.
 * Ini satu-satunya alasan file ini 'use client'.
 * Seluruh halaman eticket tetap di-render oleh server.
 */
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary text-sm touch-manipulation"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Printer size={14} /> Print / Save PDF
    </button>
  );
}
