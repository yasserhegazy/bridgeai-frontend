"use client";

import React, { useState, useEffect } from "react";
import { Send, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getComments, createComment, CommentOut } from "@/lib/api-comments";

import { cn } from "@/lib/utils";

interface CommentsSectionProps {
    crsId: number;
    className?: string;
    onCommentAdded?: () => void;
}

export function CommentsSection({ crsId, className, onCommentAdded }: CommentsSectionProps) {
    const [comments, setComments] = useState<CommentOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState("");

    const fetchComments = async () => {
        if (!crsId) return;

        try {
            setError(null);
            const data = await getComments(crsId);
            // Data is sorted by created_at desc (newest first) from API
            setComments(data);
        } catch (err: any) {
            console.error("Error fetching comments:", err);
            setError(err?.message || "Failed to load comments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [crsId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const created = await createComment({ crs_id: crsId, content: newComment });
            setComments((prev) => [created, ...prev]);
            setNewComment("");
            if (onCommentAdded) onCommentAdded();
        } catch (err: any) {
            console.error("Error creating comment:", err);
            setError(err?.message || "Failed to post comment.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
        });
    };

    if (!crsId) {
        return null;
    }

    return (
        <div className={cn("flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-800">
                    <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-sm">Review Comments</h3>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                    {comments.length}
                </span>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50/30 scrollbar-thin scrollbar-thumb-gray-200">
                {loading ? (
                    <div className="flex justify-center items-center h-full py-8 text-gray-400">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span className="text-sm">Loading discussion...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center p-4 text-red-500 gap-2 bg-red-50 rounded-lg border border-red-100 m-4">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 opacity-30 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium">No comments yet</p>
                        <p className="text-xs text-gray-400 text-center max-w-[200px]">Start the discussion by adding a comment below.</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Avatar */}
                            <div className="flex-shrink-0 pt-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                                    <span className="text-xs font-bold uppercase">{comment.author_name.charAt(0)}</span>
                                </div>
                            </div>
                            {/* Content Bubble */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-gray-900 truncate">{comment.author_name}</span>
                                    <span className="text-[10px] text-gray-400 font-medium">{formatDate(comment.created_at)}</span>
                                </div>
                                <div className="p-3.5 bg-white rounded-2xl rounded-tl-none border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-sm text-gray-700 leading-relaxed break-words group-hover:border-blue-100 group-hover:shadow-blue-50/50 transition-all">
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSubmit} className="relative">
                    <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] w-full text-sm resize-none pr-4 pb-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all rounded-xl"
                        disabled={submitting}
                    />
                    <div className="absolute bottom-3 right-3">
                        <Button
                            type="submit"
                            size="sm"
                            className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all rounded-lg text-xs font-medium"
                            disabled={submitting || !newComment.trim()}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                    Posting
                                </>
                            ) : (
                                <>
                                    <Send className="w-3 h-3 mr-1.5" />
                                    Post
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
