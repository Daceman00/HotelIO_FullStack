import React from "react";
import { useGetAllBookings } from "../Bookings/AdminBookings/useGetAllBookings";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Link } from "react-router-dom";

function LatestBookings() {
  const { bookings, isPending, error } = useGetAllBookings();
  const latestBookings = bookings.slice(0, 5);

  const getStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          bgColor: "bg-emerald-500",
          textColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
          label: "Paid",
          icon: "✓",
        };
      case "unpaid":
        return {
          bgColor: "bg-rose-500",
          textColor: "text-rose-700 bg-rose-50 border-rose-200",
          label: "Unpaid",
          icon: "⚠",
        };
      case "missed":
        return {
          bgColor: "bg-amber-500",
          textColor: "text-amber-700 bg-amber-50 border-amber-200",
          label: "Missed",
          icon: "⏰",
        };
      default:
        return {
          bgColor: "bg-slate-400",
          textColor: "text-slate-700 bg-slate-50 border-slate-200",
          label: "Unknown",
          icon: "?",
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGuestInitials = (email) => {
    const name = email.split("@")[0];
    return name
      .split(".")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <div className="w-full max-w-8xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100/50 backdrop-blur-sm">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Recent Bookings
            </h2>
            <p className="text-gray-500 text-sm">Latest reservation activity</p>
          </div>
          {isPending && <LoadingSpinner />}
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-[#dfa379] hover:text-white hover:border-[#dfa379] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#dfa379] focus:ring-offset-2 shadow-sm hover:shadow-md"
          >
            View all bookings
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {latestBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50/50 transition-colors duration-200 group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#dfa379] to-[#c8956d] rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {getGuestInitials(booking?.user?.email)}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {booking.user.email
                              .split("@")[0]
                              .replace(".", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {booking.user.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <svg
                              className="w-3 h-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span className="text-xs text-gray-500 font-medium">
                              {booking.numOfGuests}{" "}
                              {booking.numOfGuests === 1 ? "Guest" : "Guests"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ${booking.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Room {booking.room.roomNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(booking.checkIn)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(booking.checkOut)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-gray-900">
                          {booking.numOfNights}
                        </span>
                        <span className="text-xs text-gray-500">
                          {booking.numOfNights === 1 ? "night" : "nights"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                            getStatusConfig(booking.paid).textColor
                          }`}
                        >
                          <span className="text-sm">
                            {getStatusConfig(booking.paid).icon}
                          </span>
                          {getStatusConfig(booking.paid).label}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {latestBookings.length === 0 && !isPending && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LatestBookings;
