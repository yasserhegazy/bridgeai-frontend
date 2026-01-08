"use client";

import { useState, useEffect } from "react";
import { Plus, MessageCircle, Users, Clock, Pencil, Trash2, Loader2, FileText } from "lucide-react";
import { ChatDetail, ChatSummary, createProjectChat, deleteProjectChat, fetchProjectChats, updateProjectChat } from "@/lib/api-chats";
import { SearchBar } from "@/components/shared/SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import { apiCall } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CRSOut, fetchLatestCRS } from "@/lib/api-crs";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CRSAuditButton } from "@/components/shared/CRSAuditButton";


interface ProjectPageGridProps {
  projectId: number;
  projectName: string;
  projectDescription?: string;
  userRole: "BA" | "Client";
}


// Mock data
const mockChats = [
  { id: "1", name: "Client Meeting", lastMessage: "Reviewed designs", date: "2025-09-16" },
  { id: "2", name: "Dev Discussion", lastMessage: "Merged feature branch", date: "2025-09-15" },
  { id: "3", name: "Team Standup", lastMessage: "Blocked tasks discussed", date: "2025-09-14" },
];

const mockRequests = [
  { id: "1", title: "Request 1", status: "Pending", date: "2025-09-16" },
  { id: "2", title: "Request 2", status: "Completed", date: "2025-09-15" },
];

const mockDocuments = [
  { id: "1", title: "Project Specification v2.1", date: "2025-09-14" },
  { id: "2", title: "Client Proposal", date: "2025-09-13" },
  { id: "3", title: "Meeting Notes", date: "2025-09-12" },
];

