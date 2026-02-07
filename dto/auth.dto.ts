/**
 * Data Transfer Objects for Authentication
 * Defines strict contracts between backend and frontend
 */

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  access_token: string;
  token_type: string;
  role: string | null;  // Can be null for users who haven't selected role yet
}

export interface RegisterRequestDTO {
  full_name: string;
  email: string;
  password: string;
  // Role removed - selected post-registration via role selection modal
}

export interface RegisterResponseDTO {
  id: number;
  email: string;
  full_name: string;
  role: string | null;  // Will be null until role is selected
  created_at: string;
}

export interface CurrentUserDTO {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: string | null;  // Can be null for users who haven't selected role yet
  created_at: string;
}

export interface GoogleLoginRequestDTO {
  token: string;
  // Role removed - selected post-OAuth via role selection modal
}

export interface RoleSelectionRequestDTO {
  role: UserRole;
}

export interface RoleSelectionResponseDTO {
  access_token: string;
  token_type: string;
  role: string;
  user: CurrentUserDTO;
}

export interface ValidationErrorDTO {
  loc: string[];
  msg: string;
  type: string;
}

export interface ApiErrorDTO {
  detail: string | ValidationErrorDTO[];
}

export type UserRole = "client" | "ba";
