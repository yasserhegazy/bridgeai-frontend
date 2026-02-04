/**
 * Enhanced useModal Hook with Modal Manager Integration
 * 
 * Provides backward-compatible API with optional modal manager integration
 * Components can opt-in to global collision prevention by providing a unique ID
 * 
 * SOLID Principles:
 * - Single Responsibility: Modal state management
 * - Open/Closed: Extends original useModal without breaking existing usage
 * - Dependency Inversion: Optional dependency on modal manager
 */

import { useState, useCallback, useEffect } from "react";
import { useModalManager } from "@/contexts/ModalManagerContext";

interface UseModalOptions {
  /**
   * Unique modal ID for global coordination
   * If provided, uses ModalManager to prevent collisions
   * If omitted, operates independently (legacy behavior)
   */
  id?: string;
  /**
   * Priority level (higher = stays open during conflicts)
   * Only used when id is provided
   */
  priority?: number;
  /**
   * Callback when modal opens
   */
  onOpen?: () => void;
  /**
   * Callback when modal closes
   */
  onClose?: () => void;
}

interface UseModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export function useModal(
  initialState: boolean = false,
  options?: UseModalOptions
): UseModalReturn {
  const [isLocalOpen, setIsLocalOpen] = useState(initialState);
  
  // Try to get modal manager (optional - gracefully handles missing provider)
  let modalManager: ReturnType<typeof useModalManager> | null = null;
  try {
    if (options?.id) {
      modalManager = useModalManager();
    }
  } catch {
    // No modal manager provider - use local state only
    modalManager = null;
  }

  // Register modal if using manager
  useEffect(() => {
    if (modalManager && options?.id) {
      modalManager.registerModal(options.id, options.priority ?? 0);
      return () => {
        modalManager?.unregisterModal(options.id!);
      };
    }
  }, [modalManager, options?.id, options?.priority]);

  // Determine actual open state
  const isOpen = options?.id && modalManager
    ? modalManager.isModalOpen(options.id)
    : isLocalOpen;

  const openModal = useCallback(() => {
    if (options?.id && modalManager) {
      const success = modalManager.openModal(options.id);
      if (success && options.onOpen) {
        options.onOpen();
      }
    } else {
      setIsLocalOpen(true);
      options?.onOpen?.();
    }
  }, [modalManager, options]);

  const closeModal = useCallback(() => {
    if (options?.id && modalManager) {
      modalManager.closeModal(options.id);
      options?.onClose?.();
    } else {
      setIsLocalOpen(false);
      options?.onClose?.();
    }
  }, [modalManager, options]);

  const toggleModal = useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, openModal, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
