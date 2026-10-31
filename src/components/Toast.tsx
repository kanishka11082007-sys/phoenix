import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast-item">
          {t.type === 'success' && <CheckCircle2 size={16} color="#10B981" />}
          {t.type === 'warning' && <AlertCircle size={16} color="#F59E0B" />}
          {t.type === 'info' && <Info size={16} color="var(--accent-orange)" />}
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', marginLeft: 'auto' }}
            aria-label="Dismiss notification"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
};
