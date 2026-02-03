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
  role: string;
}

export interface RegisterRequestDTO {
  full_name: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponseDTO {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface CurrentUserDTO {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: string;
  created_at: string;
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
