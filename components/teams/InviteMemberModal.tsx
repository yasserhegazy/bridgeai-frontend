/**
 * Invite Member Modal Component
 * Modal for inviting members to a team
 * Single Responsibility: Member invitation UI
 */

"use client";

import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/auth/FormField";
import { FormSelect, SelectOption } from "@/components/auth/FormSelect";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
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
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite Team Member
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invitation Sent!
            </h3>
            <p className="text-gray-600">
              An invitation has been sent to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              They will receive an email with instructions to join the team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              placeholder="Enter email address"
              disabled={isLoading}
              required
            />

            <FormSelect
              id="role"
              label="Role"
              value={role}
              onChange={(value) => setRole(value as MemberRole)}
              options={ROLE_OPTIONS}
              error={errors.role}
              placeholder="Select a role"
              disabled={isLoading}
            />

            {error && <ErrorAlert message={error} />}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#341BAB] hover:bg-[#271080]"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
