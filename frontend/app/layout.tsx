import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'workspace. — Find Your Perfect Space',
  description: 'Premium coworking spaces designed for focus, creativity and growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen antialiased" style={{ backgroundColor: '#120d0b', color: '#f4eee7' }}>
        {children}
      </body>
    </html>
  );
}
