"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, WifiOff } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ChatDetail, ChatMessage as ChatMessageType } from "@/lib/api-chats";
import { ChatMessage, TypingIndicator, ChatMessageData } from "@/components/chats/ChatMessage";
import { getAccessToken } from "@/lib/api";
import { CRSOut, fetchLatestCRS, createCRS, updateCRSStatus } from "@/lib/api-crs";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";

interface ChatUIProps {
  chat: ChatDetail;
  currentUser: {
    id: number;
    role: "client" | "ba" | string;
    full_name?: string;
  };
}

type ConnectionState = "connecting" | "open" | "closed" | "error";
type LocalChatMessage = ChatMessageData & { _localId?: string; pending?: boolean; failed?: boolean };

export function ChatUI({ chat, currentUser }: ChatUIProps) {
  const [messages, setMessages] = useState<LocalChatMessage[]>(chat.messages || []);
  const [input, setInput] = useState("");
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [wsError, setWsError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const didOpenRef = useRef(false);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

  useEffect(() => {
    // Only reset messages when switching to a different chat
    // We don't want to sync on chat.messages changes because we have local real-time state
    setMessages(chat.messages || []);
  }, [chat.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("chatReturnTo");
      if (stored) setReturnTo(stored);
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setWsError("Missing auth token. Please log in again.");
      setConnectionState("error");
      console.warn("[ChatUI] WebSocket aborted: no auth token found");
      return;
    }

    if (!chat?.id || !chat?.project_id) {
      setWsError("Chat is missing required identifiers.");
      setConnectionState("error");
      console.warn("[ChatUI] WebSocket aborted: chat/project id missing", chat);
      return;
    }

    const protocol = apiBase.startsWith("https") ? "wss" : "ws";
    const wsUrl = `${apiBase.replace(/^https?/, protocol)}/api/projects/${chat.project_id}/chats/${chat.id}/ws?token=${token}`;
    console.info("[ChatUI] Opening WebSocket", wsUrl);

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;
    setConnectionState("connecting");
    didOpenRef.current = false;

    ws.onopen = () => {
      setConnectionState("open");
      setWsError(null);
      didOpenRef.current = true;
    };

    ws.onerror = () => {
      setConnectionState("error");
      setWsError("WebSocket connection error. Please refresh to retry.");
    };

    ws.onclose = (event) => {
      setConnectionState("closed");
      // In dev, React Strict Mode mounts/unmounts effects twice; ignore pre-open closes
      if (didOpenRef.current) {
        const codeInfo = event.code ? ` (code ${event.code})` : "";
        setWsError(event.reason || `Connection closed${codeInfo}`);
        console.warn("[ChatUI] WebSocket closed", { code: event.code, reason: event.reason });
      }
    };

    ws.onmessage = (event) => {
      console.log("[ChatUI] WebSocket message received:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("[ChatUI] Parsed message data:", data);

        if (data?.error) {
          console.error("[ChatUI] Server error:", data.error);
          setWsError(data.error);
          return;
        }

        // Server returns messages with id, session_id, sender_type, sender_id, content, timestamp
        if (typeof data?.id !== "number" || !data.content) {
          console.warn("[ChatUI] Invalid message format, missing id or content:", data);
          return;
        }
        
        const incoming: LocalChatMessage = {
          id: data.id,
          session_id: data.session_id ?? chat.id,
          sender_type: data.sender_type,
          sender_id: data.sender_id ?? null,
          content: data.content,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        console.log("[ChatUI] Incoming message processed:", incoming);

        // Hide typing indicator when AI responds
        if (incoming.sender_type === "ai") {
          setIsAiTyping(false);
        }

        setMessages((prev) => {
          // Avoid duplicates when history + websocket echo overlap
          const exactIdx = prev.findIndex((m) => m.id === incoming.id);
          if (exactIdx >= 0) {
            console.log("[ChatUI] Updating existing message at index:", exactIdx);
            const updated = [...prev];
            updated[exactIdx] = incoming;
            return updated;
          }

          // Replace matching pending local message (same sender + content)
          const pendingIdx = prev.findIndex(
            (m) =>
              m.pending &&
              m.sender_type === incoming.sender_type &&
              m.content === incoming.content &&
              (m.sender_id ?? currentUser.id) === (incoming.sender_id ?? currentUser.id)
          );
          if (pendingIdx >= 0) {
            console.log("[ChatUI] Replacing pending message at index:", pendingIdx);
            const updated = [...prev];
            updated[pendingIdx] = incoming;
            return updated;
          }

          console.log("[ChatUI] Adding new message to list");
          return [...prev, incoming];
        });
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    return () => {
      // Avoid closing a socket that never opened (dev double-mount). Only close if it actually connected.
      if (socketRef.current === ws && didOpenRef.current && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      socketRef.current = null;
      setConnectionState("closed");
    };
  }, [apiBase, chat.id, chat.project_id]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const payload = {
      content: input.trim(),
      sender_type: (currentUser.role === "ba" ? "ba" : "client") as "ba" | "client",
    };

    const pendingLocal: LocalChatMessage = {
      _localId: `local-${Date.now()}`,
      id: Date.now() * -1,
      session_id: chat.id,
      sender_type: payload.sender_type,
      sender_id: currentUser.id,
      content: payload.content,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, pendingLocal]);
    setInput("");

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setWsError("Not connected. Please wait for the chat to reconnect.");
      // mark pending as failed
      setMessages((prev) =>
        prev.map((m) => (m._localId === pendingLocal._localId ? { ...m, pending: false, failed: true } : m))
      );
      return;
    }

    try {
      setIsSending(true);
      setIsAiTyping(true); // Show typing indicator while waiting for AI
      console.log("[ChatUI] Sending message via WebSocket:", payload);
      socketRef.current.send(JSON.stringify(payload));
      console.log("[ChatUI] Message sent successfully");
    } catch (err) {
      console.error("Failed to send message", err);
      setWsError("Failed to send message. Please try again.");
      setMessages((prev) =>
        prev.map((m) => (m._localId === pendingLocal._localId ? { ...m, pending: false, failed: true } : m))
      );
    } finally {
      setIsSending(false);
    }
  };

  const isOwnMessage = (msg: LocalChatMessage) =>
    msg.sender_id === currentUser.id && msg.sender_type !== "ai";

  // CRS state
  const [openDraft, setOpenDraft] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [latestCRS, setLatestCRS] = useState<CRSOut | null>(null);
  const [crsLoading, setCrsLoading] = useState(false);
  const [crsError, setCrsError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load CRS when opening the draft dialog
  useEffect(() => {
    if (openDraft && chat.project_id) {
      loadCRS();
    }
  }, [openDraft, chat.project_id]);

  const loadCRS = async () => {
    if (!chat.project_id) return;
    
    try {
      setCrsLoading(true);
      setCrsError(null);
      const crs = await fetchLatestCRS(chat.project_id);
      setLatestCRS(crs);
    } catch (err) {
      setCrsError(err instanceof Error ? err.message : "Failed to load CRS");
      setLatestCRS(null);
    } finally {
      setCrsLoading(false);
    }
  };

  const handleGenerateCRS = async () => {
    if (!chat.project_id) {
      alert("Project ID not found");
      return;
    }

    try {
      setIsGenerating(true);
      setCrsError(null);
      
      // Compile chat conversation into content
      const conversationText = messages
        .filter(msg => msg.sender_type !== "system")
        .map(msg => `${msg.sender_type === "client" ? "Client" : "AI"}: ${msg.content}`)
        .join("\n\n");

      // Extract key points from conversation (simple extraction)
      const summaryPoints = messages
        .filter(msg => msg.sender_type === "client")
        .map(msg => msg.content)
        .filter(content => content.length > 20)
        .slice(0, 5); // Take first 5 meaningful client messages

      // Create CRS document
      const newCRS = await createCRS({
        project_id: chat.project_id,
        content: conversationText,
        summary_points: summaryPoints,
      });

      setLatestCRS(newCRS);
      setOpenGenerate(false);
      setOpenDraft(true);
    } catch (err) {
      setCrsError(err instanceof Error ? err.message : "Failed to generate CRS");
      alert("Failed to generate CRS. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendToBA = async () => {
    if (!latestCRS) {
      alert("No CRS to submit");
      return;
    }

    try {
      // Update status from draft to under_review
      const updatedCRS = await updateCRSStatus(latestCRS.id, "under_review");
      setLatestCRS(updatedCRS);
      setOpenDraft(false);
      alert("CRS submitted for BA review successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit CRS");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            aria-label="Back to project"
            onClick={() => {
              if (returnTo) {
                try {
                  sessionStorage.removeItem("chatReturnTo");
                } catch {
                  // ignore
                }
                router.push(returnTo);
              } else {
                router.back();
              }
            }}
            className="p-2 rounded hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{chat.name}</h2>
            <p className="text-sm text-gray-500">
              {currentUser.full_name ? `${currentUser.full_name} - ` : ""}Project chat #{chat.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
              connectionState === "open"
                ? "bg-green-50 text-green-700"
                : connectionState === "connecting"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {connectionState === "connecting" && <Loader2 className="h-3 w-3 animate-spin" />}
            {connectionState !== "open" && <WifiOff className="h-3 w-3" />}
            <span>
              {connectionState === "open"
                ? "Connected"
                : connectionState === "connecting"
                ? "Connecting..."
                : "Disconnected"}
            </span>
          </div>
          <Button onClick={() => setOpenGenerate(true)} variant="primary">
            Generate CRS document
          </Button>
          <Button onClick={() => setOpenDraft(true)} variant="secondary">
            View CRS draft
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {wsError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">
            {wsError}
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {sortedMessages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={isOwnMessage(msg)}
              currentUserName={currentUser.full_name}
            />
          ))}
          {isAiTyping && <TypingIndicator key="typing-indicator" />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white flex gap-3">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
          disabled={connectionState !== "open"}
        />
        <Button onClick={handleSend} variant="primary" disabled={isSending || connectionState !== "open"}>
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>

      {/* Generate CRS Dialog */}
      <Dialog open={openGenerate} onOpenChange={setOpenGenerate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate CRS Document</DialogTitle>
            <DialogDescription>
              This will create a CRS document from your chat conversation. You can review and submit it to the BA for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              The system will compile your conversation into a structured CRS document that captures the requirements discussed.
            </p>
          </div>
          <DialogFooter className="mt-6 flex gap-2">
            <Button onClick={() => setOpenGenerate(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGenerateCRS} variant="primary" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate CRS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CRS Draft Dialog */}
      <Dialog open={openDraft} onOpenChange={setOpenDraft}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CRS Document</DialogTitle>
            <DialogDescription>
              Review the latest CRS document and its details.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {crsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading CRS...</span>
              </div>
            ) : crsError || !latestCRS ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {crsError || "No CRS document found for this project."}
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg flex-1">
                    <p className="text-sm font-semibold text-gray-600">Version</p>
                    <p className="text-2xl font-bold text-black">{latestCRS.version}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg flex-1">
                    <p className="text-sm font-semibold text-gray-600">Status</p>
                    <div className="mt-2">
                      <CRSStatusBadge status={latestCRS.status} />
                    </div>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg flex-1">
                    <p className="text-sm font-semibold text-gray-600">Created</p>
                    <p className="text-sm font-medium text-black mt-1">
                      {new Date(latestCRS.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {latestCRS.summary_points && latestCRS.summary_points.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary Points</label>
                    <ul className="list-disc list-inside space-y-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      {latestCRS.summary_points.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Content</label>
                  <div className="w-full min-h-[200px] max-h-[400px] overflow-y-auto rounded-md border p-3 text-black bg-gray-50">
                    <pre className="whitespace-pre-wrap text-sm">{latestCRS.content}</pre>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button onClick={() => setOpenDraft(false)} variant="outline">Close</Button>
            {latestCRS && latestCRS.status === "draft" && (
              <Button onClick={handleSendToBA} variant="primary">Submit for Review</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
