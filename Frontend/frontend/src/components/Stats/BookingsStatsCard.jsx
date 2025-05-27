import { BookOpenIcon } from "@heroicons/react/24/outline";
import React from "react";

function BookingsStatsCard({ bookings }) {
  return (
    <div className="w-full rounded-xl bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left section */}
        <div className="flex sm:flex-col items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <BookOpenIcon className="h-5 w-5 text-[#dfa379]" />
          </div>
          <div className="text-sm text-gray-500">Bookings</div>
          <div className="text-3xl font-bold text-gray-900">
            {bookings.total}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block border-l border-gray-200"></div>

        {/* Right section */}
        <div className="flex flex-col justify-center gap-2 text-sm text-gray-500">
          <span>Upcoming: {bookings.data.upcoming}</span>
          <span>Current: {bookings.data.current}</span>
          <span>Past: {bookings.data.past}</span>
          <span>Missed: {bookings.data.missed}</span>
        </div>
      </div>
    </div>
  );
}

export default BookingsStatsCard;
