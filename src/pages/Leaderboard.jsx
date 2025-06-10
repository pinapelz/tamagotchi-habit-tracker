import React from "react";
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, TrendingUp, Users } from "lucide-react";


const PAGE_SIZE = 20;

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userProfile, setUserProfile] = useState(null);
  const [mode, setMode] = useState("global");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // User profile for header
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
        setError(err.message);
      }
    };
    fetchProfileData();
  }, [navigate]);

  // Leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint =
          mode === "global"
            ? `/api/leaderboard/global?page=${currentPage}&limit=${PAGE_SIZE}`
            : `/api/leaderboard/friends?page=${currentPage}&limit=${PAGE_SIZE}`;
        const res = await fetch(`${import.meta.env.VITE_API_DOMAIN}${endpoint}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch leaderboard");
        setLeaderboardData(data.users || []);
        setPageCount(Math.ceil((data.total || 1) / PAGE_SIZE));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboardData();
  }, [mode, currentPage]);

  // Reset to page 1 on tab switch
  useEffect(() => {
    setCurrentPage(1);
  }, [mode]);

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

          {/* Pages */}
          <div className="flex justify-center gap-2 my-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              {"<"}
            </button>
            {[...Array(pageCount)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? "bg-[#4abe9c] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              {">"}
            </button>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="text-center p-8 text-gray-400">Loading leaderboard...</div>
            ) : error ? (
              <div className="text-center p-8 text-red-500">{error}</div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center p-8 text-gray-400">No users found.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leaderboardData.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    {/* Rank + User Info */}
                    <div className="flex items-center gap-4 mb-3 sm:mb-0 sm:flex-1">
                      <div className="w-8 text-center">
                        <span className="text-lg font-medium text-[#486085]">
                          #{(currentPage - 1) * PAGE_SIZE + index + 1}
                        </span>
                      </div>
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`}
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
            )}
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
