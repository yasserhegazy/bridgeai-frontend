// API utilities for team invitations feature
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Types
export interface InvitationRequest {
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface InvitationResponse {
  id: string;
  email: string;
  role: string;
  team_id: string;
  invited_by_user_id: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'canceled';
  created_at: string;
  expires_at: string;
}

export interface InvitationPublicDetails {
  email: string;
  role: string;
  team_id: number;
  team_name: string;
  invited_by_name: string;
  invited_by_email: string;
  created_at: string;
  expires_at: string;
  status: string;
}

export interface InvitationAcceptResponse {
  message: string;
  team_id?: number;
  team?: {
    id: string | number;
    name: string;
    description: string;
  };
  role: string;
}

// Get auth token from cookies
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Get token from cookies
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token') {
      return value;
    }
  }
  
  // Fallback to localStorage for backward compatibility
  return localStorage.getItem('token');
};

// Create authorization headers
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const invitationAPI = {
  /**
   * Send invitation to join a team
   */
  async sendInvitation(teamId: string, invitation: InvitationRequest): Promise<InvitationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/invite`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(invitation),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send invitation');
    }

    return response.json();
  },

  /**
   * Get invitation details (public endpoint)
   */
  async getInvitationDetails(token: string): Promise<InvitationPublicDetails> {
    const response = await fetch(`${API_BASE_URL}/api/invitation/${token}`, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Invitation not found or has expired');
      }
      if (response.status === 410) {
        throw new Error('This invitation has expired');
      }
      throw new Error('Failed to load invitation details');
    }

    return response.json();
  },

  /**
   * Accept invitation (requires authentication)
   */
  async acceptInvitation(token: string): Promise<InvitationAcceptResponse> {
    const response = await fetch(`${API_BASE_URL}/api/invitation/${token}/accept`, {
      method: 'POST',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 400) {
        // Return the specific error message from the backend
        throw new Error(error.detail || 'Invitation expired or email mismatch');
      }
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      if (response.status === 404) {
        throw new Error('Invalid invitation token');
      }
      if (response.status === 409) {
        throw new Error('You are already a member of this team');
      }
      
      throw new Error(error.detail || 'Failed to accept invitation');
    }

    return response.json();
  },

  /**
   * Get team invitations (for admins/owners)
   * Note: This endpoint might need to be implemented in the backend
   */
  async getTeamInvitations(teamId: string): Promise<InvitationResponse[]> {
    const response = await fetch(`${API_BASE_URL}/api/teams/${teamId}/invitations`, {
      method: 'GET',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch team invitations');
    }

    return response.json();
  },

  /**
   * Cancel invitation (for admins/owners)
   * Note: This endpoint might need to be implemented in the backend
   */
  async cancelInvitation(invitationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/invitations/${invitationId}/cancel`, {
      method: 'POST',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to cancel invitation');
    }
  },

  /**
   * Resend invitation (for admins/owners)
   * Note: This endpoint might need to be implemented in the backend
   */
  async resendInvitation(invitationId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/invitations/${invitationId}/resend`, {
      method: 'POST',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to resend invitation');
    }
  },
};