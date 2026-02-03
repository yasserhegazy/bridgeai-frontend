/**
 * Profile Settings Page
 * Main profile page for viewing and editing user profile
 * Single Responsibility: Profile settings UI orchestration
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { getCookie } from "@/lib/utils";
import { User, Lock, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const token = getCookie("token");
    const isAuthenticated = !!token;
    const { user, isLoading, refresh } = useCurrentUser(isAuthenticated);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-14 px-6 sm:px-8 flex justify-center items-center">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading profile...</span>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated (after loading)
    if (!user) {
        return null;
    }

    // Google users have avatar URLs starting with "http" (from googleusercontent.com)
    // Regular users have local avatar URLs starting with "public/" or no avatar
    const isGoogleUser = user.avatar_url?.startsWith("http") || false;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-14 px-6 sm:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your account information and preferences
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Avatar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <ProfileAvatar user={user} onAvatarUpdate={refresh} />
                        </div>
                    </div>

                    {/* Right Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                                <User className="w-5 h-5 text-gray-700" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Profile Information
                                </h2>
                            </div>
                            <ProfileForm user={user} onSuccess={refresh} />
                        </div>

                        {/* Password Change - Only show for non-Google users */}
                        {!isGoogleUser && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                                    <Lock className="w-5 h-5 text-gray-700" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Change Password
                                    </h2>
                                </div>
                                <PasswordChangeForm />
                            </div>
                        )}

                        {/* Google User Notice */}
                        {isGoogleUser && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 text-blue-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-900">
                                            Google Account
                                        </h3>
                                        <p className="text-sm text-blue-700 mt-1">
                                            You're signed in with Google. Password management is handled
                                            through your Google account settings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
