'use client';

import React, { useEffect } from 'react';
import { useToastContext } from '@/context/ToastContext';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useToastContext();

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5" />;
      case 'error':
        return <X className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-in ${getToastStyles(toast.type)}`}
          role="alert"
        >
          <span className="text-xl flex-shrink-0" aria-hidden="true">{getIcon(toast.type)}</span>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white hover:text-gray-200 text-xl leading-none flex-shrink-0"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
