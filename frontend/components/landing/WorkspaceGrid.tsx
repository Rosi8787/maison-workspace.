'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockSpaces } from '@/lib/mock-data';
import WorkspaceFilter from './WorkspaceFilter';
import WorkspaceCard from './WorkspaceCard';

export default function WorkspaceGrid() {
  const [activeFilter, setActiveFilter] = useState('');

  const filtered =
    activeFilter === ''
      ? mockSpaces
      : mockSpaces.filter((s) => s.type === activeFilter);

  return (
    <section
      id="spaces"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      style={{ background: '#120d0b' }}
      aria-labelledby="spaces-heading"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-block text-xs font-semibold tracking-[0.22em] uppercase mb-4"
            style={{ color: '#c9a77a' }}
          >
            Our Spaces
          </span>
          <h2
            id="spaces-heading"
            className="font-semibold mb-4 leading-tight"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              color: '#f4eee7',
              letterSpacing: '-0.02em',
            }}
          >
            Find a space that fits you
          </h2>
          <p
            className="text-base max-w-md mx-auto leading-relaxed"
            style={{ color: '#7a6a5a' }}
          >
            Choose a workspace designed around the way you work.
          </p>
        </motion.div>

        {/* ── Filter ── */}
        <div className="mb-10">
          <WorkspaceFilter active={activeFilter} onChange={setActiveFilter} />
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: '#7a6a5a' }}>
            <p className="text-lg font-medium mb-2">No spaces found</p>
            <p className="text-sm">Try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((space, i) => (
              <WorkspaceCard key={space.id} space={space} index={i} />
            ))}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-14"
        >
          <a
            href="/register"
            className="btn-glass inline-flex"
          >
            View All Spaces
          </a>
        </motion.div>
      </div>
    </section>
  );
}
