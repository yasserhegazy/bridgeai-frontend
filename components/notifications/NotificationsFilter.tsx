/**
 * Notifications Filter Component
 * Filters for notification list
 * Single Responsibility: Filter UI
 */

"use client";

import { Button } from "@/components/ui/button";

interface NotificationsFilterProps {
  filter: "all" | "unread";
  onFilterChange: (filter: "all" | "unread") => void;
}

export function NotificationsFilter({
  filter,
  onFilterChange,
}: NotificationsFilterProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>
      <Button
        variant={filter === "unread" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("unread")}
      >
        Unread
      </Button>
    </div>
  );
}
