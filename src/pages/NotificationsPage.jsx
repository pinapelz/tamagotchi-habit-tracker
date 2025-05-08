import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import snowBg from "../assets/pet_bg/snow.png";
import meadowBg from "../assets/pet_bg/meadow_day.png";
import LoadingPage from "./Loading";
import { fetchUserProfile } from "../utils/profileHelpers";

// Temporary placeholder notifications
const exampleNotifications = [
  {
    id: 1,
    type: "friend",
    message: "FRIEND1 has reached Level 10!",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "system",
    message: "You earned a new badge: Daily Streak!",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    type: "pet",
    message: "Your pet Fluffy is feeling very happy today!",
    timestamp: "3 days ago",
  },
];

export default function NotificationsPage({ userId }) {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  

    const backgrounds = [snowBg, meadowBg];
    const backgroundIndex = userId
        ? userId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        backgrounds.length
        : 0;
    const backgroundImage = backgrounds[backgroundIndex];

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const getUserProfile = async () => {
        try {
            const profileData = await fetchUserProfile(userId);
            setUserProfile(profileData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };
        getUserProfile();
    }, [userId]);

    if (loading) return <LoadingPage />;
    if (error)
        return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
            Error: {error}
        </div>
        );
    if (!userProfile)
        return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
            No profile found.
        </div>
        );

    const LayoutComponent = isMobile ? MobileLayout : Layout;
    

  return (
    <LayoutComponent userName={userProfile.username}>
      <div
        className="min-h-screen font-sniglet pt-12"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      >
        <div className="max-w-3xl mx-auto bg-[#FDFFE9] border border-[#4abe9c] rounded-xl shadow-sm mt-8 p-4 sm:p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-[#4abe9c]">
            Notifications
          </h1>

          {exampleNotifications.length === 0 ? (
            <div className="text-center text-[#486085] text-lg">
              No new notifications.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {exampleNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <div className="text-[#486085]">{notif.message}</div>
                    <div className="text-xs text-gray-400">
                      {notif.timestamp}
                    </div>
                  </div>
                  {notif.type === "friend" && (
                    <span className="text-[#4abe9c] font-bold text-sm">🎉</span>
                  )}
                  {notif.type === "system" && (
                    <span className="text-[#fbbf24] font-bold text-sm">⭐</span>
                  )}
                  {notif.type === "pet" && (
                    <span className="text-[#60a5fa] font-bold text-sm">🐾</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LayoutComponent>
  );
}
