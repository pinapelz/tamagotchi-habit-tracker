import { MessageCircle } from "lucide-react"

export default function StatusCard({ userName, weatherIcon, currentWeather, dailyMessage, petStatusMessage }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm lg:max-w-[99%] 2xl:max-w-[98.5%]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-sniglet">Hello, {userName}!</h2>

        {/* Larger weather display */}
        <div className="flex items-center gap-2 bg-[#f0f9ff] px-4 py-2 rounded-xl">
          <span className="font-sniglet text-sm text-gray-600">Current weather:</span>
          {weatherIcon}
          <p className="font-sniglet text-base">{currentWeather}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <MessageCircle size={18} className="text-[#e79c2d]" />
        <p className="font-sniglet text-base">{dailyMessage}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-lg">🐾</span>
        <p className="font-sniglet text-sm">{petStatusMessage}</p>
      </div>
    </div>
  )
}