// StatusBadge component
function StatusBadge({ status }: { status: string }) {
  const colors: { [key: string]: string } = {
    Active: "bg-green-200 text-green-800",
    Completed: "bg-blue-200 text-blue-800",
    Pending: "bg-yellow-200 text-yellow-800",
    Cancelled: "bg-red-200 text-red-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-200 text-gray-800"}`}>
      {status}
    </span>
  );
}

// Button component
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function Button({ children, variant = "default", size = "md", className = "", onClick, disabled = false }: ButtonProps) {
  const variants: Record<ButtonProps["variant"] & string, string> = {
    primary: "bg-[#341bab] text-white hover:bg-[#2a1589] disabled:bg-gray-400 disabled:cursor-not-allowed",
    default: "bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed",
  };

  const sizes: Record<ButtonProps["size"] & string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function ProjectPageGrid({ projectId, projectName, projectDescription = "", userRole, initialTab }: ProjectPageGridProps & { initialTab?: "dashboard" | "chats" | "settings" }) {
  const searchParams = useSearchParams?.();
  const [activeTab, setActiveTab] = useState<"dashboard" | "chats" | "settings">(
    initialTab || (searchParams?.get("tab") as "dashboard" | "chats" | "settings") || "dashboard"
  );
  const [createChatTrigger, setCreateChatTrigger] = useState<number>(0);

  const handleStartChat = () => {
    setActiveTab("chats");
    setCreateChatTrigger(Date.now());
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["dashboard", "chats", "settings"] as const)
          .filter((tab) => tab !== "chats" || userRole === "Client")
          .map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-semibold ${activeTab === tab
                ? "border-b-2 border-[#341bab] text-black"
                : "text-gray-500 hover:text-black hover:cursor-pointer"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "dashboard" ? "Dashboard" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && <DashboardTab userRole={userRole} onStartChat={handleStartChat} projectId={projectId} />}
      {activeTab === "chats" && userRole === "Client" && <ChatsTab projectId={projectId} createChatTrigger={createChatTrigger} />}
      {activeTab === "settings" && (
        <SettingsTab
          projectId={projectId}
          projectName={projectName}
          projectDescription={projectDescription}
        />
      )}
    </div>
  );
}

// Dashboard Tab Content
function DashboardTab({ userRole, onStartChat, projectId }: { userRole: "BA" | "Client"; onStartChat: () => void; projectId: number }) {
  const [latestCRS, setLatestCRS] = useState<CRSOut | null>(null);
  const [crsLoading, setCrsLoading] = useState(false);
  const [crsError, setCrsError] = useState<string | null>(null);

  useEffect(() => {
    const loadCRS = async () => {
      try {
        setCrsLoading(true);
        setCrsError(null);
        const crs = await fetchLatestCRS(projectId);
        setLatestCRS(crs);
      } catch (err) {
        // It's ok if there's no CRS yet
        setCrsError(err instanceof Error ? err.message : "No CRS available");
      } finally {
        setCrsLoading(false);
      }
    };

    loadCRS();
  }, [projectId]);

  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      {/* Top Row: Two Stat Cards + Quick Actions */}
      <div className="grid grid-cols-3 gap-6">
        {userRole === "Client" && (
          <StatCard
            title="Chats"
            value={mockChats.length}
            statusCounts={{ Active: 1, Completed: 1, Pending: 0 }}
            icon={<MessageCircle />}
          />
        )}
        {userRole === "BA" && (
          <StatCard
            title="Requests"
            value={mockRequests.length}
            statusCounts={{ Active: 1, Completed: 1, Pending: 0 }}
            icon={<Clock />}
          />
        )}
        <StatCard
          title="Documents"
          value={mockDocuments.length}
          statusCounts={{ Active: 1, Completed: 1, Pending: 0 }}
          icon={<Clock />}
        />

        {/* Quick Actions */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Project
          </Button>
          {userRole === "Client" && (
            <Button variant="primary" size="lg" className="flex items-center gap-2" onClick={onStartChat}>
              <MessageCircle className="w-4 h-4" /> Start Chat
            </Button>
          )}
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Add Team Member
          </Button>
        </section>
      </div>

      {/* Bottom: Recent Chats & Documents */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="flex flex-col gap-6">
          {/* Recent Chats / Requests */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              {userRole === "Client" ? "Recent Chats" : "Recent Requests"}
            </h2>
            <ul className="space-y-3">
              {(userRole === "Client" ? mockChats : mockRequests).map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <p className="text-black font-medium">{'name' in item ? item.name : item.title}</p>
                  {'status' in item && <StatusBadge status={item.status} />}
                </li>
              ))}
            </ul>
          </section>

          {/* Recent Documents */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
            <ul className="space-y-3">
              {mockDocuments.map((doc) => (
                <li key={doc.id} className="text-black">{doc.title}</li>
              ))}
            </ul>
          </section>

          {/* CRS Status Section */}
          <section className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#341bab]" />
              <h2 className="text-lg font-semibold">CRS Document</h2>
            </div>
            {crsLoading ? (
              <p className="text-sm text-gray-500">Loading CRS status...</p>
            ) : crsError || !latestCRS ? (
              <p className="text-sm text-gray-500">No CRS document available yet</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Version {latestCRS.version}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(latestCRS.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CRSStatusBadge status={latestCRS.status} />
                    <CRSExportButton crsId={latestCRS.id} version={latestCRS.version} />
                    <CRSAuditButton crsId={latestCRS.id} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// Chats Tab Content
function ChatsTab({ projectId, createChatTrigger }: { projectId: number; createChatTrigger?: number }) {
  const [items, setItems] = useState<ChatSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [chatName, setChatName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "rename">("create");
  const [selectedChat, setSelectedChat] = useState<ChatSummary | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<ChatSummary | null>(null);
  const [latestCRS, setLatestCRS] = useState<CRSOut | null>(null);
  const router = useRouter();

  const normalizeChat = (chat: ChatSummary | ChatDetail): ChatSummary => ({
    ...chat,
    message_count:
      typeof chat.message_count === "number"
        ? chat.message_count
        : Array.isArray((chat as any).messages)
          ? (chat as any).messages.length
          : 0,
  });

  const loadChats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [chatsData, crsData] = await Promise.all([
        fetchProjectChats(projectId),
        fetchLatestCRS(projectId).catch(() => null) // CRS might not exist yet
      ]);
      setLatestCRS(crsData);

      // Show all chats for the project - don't filter by CRS ID
      // Users should see all their chats regardless of CRS status
      setItems(chatsData.map(normalizeChat));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, [projectId]);

  useEffect(() => {
    if (createChatTrigger) {
      openCreateModal();
    }
  }, [createChatTrigger]);

  const openCreateModal = () => {
    setModalMode("create");
    setChatName("");
    setSelectedChat(null);
    setActionError(null);
    setModalOpen(true);
  };

  const openRenameModal = (chat: ChatSummary) => {
    setModalMode("rename");
    setChatName(chat.name);
    setSelectedChat(chat);
    setActionError(null);
    setModalOpen(true);
  };

  const handleSaveChat = async () => {
    const trimmed = chatName.trim();
    if (!trimmed) {
      setActionError("Chat name is required");
      return;
    }

    try {
      setIsSaving(true);
      setActionError(null);

      if (modalMode === "create") {
        // Don't link to CRS on creation - each chat will get its own CRS when the AI generates it
        const created = await createProjectChat(projectId, {
          name: trimmed,
          crs_document_id: undefined
        });
        setItems((prev) => [normalizeChat(created), ...prev]);
        setSuccessMessage("Chat created successfully");
      } else if (selectedChat) {
        const updated = await updateProjectChat(projectId, selectedChat.id, { name: trimmed });
        setItems((prev) => prev.map((chat) => (chat.id === updated.id ? normalizeChat(updated) : chat)));
        setSuccessMessage("Chat renamed successfully");
      }

      setModalOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to save chat");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!chatToDelete) return;

    try {
      setDeletingId(chatToDelete.id);
      setActionError(null);
      await deleteProjectChat(projectId, chatToDelete.id);
      setItems((prev) => prev.filter((c) => c.id !== chatToDelete.id));
      setSuccessMessage("Chat deleted successfully");
      setDeleteModalOpen(false);
      setChatToDelete(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to delete chat");
    } finally {
      setDeletingId(null);
    }
  };

  const handleChatClick = (id: number) => {
    // Store the return path in sessionStorage (keeps chat URL clean). Use
    // a clearer path `/projects/:id/chats` so the project return URL is readable.
    try {
      sessionStorage.setItem("chatReturnTo", `/projects/${projectId}/chats`);
    } catch (e) {
      // ignore sessionStorage errors
    }

    router.push(`/chats/${id}?projectId=${projectId}`);
  };

  const filteredChats = items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Chats</h2>
          <p className="text-sm text-gray-500">Create, rename, or delete chats for this project.</p>
        </div>
        <Button variant="primary" size="md" className="flex items-center gap-2" onClick={openCreateModal}>
          <Plus className="w-4 h-4" /> Add Chat
        </Button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading chats...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">{error}</div>
        ) : (
          <>
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
              <SearchBar placeholder="Search chats..." value={search} onChange={setSearch} />
              <span className="text-sm text-gray-500 whitespace-nowrap">{filteredChats.length} chats</span>
            </div>

            {successMessage && (
              <div className="px-4 py-2 text-sm text-green-700 border-b border-gray-100 bg-green-50">
                {successMessage}
              </div>
            )}
            {actionError && (
              <div className="px-4 py-2 text-sm text-red-600 border-b border-gray-100 bg-red-50">{actionError}</div>
            )}

            {filteredChats.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No chats yet. Start one to begin collaborating.</div>
            ) : (
              <ul>
                {filteredChats.map((chat) => (
                  <li
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-black">{chat.name}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <Badge className={statusStyles[chat.status] || "bg-gray-100 text-gray-700"}>
                          {chat.status}
                        </Badge>
                        <span>{chat.message_count} messages</span>
                        <span>Started {new Date(chat.started_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        aria-label="Rename chat"
                        className="p-2 rounded hover:bg-gray-100 text-gray-600"
                        onClick={() => openRenameModal(chat)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        aria-label="Delete chat"
                        className="p-2 rounded hover:bg-red-50 text-red-600 disabled:opacity-50"
                        disabled={deletingId === chat.id}
                        onClick={() => {
                          setChatToDelete(chat);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalMode === "create" ? "Create chat" : "Rename chat"}</DialogTitle>
            <DialogDescription>Give this chat a clear, descriptive name.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Chat name
              <Input
                className="mt-1"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="e.g. Client kickoff discussion"
              />
            </label>
            {actionError && <p className="text-sm text-red-600">{actionError}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="default" size="md" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleSaveChat} disabled={isSaving}>
              {isSaving ? "Saving..." : modalMode === "create" ? "Create chat" : "Update chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete chat</DialogTitle>
            <DialogDescription>This action cannot be undone. Messages in this chat will be removed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              {chatToDelete ? `Are you sure you want to delete "${chatToDelete.name}"?` : "Are you sure you want to delete this chat?"}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="default" size="md" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleDelete} disabled={deletingId !== null}>
              {deletingId !== null ? "Deleting..." : "Delete chat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Settings Tab Content
function SettingsTab({
  projectId,
  projectName,
  projectDescription
}: {
  projectId: number;
  projectName: string;
  projectDescription: string;
}) {
  const [name, setName] = useState(projectName);
  const [description, setDescription] = useState(projectDescription);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Check if anything changed
      if (name === projectName && description === projectDescription) {
        setError("No changes to save");
        return;
      }

      // Prepare update payload with only changed fields
      const updateData: { name?: string; description?: string } = {};
      if (name !== projectName) updateData.name = name;
      if (description !== projectDescription) updateData.description = description;

      await apiCall(`/api/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      setSuccessMessage("Project updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating project:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update project"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-50 p-6 min-h-screen">
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Project Info</h2>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab]"
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#341bab] min-h-[100px]"
              disabled={isSaving}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// StatCard component
interface StatCardProps {
  title: string;
  value: number;
  statusCounts?: { [key: string]: number };
  icon?: React.ReactNode;
}

export function StatCard({ title, value, statusCounts, icon }: StatCardProps) {
  const statusColors: { [key: string]: string } = {
    Active: "bg-green-200 text-black",
    Completed: "bg-blue-200 text-black",
    Pending: "bg-yellow-200 text-black",
    Cancelled: "bg-red-200 text-black",
  };

  return (
    <div className="relative p-5 rounded-2xl bg-[#eceded]">
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
            <div key={status} className="flex justify-between items-center text-sm">
              <span className="text-black">{status}</span>
              <span
                className={`px-2 py-1 rounded-full font-semibold text-xs ${statusColors[status] || "bg-gray-300 text-black"
                  }`}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Demo
export default function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Project</h1>
      <ProjectPageGrid
        projectId={1}
        projectName="E-Commerce Platform"
        projectDescription="Building a modern e-commerce solution"
        userRole="BA"
      />
    </div>
  );
}
