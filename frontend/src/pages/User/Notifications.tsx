import { useState, useEffect } from 'react';
import { Bell, CheckCheck, ArrowLeft, Trash2 } from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

interface Notification {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  report_id: string;
  created_at: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handler = () => fetchNotifications();
    window.addEventListener('fcm-message', handler);
    return () => window.removeEventListener('fcm-message', handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true })),
      );
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotif = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleClick = (notif: Notification) => {
    if (!notif.is_read) markAsRead(notif.id);
    if (notif.report_id) navigate(`/report/${notif.report_id}`);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant/10 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <h1 className="font-headline font-bold text-xl text-on-surface">Notifications</h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-fixed transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="max-w-3xl mx-auto px-6 pt-6 pb-8">
          {loading ? (
            <div className="text-center py-20 text-on-surface-variant">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                <Bell className="w-10 h-10 text-on-surface-variant/30" />
              </div>
              <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
                No Notifications Yet
              </h2>
              <p className="font-body text-on-surface-variant text-sm max-w-xs">
                When you get notifications, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    notif.is_read
                      ? 'bg-surface-container-lowest border-outline-variant/10'
                      : 'bg-primary/5 border-primary/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-headline font-bold text-sm ${notif.is_read ? 'text-on-surface' : 'text-primary'}`}>
                        {notif.title}
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant mt-1 line-clamp-2">
                        {notif.body}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/60 mt-2">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotif(notif.id);
                      }}
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low text-on-surface-variant/40 hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
