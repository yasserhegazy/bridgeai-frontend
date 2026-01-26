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
                return <FileText className="w-5 h-5 text-blue-500" />;
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
                <Button variant="outline" size="sm" className="gap-2">
                    <History className="w-4 h-4" />
                    History
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Audit Trail & Version History
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 mt-4">
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
                        <div className="space-y-6 pl-2">
                            {logs.map((log, idx) => (
                                <div key={log.id} className="relative flex gap-4">
                                    {/* Timeline Line */}
                                    {idx !== logs.length - 1 && (
                                        <div className="absolute left-[9px] top-8 -bottom-6 w-0.5 bg-gray-200" />
                                    )}

                                    {/* Icon */}
                                    <div className="relative z-10 shrink-0 bg-white p-0.5">
                                        {getActionIcon(log.action)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-gray-900">
                                                {formatActionName(log.action)}
                                            </p>
                                            <span className="text-xs text-gray-500">
                                                {log.formattedDate}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-700">
                                                User #{log.changed_by}
                                            </span> performed this action.
                                        </div>

                                        {/* Details/Metadata constructed from flat fields */}
                                        <div className="mt-2 space-y-2">
                                            {log.summary && (
                                                <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-600 border border-gray-100 italic">
                                                    {log.summary}
                                                </div>
                                            )}

                                            {/* Only show content change notice if there is one, but don't dump the whole content */}
                                            {(log.new_content && log.new_content !== log.old_content) && (
                                                <div className="bg-gray-50 rounded-md p-2 text-xs text-gray-600 border border-gray-100">
                                                    <span className="font-semibold text-gray-700">Content updated</span>
                                                </div>
                                            )}
                                        </div>
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
