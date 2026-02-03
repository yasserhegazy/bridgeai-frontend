/**
 * Profile Avatar Component
 * Displays user avatar with upload and delete functionality
 * Single Responsibility: User avatar display and management
 */

"use client";

import { useState, useRef } from "react";
import { CurrentUserDTO } from "@/dto/auth.dto";
import { COLORS } from "@/constants";
import { uploadAvatar, deleteAvatar, ProfileError } from "@/services/profile.service";
import { getCookie } from "@/lib/utils";
import { Camera, Trash2, Loader2 } from "lucide-react";

interface ProfileAvatarProps {
    user: CurrentUserDTO;
    onAvatarUpdate: () => void;
}

function getUserInitials(fullName?: string): string {
    if (!fullName) return "U";

    const nameParts = fullName.trim().split(/\s+/);

    if (nameParts.length === 0) return "U";
    if (nameParts.length === 1) {
        return nameParts[0].substring(0, 2).toUpperCase();
    }

    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

    return firstInitial + lastInitial;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function ProfileAvatar({ user, onAvatarUpdate }: ProfileAvatarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const isGoogleUser = user.avatar_url?.startsWith("http");
    const hasCustomAvatar = user.avatar_url && !isGoogleUser;

    const getAvatarUrl = () => {
        if (previewUrl) return previewUrl;
        if (user.avatar_url?.startsWith("http")) return user.avatar_url;
        if (user.avatar_url) return `${API_BASE_URL}/${user.avatar_url}`;
        return null;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        try {
            const token = getCookie("token");
            if (!token) {
                throw new Error("Not authenticated");
            }

            await uploadAvatar(token, file);
            onAvatarUpdate(); // Refresh user data
            setPreviewUrl(null);
        } catch (err) {
            setError(
                err instanceof ProfileError ? err.message : "Failed to upload avatar"
            );
            setPreviewUrl(null);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeleteAvatar = async () => {
        if (!confirm("Are you sure you want to delete your avatar?")) {
            return;
        }

        setError(null);
        setIsUploading(true);
        try {
            const token = getCookie("token");
            if (!token) {
                throw new Error("Not authenticated");
            }

            await deleteAvatar(token);
            onAvatarUpdate(); // Refresh user data
        } catch (err) {
            setError(
                err instanceof ProfileError ? err.message : "Failed to delete avatar"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const avatarUrl = getAvatarUrl();

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            {/* Avatar */}
            <div className="relative group">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={user.full_name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                ) : (
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-white"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        {getUserInitials(user.full_name)}
                    </div>
                )}

                {/* Upload/Delete Overlay */}
                {!isGoogleUser && (
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
                            title="Upload avatar"
                        >
                            {isUploading ? (
                                <Loader2 className="w-5 h-5 text-gray-700 animate-spin" />
                            ) : (
                                <Camera className="w-5 h-5 text-gray-700" />
                            )}
                        </button>

                        {hasCustomAvatar && !isUploading && (
                            <button
                                onClick={handleDeleteAvatar}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 hover:bg-red-50"
                                title="Delete avatar"
                            >
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                        )}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* User Info */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                <span
                    className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                        backgroundColor: user.role === "ba" ? "#E0F2FE" : "#F3E8FF",
                        color: user.role === "ba" ? "#0369A1" : "#7E22CE",
                    }}
                >
                    {user.role === "ba" ? "Business Analyst" : "Client"}
                </span>
            </div>

            {/* Error Message */}
            {error && (
                <div className="w-full bg-red-50 border border-red-200 rounded-md p-2">
                    <p className="text-xs text-red-600 text-center">{error}</p>
                </div>
            )}

            {/* Google User Notice */}
            {isGoogleUser && (
                <div className="w-full bg-blue-50 border border-blue-200 rounded-md p-2">
                    <p className="text-xs text-blue-600 text-center">
                        Google avatar managed through your Google account
                    </p>
                </div>
            )}
        </div>
    );
}
