/**
 * Password Change Hook
 * Manages password change state and API calls
 * Single Responsibility: Password change logic
 */

"use client";

import { useState } from "react";
import { changePassword, ProfileError } from "@/services/profile.service";
import { PasswordChangeDTO } from "@/dto/profile.dto";
import { getCookie } from "@/lib/utils";

interface UsePasswordChangeReturn {
    changeUserPassword: (data: PasswordChangeDTO) => Promise<boolean>;
    isChanging: boolean;
    error: string | null;
    success: string | null;
    clearMessages: () => void;
}

export function usePasswordChange(): UsePasswordChangeReturn {
    const [isChanging, setIsChanging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const changeUserPassword = async (
        data: PasswordChangeDTO
    ): Promise<boolean> => {
        setIsChanging(true);
        setError(null);
        setSuccess(null);

        try {
            const token = getCookie("token");
            if (!token) {
                throw new Error("Not authenticated");
            }

            const result = await changePassword(token, data);
            setSuccess(result.message);
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof ProfileError
                    ? err.message
                    : "Failed to change password. Please try again.";
            setError(errorMessage);
            return false;
        } finally {
            setIsChanging(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        changeUserPassword,
        isChanging,
        error,
        success,
        clearMessages,
    };
}
