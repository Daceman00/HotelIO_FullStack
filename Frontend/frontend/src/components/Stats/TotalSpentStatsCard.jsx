import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

function TotalSpentStatsCard({ totalRevenue }) {
  return (
    <div className="w-full rounded-xl bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left section */}
        <div className="flex sm:flex-col items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="text-3xl font-bold text-gray-900">
            ${totalRevenue.data.totalRevenue.toLocaleString("en-US")}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block border-l border-gray-200"></div>

        {/* Right section */}
        <div className="flex flex-col justify-center gap-2 text-sm text-gray-500">
          <span>Avg. Booking:</span>
          <span className="font-medium text-green-600">
            ${totalRevenue.data.averageBookingPrice.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TotalSpentStatsCard;
