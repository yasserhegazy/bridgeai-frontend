import { useState, useMemo, useEffect, useRef } from "react";
import { CRSDTO } from "@/dto";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { CRSContentEditor } from "@/components/shared/CRSContentEditor";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { updateCRSContent } from "@/services/crs.service";
import { CRSError } from "@/services/errors.service";
import {
    ArrowLeft, WifiOff, Loader2, MoreVertical, Eye, Sparkles,
    FileText, CheckCircle2, Download, AlertCircle, Edit, MessageSquare, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConnectionState, ChatSessionDTO, CurrentUserDTO } from "@/dto";
import { ExportButton } from "@/components/shared/ExportButton";
import { toast } from "sonner";

interface CRSPanelProps {
    latestCRS: CRSDTO | null;
    crsLoading: boolean;
    crsError: string | null;
    isGenerating?: boolean;
    chat?: ChatSessionDTO;
    onGenerateCRS?: () => void;
    onViewCRS?: () => void;
    onSubmitForReview?: () => Promise<void>;
    onRegenerate?: () => void;
    onStatusUpdate?: () => void;
    canGenerateCRS?: boolean;
    isRejected?: boolean;
    isApproved?: boolean;
    chatTranscript?: string;
    crsId?: number;
    recentInsights?: {
        summary_points: string[];
        quality_summary?: string;
    } | null;
    // Real-time streaming props
    streamStatus?: "idle" | "connecting" | "connected" | "error" | "closed";
    streamProgress?: number;
    streamStep?: string;
    streamError?: string | null;
    streamRetryCount?: number;
}

