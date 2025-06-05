import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { Bell, Moon, Sun, User, MapPin, Volume2, VolumeX, AlertCircle, Loader2, Download } from "lucide-react";

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName="User">
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
