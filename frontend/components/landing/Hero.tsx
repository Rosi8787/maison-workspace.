'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BookingPanel from './BookingPanel';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero section"
    >
      {/* ── Background Image ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          // src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop&q=75"
          // src="https://i.ibb.co.com/XvK5TVh/Background-workspace.jpg"
          src="/uploads/Background-workspace.jpeg"
          alt="Workspace image"
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.65) saturate(0.85)' }}
        />

        {/* Warm color grade overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(20,14,12,0.10) 0%, rgba(20,14,12,0.25) 35%, rgba(20,14,12,0.60) 65%, rgba(18,13,11,0.92) 85%, #120d0b 100%)',
          }}
        />

        {/* Subtle warm tint */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(80,40,10,0.12)', mixBlendMode: 'multiply' }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* Spacer for navbar */}
        <div className="h-32 sm:h-36" />

        {/* Main headline */}
        <div className="flex-1 flex flex-col justify-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-6 px-3 py-1.5 rounded-full glass-sm"
              style={{ color: '#c9a77a' }}
            >
              Premium Coworking Space
            </span> */}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="font-semibold leading-[1.06] tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2.6rem, 7vw, 4.5rem)',
              color: '#f4eee7',
            }}
          >
            Find Your <br className="hidden sm:block" />
            <span
              style={{
                background: 'linear-gradient(135deg, #f4eee7 0%, #c9a77a 55%, #a07a4a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Perfect Space
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
            style={{ color: '#b8a898' }}
          >
            Discover a workspace designed for focus,<br className="hidden sm:block" />
            creativity and growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href="#spaces"
              className="btn-primary group text-sm"
            >
              Explore Workspace
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <Link
              href="/register"
              className="btn-glass text-sm"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>

        {/* Booking panel pinned above the fold */}
        <div className="pb-10 sm:pb-14">
          <BookingPanel />
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #120d0b)' }}
      />
    </section>
  );
}
