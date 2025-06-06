import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import LoadingPage from "./Loading";
import pixelCat from "../assets/pets/pixel-cat.gif";
import pixelBat from "../assets/pets/pixel-bat.gif";
import pixelDuck from "../assets/pets/pixel-duck.gif";
import pixelDog from "../assets/pets/pixel-dog.gif";
import snowBg from "../assets/pet_bg/snow.png";
import meadowBg from "../assets/pet_bg/meadow_day.png";
import Achievements from '../components/Achievements';

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
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [bioError, setBioError] = useState(null);
  const backgrounds = [snowBg, meadowBg];
  const navigate = useNavigate(); // Add this line to get navigation function

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
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error(errorData.message || "Failed to fetch profile data.");
        }

        const profileData = await response.json();
        setUserProfile(profileData.data);
        setBio(profileData.data.bio || "Hi! I'm building good habits with my Tamagotchi. Let's grow together!");
      } catch (err) {
        setError(err.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [navigate]);

  const handleSaveBio = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/set-bio`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update bio.");
      }

      setIsEditingBio(false);
      setBioError(null);
      console.log("Bio updated successfully.");
    } catch (err) {
      setBioError(err.message);
    }
  };

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

  // Fix: Validate the index before accessing the backgrounds array
  const backgroundIndex = Math.abs(userProfile.user.id.hashCode()) % backgrounds.length;
  const backgroundImage =
    backgroundIndex >= 0 && backgroundIndex < backgrounds.length
      ? backgrounds[backgroundIndex]
      : null;

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName={userProfile.user.display_name}>
      <div className="min-h-screen font-sniglet pt-12 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
        <div className="max-w-5xl mx-auto">
          {/* Main Island */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm p-6 space-y-8">
            {/* User Info Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left: User Avatar and Username */}
              <div className="flex flex-col items-center">
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${userProfile.user.display_name}`}
                  alt="avatar"
                  className="w-24 h-24 rounded-full border-4 border-[#4abe9c] bg-white shadow-lg mb-3 transition-transform hover:scale-105"
                />
                <h1 className="text-2xl text-[#486085]">
                  {userProfile.user.display_name}
                </h1>
              </div>

              {/* Middle: Pet Info */}
              <div className="bg-[#eaf6f0] px-8 py-4 rounded-xl shadow-sm">
                <div className="text-center">
                  <span className="text-lg font-medium text-[#486085]">
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
                              pixelCat // Default to cat if type doesn't match
                      : pixelCat // Default to cat if no pet
                  }
                  alt={`${userProfile.pet?.name || "Tamagotchi"} pet`}
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>

            {/* About Me */}
            <div>
              <h2 className="text-[#4abe9c] text-xl mb-4 pb-2 border-b border-[#4abe9c]">
                About Me
              </h2>
              {isEditingBio ? (
                <div className="space-y-4">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4abe9c] transition-all"
                    rows="4"
                  />
                  {bioError && <div className="text-red-500 text-sm">{bioError}</div>}
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveBio}
                      className="bg-[#4abe9c] text-white px-4 py-2 rounded-lg hover:bg-[#3aa87c] transition-all shadow-sm hover:shadow-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all shadow-sm hover:shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-[#eaf6f0] p-4 rounded-lg">
                  <p className="text-[#486085]">{bio}</p>
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="text-[#4abe9c] hover:text-[#3aa87c] transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Pet Stats */}
            <div>
              <h2 className="text-[#4abe9c] text-xl mb-4 pb-2 border-b border-[#4abe9c]">
                Pet Stats
              </h2>
              <div className="bg-[#eaf6f0] rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.pet?.name || "No pet"}
                    </div>
                    <div className="text-sm text-gray-500">Pet</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.pet?.lvl || 0}
                    </div>
                    <div className="text-sm text-gray-500">Level</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.stats?.current_streak || 0}
                    </div>
                    <div className="text-sm text-gray-500">Day Streak</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.stats?.total_habits_completed || 0}
                    </div>
                    <div className="text-sm text-gray-500">Habits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifetime Stats */}
            <div>
              <h2 className="text-[#4abe9c] text-xl mb-4 pb-2 border-b border-[#4abe9c]">
                Lifetime Stats
              </h2>
              <div className="bg-[#eaf6f0] rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.stats?.longest_streak || 0}
                    </div>
                    <div className="text-sm text-gray-500">Longest Day Streak</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.pet?.highest_level || userProfile.pet?.lvl || 0}
                    </div>
                    <div className="text-sm text-gray-500">Highest Level</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.stats?.most_tracked_habit || "No habits yet"}
                    </div>
                    <div className="text-sm text-gray-500">Most Tracked Habit</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-xl text-[#4abe9c]">
                      {userProfile.stats?.total_habits_completed || 0}
                    </div>
                    <div className="text-sm text-gray-500">Total Habits Completed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-[#4abe9c] text-xl mb-4 pb-2 border-b border-[#4abe9c]">
                Achievements
              </h2>
              <Achievements userAchievements={userProfile.achievements || []} />
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
