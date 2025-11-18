"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { invitationAPI, InvitationRequest } from "@/lib/api-invitations";

interface InviteMemberModalProps {
  teamId: string;
  onInviteSent?: () => void;
  triggerClassName?: string;
  triggerLabel?: string;
  triggerSize?: "sm" | "default" | "lg" | "icon";
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
}

interface FormErrors {
  email?: string;
  role?: string;
  general?: string;
}

export function InviteMemberModal({ 
  teamId, 
  onInviteSent, 
  triggerClassName,
  triggerLabel = "Invite Member",
  triggerSize = "sm",
  triggerVariant = "primary"
}: InviteMemberModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitationRequest['role']>("member");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate role
    if (!role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      await invitationAPI.sendInvitation(teamId, {
        email: email.trim(),
        role,
      });

      setSuccess(true);
      setEmail("");
      setRole("member");
      
      // Auto close modal after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        onInviteSent?.();
      }, 2000);

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Failed to send invitation"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setEmail("");
      setRole("member");
      setErrors({});
      setSuccess(false);
    }
  };

  const roleOptions = [
    { value: "viewer" as const, label: "Viewer", description: "Can view team content" },
    { value: "member" as const, label: "Member", description: "Can contribute to projects" },
    { value: "admin" as const, label: "Admin", description: "Can manage team settings" },
    { value: "owner" as const, label: "Owner", description: "Full control over the team" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className={cn(errors.email && "border-red-500 focus:ring-red-500")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <Select value={role} onValueChange={(value: InvitationRequest['role']) => setRole(value)}>
                <SelectTrigger className={cn(errors.role && "border-red-500")}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role}
                </p>
              )}
            </div>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.general}
                </p>
              </div>
            )}

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