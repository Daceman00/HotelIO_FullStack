import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

function TotalSpentStatsCard({ totalRevenue }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r  from-orange-400 via-amber-400 to-yellow-400"></div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-green-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex flex-col gap-4">
        {/* Icon container with modern styling */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-b from-orange-100 to-amber-100 group-hover:from-orange-200 group-hover:to-amber-200 transition-all duration-300 shadow-sm">
            <CurrencyDollarIcon className="h-6 w-6 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
          </div>

          {/* Subtle indicator dot */}
          <div className="h-2 w-2 rounded-full bg-green-400 shadow-sm"></div>
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-gray-600 tracking-wide">
          TOTAL REVENUE
        </div>

        {/* Main value */}
        <div className="flex items-end justify-between">
          <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            ${totalRevenue.data.totalRevenue.toLocaleString("en-US")}
          </div>
        </div>

        {/* Average booking value */}
        <div className="text-sm text-gray-600">
          Avg. Booking:{" "}
          <span className="font-medium text-green-600">
            ${totalRevenue.data.averageBookingPrice.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TotalSpentStatsCard;
