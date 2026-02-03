/**
 * ChatUI Component - Refactored
 * Main chat interface orchestrating WebSocket connection, messages, and CRS operations
 * Following SOLID principles with extracted hooks and components
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/shared/useModalEnhanced";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInputArea } from "./ChatInputArea";
import { CRSDraftDialog } from "./CRSDraftDialog";
import { CRSGenerateDialog } from "./CRSGenerateDialog";
import { PartialCRSConfirmModal } from "./PartialCRSConfirmModal";
import { CRSPanel } from "./CRSPanel";
import { CRSPerformanceMonitor } from "./CRSPerformanceMonitor";
import { Group, Panel, Separator } from "react-resizable-panels";
import { GripVertical, Plus, MessageSquare, ChevronRight, ChevronLeft, FileText } from "lucide-react";
import {
  useChatSocket,
  useChatMessages,
  useChatCRS,
  useChatInput,
  useChatScroll,
  useChatState,
} from "@/hooks";
import { useCRSPatchApplicator } from "@/hooks/chats/useCRSPatchApplicator";
import { useCRSStream } from "@/hooks/chats/useCRSStream";
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

  // Real-time CRS state is managed by useChatCRS and useCRSStream hooks

  // Managed modals with collision prevention
  const draftModal = useModal(false, { id: "crs-draft-dialog", priority: 2 });
  const generateModal = useModal(false, { id: "crs-generate-dialog", priority: 1 });
  const partialConfirmModal = useModal(false, { id: "partial-crs-confirm", priority: 3 });

  const [returnTo, setReturnTo] = useState<string | undefined>(undefined);
  const [crsPattern, setCrsPattern] = useState<
    "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories"
  >(chat.crs_pattern || "babok");
  const [showDocument, setShowDocument] = useState(true);
  const [isChatOnRight, setIsChatOnRight] = useState(false);

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
    setLatestCRS,
    crsLoading,
    crsError,
    isGenerating,
    setIsGenerating,
    setRecentInsights,
    previewData,
    recentInsights,
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

  // Initialize CRS patch applicator
  const { applyPatchToCRS, getMetrics } = useCRSPatchApplicator();

  // Initialize real-time CRS streaming (SSE)
  const {
    status: crsStreamStatus,
    progress: crsProgress,
    currentStep: crsStep,
    error: crsStreamError,
    retryCount: crsRetryCount,
    isGenerating: isCRSGenerating,
  } = useCRSStream({
    sessionId: chat.id,
    enabled: true,
    onUpdate: (partialTemplate) => {
      // High-frequency update for streaming "Ghost Writing"
      setLatestCRS((prev: any) => {
        const nextContent = typeof partialTemplate === 'string'
          ? partialTemplate
          : JSON.stringify(partialTemplate);

        return {
          ...(prev || {}),
          id: prev?.id || 0,
          project_id: chat.project_id,
          chat_session_id: chat.id,
          status: prev?.status || 'draft',
          pattern: crsPattern,
          content: nextContent,
          updated_at: new Date().toISOString(),
        };
      });
    },
    onProgress: (event) => {
      console.log("[CRS Stream] Progress:", event);

      // Update CRS template in real-time
      if (event.crs_template) {
        const updatedCRS = {
          id: latestCRS?.id || event.crs_document_id || 0,
          project_id: chat.project_id,
          chat_session_id: chat.id,
          status: (event.is_complete ? 'draft' : 'draft') as 'draft',
          pattern: crsPattern,
          version: latestCRS?.version || 1,
          edit_version: latestCRS?.edit_version || 1,
          content: typeof event.crs_template === 'string' ? event.crs_template : JSON.stringify(event.crs_template),
          summary_points: event.summary_points || latestCRS?.summary_points || [],
          created_at: latestCRS?.created_at || new Date().toISOString(),
          updated_at: event.timestamp || new Date().toISOString(),
          created_by: latestCRS?.created_by || null,
        };

        setLatestCRS(updatedCRS);
      }

      // Update insights
      if (event.summary_points || event.overall_summary) {
        setRecentInsights({
          summary_points: event.summary_points || [],
          quality_summary: event.overall_summary || undefined,
        });
      }

      // Show progress toast for major steps
      if (event.step && event.message) {
        toast({
          title: "CRS Generation Progress",
          description: `${event.step}: ${event.message}`,
          duration: 2000,
        });
      }
    },
    onComplete: (event) => {
      console.log("[CRS Stream] Complete:", event);

      // Reload CRS from database to get the persisted version
      if (event.crs_document_id) {
        loadCRS();
      } else {
        // Fallback: Update local state if no document ID
        if (event.crs_template) {
          const finalCRS = {
            id: event.crs_document_id || latestCRS?.id || 0,
            project_id: chat.project_id,
            chat_session_id: chat.id,
            status: 'draft' as const,
            pattern: crsPattern,
            version: latestCRS?.version || 1,
            edit_version: latestCRS?.edit_version || 1,
            content: typeof event.crs_template === 'string' ? event.crs_template : JSON.stringify(event.crs_template),
            summary_points: event.summary_points || [],
            created_at: latestCRS?.created_at || new Date().toISOString(),
            updated_at: event.timestamp || new Date().toISOString(),
            created_by: latestCRS?.created_by || null,
          };

          setLatestCRS(finalCRS);
        }
      }

      // Show completion notification
      if (event.is_complete) {
        toast({
          title: "CRS Generation Complete",
          description: "Your Computer Requirements Specification is ready for review.",
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      console.error("[CRS Stream] Error:", error);
      toast({
        title: "CRS Generation Error",
        description: error,
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Real-time synchronization is now handled directly by useCRSStream and setLatestCRS


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
        onMessage: (msg: any) => {
          addMessage(msg);
          // Update insights from message metadata if present
          if (msg.crs?.summary_points?.length || msg.crs?.quality_summary) {
            setRecentInsights({
              summary_points: msg.crs.summary_points || [],
              quality_summary: msg.crs.quality_summary
            });
          }
        },
        onCRSUpdate: (crsData: any) => {
          console.log('[ChatUI] CRS Update received:', crsData);

          // Hybrid approach: try patch first, fallback to full document
          const { updatedCRS, metrics } = applyPatchToCRS(
            latestCRS,
            crsData.patch,
            crsData.content,
            {
              id: crsData.crs_document_id,
              crs_document_id: crsData.crs_document_id,
              project_id: chat.project_id,
              chat_session_id: chat.id,
              status: crsData.status || 'draft',
              pattern: crsPattern,
              version: crsData.version || 1,
              edit_version: crsData.edit_version || 1,
              summary_points: crsData.summary_points || [],
              created_at: crsData.updated_at || new Date().toISOString(),
              updated_at: crsData.updated_at || new Date().toISOString(),
              created_by: null,
              _metrics: crsData._metrics,
            }
          );

          if (updatedCRS) {
            console.log('[ChatUI] Setting CRS state:', updatedCRS);
            setLatestCRS(updatedCRS);

            // Log performance metrics
            if (crsData._metrics) {
              console.log('[CRS Performance]', {
                backend: crsData._metrics,
                frontend: {
                  applicationTimeMs: metrics.applicationTimeMs,
                  success: metrics.success,
                  usedPatch: !metrics.fallbackToFull
                }
              });

              // Emit performance event for monitoring
              const perfEvent = new CustomEvent('crs-performance-metric', {
                detail: metrics
              });
              window.dispatchEvent(perfEvent);
            }
          } else {
            console.warn('[ChatUI] Failed to create/update CRS from WebSocket data');
          }

          // Always update insights when available
          if (crsData.summary_points || crsData.quality_summary) {
            console.log('[ChatUI] Setting insights:', { summary_points: crsData.summary_points, quality_summary: crsData.quality_summary });
            setRecentInsights({
              summary_points: crsData.summary_points || [],
              quality_summary: crsData.quality_summary
            });
          }
        },
        onCRSComplete: loadCRS,
        onStatusUpdate: (status, isGenerating) => {
          setIsGenerating(isGenerating);
          if (isGenerating) showAiTyping();
        }
      });
    },
    [handleWebSocketMessage, addMessage, loadCRS, setLatestCRS, setIsGenerating, setRecentInsights, showAiTyping, chat.id, chat.project_id]
  );

  // Initialize WebSocket connection
  const { sendMessage, isConnected } = useChatSocket({
    sessionId: chat.id,
    projectId: chat.project_id,
    apiBase: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
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
    if (draftModal.isOpen && chat.id) {
      loadCRS();
    }
  }, [draftModal.isOpen, chat.id, loadCRS]);

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
        generateModal.closeModal();
        partialConfirmModal.openModal();
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
  }, [fetchPreview, generateModal, partialConfirmModal, toast]);

  const confirmGenerateCRS = useCallback(
    async (preview: any) => {
      try {
        const { crs, isPartial } = await generateCRS(preview);
        partialConfirmModal.closeModal();
        generateModal.closeModal();
        draftModal.openModal();

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
    [generateCRS, partialConfirmModal, generateModal, draftModal, toast]
  );

  const handleContinueClarification = useCallback(() => {
    partialConfirmModal.closeModal();
    setPreviewData(null);
  }, [setPreviewData, partialConfirmModal]);

  const handleSubmitForReview = useCallback(async () => {
    try {
      await submitForReview();
      draftModal.closeModal();
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
  }, [submitForReview, draftModal, toast]);

  const handleRegenerate = useCallback(() => {
    draftModal.closeModal();
    generateModal.openModal();
  }, [draftModal, generateModal]);

  const handleSwapSide = useCallback(() => {
    setIsChatOnRight(prev => !prev);
  }, []);

  const documentPanel = (
    <Panel defaultSize={35} minSize={30} className="flex-1 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="relative h-full">
        <CRSPanel
          latestCRS={latestCRS}
          crsLoading={crsLoading}
          crsError={crsError}
          isGenerating={isGenerating || isCRSGenerating}
          chat={chat}
          crsId={latestCRS?.id}
          chatTranscript={generateChatTranscript()}
          onGenerateCRS={() => generateModal.openModal()}
          onViewCRS={() => draftModal.openModal()}
          onSubmitForReview={handleSubmitForReview}
          onRegenerate={handleRegenerate}
          onStatusUpdate={loadCRS}
          recentInsights={recentInsights}
          canGenerateCRS={canGenerateCRS}
          isRejected={isRejected}
          isApproved={isApproved}
          // Real-time streaming status
          streamStatus={crsStreamStatus}
          streamProgress={crsProgress}
          streamStep={crsStep}
          streamError={crsStreamError}
          streamRetryCount={crsRetryCount}
        />
      </div>
    </Panel>
  );

  const chatPanel = (
    <Panel defaultSize={65} minSize={34} className="flex h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative">
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ChatHeader
          chat={chat}
          currentUser={currentUser}
          connectionState={connectionState}
          returnTo={returnTo || "/dashboard"}
          canGenerateCRS={canGenerateCRS}
          crsId={latestCRS?.id}
          chatTranscript={generateChatTranscript()}
          onGenerateCRS={() => generateModal.openModal()}
          onViewCRS={() => draftModal.openModal()}
          onToggleDocument={() => setShowDocument(prev => !prev)}
          onSwapSide={handleSwapSide}
          isRejected={isRejected}
          isApproved={isApproved}
          showDocument={showDocument}
        />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <ChatMessageList
            messages={messages}
            isOwnMessage={isOwnMessage}
            currentUserName={currentUser.full_name || "You"}
            wsError={wsError}
            isAiTyping={isAiTyping}
            bottomRef={bottomRef}
          />

          {/* View Specification Floating Button when collapsed */}
          {!showDocument && (
            <div className={`absolute top-8 ${isChatOnRight ? 'left-8' : 'right-8'} z-50 pointer-events-none`}>
              <motion.button
                initial={{ x: isChatOnRight ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDocument(true)}
                className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-md text-gray-900 rounded-full shadow-lg border border-gray-100 hover:bg-white transition-all font-bold text-[10px] tracking-tight"
              >
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>View specification</span>
              </motion.button>
            </div>
          )}
        </div>

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
      </div>
    </Panel>
  );

  return (
    <div className="flex w-full h-full bg-[#FAFBFC] overflow-hidden relative p-4 lg:p-6 transition-all">
      <Group orientation="horizontal">
        {isChatOnRight ? (
          <>
            {showDocument && (
              <>
                {documentPanel}
                <Separator className="w-4 bg-transparent flex items-center justify-center cursor-col-resize group z-20">
                  <div className="w-1.5 h-12 bg-gray-200 group-hover:bg-primary/40 rounded-full transition-all" />
                </Separator>
              </>
            )}
            {chatPanel}
          </>
        ) : (
          <>
            {chatPanel}
            {showDocument && (
              <>
                <Separator className="w-4 bg-transparent flex items-center justify-center cursor-col-resize group z-20">
                  <div className="w-1.5 h-12 bg-gray-200 group-hover:bg-primary/40 rounded-full transition-all" />
                </Separator>
                {documentPanel}
              </>
            )}
          </>
        )}
      </Group>

      {/* Dialogs - Managed by ModalManager */}
      <CRSGenerateDialog
        open={generateModal.isOpen}
        onOpenChange={(open) => !open && generateModal.closeModal()}
        onGenerate={handleGenerateCRS}
        isGenerating={isGenerating}
        crsPattern={crsPattern}
      />

      <CRSDraftDialog
        open={draftModal.isOpen}
        onOpenChange={(open) => !open && draftModal.closeModal()}
        latestCRS={latestCRS}
        crsLoading={crsLoading}
        crsError={crsError}
        onSubmitForReview={handleSubmitForReview}
        onRegenerate={handleRegenerate}
        onCRSUpdate={loadCRS}
      />

      {previewData && (
        <PartialCRSConfirmModal
          open={partialConfirmModal.isOpen}
          onOpenChange={(open) => !open && partialConfirmModal.closeModal()}
          completenessPercentage={previewData.completeness_percentage}
          missingRequiredFields={previewData.missing_required_fields}
          weakFields={previewData.weak_fields}
          onConfirmGenerate={() => confirmGenerateCRS(previewData)}
          onContinueClarification={handleContinueClarification}
          isGenerating={isGenerating}
        />
      )}

      {/* Performance Monitor (enable in development) */}
      <CRSPerformanceMonitor enabled={process.env.NODE_ENV === 'development'} />
    </div>
  );
}
