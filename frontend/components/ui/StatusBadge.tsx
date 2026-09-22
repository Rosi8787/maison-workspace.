import { getStatusLabel } from '@/lib/utils';

const STATUS_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  belum_dikonfirm: {
    bg:     'rgba(251,191,36,0.10)',
    border: 'rgba(251,191,36,0.25)',
    color:  '#fbbf24',
  },
  disetujui: {
    bg:     'rgba(96,165,250,0.10)',
    border: 'rgba(96,165,250,0.25)',
    color:  '#60a5fa',
  },
  aktif: {
    bg:     'rgba(74,222,128,0.10)',
    border: 'rgba(74,222,128,0.25)',
    color:  '#4ade80',
  },
  selesai: {
    bg:     'rgba(148,163,184,0.10)',
    border: 'rgba(148,163,184,0.20)',
    color:  '#94a3b8',
  },
  dibatalkan: {
    bg:     'rgba(248,113,113,0.10)',
    border: 'rgba(248,113,113,0.25)',
    color:  '#f87171',
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES['selesai'];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      {getStatusLabel(status)}
    </span>
  );
}
