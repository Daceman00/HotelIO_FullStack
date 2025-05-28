import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

function TopReviewersStatsCard({ reviewers }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400"></div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left section - Main stats */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-4 flex-1">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 shadow-sm">
              <UserIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
            </div>

            {/* Status indicator */}
            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-sm sm:hidden"></div>
          </div>

          <div className="text-sm font-medium text-gray-600 tracking-wide">
            TOP REVIEWERS
          </div>

          <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {reviewers?.totalReviews || "0"}
          </div>

          {/* Status indicator for larger screens */}
          <div className="hidden sm:block h-2 w-2 rounded-full bg-blue-400 shadow-sm"></div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block border-l border-gray-200/60"></div>

        {/* Right section - Stats */}
        <div className="flex flex-col justify-center gap-3 min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
              <span className="text-xs font-medium text-gray-600">
                Avg. Rating
              </span>
              <span className="text-sm font-bold text-blue-700">
                {reviewers?.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopReviewersStatsCard;
