/**
 * ChatInputArea Component
 * Handles user input for sending messages with modern UI design
 */

"use client";

import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { ConnectionState, CRSDTO } from "@/dto";

interface ChatInputAreaProps {
  input: string;
  onInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  isSending: boolean;
  connectionState: ConnectionState;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  crsPattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories";
  onPatternChange: (pattern: "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories") => void;
  latestCRS: CRSDTO | null;
}

export function ChatInputArea({
  input,
  onInputChange,
  onKeyDown,
  onSend,
  isSending,
  connectionState,
  textareaRef,
  crsPattern,
  onPatternChange,
  latestCRS,
}: ChatInputAreaProps) {
  const isUnderReview = latestCRS?.status === "under_review";
  const isRejected = latestCRS?.status === "rejected";
  const isDisabled = isSending || connectionState !== "open";
  const canSend = input.trim() && !isDisabled;

  return (
    <div className="p-4 bg-gradient-to-t from-chat-bg via-chat-bg to-transparent">
      {isUnderReview && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <div className="font-semibold mb-1">CRS Under Review</div>
          <div className="text-xs">
            Your CRS is currently being reviewed by the BA. You can continue chatting while waiting
            for follow-up questions or new features.
          </div>
        </div>
      )}

      {isRejected && latestCRS?.rejection_reason && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <div className="font-semibold mb-1">Your CRS was rejected</div>
          <div className="text-xs">Feedback: {latestCRS.rejection_reason}</div>
          <div className="text-xs mt-2">
            Please review the feedback and regenerate an improved version.
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="relative bg-chat-input rounded-2xl border border-border shadow-lg shadow-primary/5 transition-shadow duration-200 focus-within:shadow-xl focus-within:shadow-primary/10 focus-within:border-primary/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Message..."
            disabled={isDisabled}
            rows={1}
            className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 min-h-[56px] max-h-[200px]"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSend}
            disabled={!canSend}
            className={`absolute right-3 h-10 w-10 flex items-center justify-center rounded-xl text-white transition-all duration-200 ${canSend ? "bg-[rgb(52,27,171)] hover:bg-[rgb(52,27,171)]/90 shadow-md shadow-purple-200" : "bg-primary/10 text-primary/40 cursor-not-allowed"}`}
            style={{ bottom: "12px", top: "auto" }}
            aria-label="Send message"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex justify-between items-center px-2 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="opacity-70">Pattern:</span>
            <select
              value={crsPattern}
              onChange={(e) =>
                onPatternChange(
                  e.target.value as "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories"
                )
              }
              className="bg-transparent font-medium hover:text-foreground focus:outline-none cursor-pointer transition-colors"
              title="Select the requirements pattern for AI interpretation"
            >
              <option value="babok">BABOK</option>
              <option value="ieee_830">IEEE 830</option>
              <option value="iso_iec_ieee_29148">ISO 29148</option>
              <option value="agile_user_stories">Agile Stories</option>
            </select>
          </div>
          <p>Press Enter to send, Shift + Enter for new line</p>
        </div>
      </motion.div>
    </div>
  );
}
