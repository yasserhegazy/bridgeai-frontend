"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ChatDetail, ChatMessage } from "@/lib/api-chats";
import { getAccessToken } from "@/lib/api";

interface ChatUIProps {
  chat: ChatDetail;
  currentUser: {
    id: number;
    role: "client" | "ba" | string;
    full_name?: string;
  };
}

type ConnectionState = "connecting" | "open" | "closed" | "error";
type LocalChatMessage = ChatMessage & { _localId?: string; pending?: boolean; failed?: boolean };

export function ChatUI({ chat, currentUser }: ChatUIProps) {
  const [messages, setMessages] = useState<LocalChatMessage[]>(chat.messages || []);
  const [input, setInput] = useState("");
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [wsError, setWsError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

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

  const renderSenderLabel = (msg: ChatMessage) => {
    if (msg.sender_type === "ai") return "Bridge AI";
    if (msg.sender_id === currentUser.id) return "You";
    if (msg.sender_type === "ba") return "Business Analyst";
    return "Client";
  };

  const isOwnMessage = (msg: ChatMessage) =>
    msg.sender_id === currentUser.id && msg.sender_type !== "ai";

  // CRS modals (still placeholder)
  const [openDraft, setOpenDraft] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [draftText, setDraftText] = useState<string>(
    "This is a mock CRS draft generated from the chat. Replace with backend document when available."
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCRS = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsGenerating(false);
    setOpenGenerate(false);
    setOpenDraft(true);
  };

  const handleSendToBA = async () => {
    setOpenDraft(false);
    alert("CRS draft saved and ready to send to BA (mock)");
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
        {sortedMessages.map((msg) => (
          <div key={msg.id} className={`flex ${isOwnMessage(msg) ? "justify-end" : "justify-start"}`}>
            <div
              className={`rounded-2xl px-4 py-2 max-w-xl shadow border ${
                msg.sender_type === "ai"
                  ? "bg-indigo-50 border-indigo-100 text-gray-900"
                  : isOwnMessage(msg)
                  ? "bg-[#341bab] border-[#341bab] text-white"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <div className="text-xs font-semibold mb-1 opacity-80">{renderSenderLabel(msg)}</div>
              <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center gap-2 text-xs opacity-70 mt-1">
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                {msg.pending && <span className="text-[10px] uppercase tracking-wide">sending…</span>}
                {msg.failed && <span className="text-[10px] uppercase tracking-wide text-red-300">failed</span>}
              </div>
            </div>
          </div>
        ))}
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
              This will generate a CRS document draft based on the chat conversation. You can review it before sending to BA.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-600">A draft will be generated and stored in the database (mock).</p>
          </div>
          <DialogFooter className="mt-6 flex gap-2">
            <Button onClick={() => setOpenGenerate(false)} variant="outline">Cancel</Button>
            <Button onClick={handleGenerateCRS} variant="primary">{isGenerating ? "Generating..." : "Generate"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CRS Draft Dialog */}
      <Dialog open={openDraft} onOpenChange={setOpenDraft}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CRS Draft & Statistics</DialogTitle>
            <DialogDescription>
              Review the latest CRS draft and some basic statistics. This is a mock preview while backend is not ready.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-lg w-1/3">
                <p className="text-sm font-semibold">Sections</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg w-1/3">
                <p className="text-sm font-semibold">Completion</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg w-1/3">
                <p className="text-sm font-semibold">Last Updated</p>
                <p className="text-2xl font-bold">2m ago</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Draft Preview</label>
              <textarea value={draftText} onChange={(e) => setDraftText(e.target.value)} className="w-full min-h-[200px] rounded-md border p-3 text-black" />
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button onClick={() => setOpenDraft(false)} variant="outline">Close</Button>
            <Button onClick={handleSendToBA} variant="primary">Save & Send to BA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
