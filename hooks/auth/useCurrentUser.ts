/**
 * useCurrentUser Hook
 * Loads current authenticated user data
 * Single Responsibility: Current user state and fetch logic
 */

import { useState, useEffect, useCallback } from "react";
import { getAuthToken } from "@/services/token.service";
import { getCurrentUser } from "@/services/auth.service";
import { CurrentUserDTO } from "@/dto/auth.dto";

interface UseCurrentUserReturn {
  user: CurrentUserDTO | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useCurrentUser(enabled = true): UseCurrentUserReturn {
  const [user, setUser] = useState<CurrentUserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("No authentication token found");
        setUser(null);
        return;
      }
      const data = await getCurrentUser(token);
      setUser(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load user";
      setError(message);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [enabled, loadUser]);

  const refresh = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return { user, isLoading, error, refresh };
}
