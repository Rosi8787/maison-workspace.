'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { Member } from '@/types';

const navLinks = [
  { href: '/spaces', label: 'Ruang' },
  { href: '/reservation', label: 'Reservasi' },
  { href: '/history', label: 'Histori' },
  { href: '/profile', label: 'Profil' },
];

export default function MemberNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();
  const member = user?.profile as Member | undefined;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/spaces" className="text-xl font-bold text-primary-600">
              🏢 CoworkSpace
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden md:block">
              {member?.nama_member || user?.username}
            </span>
            <button
              onClick={() => logout()}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                pathname.startsWith(link.href)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
