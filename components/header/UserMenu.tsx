"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLORS } from "@/constants";
import { CurrentUserDTO } from "@/dto/auth.dto";

interface UserMenuProps {
  user: CurrentUserDTO | null;
  onLogout: () => void;
  onProfileClick: () => void;
}

function getUserInitials(fullName?: string): string {
  if (!fullName) return "U";

  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 0) return "U";
  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase();
  }

  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

  return firstInitial + lastInitial;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function UserMenu({ user, onLogout, onProfileClick }: UserMenuProps) {
  const getAvatarUrl = () => {
    if (!user?.avatar_url) return null;
    // Google avatars start with http
    if (user.avatar_url.startsWith("http")) return user.avatar_url;
    // Local avatars need backend URL prepended
    return `${API_BASE_URL}/${user.avatar_url}`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full w-8 h-8 flex items-center justify-center p-0 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
          style={{ backgroundColor: avatarUrl ? "transparent" : COLORS.primary, color: COLORS.textLight }}
          onClick={onProfileClick}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.full_name || "User avatar"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="font-semibold text-sm">
              {getUserInitials(user?.full_name)}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="text-sm cursor-pointer"
          onClick={onProfileClick}
        >
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-sm text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
