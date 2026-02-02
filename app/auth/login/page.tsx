/**
 * Login Page
 * User authentication page
 * Single Responsibility: Login UI composition
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { FormField } from "@/components/auth/FormField";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useLogin } from "@/hooks/auth/useLogin";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { isLoading, error, login, loginWithGoogle } = useLogin();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await login({ username, password });
    },
    [username, password, login]
  );

  const handleNavigateToRegister = useCallback(() => {
    router.push("/auth/register");
  }, [router]);

  return (
    <AuthFormContainer title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <FormField
            id="username"
            label="Email"
            type="email"
            value={username}
            onChange={setUsername}
            placeholder="Enter your username"
            required
            disabled={isLoading}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary hover:underline hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center w-full">
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE" &&
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== "YOUR_CLIENT_ID" ? (
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  loginWithGoogle(credentialResponse.credential);
                }
              }}
              onError={() => {
                console.error('Google Login Failed');
              }}
              useOneTap={false}
              auto_select={false}
              context="signin"
            />
          ) : (
            <div className="text-xs text-muted-foreground text-center p-2 border rounded bg-muted/50">
              Google Login disabled (Client ID not configured)
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account? </span>
          <Button
            type="button"
            variant="link"
            className="p-0 font-semibold text-primary hover:text-primary/80"
            onClick={handleNavigateToRegister}
          >
            Register here
          </Button>
        </div>
      </form>
    </AuthFormContainer>
  );
}
