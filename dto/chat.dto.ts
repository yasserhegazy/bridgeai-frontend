/**
 * Chat Domain DTOs
 * Type contracts for chat sessions, messages, and WebSocket communication
 */

export type SenderType = "ba" | "client" | "ai";

export type ConnectionState = "connecting" | "open" | "closed" | "error";

export interface ChatSessionDTO {
  id: number;
  project_id: number;
  name: string;
  status: "active" | "closed" | "completed";
  started_at: string;
  ended_at?: string | null;
  crs_pattern?: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories"; messages?: ChatMessageDTO[];
}

export interface ChatMessageDTO {
  id: number;
  session_id: number;
  sender_type: SenderType;
  sender_id: number | null;
  content: string;
  timestamp: string;
}

export interface LocalChatMessage extends ChatMessageDTO {
  _localId?: string; // For optimistic UI
  pending?: boolean;
  failed?: boolean;
}

export interface SendMessagePayload {
  content: string;
  sender_type: "ba" | "client";
  crs_pattern?: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";
}

export interface WebSocketMessageData {
  type?: "message" | "status" | "error";
  id?: number;
  session_id?: number;
  sender_type?: SenderType;
  sender_id?: number | null;
  content?: string;
  timestamp?: string;
  error?: string;
  status?: string; // e.g. "thinking", "drafting", "idle"
  is_generating?: boolean;
  crs?: {
    is_complete?: boolean;
    crs_document_id?: number;
    version?: number;
    summary_points?: string[];
    quality_summary?: string;
  };
}

export interface CRSPreviewOut {
  content: string; // JSON string
  summary_points: string[];
  overall_summary: string;
  completeness_percentage: number;
  is_complete: boolean;
  missing_required_fields: string[];
  missing_optional_fields: string[];
  weak_fields: string[];
  field_sources: Record<string, string>;
  filled_optional_count: number;
}

export interface CreateCRSPayload {
  project_id: number;
  content: string;
  summary_points: string[];
  allow_partial: boolean;
  completeness_percentage: number;
  session_id: number;
  pattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";
}
