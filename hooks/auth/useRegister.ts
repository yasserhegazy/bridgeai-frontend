/**
 * Registration Hook
 * Handles registration business logic and side effects
 * Single Responsibility: Registration state management
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RegisterRequestDTO } from "@/dto/auth.dto";
import { registerUser, AuthenticationError } from "@/services/auth.service";

interface UseRegisterReturn {
  isLoading: boolean;
  error: string | null;
  register: (userData: RegisterRequestDTO) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for handling user registration
 */
export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = useCallback(
    async (userData: RegisterRequestDTO) => {
      setIsLoading(true);
      setError(null);

      try {
        await registerUser(userData);

        // Redirect to login page after successful registration
        router.push("/auth/login");
      } catch (err) {
        if (err instanceof AuthenticationError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred during registration");
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
    register,
    clearError,
  };
}
