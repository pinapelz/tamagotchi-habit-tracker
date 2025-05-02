import React, { useState, useEffect } from "react";
import PetDisplay from "../components/PetDisplay";
import HabitTracker from "../components/HabitTracker";
import NavBar from "../components/NavBar";
import WelcomeMessage from "../components/WelcomeMessage";
import Encouragement from "../components/Encouragement";

export default function Dashboard() {
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [weather, setWeather] = useState("sunny");
  const [streakCount, setStreakCount] = useState(12);
  const [habits, setHabits] = useState([
    { name: "Drink Water", completed: true },
    { name: "Exercise", completed: true },
    { name: "Read Book", completed: false },
    { name: "Meditate", completed: true },
    { name: "Sleep Early", completed: false },
    { name: "Sleep Early", completed: false },
    { name: "Sleep Early", completed: false },
    { name: "Sleep Early", completed: false },
    { name: "Sleep Early", completed: false },
    { name: "Sleep Early", completed: false },
    { name: "Sleep Early", completed: false },
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(hour >= 6 && hour < 18 ? "day" : "night");
  }, []);

  const handleCompleteHabit = (idx) => {
    setHabits((prev) =>
      prev.map((habit, i) =>
        i === idx && !habit.completed ? { ...habit, completed: true } : habit
      )
    );
  };

  const backgroundColor = timeOfDay === "day" ? "bg-blue-50" : "bg-indigo-950";

  return (
    <div className={`relative min-h-screen ${backgroundColor}`}>
      <NavBar />
      <main className="mt-2 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <WelcomeMessage name="USER" weather={weather} />
          <Encouragement message="You're doing great! Keep Going!" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PetDisplay timeOfDay={timeOfDay} weather={weather} />
          <HabitTracker
            habits={habits}
            streakCount={streakCount}
            onToggleHabit={handleCompleteHabit} // Pass handler
          />
        </div>
      </main>
    </div>
  );
}
