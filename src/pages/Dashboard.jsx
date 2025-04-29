import React, { useState, useEffect } from "react";
import PetDisplay from "../components/PetDisplay";
import HabitTracker from "../components/HabitTracker";
import NavBar from "../components/NavBar";
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
      <div className={`relative min-h-screen ${backgroundColor}`}>
        <NavBar />
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PetDisplay timeOfDay={timeOfDay} weather={weather} />
            <HabitTracker
              habits={habits}
              completedCount={completedCount}
              totalCount={totalCount}
              streakCount={streakCount}
            />
          </div>
        </main>
      </div>
  );
}
