import React from "react";
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, TrendingUp, Users } from "lucide-react";

// Mock data for testing
const mainLeaderboard = [
  {
    username: "PetLover123",
    petName: "Toto",
    petType: "cat",
    petLevel: 15,
    streak: 45,
    habitsCompleted: 120,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PetLover123"
  },
  {
    username: "HabitHero",
    petName: "Fluffy",
    petType: "cat",
    petLevel: 14,
    streak: 38,
    habitsCompleted: 98,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=HabitHero"
  },
  {
    username: "TamaQueen",
    petName: "Sparkle",
    petType: "cat",
    petLevel: 13,
    streak: 32,
    habitsCompleted: 85,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=TamaQueen"
  },
  {
    username: "PixelMaster",
    petName: "Byte",
    petType: "cat",
    petLevel: 12,
    streak: 28,
    habitsCompleted: 76,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelMaster"
  },
  {
    username: "PetPal",
    petName: "Buddy",
    petType: "cat",
    petLevel: 11,
    streak: 25,
    habitsCompleted: 65,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PetPal"
  },
  {
    username: "USERNAME6",
    petName: "Max",
    petType: "cat",
    petLevel: 12,
    streak: 20,
    habitsCompleted: 60,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=USERNAME6"
  },
  {
    username: "USERNAME7",
    petName: "Luna",
    petType: "cat",
    petLevel: 12,
    streak: 18,
    habitsCompleted: 55,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=USERNAME7"
  },
  {
    username: "USERNAME8",
    petName: "Charlie",
    petType: "cat",
    petLevel: 12,
    streak: 15,
    habitsCompleted: 50,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=USERNAME8"
  },
  {
    username: "USERNAME9",
    petName: "Bella",
    petType: "cat",
    petLevel: 12,
    streak: 12,
    habitsCompleted: 45,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=USERNAME9"
  },
  {
    username: "USERNAME10",
    petName: "Rocky",
    petType: "cat",
    petLevel: 12,
    streak: 10,
    habitsCompleted: 40,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=USERNAME10"
  },
  {
    username: "USERNAME11",
    petName: "Daisy",
    petType: "cat",
    petLevel: 12,
    streak: 8,
    habitsCompleted: 35,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=USERNAME11"
  }
];

const friendsLeaderboard = [
  {
    username: "PetLover123",
    petName: "Toto",
    petType: "cat",
    petLevel: 15,
    streak: 45,
    habitsCompleted: 120,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=PetLover123"
  },
  {
    username: "HabitHero",
    petName: "Fluffy",
    petType: "cat",
    petLevel: 14,
    streak: 38,
    habitsCompleted: 98,
    avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=HabitHero"
  }
];

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userProfile, setUserProfile] = useState(null);
  const [mode, setMode] = useState("global");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile data
  useEffect(() => {
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
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      }
    };

    fetchProfileData();
  }, [navigate]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        // Mock data for demonstration
        const mockData = [
          {
            id: 1,
            username: "TamaQueen",
            petName: "Sparkle",
            petType: "Pixel Cat",
            level: 25,
            points: 1500,
            streak: 45,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=TamaQueen`
          },
          {
            id: 2,
            username: "PixelMaster",
            petName: "Byte",
            petType: "Pixel Cat",
            level: 23,
            points: 1450,
            streak: 38,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PixelMaster`
          },
          {
            id: 3,
            username: "PetLover123",
            petName: "Toto",
            petType: "Pixel Cat",
            level: 20,
            points: 1300,
            streak: 30,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=PetLover123`
          },
          {
            id: 4,
            username: "HabitHero",
            petName: "Fluffy",
            petType: "Pixel Cat",
            level: 18,
            points: 1200,
            streak: 25,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=HabitHero`
          },
          {
            id: 5,
            username: "TamaKing",
            petName: "Pixel",
            petType: "Pixel Cat",
            level: 15,
            points: 1000,
            streak: 20,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=TamaKing`
          }
        ];

        setLeaderboardData(mockData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName={userProfile?.user?.display_name || "User"}>
      <div className="min-h-screen font-sniglet pt-12 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-[#486085] font-medium mb-4">Leaderboard</h1>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setMode("friends")}
                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  mode === "friends"
                    ? "bg-[#4abe9c] text-white shadow-md"
                    : "bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10"
                }`}
              >
                <Users size={18} />
                Friends
              </button>
              <button
                onClick={() => setMode("global")}
                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  mode === "global"
                    ? "bg-[#4abe9c] text-white shadow-md"
                    : "bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10"
                }`}
              >
                <Users size={18} />
                Global
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {leaderboardData.map((user, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Rank + User Info */}
                  <div className="flex items-center gap-4 mb-3 sm:mb-0 sm:flex-1">
                    <div className="w-8 text-center">
                      <span className="text-lg font-medium text-[#486085]">#{index + 1}</span>
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border-2 border-[#4abe9c]"
                    />
                    <div>
                      <div className="font-medium text-[#486085]">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.petName} the {user.petType}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-end gap-6 sm:gap-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Streak</div>
                      <div className="font-medium text-[#4abe9c]">{user.streak} days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Habits</div>
                      <div className="font-medium text-[#4abe9c]">{user.habitsCompleted}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Level</div>
                      <div className="font-medium text-[#4abe9c]">{user.level}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
