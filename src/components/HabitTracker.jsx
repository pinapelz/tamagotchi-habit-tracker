import React from "react";
import ProgressBar from "./ProgressBar";

export default function HabitTracker({ habits, completedCount, totalCount, streakCount }) {
  const completionPercent = (completedCount / totalCount) * 100;

  return (
    <div className="flex flex-col bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-lg">
      {/* Today's Progress */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Progress</h2>
        <ProgressBar value={completionPercent} />
        <div className="text-right text-sm text-gray-600 mt-1">
          {completedCount}/{totalCount} completed
        </div>
      </div>

      {/* Habit Cards */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {habits.map((habit, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-blue-50 transition shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full ${habit.completed ? "bg-green-400" : "border-2 border-gray-300"}`} />
              <span className="font-medium text-gray-700">{habit.name}</span>
            </div>
            <div className="text-xs text-gray-400">{habit.completed ? "Done" : "Pending"}</div>
          </div>
        ))}
      </div>

      {/* Streak */}
      <div className="mt-6 text-center">
        <div className="inline-block bg-yellow-200 px-4 py-1 rounded-full text-sm font-semibold text-yellow-800 shadow-sm animate-pulse">
          🔥 {streakCount} Day Streak!
        </div>
      </div>
    </div>
  );
}
