import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { Bell, Moon, Sun, User, MapPin, Volume2, VolumeX, AlertCircle, Loader2, Download, Camera, Image } from "lucide-react";
import LoadingPage from './Loading';

export default function Settings() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    sound: true,
    emailUpdates: true,
    location: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error("Failed to fetch profile data");
      }

      const { data } = await response.json();
      setUserProfile(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [navigate]);

  const handleToggle = async (setting) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    } catch (error) {
      setError("Failed to update setting. Please try again.");
      // Revert the toggle if it failed
      setSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    if (!showExportConfirm) {
      setShowExportConfirm(true);
      return;
    }

    setIsExporting(true);
    setError(null);
    try {
      // Simulate API call to get user data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const exportDate = new Date().toISOString();
      
      const userData = {
        exportDate,
        user: {
          username: "User", // From user context
          joinDate: "2024-01-01" // From user context
        },
        settings: {
          notifications: settings.notifications,
          darkMode: settings.darkMode,
          sound: settings.sound,
          emailUpdates: settings.emailUpdates,
          location: settings.location
        },
        pet: {
          name: "Fluffy", // From pet state
          type: "cat", // From pet state
          level: 5 // From pet state
        },
        habits: [
          {
            name: "Morning Walk",
            streak: 7,
            frequency: "daily"
          },
          {
            name: "Read Books",
            streak: 3,
            frequency: "daily"
          }
        ],
        achievements: [
          {
            name: "Early Bird",
            earnedDate: "2024-03-15"
          },
          {
            name: "Streak Master",
            earnedDate: "2024-03-18"
          }
        ]
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tamagotchi-data-${exportDate.split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      setShowExportConfirm(false);
    } catch (error) {
      setError("Failed to export data. Please try again.");
      setShowExportConfirm(false);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirect to login page after successful deletion
      window.location.href = '/login';
    } catch (error) {
      setError("Failed to delete account. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAvatarSeed(""); // Clear seed when file is selected
    }
  };

  const handleSaveAvatar = async () => {
    try {
      let avatarUrl;
      
      if (selectedFile) {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(selectedFile);
        });
        avatarUrl = await base64Promise;
      } else if (avatarSeed) {
        avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}`;
      } else {
        throw new Error("Please either upload an image or enter a seed");
      }

      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile/avatar`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar_url: avatarUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update avatar");
      }

      // Update local state
      const updatedProfile = { ...userProfile };
      updatedProfile.user.avatar_url = avatarUrl;
      setUserProfile(updatedProfile);
      
      setIsEditingAvatar(false);
      setAvatarSeed("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
    } catch (err) {
      console.error("Error updating avatar:", err);
      setError(err.message);
    }
  };

  const settingOptions = [
    {
      icon: <Bell className="text-[#4abe9c]" size={24} />,
      title: "Notifications",
      description: (
        <span className="block sm:inline">
          Receive notifications for habits, pet updates,{" "}
          <span className="block sm:inline">and friend activities</span>
        </span>
      ),
      setting: "notifications"
    },
    {
      icon: settings.darkMode ? <Moon className="text-[#4abe9c]" size={24} /> : <Sun className="text-[#4abe9c]" size={24} />,
      title: "Dark Mode",
      description: "Switch between light and dark theme",
      setting: "darkMode"
    },
    // Comment out if not needed
    {
      icon: settings.sound ? <Volume2 className="text-[#4abe9c]" size={24} /> : <VolumeX className="text-[#4abe9c]" size={24} />,
      title: "Sound Effects",
      description: "Enable or disable sound effects",
      setting: "sound"
    },
    // Comment out if not needed
    {
      icon: <User className="text-[#4abe9c]" size={24} />,
      title: "Email Updates",
      description: "Receive email notifications for important updates",
      setting: "emailUpdates"
    },
    {
      icon: <MapPin className="text-[#4abe9c]" size={24} />,
      title: "Location Services",
      description: "Allow weather updates and location-based features",
      setting: "location"
    }
  ];

  if (loading) return <LoadingPage />;
  if (error) return <div>Error: {error}</div>;
  if (!userProfile) return <div>No profile found.</div>;

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName={userProfile.user.display_name}>
      <div className="min-h-screen font-sniglet pt-12 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-[#486085] font-medium mb-4">Settings</h1>
            <p className="text-[#486085]">Customize your Tamagotchi Tracker experience</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Avatar Section */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Camera className="text-[#4abe9c]" size={24} />
                <div>
                  <h3 className="font-medium text-[#486085]">Profile Picture</h3>
                  <p className="text-sm text-gray-600">Customize your avatar</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="text-[#4abe9c] hover:text-[#3aa87c] transition-colors"
              >
                {isEditingAvatar ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditingAvatar && (
              <div className="mt-4 space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src={previewUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed || userProfile.user.display_name}`}
                      alt="avatar preview"
                      className="w-24 h-24 rounded-full border-4 border-[#4abe9c] bg-white shadow-lg"
                    />
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1">
                          <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <Image className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">Choose file</span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                        {selectedFile && (
                          <span className="text-sm text-gray-500">
                            {selectedFile.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Or use DiceBear
                      </label>
                      <input
                        type="text"
                        value={avatarSeed}
                        onChange={(e) => {
                          setAvatarSeed(e.target.value);
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        placeholder="Enter a seed for your avatar"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4abe9c]"
                      />
                    </div>

                    <button
                      onClick={handleSaveAvatar}
                      className="w-full bg-[#4abe9c] text-white px-4 py-2 rounded-lg hover:bg-[#3aa87c] transition-colors"
                    >
                      Save Avatar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings List */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm overflow-hidden">
            {settingOptions.map((option, index) => (
              <div
                key={index}
                className={`p-6 flex items-center justify-between ${
                  index !== settingOptions.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div>
                    <h3 className="font-medium text-[#486085] mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(option.setting)}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4abe9c] focus:ring-offset-2 ${
                    settings[option.setting] ? "bg-[#4abe9c]" : "bg-gray-200"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[option.setting] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Additional Actions */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleExportData}
              disabled={isExporting}
              className={`w-full py-3 px-4 bg-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                showExportConfirm
                  ? "text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10"
                  : "text-[#486085] border border-[#4abe9c] hover:bg-[#4abe9c]/10"
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Exporting...
                </>
              ) : showExportConfirm ? (
                <>
                  <Download size={20} />
                  Click again to confirm export
                </>
              ) : (
                <>
                  <Download size={20} />
                  Export My Data
                </>
              )}
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                showDeleteConfirm
                  ? "text-red-500 border border-red-500 hover:bg-red-50"
                  : "text-red-500 border border-red-500 hover:bg-red-50"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Deleting...
                </>
              ) : showDeleteConfirm ? (
                "Click again to confirm deletion"
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
} 
