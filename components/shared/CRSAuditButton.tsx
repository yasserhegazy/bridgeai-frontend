"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { History, Loader2, FileText, CheckCircle, XCircle, Edit } from "lucide-react";
import { useCRSAuditLogs } from "@/hooks/crs/useCRSAuditLogs";

interface CRSAuditButtonProps {
    crsId: number;
}

export function CRSAuditButton({ crsId }: CRSAuditButtonProps) {
    const [open, setOpen] = useState(false);
    const { logs, isLoading, error, refresh } = useCRSAuditLogs(crsId, open);

    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case "approved":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "rejected":
                return <XCircle className="w-5 h-5 text-red-500" />;
            case "created":
                return <FileText className="w-5 h-5 text-primary" />;
            case "updated":
            case "version_update":
                return <Edit className="w-5 h-5 text-orange-500" />;
            default:
                return <History className="w-5 h-5 text-gray-500" />;
        }
    };

    const formatActionName = (action: string) => {
        return action.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const handleRetry = useCallback(() => {
        refresh();
    }, [refresh]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-10 px-6 gap-2.5 rounded-xl font-bold text-xs transition-all active:scale-95"
                >
                    <History className="w-3.5 h-3.5" />
                    History
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl">
                <DialogHeader className="px-8 py-5 border-b border-gray-100 shrink-0 bg-white">
                    <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-gray-900 tracking-tight">
                        <History className="w-5 h-5 text-primary" />
                        Audit Trail & History
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50/30">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <p>Loading history...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
                            {error}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRetry}
                                className="mt-2 text-red-800 border-red-300 hover:bg-red-100 block mx-auto"
                            >
                                Retry
                            </Button>
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No history found for this document.
                        </div>
                    ) : (
                        <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-gray-100">
                            {logs.map((log) => (
                                <div key={log.id} className="relative flex gap-5 group">
                                    {/* Icon Container */}
                                    <div className="relative z-10 shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                                            {getActionIcon(log.action)}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="font-bold text-gray-900 tracking-tight">
                                                {formatActionName(log.action)}
                                            </p>
                                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                {log.formattedDate}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                            <span className="font-bold text-gray-900">User #{log.changed_by}</span> performed this action.
                                        </p>

                                        {/* Activity Details */}
                                        {(log.summary || (log.new_content && log.new_content !== log.old_content)) && (
                                            <div className="space-y-2">
                                                {log.summary && (
                                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-xs text-gray-600 border border-gray-100 italic shadow-xs">
                                                        {log.summary}
                                                    </div>
                                                )}

                                                {log.new_content && log.new_content !== log.old_content && (
                                                    <div className="bg-primary/5 rounded-xl p-3 text-xs text-primary font-bold border border-primary/10 shadow-xs flex items-center gap-2">
                                                        <FileText className="w-3 h-3" />
                                                        Content specification updated
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
