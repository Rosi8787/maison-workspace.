'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image'

const NAV_LINKS = [
  { label: 'Spaces', href: '#spaces' },
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
      >
        <nav
          className={`w-full max-w-5xl transition-all duration-500 rounded-2xl ${scrolled
              ? 'glass shadow-glass px-5 py-3'
              : 'bg-transparent px-5 py-3'
            }`}
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
              style={{ color: '#f4eee7' }}
            >
              Maison Workspace<span style={{ color: '#c9a77a' }}>.</span>
            
            </Link>

            {/* {<Link
              href="/"
              className="relative flex items-center h-0 w-32"
              style={{ color: '#f4eee7' }}
            >
              <Image
                src="/uploads/logo1.png"
                alt="Maison Workspace Logo"
                width={300}
                height={100}
                className="absolute left-0 max-w-none h-12 w-auto object-contain"
                priority
              />
            </Link>} */}



            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10"
                    style={{ color: '#b8a898' }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#f4eee7')}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#b8a898')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/10"
                style={{ color: '#b8a898' }}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-5 py-2"
              >
                Register
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl transition-colors hover:bg-white/10"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen
                ? <X size={20} style={{ color: '#f4eee7' }} />
                : <Menu size={20} style={{ color: '#f4eee7' }} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-40 pt-20 px-4 pb-6"
            style={{ background: 'rgba(18,13,11,0.96)', backdropFilter: 'blur(20px)' }}
          >
            <div className="max-w-5xl mx-auto space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/08"
                  style={{ color: '#b8a898' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px my-3" style={{ background: 'rgba(255,255,255,0.10)' }} />
              <Link
                href="/login"
                className="block px-4 py-3 rounded-xl text-sm font-medium"
                style={{ color: '#f4eee7' }}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary w-full justify-center mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
