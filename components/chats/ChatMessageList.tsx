/**
 * ChatMessageList Component
 * Renders the scrollable list of chat messages
 */

"use client";

import { AnimatePresence } from "framer-motion";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { LocalChatMessage } from "@/dto";

interface ChatMessageListProps {
  messages: LocalChatMessage[];
  isOwnMessage: (msg: LocalChatMessage) => boolean;
  currentUserName?: string;
  wsError: string | null;
  isAiTyping: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessageList({
  messages,
  isOwnMessage,
  currentUserName,
  wsError,
  isAiTyping,
  bottomRef,
}: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {wsError && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded">
            {wsError}
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={isOwnMessage(msg)}
              currentUserName={currentUserName}
            />
          ))}
          {isAiTyping && <TypingIndicator key="typing-indicator" />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
