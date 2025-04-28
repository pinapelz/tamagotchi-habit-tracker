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
        <Sun className="w-8 h-8 text-yellow-300" />
      ) : (
        <Moon className="w-8 h-8 text-blue-300" />
      );
    if (weather === "cloudy") return <Cloud className="w-8 h-8 text-gray-400" />;
    if (weather === "rainy") return <CloudRain className="w-8 h-8 text-blue-400" />;
  };

  return (
    <div className="relative bg-gradient-to-b p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center overflow-hidden from-sky-100 to-sky-200">
      {/* Background based on time */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} opacity-50`} />

      {/* Weather */}
      <div className="absolute top-4 right-4">{getWeatherIcon()}</div>

      {/* Pet Image Placeholder */}
      <div className="relative w-60 h-60 bg-white/30 backdrop-blur-lg rounded-full flex items-center justify-center shadow-xl">
        {/* Insert your gif here later */}
        <span className="text-6xl">🐾</span>
      </div>

      {/* Label */}
      <div className="mt-6 text-gray-700 font-semibold text-lg">
        Your Pet is Waiting!
      </div>
    </div>
  );
}
