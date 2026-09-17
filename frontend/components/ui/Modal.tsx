'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full z-10">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="p-6">{children}</div>
          {footer && <div className="px-6 pb-6">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
