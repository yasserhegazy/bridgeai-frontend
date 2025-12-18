"use client";

import { motion } from "framer-motion";
import { Bot, HelpCircle, FileText, User, Briefcase } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

// Animation variants for messages
const messageVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 40,
      mass: 1
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

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
      return <Bot className="w-4 h-4" />;
    case "ba":
      return <Briefcase className="w-4 h-4" />;
    case "user":
    default:
      return <User className="w-4 h-4" />;
  }
}

// Get label for message type
function getMessageLabel(type: MessageType, isOwn: boolean): string {
  switch (type) {
    case "ai-clarification":
      return "Bridge AI - Clarification";
    case "ai-crs":
      return "Bridge AI - CRS Generated";
    case "ai":
      return "Bridge AI";
    case "ba":
      return "Business Analyst";
    case "user":
    default:
      return isOwn ? "You" : "Client";
  }
}

// Get styles for message type
function getMessageStyles(type: MessageType, isOwn: boolean) {
  const baseStyles = "rounded-2xl px-4 py-3 max-w-xl shadow-sm border";
  
  switch (type) {
    case "ai-clarification":
      return `${baseStyles} bg-amber-50 border-amber-200 text-gray-900`;
    case "ai-crs":
      return `${baseStyles} bg-emerald-50 border-emerald-200 text-gray-900`;
    case "ai":
      return `${baseStyles} bg-indigo-50 border-indigo-100 text-gray-900`;
    case "ba":
      return `${baseStyles} bg-purple-50 border-purple-200 text-gray-900`;
    case "user":
    default:
      return isOwn
        ? `${baseStyles} bg-[#341bab] border-[#341bab] text-white`
        : `${baseStyles} bg-white border-gray-200 text-gray-800`;
  }
}

// Get header/badge styles for message type
function getHeaderStyles(type: MessageType, isOwn: boolean) {
  switch (type) {
    case "ai-clarification":
      return "text-amber-700 bg-amber-100";
    case "ai-crs":
      return "text-emerald-700 bg-emerald-100";
    case "ai":
      return "text-indigo-700 bg-indigo-100";
    case "ba":
      return "text-purple-700 bg-purple-100";
    case "user":
    default:
      return isOwn ? "text-white/80 bg-white/10" : "text-gray-600 bg-gray-100";
  }
}

export function ChatMessage({ message, isOwn, currentUserName }: ChatMessageProps) {
  const messageType = detectMessageType(message);
  const icon = getMessageIcon(messageType);
  const label = getMessageLabel(messageType, isOwn);
  const containerStyles = getMessageStyles(messageType, isOwn);
  const headerStyles = getHeaderStyles(messageType, isOwn);

  return (
    <motion.div
      layout
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div className={containerStyles}>
        {/* Message Header with Icon and Label */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold mb-2 px-2 py-1 rounded-full ${headerStyles}`}>
          {icon}
          <span>{label}</span>
        </div>

        {/* Message Content */}
        <div className="text-base leading-relaxed">
          {messageType === "ai-crs" || messageType === "ai-clarification" || messageType === "ai" ? (
            <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Timestamp and Status */}
        <div className="flex items-center gap-2 text-xs opacity-70 mt-2">
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.pending && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-wide"
            >
              sending…
            </motion.span>
          )}
          {message.failed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-wide text-red-400"
            >
              failed
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Typing indicator component for AI responses
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start"
    >
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 shadow-sm">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full mb-2">
          <Bot className="w-4 h-4" />
          <span>Bridge AI</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 bg-indigo-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-indigo-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-indigo-400 rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
