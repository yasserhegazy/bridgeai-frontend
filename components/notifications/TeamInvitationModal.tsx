"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Users } from "lucide-react";
import { invitationAPI, InvitationPublicDetails } from "@/lib/api-invitations";
import { notificationAPI } from "@/lib/api-notifications";
import { showToast } from "@/components/notifications/NotificationToast";

export type TeamInvitationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationToken: string | null;
  notificationId?: number;
  onResolved?: () => void;
};

export function TeamInvitationModal({
  open,
  onOpenChange,
  invitationToken,
  notificationId,
  onResolved,
}: TeamInvitationModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<"accept" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<InvitationPublicDetails | null>(null);

  const token = useMemo(() => invitationToken ?? "", [invitationToken]);

  useEffect(() => {
    if (!open) {
      setError(null);
      setDetails(null);
      setLoading(false);
      setActing(null);
      return;
    }

    if (!token) {
      setError("Missing invitation token");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await invitationAPI.getInvitationDetails(token);
        if (!cancelled) setDetails(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load invitation");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, token]);

  const handleAccept = async () => {
    if (!token) return;
    try {
      setActing("accept");
      setError(null);

      // Prefer accepting via notification endpoint (marks it read + avoids relying on token state)
      const result = notificationId
        ? await notificationAPI.acceptInvitationFromNotification(notificationId)
        : await invitationAPI.acceptInvitation(token);

      showToast({
        type: "success",
        title: "Invitation accepted",
        message: "You have joined the team successfully",
      });

      onOpenChange(false);
      onResolved?.();

      const teamId = (result as any).team_id;
      if (teamId) {
        router.push(`/teams/${teamId}/dashboard`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to accept invitation");
    } finally {
      setActing(null);
    }
  };

  const handleReject = async () => {
    if (!token) return;

    try {
      setActing("reject");
      setError(null);

      await invitationAPI.rejectInvitation(token);

      if (notificationId) {
        // Make UX consistent: treat a rejection as "handled"
        await notificationAPI.markAsRead(notificationId);
      }

      showToast({
        type: "success",
        title: "Invitation rejected",
        message: "You declined the invitation",
      });

      onOpenChange(false);
      onResolved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to reject invitation");
    } finally {
      setActing(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Invitation
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#341BAB] mx-auto mb-3" />
            Loading invitation details...
          </div>
        ) : error ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <div>{error}</div>
          </div>
        ) : details ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-semibold text-gray-900">{details.team_name}</div>
              {details.team_description && (
                <div className="text-sm text-gray-700 mt-1">{details.team_description}</div>
              )}
              <div className="text-sm text-gray-700 mt-2">
                Invited by: <span className="font-medium">{details.invited_by_name}</span>
                {details.invited_by_email ? ` (${details.invited_by_email})` : ""}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Expires: {formatDate(details.expires_at)}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={acting !== null}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={acting !== null}
              >
                {acting === "reject" ? "Rejecting..." : "Reject"}
              </Button>
              <Button
                className="bg-[#341BAB] hover:bg-[#271080]"
                onClick={handleAccept}
                disabled={acting !== null}
              >
                {acting === "accept" ? "Accepting..." : "Accept"}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
