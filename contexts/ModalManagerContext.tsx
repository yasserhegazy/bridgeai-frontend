/**
 * Modal Manager Context
 * Provides global modal state management to prevent modal collisions
 * 
 * Purpose:
 * - Prevents multiple modals from opening simultaneously
 * - Manages modal stack/queue for proper z-index layering
 * - Provides centralized modal coordination across components
 * 
 * SOLID Principles:
 * - Single Responsibility: Only manages modal registration and visibility
 * - Open/Closed: Extensible for new modal types without modification
 * - Dependency Inversion: Components depend on ModalManager abstraction
 */

"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ModalState {
  id: string;
  isOpen: boolean;
  priority?: number;
  metadata?: Record<string, unknown>;
}

interface ModalManagerContextValue {
  modals: Map<string, ModalState>;
  registerModal: (id: string, priority?: number) => void;
  unregisterModal: (id: string) => void;
  openModal: (id: string, metadata?: Record<string, unknown>) => boolean;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
  hasOpenModals: () => boolean;
  getOpenModals: () => string[];
}

const ModalManagerContext = createContext<ModalManagerContextValue | undefined>(undefined);

interface ModalManagerProviderProps {
  children: ReactNode;
  /**
   * Maximum number of modals that can be open simultaneously
   * Default: 1 (prevents collisions)
   * Set to higher value for intentional stacking (e.g., 2 for parent + child dialogs)
   */
  maxSimultaneousModals?: number;
  /**
   * When true, attempting to open a modal while another is open will close the first
   * When false, the open attempt will be rejected
   */
  autoCloseOnConflict?: boolean;
}

export function ModalManagerProvider({
  children,
  maxSimultaneousModals = 1,
  autoCloseOnConflict = true,
}: ModalManagerProviderProps) {
  const [modals, setModals] = useState<Map<string, ModalState>>(new Map());

  const registerModal = useCallback((id: string, priority: number = 0) => {
    setModals((prev) => {
      const next = new Map(prev);
      if (!next.has(id)) {
        next.set(id, { id, isOpen: false, priority });
      }
      return next;
    });
  }, []);

  const unregisterModal = useCallback((id: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const getOpenModals = useCallback((): string[] => {
    return Array.from(modals.values())
      .filter((modal) => modal.isOpen)
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
      .map((modal) => modal.id);
  }, [modals]);

  const hasOpenModals = useCallback((): boolean => {
    return Array.from(modals.values()).some((modal) => modal.isOpen);
  }, [modals]);

  const openModal = useCallback(
    (id: string, metadata?: Record<string, unknown>): boolean => {
      const openModals = Array.from(modals.values()).filter((m) => m.isOpen);

      // Check if we've reached the limit
      if (openModals.length >= maxSimultaneousModals) {
        if (autoCloseOnConflict) {
          // Close the lowest priority modal
          const sortedOpen = openModals.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
          const toClose = sortedOpen[0];
          
          setModals((prev) => {
            const next = new Map(prev);
            const modalToClose = next.get(toClose.id);
            if (modalToClose) {
              next.set(toClose.id, { ...modalToClose, isOpen: false });
            }
            const modalToOpen = next.get(id);
            if (modalToOpen) {
              next.set(id, { ...modalToOpen, isOpen: true, metadata });
            }
            return next;
          });
          return true;
        } else {
          // Reject the open attempt
          console.warn(
            `[ModalManager] Cannot open modal "${id}". Maximum ${maxSimultaneousModals} modal(s) already open:`,
            openModals.map((m) => m.id)
          );
          return false;
        }
      }

      // Open the modal
      setModals((prev) => {
        const next = new Map(prev);
        const modal = next.get(id);
        if (modal) {
          next.set(id, { ...modal, isOpen: true, metadata });
        } else {
          // Auto-register if not registered
          next.set(id, { id, isOpen: true, priority: 0, metadata });
        }
        return next;
      });
      return true;
    },
    [modals, maxSimultaneousModals, autoCloseOnConflict]
  );

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const next = new Map(prev);
      const modal = next.get(id);
      if (modal) {
        next.set(id, { ...modal, isOpen: false, metadata: undefined });
      }
      return next;
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals((prev) => {
      const next = new Map(prev);
      next.forEach((modal, id) => {
        if (modal.isOpen) {
          next.set(id, { ...modal, isOpen: false, metadata: undefined });
        }
      });
      return next;
    });
  }, []);

  const isModalOpen = useCallback(
    (id: string): boolean => {
      return modals.get(id)?.isOpen ?? false;
    },
    [modals]
  );

  return (
    <ModalManagerContext.Provider
      value={{
        modals,
        registerModal,
        unregisterModal,
        openModal,
        closeModal,
        closeAllModals,
        isModalOpen,
        hasOpenModals,
        getOpenModals,
      }}
    >
      {children}
    </ModalManagerContext.Provider>
  );
}

/**
 * Hook to access modal manager
 * Throws if used outside ModalManagerProvider
 */
export function useModalManager() {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error("useModalManager must be used within ModalManagerProvider");
  }
  return context;
}

/**
 * Hook for individual modal components
 * Provides managed open/close state with collision prevention
 * 
 * @param id - Unique modal identifier
 * @param priority - Higher priority modals stay open during conflicts (default: 0)
 * @returns Modal state and control functions
 */
export function useManagedModal(id: string, priority: number = 0) {
  const { registerModal, unregisterModal, openModal, closeModal, isModalOpen } = useModalManager();

  // Register on mount, unregister on unmount
  useState(() => {
    registerModal(id, priority);
    return () => unregisterModal(id);
  });

  const open = useCallback(
    (metadata?: Record<string, unknown>) => {
      return openModal(id, metadata);
    },
    [openModal, id]
  );

  const close = useCallback(() => {
    closeModal(id);
  }, [closeModal, id]);

  const isOpen = isModalOpen(id);

  return {
    isOpen,
    open,
    close,
    toggle: useCallback(() => {
      if (isOpen) {
        close();
      } else {
        open();
      }
    }, [isOpen, open, close]),
  };
}
