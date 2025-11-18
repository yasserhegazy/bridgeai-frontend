"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { InviteMemberModal } from "@/components/teams/InviteMemberModal";
import { Clock, File, MessageCircle, Plus, Users } from "lucide-react";
import { apiCall } from "@/lib/api";

interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

interface ProjectStats {
  total: number;
  pending: number;
  approved: number;
  active: number;
  completed: number;
  rejected: number;
  archived: number;
}

export function DashboardGrid() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [isAddProjectOpen, setAddProjectOpen] = useState(false);
  const [isStartChatOpen, setStartChatOpen] = useState(false);
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    total: 0,
    pending: 0,
    approved: 0,
    active: 0,
    completed: 0,
    rejected: 0,
    archived: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjectStats = async () => {
    try {
      setIsLoading(true);
      const data = await apiCall<Project[]>(`/api/teams/${teamId}/projects`);
      
      // Calculate statistics
      const stats: ProjectStats = {
        total: data.length,
        pending: data.filter(p => p.status === "pending").length,
        approved: data.filter(p => p.status === "approved").length,
        active: data.filter(p => p.status === "active").length,
        completed: data.filter(p => p.status === "completed").length,
        rejected: data.filter(p => p.status === "rejected").length,
        archived: data.filter(p => p.status === "archived").length,
      };
      
      setProjectStats(stats);
      
      // Get recent projects (last 3)
      const recent = data
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);
      setRecentProjects(recent);
    } catch (error) {
      console.error("Error fetching project stats:", error);
      // Set empty state on error
      setRecentProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchProjectStats();
    }
  }, [teamId]);

  const handleProjectCreated = () => {
    // Refresh dashboard data
    fetchProjectStats();
  };

  const handleProjectsClick = () => {
    router.push(`/teams/${teamId}/projects`);
  };

  return (
    <div className="flex mb-14 flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      {/* Row 1: Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          title="Projects"
          value={projectStats.total}
          statusCounts={{ 
            Pending: projectStats.pending,
            Approved: projectStats.approved,
            Active: projectStats.active,
            Completed: projectStats.completed,
          }}
          icon={<File />}
          onClick={handleProjectsClick}
          isLoading={isLoading}
        />
        <StatCard
          title="Chats"
          value={18}
          statusCounts={{ Active: 10, Completed: 5, Pending: 3 }}
          icon={<MessageCircle />}
        />
        <StatCard
          title="Requests"
          value={7}
          statusCounts={{ Active: 3, Completed: 3, Pending: 1 }}
          icon={<Clock />}
        />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          {/* Recent Projects */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
            {isLoading ? (
              <p className="text-sm text-gray-500">Loading projects...</p>
            ) : recentProjects.length === 0 ? (
              <p className="text-sm text-gray-500">No projects yet</p>
            ) : (
              <ul className="space-y-3">
                {recentProjects.map((p) => (
                  <li key={p.id} className="flex justify-between items-center">
                    <p className="font-medium">{p.name}</p>
                    <StatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Chats */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <p>Ahmed Hassan</p>
                <StatusBadge status="active" />
              </li>
              <li className="flex justify-between items-center">
                <p>Sarah Johnson</p>
                <StatusBadge status="pending" />
              </li>
            </ul>
          </section>
        </div>

        {/* Quick Actions */}
        <div className="col-span-1 flex flex-col gap-6">
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setAddProjectOpen(true)}
              >
                <Plus className="w-4 h-4" /> Add Project
              </Button>

              <Button
                variant="primary"
                size="lg"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setStartChatOpen(true)}
              >
                <MessageCircle className="w-4 h-4" /> Start Chat
              </Button>

              <InviteMemberModal 
                teamId={teamId} 
                onInviteSent={handleProjectCreated}
                triggerLabel="Add Team Member"
                triggerSize="lg"
                triggerVariant="primary"
                triggerClassName="w-full"
              />
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      {/* Create Project Modal */}
      <CreateProjectModal
        open={isAddProjectOpen}
        onOpenChange={setAddProjectOpen}
        teamId={teamId}
        onProjectCreated={handleProjectCreated}
      />

      {isStartChatOpen && (
        <Modal onClose={() => setStartChatOpen(false)} title="Start Chat">
          <select className="w-full p-2 border rounded mb-2">
            {recentProjects.length === 0 ? (
              <option>No projects available</option>
            ) : (
              recentProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
          <input
            type="text"
            placeholder="Chat Name"
            className="w-full p-2 border rounded mb-2"
          />
          <Button 
            className="cursor-pointer"
            onClick={() => setStartChatOpen(false)}
          >
            Start
          </Button>
        </Modal>
      )}
    </div>
  );
}

// Generic Modal Component
function Modal({
  onClose,
  title,
  children,
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3">{children}</div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  statusCounts?: { [key: string]: number };
  icon?: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  statusCounts,
  icon,
  onClick,
  isLoading = false,
}: StatCardProps) {
  const statusColors: { [key: string]: string } = {
    Active: "bg-green-200 text-black",
    Approved: "bg-green-200 text-black",
    Completed: "bg-blue-200 text-black",
    Pending: "bg-yellow-200 text-black",
    Cancelled: "bg-red-200 text-black",
    Rejected: "bg-red-200 text-black",
  };

  const cardBgColors: { [key: string]: string } = {
    Projects: "bg-[#eceded]",
    Chats: "bg-[#eceded]",
    Requests: "bg-[#eceded]",
  };

  return (
    <div
      className={`relative p-5 rounded-2xl ${cardBgColors[title] || "bg-gray-200"} ${
        onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full py-8">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl text-black">{icon}</div>
              <h3 className="text-lg font-semibold text-black">{title}</h3>
            </div>
            <div className="text-3xl font-bold text-black">{value}</div>
          </div>

          {statusCounts && (
            <div className="flex flex-col gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div
                  key={status}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-black">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full font-semibold text-xs ${
                      statusColors[status] || "bg-gray-300 text-black"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
