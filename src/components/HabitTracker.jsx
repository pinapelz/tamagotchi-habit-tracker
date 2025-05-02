// I've chosen to disallow uncompleting as it will be annoying to reverse metric gain/loss if there was some sort of bonus
import ProgressBar from "./ProgressBar";
import { CheckCircle, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { FaShareAlt } from "react-icons/fa";
import ShareModal from "./ShareModal";

export default function HabitTracker({ habits, streakCount, onToggleHabit }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCompletedCount(habits.filter((h) => h.completed).length);
    setTotalCount(habits.length);
  }, [habits]);

  const completionPercent = (completedCount / totalCount) * 100;
  const MAX_VISIBLE = 9;

  return (
    <div className="flex flex-col bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-blue-100">
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
          maxHeight: `${MAX_VISIBLE * 56}px`,
        }}
      >
        {habits.map((habit, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-4 rounded-xl shadow-sm border transition
              ${habit.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:bg-blue-50"}`}
            onClick={() => !habit.completed && onToggleHabit && onToggleHabit(idx)}
            style={{ cursor: habit.completed ? "default" : "pointer" }}
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

      {/* Streak and Share */}
      <div className="mt-8 flex justify-between items-center">
        {/* Share Button */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
          onClick={() => setShowModal(true)}
        >
          <FaShareAlt /> Share
        </button>
        {/* Streak */}
        <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-1.5 rounded-full text-sm font-bold text-yellow-700 shadow animate-pulse">
          <span role="img" aria-label="fire">🔥</span> {streakCount} Day Streak!
        </div>
      </div>

      {/* Share Modal Component */}
      <ShareModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}