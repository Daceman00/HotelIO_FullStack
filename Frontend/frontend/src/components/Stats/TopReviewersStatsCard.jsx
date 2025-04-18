import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

function TopReviewersStatsCard({ reviewers }) {
  return (
    <div className="w-full rounded-xl bg-white p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow ">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left section */}
        <div className="flex sm:flex-col items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <UserIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-sm text-gray-500">Top Reviewers</div>
          <div className="text-3xl font-bold text-gray-900">
            {reviewers.totalReviews}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block border-l border-gray-200"></div>

        {/* Right section */}
        <div className="flex flex-col justify-center gap-2 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <span>Avg. Rating:</span>
            <span className="font-medium text-blue-600 p-1">
              {reviewers.averageRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopReviewersStatsCard;
