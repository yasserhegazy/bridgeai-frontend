"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectDTO } from "@/dto/projects.dto";
import { X, FileText, Clock, User, Shield, Calendar, Info } from "lucide-react";
import { cn, parseUTCDate } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface ProjectDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDTO | null;
}

export function ProjectDetailsDialog({
  isOpen,
  onClose,
  project,
}: ProjectDetailsDialogProps) {
  if (!project) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                {project.name}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-gray-400">
                Project request #PR-{project.id}
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200 h-7 px-3 text-[10px] font-black uppercase tracking-widest"
            >
              Pending Validation
            </Badge>
          </div>
        </DialogHeader>

        <div className="px-8 py-6 space-y-8 bg-gray-50/30 overflow-y-auto max-h-[70vh]">
          {/* Main Info Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              Project Premise
            </h3>
            <p className="text-gray-700 leading-relaxed font-medium">
              {project.description || "No detailed description provided by the client."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Creator Card */}
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-primary/5 text-primary">
                  <User className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Requester</p>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {project.created_by_name || `User #${project.created_by}`}
              </p>
              {project.created_by_email && (
                <p className="text-xs text-gray-400 mt-0.5">{project.created_by_email}</p>
              )}
            </div>

            {/* Team/Scope Card */}
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Shield className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployment Scope</p>
              </div>
              <p className="text-sm font-bold text-gray-900">Team Workspace #{project.team_id}</p>
              <p className="text-xs text-gray-400 mt-0.5 italic">Internal organizational unit</p>
            </div>

            {/* Timeline Cards */}
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submission Date</p>
              </div>
              <p className="text-sm font-bold text-gray-900">{formatDate(project.created_at)}</p>
            </div>

            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-gray-50 text-gray-600">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Activity</p>
              </div>
              <p className="text-sm font-bold text-gray-900">{formatDistanceToNow(parseUTCDate(project.updated_at), { addSuffix: true })}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl font-bold text-xs h-10 px-8 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Close manifest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
