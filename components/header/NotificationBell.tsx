"use client";

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { notificationAPI, Notification } from '@/lib/api-notifications';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      console.log('Fetching notifications from /api/notifications...');
      const data = await notificationAPI.getNotifications();
      console.log('Notifications fetched successfully:', data);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      // Only log once with the error message
      if (error instanceof Error) {
        console.error('Failed to fetch notifications:', error.message);
      } else {
        console.error('Failed to fetch notifications:', error);
      }
      
      // Set empty state on error
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await notificationAPI.markAllAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await notificationAPI.deleteNotification(notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleAcceptInvitation = async (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const result = await notificationAPI.acceptInvitationFromNotification(notificationId);
      await fetchNotifications();
      // Navigate to team dashboard
      router.push(`/teams/${result.team_id}/dashboard`);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      alert('Failed to accept invitation. Please try again.');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Don't navigate if it's an invitation that can be accepted
    if (notification.metadata?.action_type === 'invitation_received') {
      return; // Let the accept button handle navigation
    }

    // Mark as read
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type and metadata
    if (notification.type === 'project_approval' && notification.metadata?.project_id) {
      router.push(`/projects/${notification.metadata.project_id}`);
    } else if (notification.type === 'team_invitation' && notification.metadata?.team_id) {
      router.push(`/teams/${notification.metadata.team_id}/dashboard`);
    }

    setIsOpen(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-96 max-h-[500px] overflow-y-auto p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.type === 'project_approval' 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {notification.type === 'project_approval' ? '📋' : '👥'}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm text-gray-900">
                        {notification.title}
                      </p>
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    
                    {/* Show metadata if available */}
                    {notification.metadata && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                        {notification.metadata.project_name && (
                          <p><strong>Project:</strong> {notification.metadata.project_name}</p>
                        )}
                        {notification.metadata.project_status && (
                          <p><strong>Status:</strong> {notification.metadata.project_status}</p>
                        )}
                        {notification.metadata.team_name && (
                          <p><strong>Team:</strong> {notification.metadata.team_name}</p>
                        )}
                        {notification.metadata.invitation_role && (
                          <p><strong>Role:</strong> {notification.metadata.invitation_role}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      {/* Action button for invitation */}
                      {notification.metadata?.action_type === 'invitation_received' && 
                       notification.metadata?.invitation_token && (
                        <Button
                          size="sm"
                          onClick={(e) => handleAcceptInvitation(notification.id, e)}
                          className="bg-[#341BAB] hover:bg-[#271080] text-white text-xs px-3 py-1 h-7"
                        >
                          Accept Invite
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
