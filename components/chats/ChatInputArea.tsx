/**
 * ChatInputArea Component
 * Handles user input for sending messages with modern UI design
 */

"use client";

import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import { motion } from "framer-motion";
import { ArrowUp, AlertCircle } from "lucide-react";
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
    <div className="px-8 py-8 bg-white border-t border-gray-100 z-10 transition-all">
      {isUnderReview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl text-blue-900 shadow-sm overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-black text-lg italic">i</span>
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">Active Review Phase</div>
              <div className="text-xs text-blue-800/60 mt-1 leading-relaxed font-medium">
                The current specification is with the Business Analyst. You can continue detailing your requirements below.
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isRejected && latestCRS?.rejection_reason && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 p-5 bg-red-50/50 border border-red-100 rounded-2xl text-red-900 shadow-sm overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="font-bold text-sm text-red-900 tracking-tight">Revision Necessary</div>
              <div className="text-xs text-red-800/60 mt-1 whitespace-pre-wrap font-medium leading-relaxed">{latestCRS.rejection_reason}</div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="w-full max-w-[1200px] mx-auto relative group">
        <div className="flex items-center gap-2 bg-gray-50/80 rounded-[32px] border border-gray-200/60 p-2 transition-all duration-500 focus-within:bg-white focus-within:border-primary/40 focus-within:shadow-[0_20px_50px_-12px_rgba(32,32,32,0.1)]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Type your requirements or feedback..."
            disabled={isDisabled}
            rows={1}
            className="flex-1 resize-none bg-transparent px-6 py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 min-h-[56px] max-h-[200px] text-base leading-snug t-custom-scrollbar font-medium"
          />

          <div className="flex items-center pr-2">
            <motion.button
              whileHover={canSend ? { scale: 1.05, y: -2 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
              onClick={onSend}
              disabled={!canSend}
              className={`h-11 w-11 flex items-center justify-center rounded-2xl text-white transition-all duration-300 shadow-xl ${canSend
                ? "bg-primary hover:bg-primary-dark shadow-primary/30"
                : "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed opacity-50"
                }`}
              aria-label="Send message"
            >
              <ArrowUp className="w-5 h-5 stroke-[3]" />
            </motion.button>
          </div>
        </div>

        <div className="flex justify-between items-center px-6 mt-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] hover:bg-white hover:border-primary/20 transition-all cursor-pointer group/pattern relative">
              <span className="opacity-50">Pattern:</span>
              <select
                value={crsPattern}
                onChange={(e) =>
                  onPatternChange(
                    e.target.value as "iso_iec_ieee_29148" | "ieee_830" | "babok" | "agile_user_stories"
                  )
                }
                className="bg-transparent text-primary focus:outline-none cursor-pointer font-black"
              >
                <option value="babok">BABOK Professional</option>
                <option value="ieee_830">IEEE 830 Classic</option>
                <option value="iso_iec_ieee_29148">ISO 29148 Global</option>
                <option value="agile_user_stories">Agile User Stories</option>
              </select>
            </div>
          </div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50/50 px-4 py-1.5 rounded-full border border-gray-100/30">
            Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
