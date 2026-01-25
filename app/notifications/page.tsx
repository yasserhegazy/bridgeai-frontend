"use client";

import { useState, useEffect } from 'react';
import { notificationAPI, Notification } from '@/lib/api-notifications';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TeamInvitationModal } from '@/components/notifications/TeamInvitationModal';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeInviteToken, setActiveInviteToken] = useState<string | null>(null);
  const [activeInviteNotificationId, setActiveInviteNotificationId] = useState<number | undefined>(undefined);

  const fetchNotifications = async () => {
    try {
      // Check if user is authenticated before fetching
      const token = typeof window !== 'undefined' ? document.cookie.split(';').find(c => c.trim().startsWith('token=')) : null;
      if (!token) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await notificationAPI.getNotifications(filter === 'unread');
      setNotifications(data.notifications || []);
    } catch (error) {
      // Silently handle errors
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const openInvitationModal = (notification: Notification) => {
    const token = notification.metadata?.invitation_token as string | undefined;
    if (!token) return;

    setActiveInviteToken(token);
    setActiveInviteNotificationId(notification.id);
    setInviteModalOpen(true);
  };

  return (
    <div className="p-6 mt-15">
      <TeamInvitationModal
        open={inviteModalOpen}
        onOpenChange={(open) => {
          setInviteModalOpen(open);
          if (!open) {
            setActiveInviteToken(null);
            setActiveInviteNotificationId(undefined);
          }
        }}
        invitationToken={activeInviteToken}
        notificationId={activeInviteNotificationId}
        onResolved={fetchNotifications}
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#341BAB]"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p>No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg ${
                !notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'
              }`}
              onClick={() => {
                if (notification.metadata?.action_type === 'invitation_received' && notification.metadata?.invitation_token) {
                  openInvitationModal(notification);
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
                  <p className="text-xs text-gray-400 mt-2">{formatDate(notification.created_at)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
