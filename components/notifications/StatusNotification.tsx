"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Info } from 'lucide-react';

export type NotificationStatus = 'idle' | 'loading' | 'success' | 'error' | 'info';

interface StatusNotificationProps {
  status: NotificationStatus;
  message?: string;
  onClose?: () => void;
}

export function StatusNotification({ status, message, onClose }: StatusNotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (status === 'success' || status === 'error' || status === 'info') {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  if (!visible || status === 'idle') return null;

  const config = {
    loading: { icon: Loader2, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    info: { icon: Info, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
  };

  const { icon: Icon, color, bg, border } = config[status];

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${bg} ${border}`}>
      <Icon className={`h-5 w-5 ${color} ${status === 'loading' ? 'animate-spin' : ''}`} />
      {message && <span className="text-sm text-gray-700">{message}</span>}
    </div>
  );
}

interface StatusTrackerProps {
  children: (status: NotificationStatus, setStatus: (status: NotificationStatus, message?: string) => void) => React.ReactNode;
}

export function StatusTracker({ children }: StatusTrackerProps) {
  const [status, setStatusState] = useState<NotificationStatus>('idle');
  const [message, setMessage] = useState<string>();

  const setStatus = (newStatus: NotificationStatus, newMessage?: string) => {
    setStatusState(newStatus);
    setMessage(newMessage);
  };

  return (
    <div className="space-y-4">
      <StatusNotification status={status} message={message} onClose={() => setStatusState('idle')} />
      {children(status, setStatus)}
    </div>
  );
}
