import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative">
        {/* Main spinner ring */}
        <div
          className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: "#dfa379" }}
        ></div>

        {/* Inner shadow ring for depth */}
        <div
          className="absolute inset-1 border-2 border-transparent rounded-full animate-spin opacity-60"
          style={{
            borderBottomColor: "#dfa379",
            animationDuration: "1.5s",
            animationDirection: "reverse",
          }}
        ></div>

        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: "#dfa379" }}
        ></div>

        {/* Subtle glow */}
        <div
          className="absolute inset-0 rounded-full shadow-lg animate-pulse"
          style={{ boxShadow: "0 10px 25px rgba(223, 163, 121, 0.25)" }}
        ></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
