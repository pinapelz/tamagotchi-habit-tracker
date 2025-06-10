import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import LoadingPage from "./Loading";
import { UserPlus, MessageSquare } from "lucide-react";
import pixelCat from "../assets/pets/pixel-cat.gif";
import pixelBat from "../assets/pets/pixel-bat.gif";
import pixelDuck from "../assets/pets/pixel-duck.gif";
import pixelDog from "../assets/pets/pixel-dog.gif";

export default function ViewProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
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

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/users/${userId}`, {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Profile not found");
      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId, navigate]);

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
      <div className="min-h-screen font-sniglet pt-8 pb-6 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
        <div className="max-w-4xl mx-auto">
          {/* Main Island */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm p-4 space-y-6">
            {/* User Info Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left: User Avatar and Username */}
              <div className="flex flex-col items-center">
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${userProfile.user.display_name}`}
                  alt="avatar"
                  className="w-20 h-20 rounded-full border-4 border-[#4abe9c] bg-white shadow-lg mb-2 transition-transform hover:scale-105"
                />
                <h1 className="text-xl text-[#486085]">
                  {userProfile.user.display_name}
                </h1>
              </div>

              {/* Middle: Pet Info */}
              <div className="bg-[#eaf6f0] px-6 py-3 rounded-xl shadow-sm">
                <div className="text-center">
                  <span className="text-base font-medium text-[#486085]">
                    {userProfile.pet?.name || "No pet"} the {userProfile.pet?.type || "N/A"}
                  </span>
                  <div className="text-sm text-[#486085] mt-1">
                    Level {userProfile.pet?.lvl || 0}
                  </div>
                </div>
              </div>

              {/* Right: Pet Image */}
              <div className="transform hover:scale-105 transition-transform">
                <img
                  src={
                    userProfile.pet ?
                      userProfile.pet.type === "cat" ? pixelCat :
                        userProfile.pet.type === "dog" ? pixelDog :
                          userProfile.pet.type === "bat" ? pixelBat :
                            userProfile.pet.type === "duck" ? pixelDuck :
                              pixelCat
                      : pixelCat
                  }
                  alt={`${userProfile.pet?.name || "Tamagotchi"} pet`}
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>

            {/* About Me */}
            <div>
              <h2 className="text-[#4abe9c] text-lg mb-3 pb-2 border-b border-[#4abe9c]">
                About Me
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#eaf6f0] p-3 rounded-lg">
                  <div className="space-y-1.5">
                    <p className="text-[#486085]">{userProfile.profile?.bio || "No bio yet"}</p>
                    {userProfile.profile?.location && (
                      <p className="text-[#486085] text-sm">
                        <span className="font-medium">Location:</span> {userProfile.profile.location}
                      </p>
                    )}
                    {userProfile.profile?.interests?.length > 0 && (
                      <p className="text-[#486085] text-sm">
                        <span className="font-medium">Interests:</span> {userProfile.profile.interests.join(', ')}
                      </p>
                    )}
                    {userProfile.profile?.favorite_pet_type && (
                      <p className="text-[#486085] text-sm">
                        <span className="font-medium">Favorite Pet:</span> {userProfile.profile.favorite_pet_type.charAt(0).toUpperCase() + userProfile.profile.favorite_pet_type.slice(1)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lifetime Stats */}
            <div>
              <h2 className="text-[#4abe9c] text-lg mb-3 pb-2 border-b border-[#4abe9c]">
                Lifetime Stats
              </h2>
              <div className="bg-[#eaf6f0] rounded-xl p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-lg text-[#4abe9c]">
                      {userProfile.stats?.longest_streak || 0}
                    </div>
                    <div className="text-xs text-gray-500">Longest Day Streak</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-lg text-[#4abe9c]">
                      {userProfile.pet?.highest_level || userProfile.pet?.lvl || 0}
                    </div>
                    <div className="text-xs text-gray-500">Highest Level</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-lg text-[#4abe9c]">
                      {userProfile.stats?.most_tracked_habit || "No habits yet"}
                    </div>
                    <div className="text-xs text-gray-500">Most Tracked Habit</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-lg text-[#4abe9c]">
                      {userProfile.stats?.total_habits_completed || 0}
                    </div>
                    <div className="text-xs text-gray-500">Total Habits Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-[#4abe9c] text-lg mb-3 pb-2 border-b border-[#4abe9c]">
                Achievements
              </h2>
              <div className="flex flex-wrap gap-2">
                {userProfile.achievements?.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-[#eaf6f0] px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#4abe9c]/20"
                  >
                    <div className="bg-[#4abe9c] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {achievement.icon}
                    </div>
                    <span className="text-[#486085] text-xs">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
} 
