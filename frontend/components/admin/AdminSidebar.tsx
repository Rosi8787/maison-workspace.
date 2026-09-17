'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { SpaceOwner } from '@/types';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/profile', label: 'Profil Admin', icon: '👤' },
  { href: '/admin/members', label: 'Kelola Member', icon: '👥' },
  { href: '/admin/spaces', label: 'Kelola Space', icon: '🏢' },
  { href: '/admin/diskon', label: 'Kelola Diskon', icon: '🏷️' },
  { href: '/admin/reservasi', label: 'Reservasi', icon: '📅' },
  { href: '/admin/reports', label: 'Laporan', icon: '📈' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const user = getUser();
  const owner = user?.profile as SpaceOwner | undefined;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">🏢 Admin Panel</h2>
        <p className="text-xs text-gray-400 mt-1 truncate">
          {owner?.nama_coworking || 'Coworking Space'}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2 truncate">{user?.username}</p>
        <button
          onClick={() => logout()}
          className="w-full text-left text-sm text-red-400 hover:text-red-300 font-medium py-1"
        >
          🚪 Keluar
        </button>
      </div>
    </aside>
  );
}
