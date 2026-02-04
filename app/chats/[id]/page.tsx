"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatUI } from "@/components/chats/ChatUI";
import { ChatDetail, fetchProjectChat } from "@/lib/api-chats";
import { getCurrentUser } from "@/lib/api";
import { CurrentUserDTO } from "@/dto";
import { fetchProjectById } from "@/services/projects.service";
import { setCurrentTeamId } from "@/lib/team-context";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  // Unwrap params (Next.js now passes params as a promise)
  const { id } = use(params);

  const searchParams = useSearchParams();
  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUserDTO | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const projectIdFromQuery = searchParams?.get("projectId");

  useEffect(() => {
    const loadChat = async () => {
      try {
        setLoading(true);
        setError(null);

        let projectId = projectIdFromQuery ? Number(projectIdFromQuery) : undefined;

        // Fallback: infer projectId from stored return path if query param missing
        if (!projectId) {
          try {
            const stored = sessionStorage.getItem("chatReturnTo");
            const match = stored?.match(/projects\/(\d+)/);
            if (match) projectId = Number(match[1]);
          } catch {
            // ignore storage errors
          }
        }

        if (!projectId || Number.isNaN(projectId)) {
          setError("Missing project reference for this chat.");
          return;
        }

        const [chatData, userData, projectData] = await Promise.all([
          fetchProjectChat(projectId, Number(id)),
          getCurrentUser<CurrentUserDTO>(),
          fetchProjectById(projectId),
        ]);

        // Restrict access: only clients can view chats
        if (userData.role === "ba") {
          setError("Access denied. Only clients can view chats.");
          return;
        }

        // Store team ID from project for sidebar navigation
        if (projectData.team_id) {
          setCurrentTeamId(projectData.team_id);
        }

        setChat(chatData);
        setCurrentUser(userData);
        setProject(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [id, projectIdFromQuery]);

  if (loading) {
    return <p className="text-center mt-20">Loading chat...</p>;
  }

  if (error || !chat || !currentUser) {
    return <p className="text-center mt-20 text-red-600">{error || "Chat not found"}</p>;
  }

  return (
    <div className="w-full h-full">
      <ChatUI chat={chat} currentUser={currentUser} projectStatus={project?.status} />
    </div>
  );
}
