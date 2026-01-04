import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-primary text-primary-foreground',
    error: 'bg-destructive text-destructive-foreground',
    info: 'bg-secondary text-secondary-foreground',
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in" style={{ animation: 'fade-in 0.3s ease-out' }}>
      <div className={`${typeStyles} px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-current opacity-90 hover:opacity-100 font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;

