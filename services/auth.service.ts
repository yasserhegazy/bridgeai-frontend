/**
 * Authentication Service
 * Handles all authentication-related API communication
 * Single Responsibility: External authentication operations
 */

import {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
  CurrentUserDTO,
  ApiErrorDTO,
} from "@/dto/auth.dto";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Custom error class for authentication errors
 */
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Parse and format API error response
 */
function parseApiError(data: ApiErrorDTO, statusCode: number): string {
  if (typeof data.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((err) => {
        const field = err.loc?.[err.loc.length - 1] || "field";
        return `${field}: ${err.msg}`;
      })
      .join(", ");
  }

  return "An unexpected error occurred";
}

/**
 * Login user with username and password
 */
export async function loginUser(
  credentials: LoginRequestDTO
): Promise<LoginResponseDTO> {
  const formData = new FormData();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new AuthenticationError(errorMessage, response.status, errorData);
    }

    const data: LoginResponseDTO = await response.json();

    // Validate response structure
    if (!data.access_token || !data.role) {
      throw new AuthenticationError(
        "Invalid response from server: missing required fields"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Register a new user
 */
export async function registerUser(
  userData: RegisterRequestDTO
): Promise<RegisterResponseDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new AuthenticationError(errorMessage, response.status, errorData);
    }

    const data: RegisterResponseDTO = await response.json();
    return data;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(
  token: string
): Promise<CurrentUserDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthenticationError("Unauthorized", 401);
      }
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = parseApiError(errorData, response.status);
      throw new AuthenticationError(errorMessage, response.status, errorData);
    }

    const data: CurrentUserDTO = await response.json();
    return data;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}
