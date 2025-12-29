import { apiCall } from "./api";

export interface CommentCreate {
    crs_id: number;
    content: string;
}

export interface CommentOut {
    id: number;
    crs_id: number;
    author_id: number;
    author_name: string;
    content: string;
    created_at: string;
}

/**
 * Create a new comment on a CRS document.
 */
export async function createComment(payload: CommentCreate): Promise<CommentOut> {
    return apiCall<CommentOut>("/api/comments", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * Get all comments for a CRS document.
 */
export async function getComments(crsId: number): Promise<CommentOut[]> {
    return apiCall<CommentOut[]>(`/api/comments/?crs_id=${crsId}`);
}
