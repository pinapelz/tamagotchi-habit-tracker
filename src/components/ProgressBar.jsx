import React from "react";

export default function ProgressBar({ value }) {
  return (
    <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className="h-full bg-green-500 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}