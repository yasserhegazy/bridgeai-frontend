"use client";

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
}

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(notification.id), 300);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 ${
        bgColors[notification.type]
      } ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
    >
      {icons[notification.type]}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900">{notification.title}</p>
        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(notification.id), 300);
        }}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function NotificationToastContainer() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const handleNewToast = (event: CustomEvent<ToastNotification>) => {
      setToasts(prev => [...prev, event.detail]);
    };

    window.addEventListener('show-toast', handleNewToast as EventListener);
    return () => window.removeEventListener('show-toast', handleNewToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map(toast => (
        <NotificationToast key={toast.id} notification={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

export function showToast(toast: Omit<ToastNotification, 'id'>) {
  const event = new CustomEvent('show-toast', {
    detail: { ...toast, id: Date.now().toString() }
  });
  window.dispatchEvent(event);
}
