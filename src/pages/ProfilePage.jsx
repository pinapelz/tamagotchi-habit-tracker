import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import LoadingPage from "./Loading";

import snowBg from "../assets/pet_bg/snow.png";
import meadowBg from "../assets/pet_bg/meadow_day.png";

// Helper for randomly picking a background image (but maintaining consistency)
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const backgrounds = [snowBg, meadowBg];

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
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data.");
      }

      const profileData = await response.json();
      setUserProfile(profileData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  getUserProfile();
}, []);

  if (loading)
    return (
      <LoadingPage />
    );
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

  const bio =
    userProfile.bio ||
    "Hi! I'm building good habits with my Tamagotchi. Let's grow together!";

  // Fix: Validate the index before accessing the backgrounds array
  const backgroundIndex = Math.abs(userProfile.user.id.hashCode()) % backgrounds.length;
  const backgroundImage =
    backgroundIndex >= 0 && backgroundIndex < backgrounds.length
      ? backgrounds[backgroundIndex]
      : null;

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName={userProfile.user.display_name}>
      <div
        className="min-h-screen font-sniglet pt-12"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      >
        {/* Main Island */}
        <div className="max-w-5xl mx-auto bg-[#FDFFE9] border border-[#4abe9c] rounded-xl shadow-sm mt-8 p-6 space-y-8">
          {/* User Info Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: User Avatar and Username */}
            <div className="flex flex-col items-center">
              <img
                src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${userProfile.user.display_name}`}
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-[#4abe9c] bg-white shadow mb-2"
              />
              <h1 className="text-2xl font-bold text-[#486085]">
                {userProfile.user.display_name}
              </h1>
            </div>

            {/* Middle: Pet Info */}
            <div className="bg-white px-8 py-3 rounded-xl shadow-sm">
              <div className="text-center">
                <span className="text-lg font-medium text-[#486085]">
                  {userProfile.pet?.name || "No pet"} the {userProfile.pet?.type || "N/A"}
                </span>
                <div className="text-sm text-[#486085]">
                  Level {userProfile.pet?.lvl || 0}
                </div>
              </div>
            </div>

            {/* Right: Pet Image */}
            <div>
              <img
                src="/src/assets/pets/pixel-cat.gif"
                alt="Tamagotchi pet"
                className="w-28 h-28 object-contain"
              />
            </div>
          </div>

          {/* About Me */}
          <div>
            <h2 className="text-[#4abe9c] text-xl font-bold mb-4 pb-2 border-b border-[#4abe9c]">
              About Me
            </h2>
            <p className="text-[#486085]">{bio}</p>
          </div>

          {/* Pet Stats */}
          <div>
            <h2 className="text-[#4abe9c] text-xl font-bold mb-4 pb-2 border-b border-[#4abe9c]">
              Pet Stats
            </h2>
            <div className="flex justify-center py-4">
              <div className="grid grid-cols-4 gap-10 text-center">
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    {userProfile.pet?.name || "No pet"}
                  </div>
                  <div className="text-sm text-gray-500">Pet</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    {userProfile.pet?.lvl || 0}
                  </div>
                  <div className="text-sm text-gray-500">Level</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    {userProfile.stats?.current_streak || 0}
                  </div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    {userProfile.stats?.total_habits_completed || 0}
                  </div>
                  <div className="text-sm text-gray-500">Habits</div>
                </div>
              </div>
            </div>
          </div>
          {/* Lifetime Stats */}
          <div>
            <h2 className="text-[#4abe9c] text-xl font-bold mb-4 pb-2 border-b border-[#4abe9c]">
              Lifetime Stats
            </h2>
            <div className="flex justify-center py-4">
              <div className="grid grid-cols-4 gap-10 text-center">
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    56
                  </div>
                  <div className="text-sm text-gray-500">Longest Day Streak</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    15
                  </div>
                  <div className="text-sm text-gray-500">Highest Level</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    Drinking Water
                  </div>
                  <div className="text-sm text-gray-500">Most Tracked Habit</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#4abe9c]">
                    10
                  </div>
                  <div className="text-sm text-gray-500">Total Habits Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-[#4abe9c] text-xl font-bold mb-4 pb-2 border-b border-[#4abe9c]">
              Achievements
            </h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {userProfile.achievements?.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-[#eaf6f0] px-5 py-3 rounded-lg flex items-center gap-2"
                >
                  <div className="bg-[#4abe9c] text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-[#486085]">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}