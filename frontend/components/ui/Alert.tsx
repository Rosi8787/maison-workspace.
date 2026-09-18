import { X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const STYLES: Record<AlertProps['type'], { bg: string; border: string; color: string; icon: string }> = {
  success: {
    bg:     'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.20)',
    color:  '#4ade80',
    icon:   '✓',
  },
  error: {
    bg:     'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.20)',
    color:  '#f87171',
    icon:   '✕',
  },
  warning: {
    bg:     'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.20)',
    color:  '#fbbf24',
    icon:   '⚠',
  },
  info: {
    bg:     'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.20)',
    color:  '#60a5fa',
    icon:   'ℹ',
  },
};

export default function Alert({ type, message, onClose }: AlertProps) {
  const s = STYLES[type];
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
      style={{
        background: s.bg,
        border:     `1px solid ${s.border}`,
        color:      s.color,
      }}
      role="alert"
    >
      <span className="font-bold flex-shrink-0 text-base leading-5">{s.icon}</span>
      <p className="flex-1 leading-relaxed" style={{ color: '#f4eee7' }}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 transition-opacity hover:opacity-100 opacity-60"
          style={{ color: s.color }}
          aria-label="Dismiss alert"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
