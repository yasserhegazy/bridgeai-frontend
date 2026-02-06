/**
 * Login Hook
 * Handles login business logic and side effects
 * Single Responsibility: Login state management
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoginRequestDTO } from "../../dto/auth.dto";
import { loginUser, AuthenticationError } from "../../services/auth.service";
import {
  storeAuthToken,
  storeUserRole,
  notifyAuthStateChange,
  waitForCookiePersistence,
} from "../../services/token.service";
import { getRoleBasedRedirectPath } from "../../lib/utils";

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequestDTO) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
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

        // Wait for cookies to be readable before navigation
        await waitForCookiePersistence("token", response.access_token);

        // Notify system of auth state change
        notifyAuthStateChange();

        // Redirect based on role with hard navigation to ensure middleware runs
        const redirectPath = getRoleBasedRedirectPath(response.role);
        window.location.href = redirectPath;
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

  const loginWithGoogle = useCallback(
    async (token: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await import("../../services/auth.service").then((m) =>
          m.loginWithGoogle(token)
        );

        storeAuthToken(response.access_token);
        storeUserRole(response.role as "client" | "ba");

        // Wait for cookies to be readable before navigation
        await waitForCookiePersistence("token", response.access_token);

        notifyAuthStateChange();

        // Redirect based on role with hard navigation to ensure middleware runs
        const redirectPath = getRoleBasedRedirectPath(response.role);
        window.location.href = redirectPath;
      } catch (err) {
        // Check if this is a Gmail-only restriction error
        if (err instanceof AuthenticationError &&
          err.message.includes("Only @gmail.com accounts")) {

          // Decode the JWT token to get the email
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const email = payload.email;

            // Redirect to registration page with email pre-filled
            if (email) {
              router.push(`/auth/register?email=${encodeURIComponent(email)}`);
              return;
            }
          } catch (decodeError) {
            console.error("Failed to decode token:", decodeError);
          }
        }

        // Show error for other cases
        if (err instanceof AuthenticationError) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred during Google login");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return {
    isLoading,
    error,
    login,
    loginWithGoogle,
    clearError,
  };
}
