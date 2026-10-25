import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts = [], onRemoveToast }) => {
  useEffect(() => {
    if (toasts.length === 0) return;

    // Auto-remove oldest toast after 4.5 seconds
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        onRemoveToast(toast.id);
      }, toast.duration || 4500);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, onRemoveToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const typeClass = isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info';

        return (
          <div key={toast.id} className={`toast ${typeClass}`} role="status">
            <div style={{ flexShrink: 0, marginTop: 1 }}>
              {isSuccess && <CheckCircle2 size={18} />}
              {isError && <AlertCircle size={18} />}
              {!isSuccess && !isError && <Info size={18} />}
            </div>

            <div className="toast-message">
              {toast.message}
            </div>

            <button
              type="button"
              className="toast-close"
              onClick={() => onRemoveToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
