import React from "react";
import { useState } from "react";
import NavBar from "../components/NavBar";
import snowBg from "../assets/pet_bg/snow.png";
import meadowBg from "../assets/pet_bg/meadow_day.png";

const mainLeaderboard = [
  { username: "USERNAME", petLevel: 12 },
  { username: "USERNAME2", petLevel: 12 },
  { username: "USERNAME3", petLevel: 12 },
  { username: "USERNAME4", petLevel: 12 },
  { username: "USERNAME5", petLevel: 12 },
  { username: "USERNAME6", petLevel: 12},
  { username: "USERNAME7", petLevel: 12},
  { username: "USERNAME8", petLevel: 12},
  { username: "USERNAME9", petLevel: 12},
  { username: "USERNAME10", petLevel: 12},
  { username: "USERNAME11", petLevel: 12},
];

const friendsLeaderboard = [
  { username: "FRIEND1", petLevel: 12 },
  { username: "FRIEND2", petLevel: 12 },
];

export default function Leaderboard({ userId }) {
    const [mode, setMode] = useState("global");

    const backgrounds = [snowBg, meadowBg];
    const backgroundIndex = userId
        ? userId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        backgrounds.length
        : 0;
    const backgroundImage = backgrounds[backgroundIndex];

    const leaderboardData =
      mode === "friends" ? friendsLeaderboard : mainLeaderboard;

  return (
    <>
      <NavBar />
      <div
        className="min-h-screen font-sniglet pt-12"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      >
        <div className="max-w-3xl mx-auto bg-[#FDFFE9] border border-[#4abe9c] rounded-xl shadow-sm mt-8 p-6 space-y-6">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setMode("friends")}
              className={`px-4 py-1 rounded-full font-bold transition ${
                mode === "friends"
                  ? "bg-[#4abe9c] text-white"
                  : "bg-white text-[#4abe9c] border border-[#4abe9c]"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setMode("global")}
              className={`px-4 py-1 rounded-full font-bold transition ${
                mode === "global"
                  ? "bg-[#4abe9c] text-white"
                  : "bg-white text-[#4abe9c] border border-[#4abe9c]"
              }`}
            >
              Global
            </button>
          </div>

          <h1 className="text-3xl font-bold text-center text-[#4abe9c]">
            {" "}
            {mode === "friends"
              ? "Friend Leaderboard"
              : "Global Leaderboard"}{" "}
          </h1>

          {/* Leaderboard Rows */}
          <div className="flex flex-col gap-2">
            {leaderboardData.map((user, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                >
                  {/* Avatar + Username */}
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.username}`}
                      alt="avatar"
                      className="w-10 h-10 rounded-full bg-white border"
                    />
                    <span className="font-bold text-[#486085]">
                      #{index + 1} - {user.username}
                    </span>
                  </div>

                  {/* Pet Image + Level */}
                  <div className="flex items-center gap-4">
                    <img
                      src={user.petImage}
                      alt={user.petType}
                      className="w-10 h-10 rounded-full object-cover border border-[#4abe9c] shadow"
                    />
                    <div className="text-right">
                      <div className="text-[#4abe9c] font-semibold">
                        Level {user.petLevel}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}