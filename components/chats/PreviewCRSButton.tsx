"use client";

import { useState } from "react";
import { Eye, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CRSPreviewModal } from "./CRSPreviewModal";
import { CRSPreviewOut, fetchCRSPreview, generateDraftCRS } from "@/lib/api-crs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface PreviewCRSButtonProps {
  sessionId: number;
  sessionStatus: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
  onCRSGenerated?: () => void;
}

export function PreviewCRSButton({
  sessionId,
  sessionStatus,
  variant = "outline",
  size = "default",
  showLabel = true,
  className,
  onCRSGenerated,
}: PreviewCRSButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<CRSPreviewOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handlePreview = async () => {
    setLoading(true);
    setIsModalOpen(true);

    try {
      const previewData = await fetchCRSPreview(sessionId);
      setPreview(previewData);
    } catch (error: any) {
      console.error("Failed to fetch CRS preview:", error);

      // Handle specific error cases
      if (error.message?.includes("No CRS content available")) {
        toast({
          title: "Not enough information yet",
          description: "Continue the conversation to provide more details about your requirements.",
          variant: "default",
        });
      } else if (error.message?.includes("404")) {
        toast({
          title: "Session not found",
          description: "Unable to find this chat session.",
          variant: "destructive",
        });
      } else if (error.message?.includes("No messages found")) {
        toast({
          title: "Chat is empty",
          description: "Please start a conversation before generating a CRS.",
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to generate preview",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }

      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    setGeneratingDraft(true);

    try {
      await generateDraftCRS(sessionId);

      toast({
        title: "Draft CRS Generated!",
        description: "Your draft CRS has been saved. You can now view and submit it for review.",
        variant: "default",
      });

      setIsModalOpen(false);

      // Notify parent component to refresh
      if (onCRSGenerated) {
        onCRSGenerated();
      }

      // Refresh the page to show the new CRS
      router.refresh();
    } catch (error: any) {
      console.error("Failed to generate draft CRS:", error);

      toast({
        title: "Failed to generate draft",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingDraft(false);
    }
  };

  // Only show for active sessions
  if (sessionStatus !== "active") {
    return null;
  }

  return (
    <>
      <Button
        onClick={handlePreview}
        disabled={loading}
        variant={variant}
        size={size}
        className={className}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        {showLabel && (
          <span className="ml-2">
            {loading ? "Generating..." : "Preview CRS"}
          </span>
        )}
        {!loading && variant !== "ghost" && (
          <Sparkles className="h-3 w-3 ml-1.5 text-blue-500" />
        )}
      </Button>

      <CRSPreviewModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        preview={preview}
        loading={loading}
        onGenerateDraft={handleGenerateDraft}
        generatingDraft={generatingDraft}
      />
    </>
  );
}
