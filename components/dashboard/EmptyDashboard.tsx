"use client";

import { memo } from "react";
import { FolderPlus, Users, MessageSquare, FileText, ShieldCheck, ClipboardCheck, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks";

interface EmptyDashboardProps {
  onCreateProject: () => void;
}

export const EmptyDashboard = memo(function EmptyDashboard({
  onCreateProject,
}: EmptyDashboardProps) {
  const { user } = useCurrentUser();
  const isBA = user?.role === "ba";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-3xl p-12 text-center shadow-lg">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6 shadow-xl shadow-primary/20">
          {isBA ? (
            <ShieldCheck className="w-10 h-10 text-white" />
          ) : (
            <FolderPlus className="w-10 h-10 text-white" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isBA ? "Team Management Dashboard" : "Welcome to Your Team Dashboard!"}
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {isBA
            ? "This workspace is currently empty. Initialize a project entry to start auditing requirements or monitoring client submission progress."
            : "Get started by creating your first project. Projects help you organize your work, collaborate with team members, and manage requirements."}
        </p>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={onCreateProject}
          className="inline-flex items-center gap-3 px-8 py-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer"
        >
          <FolderPlus className="w-6 h-6" />
          <span>{isBA ? "New Project Entry" : "Create Your First Project"}</span>
        </Button>

        {/* How It Works */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {isBA ? (
            <>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Project Tracking
                </h3>
                <p className="text-sm text-gray-600">
                  Monitor all active requirement cycles within this client team.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <ClipboardCheck className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Scope Audit
                </h3>
                <p className="text-sm text-gray-600">
                  Review project premises and validate if they align with organizational standards.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-purple-200 transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Specification QA
                </h3>
                <p className="text-sm text-gray-600">
                  Provide final sign-off on generated CRS documents before development hand-off.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <FolderPlus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Create a Project
                </h3>
                <p className="text-sm text-gray-600">
                  Start by creating a project for your team's work. Give it a name and description.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Start Conversations
                </h3>
                <p className="text-sm text-gray-600">
                  Use AI-powered chats to gather requirements and clarify project details.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Generate CRS
                </h3>
                <p className="text-sm text-gray-600">
                  Generate comprehensive requirement specifications automatically from your chats.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
