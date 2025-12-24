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
import { CRSOut, fetchLatestCRS, updateCRSStatus } from "@/lib/api-crs";
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

        // If AI says CRS is complete, refresh latest CRS from backend
        if (data?.crs?.is_complete && chat.project_id) {
          // Fire and forget; UI state updated when fetch resolves
          loadCRS();
        }

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
    if (!chat.project_id) return null;
    
    try {
      setCrsLoading(true);
      setCrsError(null);
      const crs = await fetchLatestCRS(chat.project_id);
      setLatestCRS(crs);
      return crs;
    } catch (err) {
      setCrsError(err instanceof Error ? err.message : "Failed to load CRS");
      setLatestCRS(null);
      return null;
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
      const crs = await loadCRS();
      if (crs) {
        setOpenGenerate(false);
        setOpenDraft(true);
      } else {
        alert("No CRS document is available yet. Please let the agent finish generating it.");
      }
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>CRS Document</DialogTitle>
            <DialogDescription>
              Review the Customer Requirements Specification document.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2">
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
                {/* Header Info */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600">Version</p>
                    <p className="text-xl font-bold text-black">{latestCRS.version}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                    <CRSStatusBadge status={latestCRS.status} />
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600">Created</p>
                    <p className="text-sm font-medium text-black mt-1">
                      {new Date(latestCRS.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Summary Points */}
                {latestCRS.summary_points && latestCRS.summary_points.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Key Points</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {latestCRS.summary_points.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Structured CRS Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                  {(() => {
                    try {
                      const crsData = JSON.parse(latestCRS.content);
                      return (
                        <>
                          {crsData.project_title && (
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{crsData.project_title}</h3>
                            </div>
                          )}

                          {crsData.project_description && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Project Description</h4>
                              <p className="text-sm text-gray-600">{crsData.project_description}</p>
                            </div>
                          )}

                          {crsData.project_objectives && crsData.project_objectives.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Objectives</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {crsData.project_objectives.map((obj: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-600">{obj}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {crsData.functional_requirements && crsData.functional_requirements.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Functional Requirements</h4>
                              <div className="space-y-3">
                                {crsData.functional_requirements.map((req: any, idx: number) => {
                                  // Handle structured requirement objects (preferred format)
                                  if (typeof req === "object" && req !== null) {
                                    return (
                                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="font-medium text-gray-900">
                                            {req.id && <span className="text-[#341bab] mr-2">{req.id}</span>}
                                            {req.title || "Requirement"}
                                          </span>
                                          {req.priority && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                              req.priority === "high" ? "bg-red-100 text-red-700" :
                                              req.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                              "bg-green-100 text-green-700"
                                            }`}>
                                              {req.priority}
                                            </span>
                                          )}
                                        </div>
                                        {req.description && (
                                          <p className="text-sm text-gray-600">{req.description}</p>
                                        )}
                                      </div>
                                    );
                                  }
                                  // Handle string requirements (fallback for older data)
                                  if (typeof req === "string") {
                                    const trimmed = req.trim();
                                    return (
                                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <p className="text-sm text-gray-600">{trimmed}</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                          )}

                          {crsData.target_users && crsData.target_users.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Target Users</h4>
                              {Array.isArray(crsData.target_users) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {crsData.target_users.map((user: string, idx: number) => (
                                    <li key={idx} className="text-sm text-gray-600">{user}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-600">{crsData.target_users}</p>
                              )}
                            </div>
                          )}

                          {/* Non-Functional Requirements Section */}
                          {(crsData.security_requirements?.length > 0 || 
                            crsData.performance_requirements?.length > 0 || 
                            crsData.scalability_requirements?.length > 0) && (
                            <div className="border-t border-gray-200 pt-4">
                              <h4 className="text-sm font-semibold text-gray-800 mb-3">Non-Functional Requirements</h4>
                              
                              {crsData.security_requirements?.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="text-xs font-medium text-gray-600 mb-1">🔒 Security</h5>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {crsData.security_requirements.map((req: string, idx: number) => (
                                      <li key={idx} className="text-sm text-gray-600">{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {crsData.performance_requirements?.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="text-xs font-medium text-gray-600 mb-1">⚡ Performance</h5>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {crsData.performance_requirements.map((req: string, idx: number) => (
                                      <li key={idx} className="text-sm text-gray-600">{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {crsData.scalability_requirements?.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="text-xs font-medium text-gray-600 mb-1">📈 Scalability</h5>
                                  <ul className="list-disc list-inside space-y-0.5">
                                    {crsData.scalability_requirements.map((req: string, idx: number) => (
                                      <li key={idx} className="text-sm text-gray-600">{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Technology Stack */}
                          {crsData.technology_stack && Object.keys(crsData.technology_stack).some(
                            k => crsData.technology_stack[k]?.length > 0
                          ) && (
                            <div className="border-t border-gray-200 pt-4">
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">🛠️ Technology Stack</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {crsData.technology_stack.frontend?.length > 0 && (
                                  <div className="bg-blue-50 rounded p-2">
                                    <span className="text-xs font-medium text-blue-800">Frontend:</span>
                                    <p className="text-sm text-blue-700">{crsData.technology_stack.frontend.join(", ")}</p>
                                  </div>
                                )}
                                {crsData.technology_stack.backend?.length > 0 && (
                                  <div className="bg-green-50 rounded p-2">
                                    <span className="text-xs font-medium text-green-800">Backend:</span>
                                    <p className="text-sm text-green-700">{crsData.technology_stack.backend.join(", ")}</p>
                                  </div>
                                )}
                                {crsData.technology_stack.database?.length > 0 && (
                                  <div className="bg-purple-50 rounded p-2">
                                    <span className="text-xs font-medium text-purple-800">Database:</span>
                                    <p className="text-sm text-purple-700">{crsData.technology_stack.database.join(", ")}</p>
                                  </div>
                                )}
                                {crsData.technology_stack.other?.length > 0 && (
                                  <div className="bg-gray-50 rounded p-2">
                                    <span className="text-xs font-medium text-gray-800">Other:</span>
                                    <p className="text-sm text-gray-700">{crsData.technology_stack.other.join(", ")}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Constraints Section */}
                          <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
                            {crsData.timeline_constraints && crsData.timeline_constraints !== "Not specified" && (
                              <div className="bg-orange-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-orange-800 mb-1">⏰ Timeline</h4>
                                <p className="text-sm text-orange-700">{crsData.timeline_constraints}</p>
                              </div>
                            )}

                            {crsData.budget_constraints && crsData.budget_constraints !== "Not specified" && (
                              <div className="bg-emerald-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-emerald-800 mb-1">💰 Budget</h4>
                                <p className="text-sm text-emerald-700">{crsData.budget_constraints}</p>
                              </div>
                            )}
                          </div>

                          {/* Technical Constraints */}
                          {crsData.technical_constraints?.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">⚠️ Technical Constraints</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {crsData.technical_constraints.map((constraint: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-600">{constraint}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Integrations */}
                          {crsData.integrations?.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">🔗 Integrations</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {crsData.integrations.map((integration: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-600">{integration}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {crsData.success_metrics && crsData.success_metrics.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">📊 Success Metrics</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {crsData.success_metrics.map((metric: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-600">{metric}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Assumptions & Risks */}
                          {(crsData.assumptions?.length > 0 || crsData.risks?.length > 0) && (
                            <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
                              {crsData.assumptions?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1">📝 Assumptions</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {crsData.assumptions.map((assumption: string, idx: number) => (
                                      <li key={idx} className="text-sm text-gray-600">{assumption}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {crsData.risks?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-red-700 mb-1">⚠️ Risks</h4>
                                  <ul className="list-disc list-inside space-y-1">
                                    {crsData.risks.map((risk: string, idx: number) => (
                                      <li key={idx} className="text-sm text-red-600">{risk}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Out of Scope */}
                          {crsData.out_of_scope?.length > 0 && (
                            <div className="bg-gray-100 rounded-lg p-3">
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">🚫 Out of Scope</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {crsData.out_of_scope.map((item: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-500">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      );
                    } catch (e) {
                      // Fallback to raw content if not valid JSON
                      return (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Document Content</h4>
                          <div className="text-sm text-gray-600 whitespace-pre-wrap">{latestCRS.content}</div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-4 flex gap-2">
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
