import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Coworking Space',
  description: 'Sistem Reservasi Smart Coworking Space',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
