import React, { useState, useEffect } from "react";
import PetDisplay from "../components/PetDisplay";
import HabitTracker from "../components/HabitTracker";

export default function Dashboard() {
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [weather, setWeather] = useState("sunny");
  const [completedCount, setCompletedCount] = useState(3);
  const [totalCount, setTotalCount] = useState(5);
  const [streakCount, setStreakCount] = useState(12);
  const [habits, setHabits] = useState([
    { name: "Drink Water", completed: true },
    { name: "Exercise", completed: true },
    { name: "Read Book", completed: false },
    { name: "Meditate", completed: true },
    { name: "Sleep Early", completed: false },
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? "day" : "night");
  }, []);

  const backgroundColor = timeOfDay === "day" ? "bg-blue-50" : "bg-indigo-950";

  return (
    <div className={`min-h-screen ${backgroundColor} p-6 flex flex-col`}>
      {/* Topbar */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Tamagotchi Tracker
        </h1>
        <button className="bg-red-400 hover:bg-red-500 text-white px-5 py-2 rounded-full text-sm shadow-md transition">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        <PetDisplay timeOfDay={timeOfDay} weather={weather} />
        <HabitTracker
          habits={habits}
          completedCount={completedCount}
          totalCount={totalCount}
          streakCount={streakCount}
        />
      </div>
    </div>
  );
}
