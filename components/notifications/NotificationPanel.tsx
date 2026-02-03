"use client";

import { useState, useEffect } from 'react';
import { Bell, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { notificationAPI, Notification } from '@/lib/api-notifications';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { showToast } from './NotificationToast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

type FilterType = 'all' | 'unread' | 'project' | 'team' | 'crs';

export function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      // Check if user is authenticated before fetching
      const token = typeof window !== 'undefined' ? document.cookie.split(';').find(c => c.trim().startsWith('token=')) : null;
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }

      const data = await notificationAPI.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      // Silently handle errors
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'project') return n.type === 'project_approval';
    if (filter === 'team') return n.type === 'team_invitation';
    if (filter === 'crs') return n.type.startsWith('crs_');
    return true;
  });

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationAPI.markAsRead(id);
      await fetchNotifications();
      showToast({
        type: 'success',
        title: 'Marked as read',
        message: 'Notification marked as read'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to mark as read'
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationAPI.deleteNotification(id);
      await fetchNotifications();
      showToast({
        type: 'success',
        title: 'Deleted',
        message: 'Notification deleted'
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete notification'
      });
    }
  };

  const getStatusIcon = (notification: Notification) => {
    if (notification.metadata?.project_status === 'approved') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (notification.metadata?.project_status === 'pending') {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    if (notification.metadata?.project_status === 'rejected') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="md" message="Loading notifications..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-[#341BAB]" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => notificationAPI.markAllAsRead().then(fetchNotifications)}
        >
          Mark all as read
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'unread', 'project', 'team', 'crs'] as FilterType[]).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? 'bg-[#341BAB] hover:bg-[#271080]' : ''}
          >
            {f === 'crs' ? 'CRS' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${!notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(notification)}
                    <h3 className="font-semibold">{notification.title}</h3>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  {notification.metadata?.project_status && (
                    <StatusBadge status={notification.metadata.project_status as any} />
                  )}
                </div>
                <div className="flex gap-2">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notification.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
