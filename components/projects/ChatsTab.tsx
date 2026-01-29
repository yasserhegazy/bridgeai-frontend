/**
 * ChatsTab Component
 * Manages project chats display and operations
 * Single Responsibility: Chats list UI and user interactions
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/SearchBar";
import { Badge } from "@/components/ui/badge";
import { CreateChatModal } from "@/components/projects/CreateChatModal";
import { RenameChatModal } from "@/components/projects/RenameChatModal";
import { DeleteChatModal } from "@/components/projects/DeleteChatModal";
import { useProjectChats, useFlashMessage } from "@/hooks";
import { ChatSummaryDTO, CRSPattern, fetchLatestCRS } from "@/services";
import { CRSDTO } from "@/dto/crs.dto";
import { setCurrentTeamId } from "@/lib/team-context";

interface ChatsTabProps {
  projectId: number;
  teamId?: number;
  createChatTrigger?: number;
}

const statusStyles: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
};

export function ChatsTab({ projectId, teamId, createChatTrigger }: ChatsTabProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatSummaryDTO | null>(null);
  const [latestCRS, setLatestCRS] = useState<CRSDTO | null>(null);

  const { flashMessage, showSuccess } = useFlashMessage();

  const {
    chats,
    isLoading,
    error,
    createNewChat,
    renameChat,
    removeChat,
    refreshChats,
    clearError,
  } = useProjectChats(projectId);

  useEffect(() => {
    const loadCRS = async () => {
      try {
        const crs = await fetchLatestCRS(projectId);
        setLatestCRS(crs);
      } catch {
        // CRS might not exist yet
      }
    };
    loadCRS();
  }, [projectId]);

  useEffect(() => {
    if (createChatTrigger) {
      setCreateModalOpen(true);
    }
  }, [createChatTrigger]);

  const filteredChats = useMemo(
    () => chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [chats, search]
  );

  const handleCreateChat = useCallback(
    async (name: string, pattern: CRSPattern) => {
      const created = await createNewChat({ name, crs_pattern: pattern });
      if (created) {
        showSuccess("Chat created successfully");
        setCreateModalOpen(false);
      }
    },
    [createNewChat, showSuccess]
  );

  const handleRenameChat = useCallback(
    async (name: string) => {
      if (!selectedChat) return;
      const success = await renameChat(selectedChat.id, name);
      if (success) {
        showSuccess("Chat renamed successfully");
        setRenameModalOpen(false);
        setSelectedChat(null);
      }
    },
    [selectedChat, renameChat, showSuccess]
  );

  const handleDeleteChat = useCallback(async () => {
    if (!selectedChat) return;
    const success = await removeChat(selectedChat.id);
    if (success) {
      showSuccess("Chat deleted successfully");
      setDeleteModalOpen(false);
      setSelectedChat(null);
    }
  }, [selectedChat, removeChat, showSuccess]);

  const handleChatClick = useCallback(
    (id: number) => {
      try {
        sessionStorage.setItem("chatReturnTo", `/projects/${projectId}/chats`);
        // Store team ID for sidebar navigation
        if (teamId) {
          setCurrentTeamId(teamId);
        }
      } catch {
        // ignore sessionStorage errors
      }
      router.push(`/chats/${id}?projectId=${projectId}`);
    },
    [projectId, teamId, router]
  );

  const openRenameModal = useCallback((chat: ChatSummaryDTO) => {
    setSelectedChat(chat);
    clearError();
    setRenameModalOpen(true);
  }, [clearError]);

  const openDeleteModal = useCallback((chat: ChatSummaryDTO) => {
    setSelectedChat(chat);
    clearError();
    setDeleteModalOpen(true);
  }, [clearError]);

  return (
    <div className="bg-gray-50 p-6 min-h-screen flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Chats</h2>
          <p className="text-sm text-gray-500">
            Create, rename, or delete chats for this project.
          </p>
        </div>
        <Button
          variant="primary"
          size="default"
          className="flex items-center gap-2"
          onClick={() => setCreateModalOpen(true)}
        >
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
              <SearchBar
                placeholder="Search chats..."
                value={search}
                onChange={setSearch}
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {filteredChats.length} chats
              </span>
            </div>

            {flashMessage && (
              <div className="px-4 py-2 text-sm text-green-700 border-b border-gray-100 bg-green-50">
                {flashMessage.message}
              </div>
            )}

            {filteredChats.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No chats yet. Start one to begin collaborating.
              </div>
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
                        <Badge
                          className={
                            statusStyles[chat.status] || "bg-gray-100 text-gray-700"
                          }
                        >
                          {chat.status}
                        </Badge>
                        <span>{chat.message_count} messages</span>
                        <span>
                          Started {new Date(chat.started_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        aria-label="Rename chat"
                        className="p-2 rounded hover:bg-gray-100 text-gray-600"
                        onClick={() => openRenameModal(chat)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        aria-label="Delete chat"
                        className="p-2 rounded hover:bg-red-50 text-red-600"
                        onClick={() => openDeleteModal(chat)}
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

      <CreateChatModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateChat}
        error={error}
      />

      <RenameChatModal
        open={renameModalOpen}
        chatName={selectedChat?.name || ""}
        onClose={() => {
          setRenameModalOpen(false);
          setSelectedChat(null);
        }}
        onSubmit={handleRenameChat}
        error={error}
      />

      <DeleteChatModal
        open={deleteModalOpen}
        chatName={selectedChat?.name || ""}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedChat(null);
        }}
        onConfirm={handleDeleteChat}
      />
    </div>
  );
}
