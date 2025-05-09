import { Info } from "lucide-react"

export default function ProgressBar({ completedHabits, totalHabits, streak }) {
  return (
    <div className="bg-white bg-opacity-50 rounded-3xl p-4">
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-lg animate-plant-grow">🌱</span>
          <h3 className="font-sniglet text-base">Progress</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-70 px-3 py-1.5 rounded-lg">
            <p className="font-sniglet text-sm">
              <span className="font-medium">
                {completedHabits}/{totalHabits}
              </span>{" "}
              Today
            </p>
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-1.5 rounded-full text-sm text-yellow-700 shadow animate-pulse">
            <span role="img" aria-label="fire">🔥</span> {streak} Day Streak!
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-green-400 transition-all duration-700 ease-in-out" 
            style={{ width: `${(completedHabits / totalHabits) * 100}%` }}
          />
          <div
            className="h-full bg-red-400 transition-all duration-700 ease-in-out"
            style={{ width: `${((totalHabits - completedHabits) / totalHabits) * 100}%` }}
          />
        </div>
        <button className="ml-2.5 text-blue-500 hover:scale-110 transition-transform">
          <Info size={18} />
        </button>
      </div>

      <style>{`
        @keyframes plantGrow {
          0% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.2) translateY(-4px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }
        .animate-plant-grow {
          animation: plantGrow 2s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  )
}
