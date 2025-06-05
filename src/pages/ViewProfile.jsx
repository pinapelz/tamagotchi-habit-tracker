import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import LoadingPage from "./Loading";
import { UserPlus, MessageSquare } from "lucide-react";

export default function ViewProfile() {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);

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
        // Mock data for testing
        const mockProfile = {
          user: {
            id: userId,
            display_name: "PetLover123",
            avatar_url: null,
          },
          pet: {
            name: "Toto",
            type: "cat",
            lvl: 5,
            happiness: 85,
            xp: 250,
            health: 100
          },
          stats: {
            current_streak: 12,
            longest_streak: 30,
            total_habits_completed: 45
          },
          bio: "Hi! I'm building good habits with my Tamagotchi. Let's grow together!",
          achievements: [
            "7 Day Streak",
            "Early Bird",
            "Hydration Hero",
            "Fitness Fanatic"
          ]
        };

        setUserProfile(mockProfile);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getUserProfile();
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsRequestSent(true);
    } catch (err) {
      setError("Failed to send friend request");
    }
  };

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
    <LayoutComponent userName={userProfile.user.display_name}>
      <div
        className="min-h-screen font-sniglet pt-12 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]"
      >
        {/* Main Island */}
        <div className="max-w-3xl mx-auto bg-[#FDFFE9] border border-[#4abe9c] rounded-xl shadow-sm mt-8 p-4 sm:p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <img
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${userProfile.user.display_name}`}
              alt="avatar"
              className="w-16 h-16 rounded-full border-4 border-[#4abe9c] bg-white shadow"
            />
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-xl text-[#486085] font-medium">
                {userProfile.user.display_name}
              </h1>
              <p className="text-sm text-[#486085] mt-1">
                {userProfile.pet?.name || "No pet"} the {userProfile.pet?.type || "N/A"} • Level {userProfile.pet?.lvl || 0}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isFriend && !isRequestSent && (
                <button
                  onClick={handleAddFriend}
                  className="bg-[#4abe9c] text-white p-2 rounded-lg hover:bg-[#3a9880] transition-colors"
                  title="Add Friend"
                >
                  <UserPlus size={20} />
                </button>
              )}
              {isRequestSent && (
                <button
                  disabled
                  className="bg-gray-300 text-gray-600 p-2 rounded-lg cursor-not-allowed"
                  title="Request Sent"
                >
                  <UserPlus size={20} />
                </button>
              )}
              <button 
                className="bg-[#486085] text-white p-2 rounded-lg hover:bg-[#3a4d6b] transition-colors"
                title="Message"
              >
                <MessageSquare size={20} />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-lg text-[#4abe9c] font-medium">
                {userProfile.stats?.current_streak || 0}
              </div>
              <div className="text-xs text-gray-500">Day Streak</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-lg text-[#4abe9c] font-medium">
                {userProfile.stats?.total_habits_completed || 0}
              </div>
              <div className="text-xs text-gray-500">Habits</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-lg text-[#4abe9c] font-medium">
                {userProfile.pet?.happiness || 0}%
              </div>
              <div className="text-xs text-gray-500">Happiness</div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-[#4abe9c] text-sm font-medium mb-2">About</h2>
            <p className="text-[#486085] text-sm">{userProfile.bio}</p>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-[#4abe9c] text-sm font-medium mb-3">Achievements</h2>
            <div className="flex flex-wrap gap-2">
              {userProfile.achievements?.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-[#eaf6f0] px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                >
                  <div className="bg-[#4abe9c] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span className="text-[#486085] text-xs">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
} 