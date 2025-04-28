import React, { useState, useRef, useEffect } from "react";
import { useGetAllBookings } from "../Bookings/AdminBookings/useGetAllBookings";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Link } from "react-router-dom";

function LatestBookings() {
  const { bookings, isPending, error } = useGetAllBookings();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("newest");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const latestBookings = bookings.slice(0, 5);

  const getStatusColor = (paid) => {
    return paid ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  };
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Bookings
          </h2>
          {isPending && <LoadingSpinner />}
          <div className="flex items-center gap-4">
            {/* Sort Field Dropdown */}
            <div className="relative pb-2" ref={dropdownRef}>
              <div
                className="w-40 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:border-[#dfa379] transition-colors flex items-center justify-between"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                role="button"
              >
                <span className="capitalize">
                  {selectedSortOption.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${
                    isSortDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {isSortDropdownOpen && (
                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {Object.keys(sortingOptions).map((option) => (
                    <li
                      key={option}
                      className={`capitalize px-4 py-3 cursor-pointer transition-colors ${
                        selectedSortOption === option
                          ? "bg-[#dfa379]/20"
                          : "hover:bg-[#dfa379]/10"
                      }`}
                      onClick={() => {
                        setSelectedSortOption(option);
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      {option.replace(/([A-Z])/g, " $1").trim()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-2">
              <button variant="outline" className="flex items-center gap-2">
                <div className="h-4 w-4" />
                Filter
              </button>
              <Link
                to="/bookings"
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-[#dfa379] hover:text-white hover:border-[#dfa379] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#dfa379] focus:ring-offset-2"
              >
                See all
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 border-b">
                  Booking
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 text-right border-b">
                  Price
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 border-b">
                  Room
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 border-b">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {latestBookings.map((booking, index) => (
                <tr
                  key={booking.id}
                  className={`
                    border-b last:border-b-0 
                    hover:bg-gray-50 transition-colors
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          #{booking.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.numOfGuests}{" "}
                          {booking.numOfGuests === 1 ? "Guest" : "Guests"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ${booking.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    Room {booking.room.roomNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          booking.paid ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.paid
                        )}`}
                      >
                        {booking.paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LatestBookings;
