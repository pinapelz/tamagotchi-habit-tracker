import React from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";
import MetricBars from "../components/MetricBars";
import meadowDay from "../assets/pet_bg/meadow_day.png"; // Import the meadow image

export default function PetDisplay({ timeOfDay, weather }) {

  return (
    <div className="flex flex-col">
      <div
        className="relative p-8 rounded-3xl flex flex-col items-center justify-between overflow-hidden"
        style={{
          height: 660, // Fixed height
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

        {/* Top section with pet */}
        <div className="flex-1 flex items-center justify-center w-full z-10">
          {/* Pet Image Placeholder */}
          <div className="w-96 h-96 bg-white/40 backdrop-blur-2xl rounded-full flex items-center justify-center shadow-xl border-4 border-white">
            <span className="text-7xl text-blue-500">🐾</span>
          </div>
        </div>

        {/* Speech Bubble - anchored to bottom */}
        <div className="w-full rounded-lg shadow-lg p-4 text-center z-20 mb-2 mt-2" style={{ backgroundColor: "#DFE8D0" }}>
          <p className="text-sm text-black">Your pet is waiting...</p>
        </div>
      </div>

      {/* Metric Bars - full width with no white space */}
      <div className="mt-3">
        <div className="bg-white/90 rounded-2xl border-blue-100 px-8 py-6 w-full">
          <MetricBars />
        </div>
      </div>
    </div>
  );
}