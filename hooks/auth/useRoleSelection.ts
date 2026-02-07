/**
 * Role Selection Hook
 * Handles role selection logic after registration/OAuth
 */

import { useState } from "react";
import { selectRole } from "@/services/auth.service";
import {
  getAuthToken,
  storeAuthToken,
  storeUserRole,
  notifyAuthStateChange,
} from "@/services/token.service";
import { UserRole } from "@/dto/auth.dto";

interface UseRoleSelectionReturn {
  selectUserRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useRoleSelection(): UseRoleSelectionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectUserRole = async (role: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current token
      const currentToken = getAuthToken();
      if (!currentToken) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // Call API to select role
      const response = await selectRole({ role }, currentToken);

      // Store new token and role
      storeAuthToken(response.access_token);
      storeUserRole(response.role as UserRole);

      // Emit auth state changed event
      notifyAuthStateChange();

      // Success - role selected
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to select role. Please try again.";
      setError(errorMessage);
      throw err; // Re-throw so component can handle (e.g., stay on modal)
    }
  };

  return {
    selectUserRole,
    isLoading,
    error,
  };
}
