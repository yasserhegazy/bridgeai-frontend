"use client";

import { motion } from "framer-motion";
import { Bot, HelpCircle, FileText, User as UserIcon, Briefcase, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export type MessageType = "user" | "ai" | "ai-clarification" | "ai-crs" | "ba";

export interface ChatMessageData {
  id: number;
  session_id: number;
  sender_type: "client" | "ai" | "ba";
  sender_id: number | null;
  content: string;
  timestamp: string;
  pending?: boolean;
  failed?: boolean;
  _localId?: string;
}

interface ChatMessageProps {
  message: ChatMessageData;
  isOwn: boolean;
  currentUserName?: string;
}

// Detect message type based on content patterns
function detectMessageType(message: ChatMessageData): MessageType {
  if (message.sender_type === "ba") return "ba";
  if (message.sender_type === "client") return "user";

  // AI message type detection
  if (message.sender_type === "ai") {
    const content = message.content.toLowerCase();

    // Check for CRS/template filler responses
    if (
      content.includes("✅") ||
      content.includes("crs document") ||
      content.includes("**summary:**") ||
      content.includes("generated a complete") ||
      content.includes("captured your requirements")
    ) {
      return "ai-crs";
    }

    // Check for clarification questions
    if (
      content.includes("i'd like to clarify") ||
      content.includes("clarify a few points") ||
      content.includes("can you provide more details") ||
      content.includes("could you clarify") ||
      content.includes("1.") && content.includes("2.") && content.includes("?")
    ) {
      return "ai-clarification";
    }

    return "ai";
  }

  return "user";
}

// Get icon for message type
function getMessageIcon(type: MessageType) {
  switch (type) {
    case "ai-clarification":
      return <HelpCircle className="w-4 h-4" />;
    case "ai-crs":
      return <FileText className="w-4 h-4" />;
    case "ai":
      return <Sparkles className="w-4 h-4" />;
    case "ba":
      return <Briefcase className="w-4 h-4" />;
    case "user":
    default:
      return <UserIcon className="w-4 h-4" />;
  }
}

export function ChatMessage({ message, isOwn, currentUserName }: ChatMessageProps) {
  const messageType = detectMessageType(message);
  const isUser = isOwn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-2`}
    >
      {/* Content Container */}
      <div
        className={cn("max-w-none w-full flex flex-col transition-all", isUser ? "items-end" : "items-start")}
      >
        {/* Role Labels */}
        <div className={`flex items-center gap-2 mb-2 ${isUser ? "justify-end px-4" : "justify-start px-0"}`}>
          <span className="text-[10px] font-bold tracking-tight text-gray-400">
            {isUser ? "You" : messageType === 'ba' ? 'Business Analyst' : 'Bridge AI'}
          </span>
        </div>

        {/* Content - Bubble for User, Transparent for System */}
        <div
          className={cn(
            "transition-all leading-normal",
            isUser
              ? "bg-chat-user text-gray-900 rounded-[24px] rounded-tr-sm px-6 py-4 shadow-sm max-w-[90%] md:max-w-2xl"
              : "bg-transparent text-gray-900 max-w-none w-full"
          )}
        >
          <div className={cn(
            "prose prose-sm md:prose-base max-w-none transition-all",
            "prose-p:text-gray-900 prose-p:leading-snug prose-p:my-2",
            "prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tighter prose-headings:mt-6 prose-headings:mb-3",
            "prose-ul:my-3 prose-li:my-1.5 prose-strong:text-gray-900 prose-strong:font-black prose-strong:inline",
            "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
            "prose-em:text-gray-900 prose-em:italic",
            isUser ? "prose-code:bg-primary/10 prose-code:text-gray-900" : "prose-code:bg-gray-100 prose-code:text-gray-900"
          )}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>

        {/* Metadata */}
        <div className={`flex items-center gap-3 text-[10px] mt-3 opacity-30 font-bold tracking-tight ${isUser ? 'justify-end px-4' : 'justify-start px-0'}`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {message.pending && (
            <span className="animate-pulse text-primary">Transferring...</span>
          )}
          {message.failed && (
            <span className="text-red-600">Failed</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-4"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white text-primary border border-primary/20 shadow-sm">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="bg-chat-ai border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-12">
        <motion.div
          className="w-1.5 h-1.5 bg-primary/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary/60 rounded-full"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </motion.div>
  );
}
