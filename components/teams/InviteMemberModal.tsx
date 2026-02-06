/**
 * Invite Member Modal Component
 * Modal for inviting members to a team
 * Single Responsibility: Member invitation UI
 * Teams are limited to 2 members (Client + BA), roles are auto-assigned based on user type
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Mail, AlertCircle, CheckCircle, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInviteMember } from "@/hooks/teams/useInviteMember";
import { useFormValidation } from "@/hooks/shared/useFormValidation";

interface InviteMemberModalProps {
  teamId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onInviteSent?: () => void;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerSize?: "sm" | "default" | "lg" | "icon";
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
  currentMemberCount?: number;
}

export function InviteMemberModal({
  teamId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onInviteSent,
  triggerClassName,
  triggerLabel = "Invite Member",
  triggerSize = "sm",
  triggerVariant = "primary",
  currentMemberCount = 0
}: InviteMemberModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [email, setEmail] = useState("");

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const { isLoading, error, success, inviteMember, resetSuccess } = useInviteMember();

  // Check if team is at max capacity - REMOVED LIMIT
  const isAtMaxCapacity = false; // currentMemberCount >= 2;

  const validationRules = useMemo(
    () => ({
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        custom: (value: string) => {
          if (!value.trim()) return "Email is required";
          if (!value.includes("@") || !value.includes(".")) {
            return "Please enter a valid email address";
          }
          return null;
        },
      },
    }),
    []
  );

  const { errors, validateAll } = useFormValidation(validationRules);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const isValid = validateAll({ email });
      if (!isValid) return;

      // Role will be auto-assigned by backend based on user's role (client or ba)
      const inviteSuccess = await inviteMember(teamId, {
        email: email.trim(),
        role: "client", // Placeholder, backend will override based on user's actual role
      });

      if (inviteSuccess) {
        // Auto close modal after 2 seconds
        setTimeout(() => {
          setOpen(false);
          resetSuccess();
          onInviteSent?.();
        }, 2000);
      }
    },
    [email, teamId, validateAll, inviteMember, resetSuccess, onInviteSent, setOpen]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setEmail("");
        resetSuccess();
      }
    },
    [resetSuccess, setOpen]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!controlledOpen && (
        <DialogTrigger asChild>
          <Button
            size={triggerSize}
            variant={triggerVariant}
            disabled={isAtMaxCapacity}
            className={cn(
              "flex items-center gap-2",
              triggerClassName
            )}
            title={isAtMaxCapacity ? "Team is at maximum capacity (2 members)" : undefined}
          >
            <Plus className="w-4 h-4" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 outline-none">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Invite Member
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-2">
            Invite a team member by email. Role will be automatically assigned based on their account type (Client or Business Analyst).
          </DialogDescription>
        </DialogHeader>

        {isAtMaxCapacity ? (
          <div className="py-8 text-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Team at Maximum Capacity
            </h3>
            <p className="text-gray-500 text-sm max-w-[300px] mx-auto">
              Teams are limited to 2 members (1 Client + 1 Business Analyst). Please remove a member before inviting someone new.
            </p>
          </div>
        ) : success ? (
          <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Invitation Sent!
            </h3>
            <p className="text-gray-500 text-sm max-w-60 mx-auto">
              An invitation has been sent to <span className="text-primary font-semibold">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex items-start gap-2 text-blue-700">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-medium">
                Team roles (Client or BA) are automatically assigned based on the invited user's account type.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email}</p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-center gap-2 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
            )}

            <DialogFooter className="mt-10 sm:justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
                className="px-6 transition-all hover:scale-105 active:scale-95 font-semibold text-primary border-none hover:bg-primary/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white min-w-40"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                <span>{isLoading ? "Sending..." : "Send Invitation"}</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
