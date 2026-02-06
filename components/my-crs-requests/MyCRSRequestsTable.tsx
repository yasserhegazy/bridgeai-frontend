"use client";

import { CRSDTO, CRSStatus } from "@/dto/crs.dto";
import { ProjectDTO } from "@/dto/projects.dto";
import { TeamDTO } from "@/dto/teams.dto";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { Eye, AlertCircle, FileText, Clock, Filter, ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { formatDistanceToNow } from "date-fns";
import { parseUTCDate } from "@/lib/utils";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MyCRSRequestsTableProps {
  documents: CRSDTO[];
  projects: ProjectDTO[];
  teams?: Array<{ id: number; name: string }>;
  onViewDetails: (crs: CRSDTO) => void;
  statusFilter: CRSStatus | "all";
  onFilterChange: (status: CRSStatus | "all") => void;
  selectedTeam: number | "all";
  onTeamChange: (teamId: number | "all") => void;
  selectedProject: number | "all";
  onProjectChange: (projectId: number | "all") => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentTeamId?: number;
}

export function MyCRSRequestsTable({
  documents,
  projects,
  teams,
  onViewDetails,
  statusFilter,
  onFilterChange,
  selectedTeam,
  onTeamChange,
  selectedProject,
  onProjectChange,
  searchTerm,
  onSearchChange,
  currentTeamId,
}: MyCRSRequestsTableProps) {
  const statusOptions: Array<{ value: CRSStatus | "all"; label: string }> = [
    { value: "all", label: "All status" },
    { value: "under_review", label: "Under review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const getProjectName = (projectId: number, crs?: CRSDTO): string => {
    const project = projects?.find((p) => Number(p.id) === Number(projectId));
    if (project) return project.name;
    if (crs?.project_name) return crs.project_name;
    return `Project #${projectId}`;
  };

  const getTeamName = (projectId: number): string => {
    const project = projects?.find((p) => Number(p.id) === Number(projectId));

    // 1. Try to find team from project's team_id
    if (project && teams && teams.length > 0) {
      const team = teams.find(t => Number(t.id) === Number(project.team_id));
      if (team) return team.name;
    }

    // 2. Fallback: If project is for current team ID or we are in a team context
    if (currentTeamId && teams) {
      const currentTeam = teams.find(t => Number(t.id) === Number(currentTeamId));
      if (currentTeam) return currentTeam.name;
    }

    return "Current team";
  };

  return (
    <div className="space-y-6">
      {/* Premium Search & Filters Area */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:max-w-xl">
            <SearchBar
              placeholder="Search by project name or version..."
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => onFilterChange(value as CRSStatus | "all")}
            >
              <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200 rounded-xl shadow-sm font-bold text-gray-700 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-sm font-medium">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Team Filter */}
            <Select
              value={selectedTeam.toString()}
              onValueChange={(value) => onTeamChange(value === "all" ? "all" : Number(value))}
            >
              <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200 rounded-xl shadow-sm font-bold text-gray-700 focus:ring-primary/20">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem value="all" className="text-sm font-medium">All teams</SelectItem>
                {teams?.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()} className="text-sm font-medium">
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Project Filter */}
            <Select
              value={selectedProject.toString()}
              onValueChange={(value) => onProjectChange(value === "all" ? "all" : Number(value))}
            >
              <SelectTrigger className="w-[180px] h-10 bg-white border-gray-200 rounded-xl shadow-sm font-bold text-gray-700 focus:ring-primary/20">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem value="all" className="text-sm font-medium">All projects</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()} className="text-sm font-medium">
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {documents.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center">
          <div className="mb-6 inline-flex p-6 rounded-full bg-gray-50 text-gray-400">
            <FileText className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-12">
          {documents.map((crs) => (
            <div
              key={crs.id}
              className="bg-white border border-gray-200 rounded-2xl py-4 px-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover-lift overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
                {/* Column 1: Document Identity (4/12) */}
                <div className="lg:col-span-4 flex items-center gap-5">
                  <div className="p-3.5 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-gray-900 truncate">
                        Spec v{crs.version}.0
                      </h4>
                      <CRSStatusBadge status={crs.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDistanceToNow(parseUTCDate(crs.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Details Column (5/12) */}
                <div className="lg:col-span-5 flex flex-col gap-2 lg:border-l lg:border-gray-100 lg:pl-8">

                  <div className="grid grid-cols-1 gap-2">
                    {/* Team Link */}
                    <Link
                      href={`/teams/${currentTeamId || "all"}/dashboard`}
                      className="flex items-center gap-2 text-xs group/link"
                    >
                      <span className="text-gray-400 font-bold w-12 shrink-0">Team:</span>
                      <span className="text-gray-600 font-semibold group-hover/link:text-primary transition-colors truncate">
                        {getTeamName(crs.project_id)}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-300 group-hover/link:text-primary transition-colors opacity-0 group-hover/link:opacity-100" />
                    </Link>

                    {/* Project Link */}
                    <Link
                      href={`/projects/${crs.project_id}`}
                      className="flex items-center gap-2 text-xs group/link"
                    >
                      <span className="text-gray-400 font-bold w-12 shrink-0">Project:</span>
                      <span className="text-gray-600 font-semibold group-hover/link:text-primary transition-colors truncate">
                        {getProjectName(crs.project_id, crs)}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-300 group-hover/link:text-primary transition-colors opacity-0 group-hover/link:opacity-100" />
                    </Link>

                    {/* Chat Link */}
                    {crs.chat_session_id ? (
                      <Link
                        href={`/chats/${crs.chat_session_id}?projectId=${crs.project_id}`}
                        className="flex items-center gap-2 text-xs group/link"
                      >
                        <span className="text-gray-400 font-bold w-12 shrink-0">Chat:</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <MessageSquare className="w-3 h-3 text-primary" />
                          <span className="text-primary font-bold group-hover/link:underline transition-all">
                            View source session
                          </span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-primary/40 group-hover/link:text-primary transition-colors" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="font-bold w-12 shrink-0">Chat:</span>
                        <span>Generated from direct upload</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 3: Actions (3/12) */}
                <div className="lg:col-span-3 flex justify-end">
                  <Button
                    onClick={() => onViewDetails(crs)}
                    variant="primary"
                    size="default"
                    className="w-full lg:w-auto px-5 h-9 gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-[1.05] active:scale-95 font-bold text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View detail</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
