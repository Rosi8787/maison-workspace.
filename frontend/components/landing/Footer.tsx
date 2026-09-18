'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Mail, ExternalLink } from 'lucide-react';

const FOOTER_NAV = [
  { label: 'Spaces', href: '#spaces' },
  { label: 'About', href: '#about' },
  { label: 'Facilities', href: '#facilities' },
  { label: 'Contact', href: '#contact' },
];

const FOOTER_ACCOUNT = [
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' },
  { label: 'My Booking', href: '/reservation' },
];

const SOCIAL = [
  { label: 'Website', href: '#', Icon: Globe },
  { label: 'Portfolio', href: '#', Icon: ExternalLink },
  { label: 'Email', href: 'mailto:hello@workspace.id', Icon: Mail },
];

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      style={{
        background:
          'linear-gradient(180deg, #120d0b 0%, #1a1008 40%, #0e0a07 100%)',
      }}
    >
      {/* Top gradient fade from content */}
      <div
        className="h-px"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14"
        >
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight mb-4 inline-block"
              style={{ color: '#f4eee7' }}
            >
              workspace<span style={{ color: '#c9a77a' }}>.</span>
            </Link>
            <p
              className="text-sm leading-relaxed mt-3"
              style={{ color: '#7a6a5a' }}
            >
              Find a place where ideas can grow.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: '#7a6a5a',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = '#c9a77a')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = '#7a6a5a')
                  }
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-5"
              style={{ color: '#7a6a5a' }}
            >
              Navigation
            </h3>
            <ul className="space-y-3" role="list">
              {FOOTER_NAV.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#b8a898' }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = '#f4eee7')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = '#b8a898')
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-5"
              style={{ color: '#7a6a5a' }}
            >
              Account
            </h3>
            <ul className="space-y-3" role="list">
              {FOOTER_ACCOUNT.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: '#b8a898' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-[0.18em] mb-5"
              style={{ color: '#7a6a5a' }}
            >
              Contact
            </h3>
            <div className="space-y-2 text-sm" style={{ color: '#7a6a5a' }}>
              <p>hello@workspace.id</p>
              <p>+62 821 0000 0000</p>
              <p className="leading-relaxed">
                Jl. Sudirman No. 1<br />Jakarta, Indonesia
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div
          className="h-px mb-8"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#7a6a5a' }}>
          <p>© 2026 workspace. All rights reserved.</p>
          <p>Designed with care for focused work.</p>
        </div>
      </div>
    </footer>
  );
}
