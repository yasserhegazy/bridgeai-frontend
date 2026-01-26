/**
 * Login Hook
 * Handles login business logic and side effects
 * Single Responsibility: Login state management
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoginRequestDTO } from "@/dto/auth.dto";
import { loginUser, AuthenticationError } from "@/services/auth.service";
import {
  storeAuthToken,
  storeUserRole,
  notifyAuthStateChange,
} from "@/services/token.service";
import { getRoleBasedRedirectPath } from "@/lib/utils";

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequestDTO) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for handling user login
 */
export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useCallback(
    async (credentials: LoginRequestDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await loginUser(credentials);

        // Store authentication data
        storeAuthToken(response.access_token);
        storeUserRole(response.role as "client" | "ba");

        // Notify system of auth state change
        notifyAuthStateChange();

        // Redirect based on role
        const redirectPath = getRoleBasedRedirectPath(response.role);
        router.push(redirectPath);
      } catch (err) {
        if (err instanceof AuthenticationError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred during login");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    login,
    clearError,
  };
}
