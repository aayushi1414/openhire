import React from "react";

function LoaderWithText() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <svg
        className="animate-spin w-36 h-36"
        viewBox="0 0 100 100"
        fill="none"
        aria-label="Loading"
      >
        <title>Loading</title>
        <circle cx="50" cy="50" r="45" stroke="#c7d2fe" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#4f46e5"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset="212"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-center text-lg font-medium">Loading</span>
      </div>
    </div>
  );
}

export default LoaderWithText;
