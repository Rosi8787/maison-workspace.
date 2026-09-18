// ─── Mock Workspace Data ────────────────────────────────────────────────────
// Used on the public landing page before API data is available.

export interface MockSpace {
  id: number;
  name: string;
  type: 'personal' | 'private' | 'meeting' | 'creative';
  typeLabel: string;
  description: string;
  price: number;
  priceLabel: string;
  capacity: number;
  image: string;
  tags: string[];
}

export const mockSpaces: MockSpace[] = [
  {
    id: 1,
    name: 'Personal Desk',
    type: 'personal',
    typeLabel: 'Personal Desk',
    description:
      'A comfortable dedicated desk in a calm, focused environment — ideal for deep work and solo productivity.',
    price: 75000,
    priceLabel: 'Rp 75.000 / hour',
    capacity: 1,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    tags: ['Quiet', 'Focused', 'Solo'],
  },
  {
    id: 2,
    name: 'Private Office',
    type: 'private',
    typeLabel: 'Private Office',
    description:
      'A quiet, enclosed private room for confidential meetings, calls, and focused professional work.',
    price: 150000,
    priceLabel: 'Rp 150.000 / hour',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    tags: ['Private', 'Enclosed', 'Professional'],
  },
  {
    id: 3,
    name: 'Meeting Room',
    type: 'meeting',
    typeLabel: 'Meeting Room',
    description:
      'A fully equipped professional space for team meetings, client presentations, and collaborative sessions.',
    price: 120000,
    priceLabel: 'Rp 120.000 / hour',
    capacity: 8,
    image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&auto=format&fit=crop&q=80',
    tags: ['Team', 'AV Equipped', 'Collaborative'],
  },
  {
    id: 4,
    name: 'Creative Space',
    type: 'creative',
    typeLabel: 'Creative Space',
    description:
      'An open, light-filled workspace designed for creative work, brainstorming, and inspired collaboration.',
    price: 100000,
    priceLabel: 'Rp 100.000 / hour',
    capacity: 12,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    tags: ['Open', 'Creative', 'Inspiring'],
  },
];

export const FILTER_OPTIONS = [
  { label: 'Every type', value: '' },
  { label: 'Personal Desk', value: 'personal' },
  { label: 'Private Office', value: 'private' },
  { label: 'Meeting Room', value: 'meeting' },
  { label: 'Creative Space', value: 'creative' },
] as const;

export const DURATION_OPTIONS = [
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
  { label: '3 Hours', value: 3 },
  { label: '4 Hours', value: 4 },
  { label: '6 Hours', value: 6 },
  { label: '8 Hours', value: 8 },
];

export const TIME_OPTIONS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
];

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
