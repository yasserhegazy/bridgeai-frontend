/**
 * API utilities for making authenticated requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface ApiErrorResponse {
  error: string;
  status: number;
}

/**
 * Get the access token from cookies
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  
  // Get token from cookies
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') {
      return value;
    }
  }
  
  // Fallback to localStorage for backward compatibility
  return localStorage.getItem("token");
}

/**
 * Store the access token in cookies
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `token=${token}; path=/; max-age=86400`;
}

/**
 * Remove the access token from cookies and localStorage
 */
export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  // Clear from cookies
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  // Also clear from localStorage for backward compatibility
  localStorage.removeItem("token");
}

/**
 * Make an authenticated API request
 */
export async function apiCall<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options?.headers,
    "Authorization": `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAccessToken();
        throw new Error("Unauthorized. Please log in again.");
      }

      // Try to parse error details from response body
      let errorMessage = response.statusText || `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If JSON parsing fails, use the statusText
      }

      throw new Error(errorMessage);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    // Add more context to network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(`Cannot connect to backend at ${API_BASE_URL}. Please ensure the server is running and CORS is configured.`);
    }
    throw error;
  }
}

/**
 * Login with username and password
 */
export async function login(
  username: string,
  password: string
): Promise<{
  access_token: string;
  token_type: string;
  role?: string;
}> {
  const url = `${API_BASE_URL}/auth/token`;
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get current user information
 */
export async function getCurrentUser<T = any>(): Promise<T> {
  return apiCall<T>("/auth/me");
}

/**
 * Register a new user
 */
export async function register(
  username: string,
  email: string,
  password: string
): Promise<any> {
  const url = `${API_BASE_URL}/auth/register`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  return response.json();
}
