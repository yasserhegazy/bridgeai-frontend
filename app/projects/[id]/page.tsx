"use client";

import { use, useState, useEffect } from "react";
import { ProjectPageGrid } from "@/components/projects/ProjectPageGrid";
import { apiCall, getCurrentUser } from "@/lib/api";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  team_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "ba" | "client";
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // Unwrap the params promise
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [userRole, setUserRole] = useState<"BA" | "Client">("Client");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch project and user data in parallel
        const [projectData, userData] = await Promise.all([
          apiCall<Project>(`/api/projects/${id}`),
          getCurrentUser<User>()
        ]);
        
        setProject(projectData);
        setUserRole(userData.role === "ba" ? "BA" : "Client");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
        console.error("Error fetching project:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">{error || "Project not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-14 px-6 sm:px-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all aspects of this project.
            </p>
          </div>
        </div>

        <main className="flex-1 mt-4 overflow-auto">
          <ProjectPageGrid 
            projectId={project.id}
            projectName={project.name} 
            projectDescription={project.description || ""}
            userRole={userRole} 
          />
        </main>
      </div>
    </div>
  );
}