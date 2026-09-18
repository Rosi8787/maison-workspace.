'use client';

import { motion } from 'framer-motion';
import { getUser } from '@/lib/auth';
import type { Member } from '@/types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

interface DashboardHeaderProps {
  subtitle?: string;
}

export default function DashboardHeader({
  subtitle = 'Ready to find your perfect workspace?',
}: DashboardHeaderProps) {
  const user   = getUser();
  const member = user?.profile as Member | undefined;
  const name   = member?.nama_member?.split(' ')[0] || user?.username || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="mb-8"
    >
      <h1
        className="font-semibold mb-1 tracking-tight"
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          color: '#f4eee7',
          letterSpacing: '-0.02em',
        }}
      >
        {getGreeting()},{' '}
        <span style={{ color: '#c9a77a' }}>{name}</span>
      </h1>
      <p className="text-sm" style={{ color: '#7a6a5a' }}>{subtitle}</p>
    </motion.div>
  );
}
