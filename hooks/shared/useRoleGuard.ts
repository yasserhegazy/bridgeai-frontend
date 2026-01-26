/**
 * useRoleGuard Hook
 * Ensures user has required role and redirects if not
 * Single Responsibility: Role-based access control side effects
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "../../services/token.service";
import { getCurrentUser } from "../../services/auth.service";

interface UseRoleGuardOptions {
  roles: string[];
  redirectTo: string;
}

interface UseRoleGuardReturn {
  isChecking: boolean;
  isAuthorized: boolean;
}

export function useRoleGuard({ roles, redirectTo }: UseRoleGuardOptions): UseRoleGuardReturn {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verify = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push(redirectTo);
          return;
        }
        const user = await getCurrentUser(token);
        if (!roles.includes(user.role)) {
          router.push(redirectTo);
          return;
        }
        setIsAuthorized(true);
      } catch {
        router.push(redirectTo);
      } finally {
        setIsChecking(false);
      }
    };

    verify();
  }, [roles, redirectTo, router]);

  return { isChecking, isAuthorized };
}
