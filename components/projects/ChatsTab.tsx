import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, MessageSquare, Calendar, Clock, ArrowRight, Search, MessageCircle, Layout } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/shared/Pagination";
import { formatDistanceToNow } from "date-fns";

interface ChatsTabProps {
  projectId: number;
  teamId?: number;
  createChatTrigger?: number;
}

const statusStyles: Record<string, string> = {
  active: "bg-green-500/10 text-green-600 border-green-500/20",
  completed: "bg-primary/10 text-primary border-primary/20",
  closed: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const patternNames: Record<string, string> = {
  iso_iec_ieee_29148: "ISO 29148",
  ieee_830: "IEEE 830",
  babok: "BABOK",
  agile_user_stories: "Agile Stories",
};

const ITEMS_PER_PAGE = 9;

export function ChatsTab({ projectId, teamId, createChatTrigger }: ChatsTabProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredChats.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentChats = useMemo(
    () => filteredChats.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [filteredChats, startIndex]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleChatClick = useCallback(
    (id: number) => {
      try {
        sessionStorage.setItem("chatReturnTo", `/projects/${projectId}/chats`);
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

  const handleCreateChat = useCallback(
    async (name: string, pattern: CRSPattern) => {
      const created = await createNewChat({ name, crs_pattern: pattern });
      if (created) {
        showSuccess("Chat created successfully");
        setCreateModalOpen(false);
        handleChatClick(created.id);
      }
    },
    [createNewChat, showSuccess, handleChatClick]
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
    <div className="flex flex-col gap-6 bg-gray-50/50 min-h-[calc(100vh-100px)] p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-2">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Project Chats
          </h2>
          <p className="text-sm text-muted-foreground">
            Collaborate, capture requirements, and refine your project details.
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-6 border-none"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5 font-bold" />
          <span className="font-semibold">New Chat</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Filter & Search Bar */}
        <div className="flex items-center gap-4 px-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
            <span className="font-semibold text-primary">{filteredChats.length}</span>
            <span>Total Chats</span>
          </div>
        </div>

        {flashMessage && (
          <div className="mx-4 animate-in fade-in slide-in-from-top-2">
            <div className="bg-green-500/10 border border-green-500/20 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {flashMessage.message}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4 text-muted-foreground animate-shimmer">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-medium">Loading chats...</p>
          </div>
        ) : error ? (
          <div className="mx-4 p-8 bg-white border border-red-100 rounded-3xl text-center shadow-xl shadow-red-500/5">
            <div className="mb-4 inline-flex p-4 rounded-full bg-red-50 text-red-500">
              <ArrowRight className="w-8 h-8 rotate-180" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{error}</p>
            <Button variant="outline" onClick={refreshChats}>Try Again</Button>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="mx-4 p-16 bg-white border border-dashed border-gray-200 rounded-3xl text-center">
            <div className="mb-6 inline-flex p-6 rounded-full bg-gray-50 text-gray-400">
              <MessageSquare className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No chats found</h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              {search
                ? "No chats match your search query. Try different keywords."
                : "Your chat history is clear. Start a new chat to begin capturing requirements."}
            </p>
            {!search && (
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="rounded-full px-8"
              >
                Start Your First Chat
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-10">
              {currentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden hover-lift"
                >
                  <div className="relative z-10 flex flex-col justify-center min-h-[100px]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-1.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors shrink-0">
                          <MessageCircle className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                          {chat.name}
                        </h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-1.5 py-0 text-[8px] uppercase font-bold tracking-wider shrink-0 h-4.5 flex items-center",
                          statusStyles[chat.status] || "bg-gray-100 text-gray-700"
                        )}
                      >
                        {chat.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1 min-w-0">
                          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(chat.started_at), { addSuffix: true })}
                          </span>
                        </div>
                        {chat.crs_pattern && (
                          <div className="flex items-center gap-1 min-w-0">
                            <Layout className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">
                              {patternNames[chat.crs_pattern] || chat.crs_pattern}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-primary/5 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openRenameModal(chat);
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(chat);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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
