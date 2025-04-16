import React from "react";
import { usetotalRevenue } from "./useTotalRevenue";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import { BookOpenIcon } from "@heroicons/react/24/outline";

function TotalSpentStatsCard({ totalRevenue }) {
  console.log(totalRevenue.data);
  return (
    <div className="max-w-sm rounded-xl bg-white p-6 shadow-md">
      <div className="flex flex-col gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <BookOpenIcon className="h-5 w-5 text-gray-600" />
        </div>

        {/* Label */}
        <div className="text-sm text-gray-500">Customers</div>

        {/* Stats */}
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-gray-900">3,782</div>
          <div className="flex items-center text-sm font-medium text-green-500">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M6 2.5L9.5 6L8.5 7L6.5 5V9.5H5.5V5L3.5 7L2.5 6L6 2.5Z"
                fill="currentColor"
              />
            </svg>
            11.01%
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalSpentStatsCard;
