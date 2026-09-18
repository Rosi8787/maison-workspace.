'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import type { MockSpace } from '@/lib/mock-data';

interface WorkspaceCardProps {
  space: MockSpace;
  index?: number;
}

export default function WorkspaceCard({ space, index = 0 }: WorkspaceCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        y: -8,
        rotate: -0.6,
        transition: { duration: 0.25, ease: [0.34, 1.3, 0.64, 1] },
      }}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(34,26,20,0.70)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={space.image}
          alt={space.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />

        {/* Gradient overlay on image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(18,13,11,0.55) 100%)',
          }}
        />

        {/* Type badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(18,13,11,0.70)',
            border: '1px solid rgba(255,255,255,0.14)',
            backdropFilter: 'blur(10px)',
            color: '#c9a77a',
          }}
        >
          {space.typeLabel}
        </div>

        {/* Capacity badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
          style={{
            background: 'rgba(18,13,11,0.70)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(10px)',
            color: '#b8a898',
          }}
        >
          <Users size={11} />
          {space.capacity}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        <h3
          className="font-semibold text-base mb-1.5 leading-snug"
          style={{ color: '#f4eee7' }}
        >
          {space.name}
        </h3>

        <p
          className="text-sm mb-4 line-clamp-2 leading-relaxed"
          style={{ color: '#7a6a5a' }}
        >
          {space.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {space.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#7a6a5a',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-xs block mb-0.5"
              style={{ color: '#7a6a5a' }}
            >
              Starting from
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: '#c9a77a' }}
            >
              {space.priceLabel}
            </span>
          </div>

          <Link
            href="/login"
            className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: 'rgba(201,167,122,0.12)',
              border: '1px solid rgba(201,167,122,0.25)',
              color: '#c9a77a',
            }}
            aria-label={`Book ${space.name}`}
          >
            Book Now
            <ArrowRight
              size={12}
              className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: '0 0 0 1px rgba(201,167,122,0.25), 0 16px 48px rgba(0,0,0,0.55)',
        }}
      />
    </motion.article>
  );
}
