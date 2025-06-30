import React from "react";
import { RotateCcw } from "lucide-react";

function RefreshButton({ onRefresh, isRefreshing, size = "md" }) {
  const sizeClasses = {
    sm: "h-8 w-8 p-1.5",
    md: "h-10 w-10 p-2",
    lg: "h-12 w-12 p-2.5",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={onRefresh}
      disabled={isRefreshing}
      className={`
        ${sizeClasses[size]}
        relative
        bg-white hover:bg-gray-50 active:bg-gray-100
        border border-gray-300 hover:border-gray-400
        rounded-full
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
        shadow-sm hover:shadow-md
        group
      `}
      title="Refresh data"
    >
      <RotateCcw
        className={`
          ${iconSizes[size]}
          text-gray-600 group-hover:text-gray-800
          transition-all duration-200
          ${isRefreshing ? "animate-spin" : "group-hover:rotate-45"}
        `}
      />

      {/* Loading indicator */}
      {isRefreshing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
  2;
}

export default RefreshButton;
