"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoleSelectionModal } from "@/components/auth/RoleSelectionModal";
import { useRoleSelection } from "@/hooks/auth/useRoleSelection";
import { UserRole } from "@/dto/auth.dto";
import { getAuthToken, getUserRole } from "@/services/token.service";

export default function SelectRolePage() {
  const router = useRouter();
  const { selectUserRole, isLoading, error } = useRoleSelection();

  // Check if user already has a role or needs authentication
  useEffect(() => {
    const token = getAuthToken();
    const role = getUserRole();

    if (!token) {
      // User not authenticated, redirect to login
      router.replace("/auth/login");
      return;
    }

    if (role && (role === "client" || role === "ba")) {
      // User already has a role, redirect to teams
      router.replace("/teams");
      return;
    }
  }, [router]);

  const handleRoleSelected = async (role: UserRole) => {
    try {
      await selectUserRole(role);
      // Role selection successful, redirect to teams
      router.push("/teams");
    } catch (err) {
      // Error is already set in the hook, modal will display it
      console.error("Role selection failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <RoleSelectionModal
        open={true}
        onRoleSelected={handleRoleSelected}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
