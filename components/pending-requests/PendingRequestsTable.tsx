"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, FileText, Clock, User, MessageSquare, Search } from "lucide-react";
import { ProjectDTO } from "@/dto/projects.dto";
import { RejectDialog } from "./RejectDialog";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/shared/SearchBar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PendingRequestsTableProps {
  projects: ProjectDTO[];
  onApprove: (projectId: number) => Promise<void>;
  onReject: (projectId: number, reason: string) => Promise<void>;
  onViewDetails: (project: ProjectDTO) => void;
}

export function PendingRequestsTable({
  projects,
  onApprove,
  onReject,
  onViewDetails,
}: PendingRequestsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingApprove, setLoadingApprove] = useState<number | null>(null);
  const [rejectingProjectId, setRejectingProjectId] = useState<number | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(searchStr) ||
        (p.description?.toLowerCase().includes(searchStr)) ||
        (p.created_by_name?.toLowerCase().includes(searchStr))
      );
    });
  }, [projects, searchTerm]);

  const handleApprove = async (projectId: number) => {
    setLoadingApprove(projectId);
    try {
      await onApprove(projectId);
    } finally {
      setLoadingApprove(null);
    }
  };

  const handleRejectSubmit = async (reason: string) => {
    if (rejectingProjectId) {
      await onReject(rejectingProjectId, reason);
      setRejectingProjectId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center">
        <div className="mb-6 inline-flex p-6 rounded-full bg-gray-50 text-gray-400">
          <FileText className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No pending requests</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          All client project requests have been reviewed and validated.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Search Area */}
        <div className="w-full md:max-w-xl mb-8">
          <SearchBar
            placeholder="Search by project name or creator..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        {/* Requests List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center">
            <p className="text-muted-foreground">No matches found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-12">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-2xl py-5 px-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover-lift overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
                  {/* Column 1: Project Identity (4/12) */}
                  <div className="lg:col-span-4 flex items-center gap-5">
                    <div className="p-3.5 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-gray-900 truncate">
                          {project.name}
                        </h4>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] font-bold uppercase tracking-wider h-5 px-2">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Details Column (5/12) */}
                  <div className="lg:col-span-5 flex flex-col gap-2 lg:border-l lg:border-gray-100 lg:pl-8 text-left">
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 font-bold w-16 shrink-0">Description:</span>
                        <span className="text-gray-600 line-clamp-1 italic">
                          {project.description || "No description provided"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-bold w-16 shrink-0">Requested by:</span>
                        <div className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-primary/60" />
                          <span className="text-gray-900 font-bold">
                            {project.created_by_name || `User #${project.created_by}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-bold w-16 shrink-0">Team ID:</span>
                        <span className="text-gray-600 font-semibold truncate">
                          #{project.team_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Actions (3/12) */}
                  <div className="lg:col-span-3 flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => onViewDetails(project)}
                      className="h-10 w-10 p-0 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setRejectingProjectId(project.id)}
                        className="h-10 px-4 rounded-xl font-bold text-xs gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(project.id)}
                        disabled={loadingApprove === project.id}
                        className="h-10 px-6 rounded-xl font-bold text-xs gap-2 bg-[#341bab] hover:bg-[#2a1589] text-white shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        {loadingApprove === project.id ? (
                          <Clock className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RejectDialog
        isOpen={rejectingProjectId !== null}
        onClose={() => setRejectingProjectId(null)}
        onSubmit={handleRejectSubmit}
        projectName={
          projects.find((p) => p.id === rejectingProjectId)?.name || ""
        }
      />
    </>
  );
}