export function CRSPanel({
    latestCRS,
    crsLoading,
    crsError,
    isGenerating,
    chat,
    onGenerateCRS,
    onViewCRS,
    onSubmitForReview,
    onRegenerate,
    onStatusUpdate,
    recentInsights,
    canGenerateCRS,
    isRejected,
    isApproved,
    chatTranscript,
    crsId,
    streamStatus = "idle",
    streamProgress = 0,
    streamStep = "",
    streamError = null,
    streamRetryCount = 0,
}: CRSPanelProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [contentError, setContentError] = useState<string | null>(null);
    const [showInsights, setShowInsights] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const previousVersionRef = useRef<number | undefined>(latestCRS?.edit_version);

    // Detect CRS updates and show visual feedback
    useEffect(() => {
        if (latestCRS?.edit_version && previousVersionRef.current !== undefined) {
            if (latestCRS.edit_version !== previousVersionRef.current) {
                setIsUpdating(true);
                
                // Show prominent toast notification
                toast.success("📝 Document Updated!", {
                    description: `CRS version ${latestCRS.edit_version} - New information added`,
                    duration: 4000,
                });
                
                // Reset updating state after animation
                const timer = setTimeout(() => setIsUpdating(false), 3000);
                return () => clearTimeout(timer);
            }
        }
        previousVersionRef.current = latestCRS?.edit_version;
    }, [latestCRS?.edit_version]);

    const parsedContent = useMemo(() => {
        if (!latestCRS?.content) return null;
        try {
            return typeof latestCRS.content === 'string'
                ? JSON.parse(latestCRS.content)
                : latestCRS.content;
        } catch (e) {
            console.error("Failed to parse CRS content", e);
            return null;
        }
    }, [latestCRS?.content]);

    const handleSaveContent = async (newContent: string) => {
        if (!latestCRS) return;

        // Optimistic update - show immediately
        const optimisticCRS = {
            ...latestCRS,
            content: newContent,
            edit_version: (latestCRS.edit_version || 0) + 1,
        };
        const previousCRS = latestCRS;

        try {
            setContentError(null);
            // Show optimistic update temporarily
            setIsUpdating(true);
            
            await updateCRSContent(
                latestCRS.id,
                newContent,
                latestCRS.edit_version || 0
            );
            setIsEditing(false);
            if (onStatusUpdate) onStatusUpdate();
            
            toast.success("Changes saved successfully!");
        } catch (err) {
            // Revert optimistic update on error
            if (err instanceof CRSError) {
                setContentError(err.message);
                toast.error("Failed to save changes", {
                    description: err.message
                });
            } else {
                setContentError("Failed to save changes. Please try again.");
                toast.error("Failed to save changes");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const canEdit = latestCRS?.status !== "approved" && latestCRS?.status !== "under_review";

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">Project Specification</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <motion.span 
                                className="flex h-1.5 w-1.5 rounded-full bg-green-500"
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [1, 0.7, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <p className="text-[10px] text-gray-500 font-bold tracking-tight">
                                {isGenerating ? "Building..." : isUpdating ? "Updating..." : "LIVE"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Insights Toggle */}
                    {recentInsights && (
                        <Button
                            onClick={() => setShowInsights(!showInsights)}
                            variant="ghost"
                            size="sm"
                            className={`h-9 gap-2 rounded-xl px-4 font-bold text-[10px] tracking-tight transition-all ${showInsights ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "text-gray-600 hover:text-primary hover:bg-primary/5"
                                }`}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Insights {showInsights ? "ON" : "OFF"}
                        </Button>
                    )}

                    {latestCRS && !isEditing && (
                        <>
                            {canEdit && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 gap-2 rounded-xl px-4 text-gray-600 hover:text-primary hover:bg-primary/5 font-bold text-[10px] tracking-tight transition-all"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    Edit
                                </Button>
                            )}

                            <Button
                                onClick={() => setShowComments(!showComments)}
                                variant="ghost"
                                size="sm"
                                className={`h-9 gap-2 rounded-xl px-4 font-bold text-[10px] tracking-tight transition-all ${showComments ? "bg-primary/10 text-primary" : "text-gray-600 hover:text-primary hover:bg-primary/5"
                                    }`}
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Comments
                            </Button>

                            {latestCRS.status === "draft" && onSubmitForReview && (
                                <Button
                                    onClick={onSubmitForReview}
                                    variant="primary"
                                    size="sm"
                                    className="h-9 rounded-xl px-4 font-black text-[10px] tracking-tight shadow-md shadow-primary/20"
                                >
                                    Submit for Review
                                </Button>
                            )}

                            {latestCRS.status === "rejected" && onRegenerate && (
                                <Button
                                    onClick={onRegenerate}
                                    variant="primary"
                                    size="sm"
                                    className="h-9 bg-orange-600 hover:bg-orange-700 rounded-xl px-4 font-black text-[10px] tracking-tight shadow-md"
                                >
                                    Regenerate
                                </Button>
                            )}
                        </>
                    )}

                    <ExportButton
                        projectId={chat?.project_id || 0}
                        content={chatTranscript || ""}
                        filename={`specification-${chat?.id || "doc"}-${(chat?.name || "export").replace(/\s+/g, "-").toLowerCase()}`}
                        crsId={crsId}
                        variant="outline"
                        className="h-10 gap-3 rounded-xl px-5 border-gray-100 hover:bg-gray-50 text-gray-900 font-bold text-[10px] tracking-tight transition-all shadow-sm active:scale-95"
                    />

                    {isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100/50 shadow-sm transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] font-bold tracking-tight">
                                    {streamStep || "AI drafting..."}
                                </span>
                                {streamProgress > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1 bg-amber-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-amber-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${streamProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <span className="text-[8px] font-medium text-amber-600">
                                            {streamProgress}%
                                        </span>
                                    </div>
                                )}
                                {streamRetryCount > 0 && (
                                    <span className="text-[8px] text-amber-600">
                                        Retry attempt {streamRetryCount}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    )}
                    
                    {streamError && !isGenerating && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl border border-red-100/50 shadow-sm"
                        >
                            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-[10px] font-bold tracking-tight">{streamError}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Document Content and Comments area */}
            <div className="flex-1 flex overflow-hidden bg-gray-50/30 relative">
                <motion.div layout className="flex-1 overflow-y-auto scroll-smooth t-custom-scrollbar">
                    {/* Recent Insights Area */}
                    <AnimatePresence>
                        {recentInsights && recentInsights.summary_points.length > 0 && showInsights && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-200 overflow-hidden shrink-0"
                            >
                                <div className="p-8 max-w-4xl mx-auto space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <motion.div 
                                                animate={{ 
                                                    rotate: [0, 10, -10, 10, 0],
                                                    scale: [1, 1.1, 1]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
                                            >
                                                <Sparkles className="w-5 h-5 text-white" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-sm font-black text-amber-900 uppercase tracking-tight">AI Extraction Insights</h3>
                                                <p className="text-[10px] text-amber-700 font-medium">Live requirements analysis</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowInsights(false)}
                                            className="text-amber-700/50 hover:text-amber-700 transition-colors p-2 hover:bg-amber-100 rounded-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {recentInsights.quality_summary && (
                                        <motion.p 
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="text-sm text-amber-900 font-semibold leading-relaxed italic border-l-4 border-amber-400 pl-4 py-2 bg-white/50 rounded-r-lg"
                                        >
                                            "{recentInsights.quality_summary}"
                                        </motion.p>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {recentInsights.summary_points.map((point, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ x: -10, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-start gap-3 bg-white p-4 rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mt-1.5 shrink-0 shadow-sm" />
                                                <span className="text-xs text-amber-900 font-bold leading-tight flex-1">{point}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="pt-4 border-t border-amber-200 flex items-center justify-center gap-2 text-amber-800"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="text-xs font-bold">Full document below ↓</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full bg-white min-h-full last:pb-40 relative"
                    >
                        <div className="p-8 lg:p-16 w-full lg:max-w-[1400px] mx-auto transition-all">
                            <AnimatePresence mode="wait">
                                {crsLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-60 gap-8"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20" />
                                            <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-gray-900 font-black text-2xl tracking-tighter">Synchronizing</p>
                                            <p className="text-gray-500 font-medium">Updating document state from cloud...</p>
                                        </div>
                                    </motion.div>
                                ) : crsError ? (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-12 bg-red-50/30 border border-red-100 rounded-3xl flex flex-col items-center text-center gap-6 mt-20"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
                                            <AlertCircle className="w-8 h-8 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-red-900 font-black text-xl">Connection error</h3>
                                            <p className="text-red-700/60 font-medium mt-2 max-w-xs mx-auto">{crsError}</p>
                                        </div>
                                    </motion.div>
                                ) : isEditing && latestCRS ? (
                                    <motion.div
                                        key="editing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="max-w-4xl mx-auto"
                                    >
                                        {contentError && (
                                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                {contentError}
                                            </div>
                                        )}
                                        <CRSContentEditor
                                            initialContent={latestCRS.content}
                                            onSave={handleSaveContent}
                                            onCancel={() => setIsEditing(false)}
                                        />
                                    </motion.div>
                                ) : latestCRS ? (
                                    <motion.div
                                        key={`content-${latestCRS.edit_version || latestCRS.version}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="prose prose-slate prose-sm md:prose-base max-w-none relative"
                                    >
                                        {/* Live Update Indicator */}
                                        <AnimatePresence>
                                            {isUpdating && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                                    className="fixed top-24 right-8 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
                                                >
                                                    <motion.div
                                                        animate={{
                                                            rotate: 360,
                                                            scale: [1, 1.2, 1]
                                                        }}
                                                        transition={{
                                                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                                            scale: { duration: 1, repeat: Infinity }
                                                        }}
                                                    >
                                                        <Sparkles className="w-5 h-5" />
                                                    </motion.div>
                                                    <div>
                                                        <div className="font-black text-sm">Document Updated!</div>
                                                        <div className="text-xs font-medium opacity-90">v{latestCRS.edit_version}</div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Updating Highlight Effect */}
                                        {isUpdating && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 0.1, 0] }}
                                                transition={{ duration: 2, repeat: 1 }}
                                                className="absolute inset-0 bg-green-400 pointer-events-none rounded-3xl"
                                            />
                                        )}

                                        {/* Error Display */}
                                        {contentError && (
                                            <div className="mb-10 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-medium">
                                                <AlertCircle className="w-4 h-4 shrink-0" />
                                                {contentError}
                                            </div>
                                        )}

                                        {/* Document Internal Header */}
                                        <div className="mb-16 relative">
                                            <div className="absolute -left-16 top-0 bottom-0 w-1 bg-primary/10 rounded-full hidden lg:block" />

                                            {/* Update Timestamp Indicator */}
                                            {isUpdating && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex items-center gap-3"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
                                                    >
                                                        <Sparkles className="w-4 h-4 text-green-600" />
                                                    </motion.div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-bold text-green-900">Document Just Updated</div>
                                                        <div className="text-xs text-green-700 font-medium">New requirements extracted from conversation</div>
                                                    </div>
                                                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                                                        LIVE
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold tracking-tight rounded-md border border-primary/10">
                                                        Official specification
                                                    </div>
                                                    <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold tracking-tight rounded-md border border-green-100 uppercase tracking-widest">
                                                        {latestCRS.status}
                                                    </div>
                                                    <motion.div 
                                                        key={latestCRS.edit_version}
                                                        initial={{ scale: 1.2, backgroundColor: "rgb(34, 197, 94)" }}
                                                        animate={{ scale: 1, backgroundColor: "rgb(243, 244, 246)" }}
                                                        transition={{ duration: 0.5 }}
                                                        className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold tracking-tight rounded-md border border-gray-200"
                                                    >
                                                        v{latestCRS.edit_version || latestCRS.version}
                                                    </motion.div>
                                                </div>

                                                <h1 className="text-5xl font-black text-gray-900 tracking-tighter !mt-2 !mb-6 leading-[0.95]">
                                                    {parsedContent?.project_title || "Software Requirements"}
                                                </h1>

                                                <div className="flex items-center gap-6 border-t border-gray-100 pt-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 font-bold tracking-tight leading-none mb-2">Version control</span>
                                                        <span className="text-sm font-bold text-gray-700 leading-none">V{latestCRS.version}.0 early draft</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-gray-100" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 font-bold tracking-tight leading-none mb-2">Last modified</span>
                                                        <span className="text-sm font-bold text-gray-700 leading-none">
                                                            {new Date(latestCRS.updated_at || Date.now()).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <CRSContentDisplay content={latestCRS.content} />
                                        </div>

                                        {/* Bottom aesthetic padding */}
                                        <div className="h-40" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center py-60 gap-10"
                                    >
                                        <div className="w-32 h-32 rounded-[40px] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center relative group active:scale-95 transition-transform rotate-3 hover:rotate-0">
                                            <FileText className="w-16 h-16 text-gray-200 group-hover:text-primary/20 transition-colors" />
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                    rotate: [0, 5, -5, 0]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                                className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-white shadow-2xl border border-gray-100 flex items-center justify-center"
                                            >
                                                <Sparkles className="w-6 h-6 text-amber-400" />
                                            </motion.div>
                                        </div>
                                        <div className="text-center max-w-sm space-y-6">
                                            <div>
                                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Canvas Ready</h3>
                                                <p className="text-gray-500 font-medium leading-relaxed mt-2">
                                                    Your requirements will appear here as we talk. Start by describing your vision to the AI assistant.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Inline Comments Section */}
                <AnimatePresence>
                    {showComments && latestCRS && (
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-[400px] border-l border-gray-100 bg-white flex flex-col shrink-0 z-30 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-primary" />
                                    Review discussion
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowComments(false)}
                                    className="rounded-full h-8 w-8"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <CommentsSection crsId={latestCRS.id} className="h-full border-none rounded-none shadow-none" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

