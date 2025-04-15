import { UsersIcon } from "@heroicons/react/24/outline";
import React from "react";

function CustomerStatsCard({ users }) {
  return (
    <div className="max-w-sm rounded-xl bg-white p-6 shadow-md">
      <div className="flex flex-col gap-4">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <UsersIcon className="h-5 w-5 text-gray-600" />
        </div>

        {/* Label */}
        <div className="text-sm text-gray-500">Customers</div>

        {/* Stats */}
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold text-gray-900">{users}</div>
        </div>
      </div>
    </div>
  );
}

export default CustomerStatsCard;
