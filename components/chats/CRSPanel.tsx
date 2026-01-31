"use client";

import { CRSDTO } from "@/dto";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { ArrowLeft, WifiOff, Loader2, MoreVertical, Eye, Sparkles, FileText, CheckCircle2, Download, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConnectionState, ChatSessionDTO, CurrentUserDTO } from "@/dto";
import { ExportButton } from "@/components/shared/ExportButton";
import { PreviewCRSButton } from "@/components/chats/PreviewCRSButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CRSPanelProps {
    latestCRS: CRSDTO | null;
    crsLoading: boolean;
    crsError: string | null;
    isGenerating?: boolean;
    chat?: ChatSessionDTO;
    onGenerateCRS?: () => void;
    onViewCRS?: () => void;
    canGenerateCRS?: boolean;
    isRejected?: boolean;
    isApproved?: boolean;
    chatTranscript?: string;
    crsId?: number;
}

export function CRSPanel({ latestCRS, crsLoading, crsError, isGenerating, chat, onGenerateCRS, onViewCRS, canGenerateCRS, isRejected, isApproved, chatTranscript, crsId }: CRSPanelProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
                        <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">Project Specification</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
                            <p className="text-[10px] text-gray-500 font-bold tracking-tight">Live document</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {latestCRS && (
                        <Button
                            onClick={onViewCRS}
                            variant="ghost"
                            size="sm"
                            className="h-9 gap-2 rounded-xl px-4 text-gray-600 hover:text-primary hover:bg-primary/5 font-bold text-[10px] tracking-tight transition-all"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            View full spec
                        </Button>
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
                            <span className="text-[10px] font-bold tracking-tight">AI drafting...</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Document Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30 p-0 scroll-smooth t-custom-scrollbar">
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
                            ) : latestCRS ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="prose prose-slate prose-sm md:prose-base max-w-none"
                                >
                                    {/* Document Internal Header */}
                                    <div className="mb-16 relative">
                                        <div className="absolute -left-16 top-0 bottom-0 w-1 bg-primary/10 rounded-full hidden lg:block" />

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-bold tracking-tight rounded-md border border-primary/10">
                                                    Official specification
                                                </div>
                                                <div className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold tracking-tight rounded-md border border-green-100">
                                                    {latestCRS.status}
                                                </div>
                                            </div>

                                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter !mt-2 !mb-6 leading-[0.95]">
                                                {latestCRS.content?.project_details?.name || "Software Requirements"}
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

                                        {canGenerateCRS && (
                                            <Button
                                                onClick={onGenerateCRS}
                                                className="bg-primary text-white hover:bg-primary-dark rounded-2xl px-10 py-7 font-black text-sm tracking-tight shadow-xl shadow-primary/20 group transition-all"
                                            >
                                                <Sparkles className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                                                Generate first draft
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
