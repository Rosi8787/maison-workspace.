'use client';
/**
 * SpaceDetailClient — thin wrapper animasi untuk SpaceDetailPage
 *
 * Karena framer-motion membutuhkan browser APIs, komponen ini harus 'use client'.
 * Tapi parent (SpaceDetailPage) tetap Server Component — hanya shell animasi
 * yang ada di sini, semua data sudah di-render oleh server.
 */
import { motion } from 'framer-motion';

export default function SpaceDetailClient({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
