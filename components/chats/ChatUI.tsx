/**
 * ChatUI Component - Refactored
 * Main chat interface orchestrating WebSocket connection, messages, and CRS operations
 * Following SOLID principles with extracted hooks and components
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
import { CRSDraftDialog } from "./CRSDraftDialog";
import { CRSGenerateDialog } from "./CRSGenerateDialog";
import { PartialCRSConfirmModal } from "./PartialCRSConfirmModal";
import {
  useChatSocket,
  useChatMessages,
  useChatCRS,
  useChatInput,
  useChatScroll,
  useChatState,
} from "@/hooks";
import { ChatSessionDTO, CurrentUserDTO, SendMessagePayload } from "@/dto";
import { getAuthToken } from "@/services/token.service";
import { useToast } from "@/components/ui/use-toast";

interface ChatUIProps {
  chat: ChatSessionDTO;
  currentUser: CurrentUserDTO;
}

export function ChatUI({ chat, currentUser }: ChatUIProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [openDraft, setOpenDraft] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openPartialConfirm, setOpenPartialConfirm] = useState(false);
  const [returnTo, setReturnTo] = useState<string | undefined>(undefined);
  const [crsPattern, setCrsPattern] = useState<
    "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories"
  >(chat.crs_pattern || "babok");

  // Get authentication token from cookies
  const accessToken = getAuthToken();

  // Initialize chat state
  const {
    connectionState,
    wsError,
    isAiTyping,
    handleConnectionChange,
    handleError,
    handleWebSocketMessage,
    showAiTyping,
  } = useChatState();

  // Initialize CRS management
  const {
    latestCRS,
    crsLoading,
    crsError,
    isGenerating,
    previewData,
    loadCRS,
    fetchPreview,
    generateCRS,
    submitForReview,
    canGenerateCRS,
    isRejected,
    isApproved,
    setPreviewData,
  } = useChatCRS({
    sessionId: chat.id,
    projectId: chat.project_id,
    crsPattern,
  });

  // Initialize messages management
  const { messages, isOwnMessage, addMessage, addPendingMessage, markPendingAsFailed } =
    useChatMessages({
      sessionId: chat.id,
      initialMessages: chat.messages || [],
      currentUserId: currentUser.id,
    });

  // WebSocket message handler
  const handleMessage = useCallback(
    (data: any) => {
      handleWebSocketMessage(data, {
        onMessage: (msg) => addMessage(msg as any),
        onCRSComplete: loadCRS,
      });
    },
    [handleWebSocketMessage, addMessage, loadCRS]
  );

  // Initialize WebSocket connection
  const { sendMessage, isConnected } = useChatSocket({
    sessionId: chat.id,
    projectId: chat.project_id,
    apiBase: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
    token: accessToken || "",
    enabled: !!accessToken, // Only enable when token is available
    onMessage: handleMessage,
    onError: handleError,
    onConnectionChange: handleConnectionChange,
  });

  // Handle message sending
  const handleSendMessage = useCallback(
    async (payload: SendMessagePayload, pendingLocal: any) => {
      if (!isConnected()) {
        handleError("Not connected. Please wait for the chat to reconnect.");
        markPendingAsFailed(pendingLocal._localId);
        return;
      }

      const pending = addPendingMessage(payload.content, payload.sender_type);
      showAiTyping();

      try {
        sendMessage(payload);
      } catch (err) {
        handleError(err instanceof Error ? err.message : "Failed to send message");
        markPendingAsFailed(pending._localId!);
      }
    },
    [isConnected, sendMessage, addPendingMessage, markPendingAsFailed, handleError, showAiTyping]
  );

  // Initialize chat input
  const { input, isSending, textareaRef, handleChange, handleSend, handleKeyDown } = useChatInput({
    onSend: handleSendMessage,
    senderType: currentUser.role === "ba" ? "ba" : "client",
    crsPattern,
    isConnected: connectionState === "open",
  });

  // Auto-scroll to bottom
  const bottomRef = useChatScroll([messages, isAiTyping]);

  // Load returnTo from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("chatReturnTo");
      setReturnTo(stored || undefined);
    } catch {
      // ignore
    }
  }, []);

  // Reload CRS when opening draft dialog
  useEffect(() => {
    if (openDraft && chat.id) {
      loadCRS();
    }
  }, [openDraft, chat.id, loadCRS]);

  // Generate chat transcript
  const generateChatTranscript = useCallback((): string => {
    const lines: string[] = [];
    lines.push(`# Chat Transcript: ${chat.name}`);
    lines.push(`**Project Chat ID:** ${chat.id}`);
    lines.push(`**Started:** ${new Date(chat.started_at).toLocaleString()}`);
    lines.push("");

    for (const msg of messages) {
      const senderLabel =
        msg.sender_type === "ai" ? "🤖 AI" : msg.sender_type === "ba" ? "👤 BA" : "👤 Client";
      const timestamp = new Date(msg.timestamp).toLocaleTimeString();
      lines.push(`**${senderLabel}** [${timestamp}]`);
      lines.push(msg.content);
      lines.push("");
    }

    return lines.join("\n");
  }, [chat, messages]);

  // Handle CRS generation
  const handleGenerateCRS = useCallback(async () => {
    try {
      const preview = await fetchPreview();

      if (preview.completeness_percentage < 100) {
        setOpenGenerate(false);
        setOpenPartialConfirm(true);
      } else {
        await confirmGenerateCRS(preview);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to check CRS status. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchPreview]);

  const confirmGenerateCRS = useCallback(
    async (preview: any) => {
      try {
        const { crs, isPartial } = await generateCRS(preview);
        setOpenPartialConfirm(false);
        setOpenGenerate(false);
        setOpenDraft(true);

        toast({
          title: "Success",
          description: isPartial
            ? "Draft CRS created successfully! You can continue clarification or edit the document."
            : "CRS created successfully! You can review and submit it for approval.",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to generate CRS. Please try again.",
          variant: "destructive",
        });
      }
    },
    [generateCRS]
  );

  const handleContinueClarification = useCallback(() => {
    setOpenPartialConfirm(false);
    setPreviewData(null);
  }, [setPreviewData]);

  const handleSubmitForReview = useCallback(async () => {
    try {
      await submitForReview();
      setOpenDraft(false);
      toast({
        title: "Success",
        description: "CRS submitted successfully! Your document is now under review by the Business Analyst. You can continue chatting while waiting for the review.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit CRS",
        variant: "destructive",
      });
    }
  }, [submitForReview]);

  const handleRegenerate = useCallback(() => {
    setOpenDraft(false);
    setOpenGenerate(true);
  }, []);

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      <ChatHeader
        chat={chat}
        currentUser={currentUser}
        connectionState={connectionState}
        returnTo={returnTo}
        canGenerateCRS={canGenerateCRS}
        crsId={latestCRS?.id}
        chatTranscript={generateChatTranscript()}
        onGenerateCRS={() => setOpenGenerate(true)}
        onViewCRS={() => setOpenDraft(true)}
        isRejected={isRejected}
        isApproved={isApproved}
      />

      <ChatMessageList
        messages={messages}
        isOwnMessage={isOwnMessage}
        currentUserName={currentUser.full_name}
        wsError={wsError}
        isAiTyping={isAiTyping}
        bottomRef={bottomRef}
      />

      <ChatInputArea
        input={input}
        onInputChange={handleChange}
        onKeyDown={handleKeyDown}
        onSend={handleSend}
        isSending={isSending}
        connectionState={connectionState}
        textareaRef={textareaRef}
        crsPattern={crsPattern}
        onPatternChange={setCrsPattern}
        latestCRS={latestCRS}
      />

      <CRSGenerateDialog
        open={openGenerate}
        onOpenChange={setOpenGenerate}
        onGenerate={handleGenerateCRS}
        isGenerating={isGenerating}
        crsPattern={crsPattern}
      />

      <CRSDraftDialog
        open={openDraft}
        onOpenChange={setOpenDraft}
        latestCRS={latestCRS}
        crsLoading={crsLoading}
        crsError={crsError}
        onSubmitForReview={handleSubmitForReview}
        onRegenerate={handleRegenerate}
        onCRSUpdate={loadCRS}
      />

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
