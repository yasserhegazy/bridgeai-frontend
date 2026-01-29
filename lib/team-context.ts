/**
 * Team Context Management
 * Stores and retrieves the current team ID across routes
 * Single Responsibility: Team ID persistence for cross-route navigation
 */

const TEAM_ID_KEY = "current_team_id";

/**
 * Store the current team ID in session storage
 * @param teamId - The team ID to store (string or number)
 */
export function setCurrentTeamId(teamId: string | number): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(TEAM_ID_KEY, String(teamId));
  } catch (error) {
    console.error("Failed to store team ID:", error);
  }
}

/**
 * Get the current team ID from session storage
 * @returns The stored team ID or null if not found
 */
export function getCurrentTeamId(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TEAM_ID_KEY);
  } catch (error) {
    console.error("Failed to retrieve team ID:", error);
    return null;
  }
}

/**
 * Clear the current team ID from session storage
 * Should be called on logout
 */
export function clearCurrentTeamId(): void {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(TEAM_ID_KEY);
  } catch (error) {
    console.error("Failed to clear team ID:", error);
  }
}
