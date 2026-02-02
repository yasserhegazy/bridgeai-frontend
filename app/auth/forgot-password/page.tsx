"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { FormField } from "@/components/auth/FormField";
import { ErrorAlert } from "@/components/auth/ErrorAlert";

type Step = 'email' | 'code' | 'password' | 'success';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to send verification code.");
                }

                setStep('code');
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        },
        [email]
    );

    const handleCodeSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp_code: code }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Invalid verification code.");
                }

                setStep('password');
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        },
        [email, code]
    );

    const handlePasswordSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp_code: code, new_password: newPassword }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to reset password.");
                }

                setStep('success');
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        },
        [email, code, newPassword, confirmPassword]
    );

    return (
        <AuthFormContainer
            title={step === 'success' ? "Reset Successful" : "Reset Password"}
            subtitle={
                step === 'email'
                    ? "Enter your email to receive a verification code"
                    : step === 'code'
                        ? `Enter the 6-digit code sent to ${email}`
                        : step === 'password'
                            ? "Enter your new password"
                            : "Your password has been reset successfully."
            }
        >
            <div className="mt-8 space-y-6">
                {step === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <FormField
                            id="email"
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                        />

                        {error && <ErrorAlert message={error} />}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Verification Code"}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="text-sm text-primary hover:underline font-medium"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}

                {step === 'code' && (
                    <form onSubmit={handleCodeSubmit} className="space-y-6">
                        <FormField
                            id="code"
                            label="Verification Code"
                            type="text"
                            value={code}
                            onChange={(val) => setCode(val.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit code"
                            required
                            disabled={isLoading}
                        />

                        {error && <ErrorAlert message={error} />}

                        <div className="space-y-3">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Verifying..." : "Verify Code"}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-xs text-muted-foreground"
                                onClick={() => setStep('email')}
                                disabled={isLoading}
                            >
                                Change Email
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                id="newPassword"
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={setNewPassword}
                                placeholder="Enter new password"
                                required
                                disabled={isLoading}
                            />
                            <FormField
                                id="confirmPassword"
                                label="Confirm New Password"
                                type="password"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                placeholder="Confirm new password"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && <ErrorAlert message={error} />}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm">
                            Your password recovery is complete. You can now sign in with your new credentials.
                        </div>
                        <Link href="/auth/login" className="block">
                            <Button variant="outline" className="w-full">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AuthFormContainer>
    );
}
