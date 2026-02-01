/**
 * ChatHeader Component
 * Displays chat session information and connection status
 */

"use client";

import { ArrowLeft, WifiOff, Loader2, MoreVertical, Eye, Sparkles, FileText, CheckCircle2, Download, Layout, PanelRightClose, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConnectionState, ChatSessionDTO, CurrentUserDTO } from "@/dto";
import { ExportButton } from "@/components/shared/ExportButton"; // We'll keep it for the functionality but wrap it or use its logic
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  chat: ChatSessionDTO;
  currentUser: CurrentUserDTO;
  connectionState: ConnectionState;
  returnTo: string;
  canGenerateCRS: boolean;
  onGenerateCRS: () => void;
  onViewCRS: () => void;
  onToggleDocument: () => void;
  onSwapSide: () => void;
  isRejected: boolean;
  isApproved: boolean;
  showDocument: boolean;
  crsId?: number;
  chatTranscript: string;
}

export function ChatHeader({
  chat,
  currentUser,
  connectionState,
  returnTo,
  canGenerateCRS,
  crsId,
  chatTranscript,
  onGenerateCRS,
  onViewCRS,
  onToggleDocument,
  onSwapSide,
  isRejected,
  isApproved,
  showDocument,
}: ChatHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
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
  };

  return (
    <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-60">
      {/* Session Info */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(returnTo)}
          className="rounded-xl hover:bg-primary/5 hover:text-primary transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900 leading-tight">
              {chat.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`flex h-1.5 w-1.5 rounded-full ${connectionState === "open"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
                  }`}
              />
              <p className="text-[10px] text-gray-500 font-bold tracking-tight">
                {connectionState === "open"
                  ? "Active session"
                  : "Disconnected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Dropdown */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all border border-transparent hover:border-gray-200"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-gray-100 backdrop-blur-xl bg-white/95">
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 tracking-tight border-b border-gray-50 mb-1">
              Session controls
            </div>

            <div className="flex flex-col gap-0.5 mt-1">
              <DropdownMenuItem
                onClick={onToggleDocument}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 focus:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {showDocument ? <PanelRightClose className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </div>
                {showDocument ? "Collapse document" : "Show document"}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onSwapSide}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 focus:bg-gray-50 transition-all cursor-pointer group"
              >
                <Layout className="w-4 h-4 text-gray-400 group-focus:text-gray-900 transition-colors" />
                Swap panel side
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
