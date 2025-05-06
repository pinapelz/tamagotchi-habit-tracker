import React from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";
import MetricBars from "../components/MetricBars";
import meadowDay from "../assets/pet_bg/meadow_day.png"; // Import the meadow image

export default function PetDisplay({ timeOfDay, weather }) {
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
        className="relative p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center overflow-hidden border border-blue-100"
        style={{
          height: 600, // Fixed height
          maxWidth: 950, // Fixed width
        }}
      >
        {/* Image with padding and border */}
        <div className="absolute inset-0 p-2 border-2 border-white rounded-3xl overflow-hidden">
          <img
            src={meadowDay}
            alt="Background"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Background overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-60" />

        {/* Speech Bubble */}
        <div className="absolute top-10 w-72 bg-white/95 rounded-lg shadow-lg p-4 text-center z-20">
          <p className="text-sm text-gray-700">Your pet is waiting...</p>
        </div>

        {/* Pet Image Placeholder */}
        <div className="relative w-96 h-96 bg-white/40 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10">
          <span className="text-7xl text-blue-500">🐾</span>
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
