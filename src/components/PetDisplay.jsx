import React from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";

export default function PetDisplay({ timeOfDay, weather }) {
  const bgGradient =
    timeOfDay === "day"
      ? weather === "sunny"
        ? "from-sky-300 to-sky-100"
        : weather === "cloudy"
        ? "from-gray-300 to-blue-100"
        : "from-gray-400 to-gray-200"
      : "from-indigo-800 to-purple-900";

  const getWeatherIcon = () => {
    if (weather === "sunny")
      return timeOfDay === "day" ? (
        <Sun className="w-8 h-8 text-yellow-300 drop-shadow" />
      ) : (
        <Moon className="w-8 h-8 text-blue-300 drop-shadow" />
      );
    if (weather === "cloudy") return <Cloud className="w-8 h-8 text-gray-400 drop-shadow" />;
    if (weather === "rainy") return <CloudRain className="w-8 h-8 text-blue-400 drop-shadow" />;
  };

  return (
    <div className="relative bg-gradient-to-b p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center overflow-hidden border border-blue-100">
      {/* Background based on time */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} opacity-60`} />

      {/* Weather */}
      <div className="absolute top-6 right-6 z-10">{getWeatherIcon()}</div>

      {/* Pet Image Placeholder */}
      <div className="relative w-64 h-64 bg-white/40 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10">
        <span className="text-7xl">🐾</span>
      </div>

      {/* Label */}
      <div className="mt-8 text-blue-900 font-extrabold text-xl z-10 drop-shadow">
        Your Pet is Waiting!
      </div>
    </div>
  );
}