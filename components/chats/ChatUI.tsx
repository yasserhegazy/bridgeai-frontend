"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, WifiOff } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ChatDetail, ChatMessage as ChatMessageType } from "@/lib/api-chats";
import { ChatMessage, TypingIndicator, ChatMessageData } from "@/components/chats/ChatMessage";
import { getAccessToken } from "@/lib/api";
import { CRSOut, fetchCRSForSession, updateCRSStatus, createCRS, getPreviewCRS, CRSPreviewOut } from "@/lib/api-crs";
import { CRSStatusBadge } from "@/components/shared/CRSStatusBadge";
import { CRSContentDisplay } from "@/components/shared/CRSContentDisplay";
import { ExportButton } from "@/components/shared/ExportButton";
import { CRSExportButton } from "@/components/shared/CRSExportButton";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { PreviewCRSButton } from "@/components/chats/PreviewCRSButton";
import { PartialCRSConfirmModal } from "@/components/chats/PartialCRSConfirmModal";

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const didOpenRef = useRef(false);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

  useEffect(() => {
    // Only reset messages when switching to a different chat
    // We don't want to sync on chat.messages changes because we have local real-time state
    setMessages(chat.messages || []);
    if (chat.crs_pattern) {
      setCrsPattern(chat.crs_pattern);
    }
  }, [chat.id, chat.crs_pattern]);

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
      crs_pattern: crsPattern, // Send current pattern selection
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

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
  const [crsPattern, setCrsPattern] = useState<"iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories">(chat.crs_pattern || "babok");
  const [openPartialConfirm, setOpenPartialConfirm] = useState(false);
  const [previewData, setPreviewData] = useState<CRSPreviewOut | null>(null);

  // Determine available actions based on CRS status
  const canGenerateCRS = !latestCRS || latestCRS.status === 'draft' || latestCRS.status === 'rejected';
  const canSubmitCRS = latestCRS?.status === 'draft';
  // Users can always chat - CRS status doesn't block conversation
  const canChatFreely = true;
  const isUnderReview = latestCRS?.status === 'under_review';
  const isApproved = latestCRS?.status === 'approved';
  const isRejected = latestCRS?.status === 'rejected';

  // Load CRS on mount to determine current status
  useEffect(() => {
    if (chat.id) {
      loadCRS();
    }
  }, [chat.id]);

  // Reload CRS when opening the draft dialog to get latest data
  useEffect(() => {
    if (openDraft && chat.id) {
      loadCRS();
    }
  }, [openDraft, chat.id]);

  const loadCRS = async () => {
    if (!chat.id) return null;

    try {
      setCrsLoading(true);
      setCrsError(null);
      const crs = await fetchCRSForSession(chat.id);
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
    if (!chat.project_id || !chat.id) {
      alert("Project ID or Session ID not found");
      return;
    }

    try {
      setIsGenerating(true);
      setCrsError(null);

      // Fetch preview data to check completeness
      const preview = await getPreviewCRS(chat.id);
      setPreviewData(preview);

      // If incomplete (<100%), show confirmation modal
      if (preview.completeness_percentage < 100) {
        setOpenGenerate(false);
        setOpenPartialConfirm(true);
        setIsGenerating(false); // Reset loading state
      } else {
        // If complete, generate directly
        await confirmGenerateCRS(preview);
      }
    } catch (err) {
      setCrsError(err instanceof Error ? err.message : "Failed to fetch CRS preview");
      alert("Failed to check CRS status. Please try again.");
      setIsGenerating(false);
    }
  };

  const confirmGenerateCRS = async (preview: CRSPreviewOut) => {
    if (!chat.project_id) {
      alert("Project ID not found");
      return;
    }

    try {
      setIsGenerating(true);
      setCrsError(null);
      const isPartial = preview.completeness_percentage < 100;

      const crs = await createCRS({
        project_id: chat.project_id,
        content: preview.content,
        summary_points: preview.summary_points,
        allow_partial: isPartial,
        completeness_percentage: preview.completeness_percentage,
        session_id: chat.id,
        pattern: crsPattern,  // Include selected pattern
      });

      setLatestCRS(crs);
      setOpenPartialConfirm(false);
      setOpenGenerate(false);
      setOpenDraft(true);

      alert(isPartial
        ? "✅ Draft CRS created successfully! You can continue clarification or edit the document."
        : "✅ CRS created successfully! You can review and submit it for approval."
      );
    } catch (err) {
      setCrsError(err instanceof Error ? err.message : "Failed to generate CRS");
      alert(err instanceof Error ? err.message : "Failed to generate CRS. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinueClarification = () => {
    setOpenPartialConfirm(false);
    setPreviewData(null);
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
      alert("✅ CRS submitted successfully! Your document is now under review by the Business Analyst. You can continue chatting while waiting for the review.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to submit CRS");
    }
  };

  const generateChatTranscript = (): string => {
    const lines: string[] = [];
    lines.push(`# Chat Transcript: ${chat.name}`);
    lines.push(`**Project Chat ID:** ${chat.id}`);
    lines.push(`**Started:** ${new Date(chat.started_at).toLocaleString()}`);
    lines.push("");

    for (const msg of messages) {
      const senderLabel = msg.sender_type === "ai" ? "🤖 AI" : msg.sender_type === "ba" ? "👤 BA" : "👤 Client";
      const timestamp = new Date(msg.timestamp).toLocaleTimeString();
      lines.push(`**${senderLabel}** [${timestamp}]`);
      lines.push(msg.content);
      lines.push("");
    }

    return lines.join("\n");
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
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${connectionState === "open"
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
          <ExportButton
            projectId={chat.project_id}
            content={generateChatTranscript()}
            filename={`chat-${chat.id}-${chat.name.replace(/\s+/g, "-").toLowerCase()}`}
            crsId={latestCRS?.id}
          />
          <PreviewCRSButton
            sessionId={chat.id}
            sessionStatus={chat.status}
            variant="outline"
            size="default"
          />
          {canGenerateCRS && (
            <Button onClick={() => setOpenGenerate(true)} variant="primary">
              {latestCRS?.status === 'rejected' ? 'Regenerate CRS' : 'Generate CRS document'}
            </Button>
          )}
          <Button onClick={() => setOpenDraft(true)} variant="secondary">
            View CRS {latestCRS?.status === 'approved' && '(Approved)'}
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

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {isUnderReview && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <div className="font-semibold mb-1">CRS Under Review</div>
            <div className="text-xs">Your CRS is currently being reviewed by the BA. You can continue chatting while waiting for follow-up questions or new features.</div>
          </div>
        )}
        {isRejected && latestCRS?.rejection_reason && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            <div className="font-semibold mb-1">Your CRS was rejected</div>
            <div className="text-xs">Feedback: {latestCRS.rejection_reason}</div>
            <div className="text-xs mt-2">Please review the feedback and regenerate an improved version.</div>
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1 flex flex-col gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Type your message... (Shift+Enter for new line)"
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              className="min-h-[44px] max-h-[200px] resize-none overflow-y-auto"
              disabled={connectionState !== "open"}
              rows={1}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Pattern:</span>
                <select
                  value={crsPattern}
                  onChange={(e) => setCrsPattern(e.target.value as "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories")}
                  className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer hover:text-gray-900 transition-colors"
                  title="Select the requirements pattern for AI interpretation"
                >
                  <option value="babok">BABOK</option>
                  <option value="ieee_830">IEEE 830</option>
                  <option value="iso_iec_ieee_29148">ISO 29148</option>
                  <option value="agile_user_stories">Agile Stories</option>
                </select>
              </div>
              <span className="text-xs text-gray-400">Shift+Enter for new line</span>
            </div>
          </div>
          <Button
            onClick={handleSend}
            variant="primary"
            disabled={isSending || connectionState !== "open"}
            className="h-[44px] mb-6"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>

      {/* Generate CRS Dialog */}
      <Dialog open={openGenerate} onOpenChange={setOpenGenerate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate CRS Document</DialogTitle>
            <DialogDescription>
              The system will generate your CRS document based on the conversation history and your selected pattern.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">
                The system will compile your conversation into a structured CRS document.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <strong>How it works:</strong> After you select a standard and submit, the system will ask clarifying questions if needed. Once clarification is complete, your CRS document will be automatically generated using your selected standard.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6 flex gap-2">
            <Button onClick={() => setOpenGenerate(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGenerateCRS} variant="primary" disabled={isGenerating}>
              {isGenerating ? "Submitting..." : "Submit & Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CRS Draft Dialog */}
      <Dialog open={openDraft} onOpenChange={setOpenDraft}>
        <DialogContent className="max-w-[95vw] lg:max-w-7xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white">
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xl">CRS Document</span>
              {latestCRS && <CRSStatusBadge status={latestCRS.status} />}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Review the Client Requirements Specification document.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              {crsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-base text-gray-500">Loading document...</span>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Version</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">v{latestCRS.version}</p>
                    </div>
                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pattern</p>
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {latestCRS.pattern === "iso_iec_ieee_29148" ? "ISO/IEC/IEEE 29148" :
                          latestCRS.pattern === "ieee_830" ? "IEEE 830" :
                            latestCRS.pattern === "agile_user_stories" ? "Agile User Stories" :
                              "BABOK"}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</p>
                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {new Date(latestCRS.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                  </div>

                  {/* Summary Points */}
                  {latestCRS.summary_points && latestCRS.summary_points.length > 0 && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
                      <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Key Points
                      </h3>
                      <ul className="grid gap-2">
                        {latestCRS.summary_points.map((point, idx) => (
                          <li key={idx} className="text-sm text-blue-900/80 pl-2 border-l-2 border-blue-200">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Structured CRS Content */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm min-h-[400px]">
                    <CRSContentDisplay content={latestCRS.content} />
                  </div>
                </>
              )}
            </div>

            {/* Right Panel: Comments */}
            {latestCRS && (
              <div className="w-[350px] lg:w-[400px] border-l border-gray-200 bg-white shadow-[rgba(0,0,0,0.05)_0px_0px_20px_-5px_inset]">
                <CommentsSection crsId={latestCRS.id} className="h-full border-none rounded-none shadow-none" />
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 p-4 border-t border-gray-200 bg-white flex items-center justify-between gap-3 z-10">
            <div className="flex gap-2">
              <Button onClick={() => setOpenDraft(false)} variant="outline" className="border-gray-300">Close</Button>
              {latestCRS && (
                <CRSExportButton
                  crsId={latestCRS.id}
                  version={latestCRS.version}
                />
              )}
            </div>

            <div className="flex gap-2">
              {latestCRS && latestCRS.status === "draft" && (
                <Button onClick={handleSendToBA} variant="primary">Submit for Review</Button>
              )}
              {latestCRS && latestCRS.status === "rejected" && (
                <Button onClick={() => {
                  setOpenDraft(false);
                  setOpenGenerate(true);
                }} variant="primary" className="bg-orange-600 hover:bg-orange-700">
                  Regenerate CRS
                </Button>
              )}
              {latestCRS && latestCRS.status === "approved" && (
                <span className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-md border border-green-200 flex items-center">
                  ✅ Final Approved
                </span>
              )}
              {latestCRS && latestCRS.status === "under_review" && (
                <span className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md border border-blue-200 flex items-center">
                  ⏳ Pending Review
                </span>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Partial CRS Confirmation Modal */}
      {previewData && (
        <PartialCRSConfirmModal
          open={openPartialConfirm}
          onOpenChange={setOpenPartialConfirm}
          completenessPercentage={previewData.completeness_percentage}
          missingRequiredFields={previewData.missing_required_fields}
          weakFields={previewData.weak_fields}
          onConfirmGenerate={() => confirmGenerateCRS(previewData)}
          onContinueClarification={handleContinueClarification}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
}
