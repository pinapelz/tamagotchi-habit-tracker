import React from "react";

export default function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-black transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
