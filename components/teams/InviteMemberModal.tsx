/**
 * Invite Member Modal Component
 * Modal for inviting members to a team
 * Single Responsibility: Member invitation UI
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormSelect, SelectOption } from "@/components/auth/FormSelect";
import { useInviteMember } from "@/hooks/teams/useInviteMember";
import { useFormValidation } from "@/hooks/shared/useFormValidation";
import { MemberRole } from "@/dto/teams.dto";

interface InviteMemberModalProps {
  teamId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onInviteSent?: () => void;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerSize?: "sm" | "default" | "lg" | "icon";
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
}

const ROLE_OPTIONS: SelectOption[] = [
  { value: "viewer", label: "Viewer" },
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "owner", label: "Owner" },
];

export function InviteMemberModal({
  teamId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onInviteSent,
  triggerClassName,
  triggerLabel = "Invite Member",
  triggerSize = "sm",
  triggerVariant = "primary"
}: InviteMemberModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("member");

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const { isLoading, error, success, inviteMember, resetSuccess } = useInviteMember();

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
      role: {
        required: true,
        custom: (value: string) => {
          if (!value) return "Role is required";
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

      const isValid = validateAll({ email, role });
      if (!isValid) return;

      const inviteSuccess = await inviteMember(teamId, {
        email: email.trim(),
        role,
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
    [email, role, teamId, validateAll, inviteMember, resetSuccess, onInviteSent]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setEmail("");
        setRole("member");
        resetSuccess();
      }
    },
    [resetSuccess]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!controlledOpen && (
        <DialogTrigger asChild>
          <Button
            size={triggerSize}
            variant={triggerVariant}
            className={cn(
              "flex items-center gap-2",
              triggerClassName
            )}
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
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Invitation Sent!
            </h3>
            <p className="text-gray-500 text-sm max-w-[240px] mx-auto">
              An invitation has been sent to <span className="text-primary font-semibold">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-3">
              <FormSelect
                label="Team Role"
                id="role"
                value={role}
                onChange={(value) => setRole(value as MemberRole)}
                options={ROLE_OPTIONS}
                error={errors.role}
                placeholder="Select a role"
                disabled={isLoading}
              />
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
                className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 px-8 border-none font-semibold text-white min-w-[160px]"
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
