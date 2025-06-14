import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import pixelCat from "../assets/pets/pixel-cat.gif";
import pixelBat from "../assets/pets/pixel-bat.gif";
import pixelDuck from "../assets/pets/pixel-duck.gif";
import pixelDog from "../assets/pets/pixel-dog.gif";
import snowBg from "../assets/pet_bg/snow.png";
import meadowBg from "../assets/pet_bg/meadow_day.png";
import Achievements from '../components/Achievements';
import doorImage from '../assets/images/door.png'

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const backgrounds = [snowBg, meadowBg];
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Make parallel API calls
      const [profileResponse, habitsResponse] = await Promise.all([
        // Fetch profile data
        fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
          method: "GET",
          credentials: "include",
        }),
        // Fetch habits data
        fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
          method: "GET",
          credentials: "include",
        })
      ]);

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        if (profileResponse.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error(errorData.message || "Failed to fetch profile data.");
      }

      const profileData = await profileResponse.json();
      console.log("Profile data received:", profileData);

      // Process habits data if available
      if (habitsResponse.ok) {
        const habitsData = await habitsResponse.json();
        const totalCompleted = habitsData.filter(habit => habit.last_completed_at).length;
        profileData.data.stats.total_habits_completed = totalCompleted;
        profileData.data.stats.lifetime_habits_completed = totalCompleted;

        // Update stats in the background
        fetch(`${import.meta.env.VITE_API_DOMAIN}/api/stats/update`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            total_habits_completed: totalCompleted,
            lifetime_habits_completed: totalCompleted 
          }),
        }).catch(err => console.error("Error updating stats:", err));
      }

      // Initialize achievements and check for new ones in the background
      Promise.all([
        fetch(`${import.meta.env.VITE_API_DOMAIN}/api/achievements/initialize`, {
          method: "POST",
          credentials: "include",
        }),
        fetch(`${import.meta.env.VITE_API_DOMAIN}/api/achievements/check`, {
          method: "POST",
          credentials: "include",
        })
      ]).then(async ([initResponse, checkResponse]) => {
        if (checkResponse.ok) {
          const achievementsData = await checkResponse.json();
          if (achievementsData.status === "ok") {
            setUserProfile(prev => ({
              ...prev,
              achievements: achievementsData.achievements
            }));
          }
        }
      }).catch(err => console.error("Error processing achievements:", err));

      setUserProfile(profileData.data);
      setBio(profileData.data.profile?.bio || "Hi! I'm building good habits with my Tamagotchi. Let's grow together!");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeAchievements = async () => {
      try {
        // Initialize achievements first
        await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/achievements/initialize`, {
          method: "POST",
          credentials: "include",
        });
        // Then refresh profile data
        fetchProfileData();
      } catch (err) {
        console.error("Error initializing achievements:", err);
        fetchProfileData(); // Still try to refresh profile even if achievement init fails
      }
    };

    initializeAchievements();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio,
          location: userProfile.profile?.location,
          interests: userProfile.profile?.interests,
          favorite_pet_type: userProfile.profile?.favorite_pet_type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }

      // Update the local profile state with the new bio
      const updatedProfile = { ...userProfile };
      if (!updatedProfile.profile) updatedProfile.profile = {};
      updatedProfile.profile.bio = bio;
      setUserProfile(updatedProfile);
      
      setIsEditingBio(false);
      setBioError(null);
      console.log("Profile updated successfully.");
    } catch (err) {
      setBioError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4abe9c]"></div>
          <p className="text-[#486085] font-sniglet">Loading profile...</p>
        </div>
      </div>
    );
  }
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
                <button
                  onClick={fetchProfileData}
                  disabled={isRefreshing}
                  className="mt-2 text-sm text-[#4abe9c] hover:text-[#3aa87c] transition-colors flex items-center gap-1"
                >
                  {isRefreshing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#4abe9c]"></div>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh Profile
                    </>
                  )}
                </button>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4abe9c] transition-all"
                      rows="4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={userProfile.profile?.location || ''}
                      onChange={(e) => {
                        const updatedProfile = { ...userProfile };
                        if (!updatedProfile.profile) updatedProfile.profile = {};
                        updatedProfile.profile.location = e.target.value;
                        setUserProfile(updatedProfile);
                      }}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4abe9c] transition-all"
                      placeholder="Where are you from?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                    <input
                      type="text"
                      value={userProfile.profile?.interests?.join(', ') || ''}
                      onChange={(e) => {
                        const updatedProfile = { ...userProfile };
                        if (!updatedProfile.profile) updatedProfile.profile = {};
                        updatedProfile.profile.interests = e.target.value.split(',').map(i => i.trim()).filter(i => i);
                        setUserProfile(updatedProfile);
                      }}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4abe9c] transition-all"
                      placeholder="Your interests (comma separated)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Pet Type</label>
                    <select
                      value={userProfile.profile?.favorite_pet_type || ''}
                      onChange={(e) => {
                        const updatedProfile = { ...userProfile };
                        if (!updatedProfile.profile) updatedProfile.profile = {};
                        updatedProfile.profile.favorite_pet_type = e.target.value;
                        setUserProfile(updatedProfile);
                      }}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4abe9c] transition-all"
                    >
                      <option value="">Select a pet type</option>
                      <option value="cat">Cat</option>
                      <option value="dog">Dog</option>
                      <option value="bat">Bat</option>
                      <option value="duck">Duck</option>
                    </select>
                  </div>
                  {bioError && <div className="text-red-500 text-sm">{bioError}</div>}
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveProfile}
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#eaf6f0] p-4 rounded-lg">
                    <div className="space-y-2">
                      <p className="text-[#486085]">{bio}</p>
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
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-[#4abe9c] hover:text-[#3aa87c] transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
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
                      {userProfile.stats?.lifetime_habits_completed || 0}
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
              <Achievements userAchievements={userProfile.achievements} />
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
