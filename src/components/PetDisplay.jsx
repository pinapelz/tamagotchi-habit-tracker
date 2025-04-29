import React from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";
import MetricBars from "../components/MetricBars";

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
    <div className="flex flex-col">
      <div
        className="relative bg-gradient-to-b p-8 rounded-3xl shadow-lg flex flex-col items-center justify-start overflow-hidden border border-blue-100"
        style={{ height: 600 }}
      >
        {/* Background based on time */}
        <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} opacity-60`} />

        {/* Weather */}
        <div className="absolute top-6 right-6 z-10">{getWeatherIcon()}</div>

        {/* Pet Image Placeholder */}
        <div className="relative w-64 h-64 bg-white/40 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10 mt-8">
          <span className="text-7xl text-blue-500">🐾</span>
        </div>

        {/* Label */}
        <div className="mt-8 text-blue-900 font-extrabold text-xl z-10 drop-shadow text-center">
          Your Pet is Waiting!
        </div>
      </div>

      {/* Metric Bars - full width with no white space */}
      <div className="mt-3">
        <div className="bg-white/90 rounded-2xl shadow border border-blue-100 px-8 py-6 w-full">
          <MetricBars />
        </div>
      </div>
    </div>
  );
}