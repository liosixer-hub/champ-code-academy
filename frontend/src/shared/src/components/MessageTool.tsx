import React, { useEffect } from 'react';
import Button from './Button';

interface MessageBoxProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  persistent?: boolean;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  persistent = false,
}) => {
  useEffect(() => {
    if (persistent || onConfirm || onCancel) {
      return;
    }
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, onConfirm, onCancel, persistent]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-primary text-primary-foreground';
      case 'error':
        return 'bg-destructive text-destructive-foreground';
      case 'warning':
        return 'bg-accent text-accent-foreground';
      case 'info':
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${getTypeStyles()} transition-all duration-300`}
    >
      <div className="flex items中心 justify-between gap-3">
        <span>{message}</span>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} className="px-3 py-1">
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button variant="primary" onClick={onConfirm} className="px-3 py-1">
              {confirmText}
            </Button>
          )}
          {!onConfirm && !onCancel && onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-lg font-bold hover:opacity-75"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
