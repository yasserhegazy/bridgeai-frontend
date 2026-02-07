/**
 * Token Management Service
 * Handles storage and retrieval of authentication tokens
 * Single Responsibility: Token persistence
 */

import { UserRole } from "@/dto/auth.dto";

const TOKEN_COOKIE_NAME = "token";
const ROLE_COOKIE_NAME = "role";
const MAX_AGE_SECONDS = 86400; // 24 hours

/**
 * Store authentication token in cookie
 */
export function storeAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${MAX_AGE_SECONDS}`;
}

/**
 * Store user role in cookie
 */
export function storeUserRole(role: UserRole | null): void {
  if (typeof window === "undefined") return;
  if (role === null) {
    // Clear role cookie if null
    document.cookie = `${ROLE_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } else {
    document.cookie = `${ROLE_COOKIE_NAME}=${role}; path=/; max-age=${MAX_AGE_SECONDS}`;
  }
}

/**
 * Get authentication token from cookie
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === TOKEN_COOKIE_NAME) {
      return value;
    }
  }

  return null;
}

/**
 * Get user role from cookie
 */
export function getUserRole(): UserRole | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === ROLE_COOKIE_NAME) {
      return value as UserRole;
    }
  }

  return null;
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (typeof window === "undefined") return;

  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${ROLE_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Dispatch auth state change event for system-wide notification
 */
export function notifyAuthStateChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("auth-state-changed"));
}

/**
 * Check if user has a valid role selected
 */
export function hasRole(): boolean {
  const role = getUserRole();
  return role !== null && (role === "client" || role === "ba");
}

/**
 * Wait for cookie to be readable with the expected value
 * Prevents race condition in navigation after login
 */
export async function waitForCookiePersistence(
  cookieName: string,
  expectedValue: string,
  maxAttempts: number = 10,
  delayMs: number = 50
): Promise<void> {
  if (typeof window === "undefined") return;

  for (let i = 0; i < maxAttempts; i++) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === cookieName && value === expectedValue) {
        return; // Cookie is readable
      }
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  console.warn(`Cookie ${cookieName} not readable after ${maxAttempts * delayMs}ms`);
}
