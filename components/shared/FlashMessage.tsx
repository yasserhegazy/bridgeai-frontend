/**
 * Flash Message Component
 * Displays temporary notification messages
 * Single Responsibility: Toast-like notifications
 */

import { useMemo } from "react";

type FlashMessageType = "success" | "info" | "error";

interface FlashMessageProps {
  type: FlashMessageType;
  message: string;
  onClose?: () => void;
}

export function FlashMessage({ type, message, onClose }: FlashMessageProps) {
  const config = useMemo(() => {
    const configs = {
      success: {
        bgColor: "bg-green-500",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      info: {
        bgColor: "bg-blue-500",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      error: {
        bgColor: "bg-red-500",
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      },
    };

    return configs[type];
  }, [type]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 text-white ${config.bgColor}`}
      role="alert"
    >
      {config.icon}
      <span className="font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80"
          aria-label="Close message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
