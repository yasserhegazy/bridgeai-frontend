/**
 * Data Transfer Objects for CRS (Client Requirements Specification)
 * Defines strict contracts between backend and frontend
 */

export interface CRSDTO {
  id: number;
  project_id: number;
  chat_session_id?: number;
  content: string;
  status: CRSStatus;
  pattern?: CRSPattern;
  version: number;
  edit_version?: number;
  summary_points?: string[];
  field_sources?: Record<string, string>;
  rejection_reason?: string | null;
  created_at: string;
  updated_at?: string;
  created_by: number | null;
  approved_by?: number | null;
  reviewed_at?: string | null;
  project_name?: string;
  client_name?: string;
}

export interface CRSListItemDTO {
  id: number;
  project_id: number;
  project_name: string;
  status: CRSStatus;
  version: number;
  created_at: string;
  updated_at: string;
  rejection_reason?: string | null;
}

export type CRSPattern = "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";

/**
 * Create CRS Request DTO (matches backend CRSCreate schema)
 */
export interface CreateCRSRequestDTO {
  project_id: number;
  content: string;
  summary_points?: string[];
  allow_partial?: boolean;
  completeness_percentage?: number;
  session_id?: number;
  pattern?: CRSPattern;
}

export interface UpdateCRSStatusRequestDTO {
  status: CRSStatus;
  rejection_reason?: string;
}

export interface UpdateCRSStatusResponseDTO {
  id: number;
  status: CRSStatus;
  rejection_reason?: string | null;
  updated_at: string;
}

export interface CRSAuditLogDTO {
  id: number;
  crs_id: number;
  action: string;
  changed_by: number;
  changed_at: string;
  old_status?: string;
  new_status?: string;
  old_content?: string;
  new_content?: string;
  summary?: string | null;
}

export type CRSStatus = 
  | "draft" 
  | "under_review" 
  | "approved" 
  | "rejected";
