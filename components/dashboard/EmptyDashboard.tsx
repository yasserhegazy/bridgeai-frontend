/**
 * EmptyDashboard Component
 * Displays onboarding flow when team has no projects
 * Single Responsibility: Empty state with onboarding UI
 */

"use client";

import { memo } from "react";
import { FolderPlus, Users, MessageSquare, FileText } from "lucide-react";

interface EmptyDashboardProps {
  onCreateProject: () => void;
}

export const EmptyDashboard = memo(function EmptyDashboard({
  onCreateProject,
}: EmptyDashboardProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-12 text-center shadow-lg">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
          <FolderPlus className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Team Dashboard!
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Get started by creating your first project. Projects help you organize
          your work, collaborate with team members, and manage requirements.
        </p>

        {/* CTA Button */}
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <FolderPlus className="w-6 h-6" />
          <span>Create Your First Project</span>
        </button>

        {/* How It Works */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <FolderPlus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              1. Create a Project
            </h3>
            <p className="text-sm text-gray-600">
              Start by creating a project for your team's work. Give it a name
              and description.
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
              Use AI-powered chats to gather requirements and clarify project
              details.
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
              Generate comprehensive requirement specifications automatically
              from your chats.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
});
