import { UsersIcon } from "@heroicons/react/24/outline";
import React from "react";

function CustomerStatsCard({ users }) {
  return (
    <div className="max-w-sm rounded-xl bg-white p-4 sm:p-6 shadow-md">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-100">
          <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
        </div>

        <div className="text-xs sm:text-sm text-gray-500">Customers</div>

        <div className="flex items-end justify-between">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">
            {users}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerStatsCard;
