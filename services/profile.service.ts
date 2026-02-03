/**
 * Profile Service
 * Handles all profile-related API communication
 * Single Responsibility: Profile management operations
 */

import {
    UserProfileUpdateDTO,
    PasswordChangeDTO,
    PasswordChangeResponseDTO,
} from "@/dto/profile.dto";
import { CurrentUserDTO } from "@/dto/auth.dto";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Get the full avatar URL from the avatar_url field
 * Handles both Google avatars (full URLs) and local avatars (relative paths)
 * @param avatarUrl - The avatar_url from user object
 * @returns Full URL to the avatar image or null
 */
export function getAvatarUrl(avatarUrl: string | null | undefined): string | null {
    if (!avatarUrl) return null;
    // Google avatars and other external URLs start with http/https
    if (avatarUrl.startsWith("http")) return avatarUrl;
    // Local avatars need backend URL prepended
    return `${API_BASE_URL}/${avatarUrl}`;
}

/**
 * Custom error class for profile errors
 */
export class ProfileError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = "ProfileError";
    }
}

/**
 * Parse and format API error response
 */
function parseApiError(data: any, statusCode: number): string {
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
 * Update user profile
 */
export async function updateUserProfile(
    token: string,
    data: UserProfileUpdateDTO
): Promise<CurrentUserDTO> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = parseApiError(errorData, response.status);
            throw new ProfileError(errorMessage, response.status, errorData);
        }

        const result: CurrentUserDTO = await response.json();
        return result;
    } catch (error) {
        if (error instanceof ProfileError) {
            throw error;
        }
        throw new ProfileError(
            error instanceof Error ? error.message : "Network error occurred"
        );
    }
}

/**
 * Change user password
 */
export async function changePassword(
    token: string,
    data: PasswordChangeDTO
): Promise<PasswordChangeResponseDTO> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = parseApiError(errorData, response.status);
            throw new ProfileError(errorMessage, response.status, errorData);
        }

        const result: PasswordChangeResponseDTO = await response.json();
        return result;
    } catch (error) {
        if (error instanceof ProfileError) {
            throw error;
        }
        throw new ProfileError(
            error instanceof Error ? error.message : "Network error occurred"
        );
    }
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(
    token: string,
    file: File
): Promise<{ message: string; avatar_url: string }> {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/api/auth/avatar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = parseApiError(errorData, response.status);
            throw new ProfileError(errorMessage, response.status, errorData);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof ProfileError) {
            throw error;
        }
        throw new ProfileError(
            error instanceof Error ? error.message : "Network error occurred"
        );
    }
}

/**
 * Delete user avatar
 */
export async function deleteAvatar(token: string): Promise<{ message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/avatar`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = parseApiError(errorData, response.status);
            throw new ProfileError(errorMessage, response.status, errorData);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        if (error instanceof ProfileError) {
            throw error;
        }
        throw new ProfileError(
            error instanceof Error ? error.message : "Network error occurred"
        );
    }
}
