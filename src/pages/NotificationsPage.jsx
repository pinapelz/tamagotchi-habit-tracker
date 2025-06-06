import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { Bell, Users, Star, PawPrint, MessageSquare, X, Loader2, AlertCircle } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  // Fetch notifications on component mount
    useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/notifications`, {
        credentials: 'include' // Important for cookies
      });
      const data = await response.json();
      
      if (data.status === 'ok') {
        // Format the notifications to match frontend needs
        const formattedNotifications = data.notifications.map(notif => ({
          id: notif.id,
          type: notif.type,
          message: notif.message,
          timestamp: formatTimestamp(notif.created_at),
          read: notif.read
        }));
        setNotifications(formattedNotifications);
      } else {
        throw new Error(data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.status === 'ok') {
        setNotifications(notifications.filter(notif => notif.id !== id));
      } else {
        throw new Error(data.message || 'Failed to delete notification');
      }
    } catch (err) {
      setError('Failed to delete notification');
      console.error('Error deleting notification:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.status === 'ok') {
        setNotifications(notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ));
      } else {
        throw new Error(data.message || 'Failed to mark notification as read');
      }
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    return notif.type === activeFilter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      // case 'friend':
      //   return <Users className="text-[#4abe9c]" size={20} />;
      case 'achievement':
        return <Star className="text-yellow-400" size={20} />;
      case 'pet':
        return <PawPrint className="text-blue-400" size={20} />;
      case 'message':
        return <MessageSquare className="text-indigo-400" size={20} />;
      default:
        return <Bell className="text-gray-400" size={20} />;
    }
  };

    const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName="User">
      <div className="min-h-screen font-sniglet pt-12 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-[#486085] font-medium mb-4">Notifications</h1>
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-[#4abe9c] text-white shadow-md'
                    : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
                }`}
              >
                All
              </button>
              {/* <button
                onClick={() => setActiveFilter('friend')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'friend'
                    ? 'bg-[#4abe9c] text-white shadow-md'
                    : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
                }`}
              >
                Friends
              </button> */}
              <button
                onClick={() => setActiveFilter('achievement')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'achievement'
                    ? 'bg-[#4abe9c] text-white shadow-md'
                    : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
                }`}
              >
                Achievements
              </button>
              <button
                onClick={() => setActiveFilter('pet')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'pet'
                    ? 'bg-[#4abe9c] text-white shadow-md'
                    : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
                }`}
              >
                Pet
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Notifications List */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="text-center py-12 text-[#486085]">
                <Loader2 className="mx-auto mb-4 animate-spin" size={40} />
                <p className="text-lg">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-[#486085]">
                <Bell className="mx-auto mb-4 text-gray-400" size={40} />
                <p className="text-lg">No notifications</p>
                <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${notif.read ? 'bg-blue-50' : ''}`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon/Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-[#4abe9c] flex items-center justify-center">
                          {getNotificationIcon(notif.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[#486085] ${!notif.read ? 'font-medium' : ''}`}>{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notif.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete notification"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
