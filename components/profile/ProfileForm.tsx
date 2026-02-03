/**
 * Profile Form Component
 * Form for updating user profile information
 * Single Responsibility: Profile update form
 */

"use client";

import { useState } from "react";
import { CurrentUserDTO } from "@/dto/auth.dto";
import { useProfileUpdate } from "@/hooks/profile/useProfileUpdate";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
    user: CurrentUserDTO;
    onSuccess: () => void;
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
    const [fullName, setFullName] = useState(user.full_name);
    const { updateProfile, isUpdating, error, clearError } = useProfileUpdate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSuccessMessage(null);

        if (fullName.trim() === user.full_name) {
            return; // No changes
        }

        const result = await updateProfile({ full_name: fullName.trim() });

        if (result) {
            setSuccessMessage("Profile updated successfully!");
            onSuccess();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Full Name
                </label>
                <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={isUpdating}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                    disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                    <p className="text-sm text-green-600">{successMessage}</p>
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isUpdating || fullName.trim() === user.full_name}
                    className="px-6"
                >
                    {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}
