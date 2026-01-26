/**
 * useFlashMessage Hook
 * Manages flash message state with auto-dismiss
 * Single Responsibility: Flash message state management
 */

import { useState, useCallback, useEffect } from "react";

type FlashMessageType = "success" | "info" | "error";

interface FlashMessageState {
  type: FlashMessageType;
  message: string;
}

interface UseFlashMessageReturn {
  flashMessage: FlashMessageState | null;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
  showError: (message: string) => void;
  clearMessage: () => void;
}

export function useFlashMessage(
  autoDismissMs: number = 3000
): UseFlashMessageReturn {
  const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(
    null
  );

  const clearMessage = useCallback(() => {
    setFlashMessage(null);
  }, []);

  const showMessage = useCallback(
    (type: FlashMessageType, message: string) => {
      setFlashMessage({ type, message });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string) => showMessage("success", message),
    [showMessage]
  );

  const showInfo = useCallback(
    (message: string) => showMessage("info", message),
    [showMessage]
  );

  const showError = useCallback(
    (message: string) => showMessage("error", message),
    [showMessage]
  );

  // Auto-dismiss flash messages
  useEffect(() => {
    if (flashMessage) {
      const timeout = setTimeout(() => {
        clearMessage();
      }, autoDismissMs);

      return () => clearTimeout(timeout);
    }
  }, [flashMessage, autoDismissMs, clearMessage]);

  return {
    flashMessage,
    showSuccess,
    showInfo,
    showError,
    clearMessage,
  };
}
