/**
 * API utilities for chat-related operations
 */
import { apiCall } from "./api";

export type SessionStatus = "active" | "completed";

export interface ChatMessage {
  id: number;
  session_id: number;
  sender_id: number | null;
  sender_type: "client" | "ai" | "ba";
  content: string;
  timestamp: string;
}

export interface ChatSummary {
  id: number;
  project_id: number;
  user_id: number;
  name: string;
  status: SessionStatus;
  started_at: string;
  ended_at: string | null;
  message_count: number;
}

export interface ChatDetail {
  id: number;
  project_id: number;
  user_id: number;
  name: string;
  status: SessionStatus;
  started_at: string;
  ended_at: string | null;
  messages: ChatMessage[];
  message_count?: number;
}

/**
 * Fetch chats for a given project.
 */
export async function fetchProjectChats(projectId: number): Promise<ChatSummary[]> {
  return apiCall<ChatSummary[]>(`/api/projects/${projectId}/chats`);
}

/**
 * Fetch a single chat detail (project-scoped).
 */
export async function fetchProjectChat(projectId: number, chatId: number): Promise<ChatDetail | null> {
  return apiCall<ChatDetail>(`/api/projects/${projectId}/chats/${chatId}`);
}

/**
 * Create a chat session for a project.
 */
export async function createProjectChat(projectId: number, payload: { name: string }): Promise<ChatDetail> {
  return apiCall<ChatDetail>(`/api/projects/${projectId}/chats`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update a chat session (status or name).
 */
export async function updateProjectChat(
  projectId: number,
  chatId: number,
  payload: { name?: string; status?: SessionStatus }
): Promise<ChatDetail> {
  return apiCall<ChatDetail>(`/api/projects/${projectId}/chats/${chatId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a chat session.
 */
export async function deleteProjectChat(projectId: number, chatId: number): Promise<void> {
  await apiCall(`/api/projects/${projectId}/chats/${chatId}`, {
    method: "DELETE",
  });
}
