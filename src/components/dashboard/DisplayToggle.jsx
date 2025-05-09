
export default function DisplayToggle({ activeView, onToggle }) {
  return (
    <div className="flex bg-white bg-opacity-80 rounded-full p-0.5 z-10 shadow-sm">
      <button
        onClick={() => onToggle("environment")}
        className={`px-3 py-1 rounded-full text-xs font-sniglet transition-colors ${
          activeView === "environment" ? "bg-[#e6f7ff] text-blue-600" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Environment
      </button>
      <button
        onClick={() => onToggle("stats")}
        className={`px-3 py-1 rounded-full text-xs font-sniglet transition-colors ${
          activeView === "stats" ? "bg-[#ffe0b2] text-orange-600" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Stats
      </button>
    </div>
  )
}
