import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the redirect path based on user role
 * @param role - User role ('ba' or 'client') or null if not yet selected
 * @returns The path to redirect to
 */
export function getRoleBasedRedirectPath(role: string | null | undefined): string {
  // Both BA and Client redirect to teams
  // If role is null/undefined, still redirect to teams (middleware will handle)
  return "/teams"
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
/**
 * Parse a date string from the backend as UTC.
 * Backend returns naive datetimes (no timezone suffix) that are actually UTC.
 */
export function parseUTCDate(dateString: string): Date {
  if (!dateString) return new Date();
  return new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z');
}

export function getCookie(name: string): string | null {
  // Check if running in browser (not SSR)
  if (typeof document === 'undefined') {
    return null;
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
