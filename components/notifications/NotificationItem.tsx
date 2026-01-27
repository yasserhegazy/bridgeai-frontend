/**
 * Notification Item Component
 * Single notification display
 * Single Responsibility: Render individual notification
 */

"use client";

import { NotificationDTO } from "@/dto/notifications.dto";

interface NotificationItemProps {
  notification: NotificationDTO;
  onMarkAsRead?: (id: number) => void;
  onClick?: () => void;
}

/**
 * Format date string to locale string
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onClick,
}: NotificationItemProps) {
  const isInvitation =
    notification.metadata?.action_type === "invitation_received" &&
    notification.metadata?.invitation_token;

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        !notification.is_read
          ? "bg-blue-50 border-blue-200"
          : "bg-white hover:bg-gray-50"
      }`}
      onClick={() => {
        if (isInvitation && onClick) {
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{notification.title}</h3>
            {!notification.is_read && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

          {notification.metadata && (
            <div className="text-xs text-gray-500 space-y-1">
              {notification.metadata.project_name && (
                <p>Project: {notification.metadata.project_name}</p>
              )}
              {notification.metadata.team_name && (
                <p>Team: {notification.metadata.team_name}</p>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">
            {formatDate(notification.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
