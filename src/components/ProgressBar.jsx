import React from "react";

export default function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}