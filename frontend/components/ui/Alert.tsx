interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const styles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const icons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export default function Alert({ type, message, onClose }: AlertProps) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles[type]}`} role="alert">
      <span className="text-lg font-bold flex-shrink-0">{icons[type]}</span>
      <p className="flex-1 text-sm">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-60 hover:opacity-100 text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
