'use client';

import { motion } from 'framer-motion';
import { FILTER_OPTIONS } from '@/lib/mock-data';

interface WorkspaceFilterProps {
  active: string;
  onChange: (value: string) => void;
}

export default function WorkspaceFilter({ active, onChange }: WorkspaceFilterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex justify-center"
      role="group"
      aria-label="Filter workspace type"
    >
      <div
        className="glass rounded-2xl px-2 py-2 flex items-center gap-1 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {FILTER_OPTIONS.map((opt) => {
          const isActive = active === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="relative px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                color: isActive ? '#1a1008' : '#b8a898',
                background: isActive ? '#c9a77a' : 'transparent',
                boxShadow: isActive ? '0 2px 12px rgba(201,167,122,0.3)' : 'none',
              }}
              aria-pressed={isActive}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
