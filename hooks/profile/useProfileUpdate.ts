/**
 * Profile Update Hook
 * Manages profile update state and API calls
 * Single Responsibility: Profile update logic
 */

"use client";

import { useState } from "react";
import { updateUserProfile, ProfileError } from "@/services/profile.service";
import { UserProfileUpdateDTO } from "@/dto/profile.dto";
import { CurrentUserDTO } from "@/dto/auth.dto";
import { getCookie } from "@/lib/utils";

interface UseProfileUpdateReturn {
    updateProfile: (data: UserProfileUpdateDTO) => Promise<CurrentUserDTO | null>;
    isUpdating: boolean;
    error: string | null;
    clearError: () => void;
}

export function useProfileUpdate(): UseProfileUpdateReturn {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateProfile = async (
        data: UserProfileUpdateDTO
    ): Promise<CurrentUserDTO | null> => {
        setIsUpdating(true);
        setError(null);

        try {
            const token = getCookie("token");
            if (!token) {
                throw new Error("Not authenticated");
            }

            const updatedUser = await updateUserProfile(token, data);

            // Trigger auth state changed event to refresh user data
            window.dispatchEvent(new Event("auth-state-changed"));

            return updatedUser;
        } catch (err) {
            const errorMessage =
                err instanceof ProfileError
                    ? err.message
                    : "Failed to update profile. Please try again.";
            setError(errorMessage);
            return null;
        } finally {
            setIsUpdating(false);
        }
    };

    const clearError = () => setError(null);

    return {
        updateProfile,
        isUpdating,
        error,
        clearError,
    };
}
