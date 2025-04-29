import React from "react";
import ProgressBar from "./ProgressBar";
import { CheckCircle, Circle } from "lucide-react";

export default function HabitTracker({ habits, completedCount, totalCount, streakCount }) {
  const completionPercent = (completedCount / totalCount) * 100;
  const MAX_VISIBLE = 8;

  return (
    <div className="flex flex-col bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-blue-100">
      {/* Today's Progress */}
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Today's Progress</h2>
        <ProgressBar value={completionPercent} />
        <div className="text-right text-sm text-gray-500 mt-2 font-medium">
          {completedCount}/{totalCount} completed
        </div>
      </div>

      {/* Habit Cards */}
      <div
        className="flex-1 space-y-4 overflow-y-auto"
        style={{
          maxHeight: `${MAX_VISIBLE * 54}px`,
        }}
      >
        {habits.map((habit, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-4 rounded-xl shadow-sm border transition
              ${habit.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:bg-blue-50"}`}
          >
            <div className="flex items-center gap-3">
              {habit.completed ? (
                <CheckCircle className="text-green-500" size={22} />
              ) : (
                <Circle className="text-gray-300" size={22} />
              )}
              <span className={`font-semibold ${habit.completed ? "text-green-700" : "text-gray-700"}`}>
                {habit.name}
              </span>
            </div>
            <div className={`text-xs font-semibold ${habit.completed ? "text-green-500" : "text-gray-400"}`}>
              {habit.completed ? "Done" : "Pending"}
            </div>
          </div>
        ))}
      </div>

      {/* Streak */}
      <div className="mt-8 flex justify-end">
        <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-1.5 rounded-full text-sm font-bold text-yellow-700 shadow animate-pulse">
          <span role="img" aria-label="fire">🔥</span> {streakCount} Day Streak!
        </div>
      </div>
    </div>
  );
}