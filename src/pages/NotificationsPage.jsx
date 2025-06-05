import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { Bell, Users, Star, PawPrint, MessageSquare, X } from "lucide-react";

// Mock notifications data
const exampleNotifications = [
  {
    id: 1,
    type: "friend",
    message: "PetLover123 has reached Level 10!",
    timestamp: "2 hours ago",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PetLover123"
  },
  {
    id: 2,
    type: "achievement",
    message: "You earned a new badge: Daily Streak!",
    timestamp: "1 day ago",
    icon: "🏆"
  },
  {
    id: 3,
    type: "pet",
    message: "Your pet Fluffy is feeling very happy today!",
    timestamp: "3 days ago",
    icon: "🐱"
  },
  {
    id: 4,
    type: "message",
    message: "New message from TamaQueen: 'Great job on your streak!'",
    timestamp: "1 week ago",
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=TamaQueen"
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(exampleNotifications);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'all') return true;
    return notif.type === activeFilter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend':
        return <Users className="text-[#4abe9c]" size={20} />;
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
              <button
                onClick={() => setActiveFilter('friend')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'friend'
                    ? 'bg-[#4abe9c] text-white shadow-md'
                    : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
                }`}
              >
                Friends
              </button>
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

          {/* Notifications List */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-[#486085]">
                <Bell className="mx-auto mb-4 text-gray-400" size={40} />
                <p className="text-lg">No notifications</p>
                <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon/Avatar */}
                      <div className="flex-shrink-0">
                        {notif.avatar ? (
                          <img
                            src={notif.avatar}
                            alt="avatar"
                            className="w-10 h-10 rounded-full border-2 border-[#4abe9c]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#4abe9c] flex items-center justify-center">
                            {getNotificationIcon(notif.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#486085]">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleDelete(notif.id)}
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
