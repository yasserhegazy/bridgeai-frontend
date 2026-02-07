/**
 * Register Page
 * User registration page
 * Single Responsibility: Registration UI composition
 */

"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { FormField } from "@/components/auth/FormField";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { useRegister } from "@/hooks/auth/useRegister";
import { useFormValidation } from "@/hooks/shared/useFormValidation";

// Role options removed - role selection happens post-registration via modal

function RegisterForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update email if URL parameter changes
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const { isLoading, error, register } = useRegister();

  const validationRules = useMemo(
    () => ({
      fullName: {
        required: true,
        minLength: 3,
        custom: (value: string) => {
          if (!value.trim()) return "Full name is required";
          if (value.length < 3) return "Full name must be at least 3 characters";
          return null;
        },
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value: string) => {
          if (!value.trim()) return "Email is required";
          if (!value.includes("@")) return "Please enter a valid email address";
          return null;
        },
      },
      password: {
        required: true,
        minLength: 6,
        custom: (value: string) => {
          if (!value.trim()) return "Password is required";
          if (value.length < 6) return "Password must be at least 6 characters";
          return null;
        },
      },
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          if (!value.trim()) return "Please confirm your password";
          if (value !== password) return "Passwords do not match";
          return null;
        },
      },
    }),
    [password]
  );

  const { errors, validateAll } = useFormValidation(validationRules);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const isValid = validateAll({ fullName, email, password, confirmPassword });
      if (!isValid) return;

      await register({
        full_name: fullName,
        email,
        password,
      });
    },
    [fullName, email, password, confirmPassword, validateAll, register]
  );

  return (
    <AuthFormContainer
      title="Create an account"
      subtitle="Join us to get started"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-4">
          <FormField
            id="fullName"
            label="Full Name"
            type="text"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            placeholder="Enter your email"
            required
            disabled={isLoading || !!emailFromUrl}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            placeholder="Create a password"
            required
            disabled={isLoading}
          />

          <FormField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            required
            disabled={isLoading}
          />
        </div>

        {error && <ErrorAlert message={error} />}

        <Button
          type="submit"
          className="w-full"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthFormContainer>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <AuthFormContainer
        title="Create an account"
        subtitle="Join us to get started"
      >
        <div className="mt-8 space-y-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </AuthFormContainer>
    }>
      <RegisterForm />
    </Suspense>
  );
}