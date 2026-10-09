'use client';

import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message || duration <= 0) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'rgba(16, 185, 129, 0.95)',
    error: 'rgba(239, 68, 68, 0.95)',
    warning: 'rgba(245, 158, 11, 0.95)',
    info: 'rgba(99, 102, 241, 0.95)',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      role="alert"
      className="animate-slide-in-right"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: bgColors[type] || bgColors.info,
        color: '#FFFFFF',
        padding: '0.875rem 1.25rem',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '420px',
        fontSize: '0.925rem',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span>{icons[type] || icons.info}</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '2px 6px',
            opacity: 0.8,
          }}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}
