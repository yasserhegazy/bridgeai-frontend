"use client";

import { useState } from "react";
import { UserRole } from "@/dto/auth.dto";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectionModalProps {
  open: boolean;
  onRoleSelected: (role: UserRole) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface RoleOption {
  value: UserRole;
  title: string;
  icon: typeof Briefcase;
  description: string[];
}

const roleOptions: RoleOption[] = [
  {
    value: "ba",
    title: "Business Analyst",
    icon: Briefcase,
    description: [
      "Create and manage projects",
      "Define requirements and user stories",
      "Collaborate with development teams",
      "Track project progress and analytics",
    ],
  },
  {
    value: "client",
    title: "Client",
    icon: User,
    description: [
      "Submit project requests and requirements",
      "Review and approve deliverables",
      "Communicate with business analysts",
      "Monitor project status",
    ],
  },
];

export function RoleSelectionModal({
  open,
  onRoleSelected,
  isLoading = false,
  error = null,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleConfirm = () => {
    if (selectedRole) {
      onRoleSelected(selectedRole);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-3xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        hideCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Choose Your Role
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Select the role that best describes how you&apos;ll use BridgeAI.
            This will customize your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 my-6">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRole === option.value;

            return (
              <Card
                key={option.value}
                className={cn(
                  "relative cursor-pointer transition-all hover:shadow-md p-6",
                  isSelected
                    ? "border-primary border-2 bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedRole(option.value)}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-4 right-4 h-6 w-6 text-primary" />
                )}

                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={cn(
                      "p-4 rounded-full",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-8 w-8",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      {option.title}
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left">
                      {option.description.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={handleConfirm}
            disabled={!selectedRole || isLoading}
            size="lg"
            className="min-w-[200px]"
          >
            {isLoading ? "Confirming..." : "Confirm Selection"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
