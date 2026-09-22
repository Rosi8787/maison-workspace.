'use client';
/**
 * CancelButton — Client Component
 *
 * Hanya komponen ini yang perlu 'use client' di halaman reservation detail,
 * karena butuh: useState (modal open/close), useRouter (refresh setelah cancel).
 *
 * Parent ReservationDetailPage tetap Server Component dan tidak terpengaruh.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { reservasiApi } from '@/lib/api';
import { getErrorMessage } from '@/lib/auth';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Props {
  reservasiId: number;
  kode: string;
}

export default function CancelButton({ reservasiId, kode }: Props) {
  const router       = useRouter();
  const [open, setOpen]           = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError]         = useState('');

  async function handleCancel() {
    setCancelling(true);
    try {
      await reservasiApi.cancel(reservasiId);
      setOpen(false);
      // Refresh Server Component — re-fetch data dari server
      router.refresh();
    } catch (err: any) {
      setError(getErrorMessage(err));
      setOpen(false);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-danger flex items-center gap-2 touch-manipulation"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <X size={14} /> Cancel
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Cancel Reservation"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">
              Keep It
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="btn-danger flex-1 flex items-center justify-center gap-2"
            >
              {cancelling && <LoadingSpinner size="sm" />}
              Yes, Cancel
            </button>
          </div>
        }
      >
        <p className="text-sm" style={{ color: '#b8a898' }}>
          Cancel reservation{' '}
          <span className="font-mono font-semibold" style={{ color: '#f4eee7' }}>{kode}</span>?
          {' '}This cannot be undone.
        </p>
        {error && (
          <p className="text-sm mt-3" style={{ color: '#f87171' }}>{error}</p>
        )}
      </Modal>
    </>
  );
}
