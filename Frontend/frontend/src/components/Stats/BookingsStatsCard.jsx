import { BookOpenIcon } from "@heroicons/react/24/outline";
import React from "react";

function BookingsStatsCard({ bookings }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-amber-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left section - Main stats */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-4 flex-1">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-300 shadow-sm">
              <BookOpenIcon className="h-6 w-6 text-[#dfa379] group-hover:text-[#cc8f65] transition-colors duration-300" />
            </div>

            {/* Status indicator */}
            <div className="h-2 w-2 rounded-full bg-blue-400 shadow-sm sm:hidden"></div>
          </div>

          <div className="text-sm font-medium text-gray-600 tracking-wide">
            BOOKINGS
          </div>

          <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {bookings?.total?.toLocaleString() || "0"}
          </div>

          {/* Status indicator for larger screens */}
          <div className="hidden sm:block h-2 w-2 rounded-full bg-blue-400 shadow-sm"></div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block border-l border-gray-200/60"></div>

        {/* Right section - Breakdown */}
        <div className="flex flex-col justify-center gap-3 min-w-0 flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 group-hover:from-green-100 group-hover:to-emerald-100 transition-all duration-300">
              <span className="text-xs font-medium text-gray-600">
                Upcoming
              </span>
              <span className="text-sm font-bold text-green-700">
                {bookings?.data?.upcoming || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-all duration-300">
              <span className="text-xs font-medium text-gray-600">Current</span>
              <span className="text-sm font-bold text-blue-700">
                {bookings?.data?.current || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 group-hover:from-gray-100 group-hover:to-slate-100 transition-all duration-300">
              <span className="text-xs font-medium text-gray-600">Past</span>
              <span className="text-sm font-bold text-gray-700">
                {bookings?.data?.past || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 group-hover:from-red-100 group-hover:to-rose-100 transition-all duration-300">
              <span className="text-xs font-medium text-gray-600">Missed</span>
              <span className="text-sm font-bold text-red-700">
                {bookings?.data?.missed || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingsStatsCard;
