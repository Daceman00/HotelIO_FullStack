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
          bgColor: "bg-green-500",
          textColor: "text-green-600 bg-green-100",
          label: "Paid",
        };
      case "unpaid":
        return {
          bgColor: "bg-red-500",
          textColor: "text-red-600 bg-red-100",
          label: "Unpaid",
        };
      case "missed":
        return {
          bgColor: "bg-orange-100 ",
          textColor: "text-orange-800 bg-orange-50",
          label: "Missed",
        };
      default:
        return {
          bgColor: "bg-yellow-500",
          textColor: "text-yellow-600 bg-yellow-100",
          label: "Unknown",
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

  return (
    <div className="w-full max-w-8xl mx-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Bookings
          </h2>
          {isPending && <LoadingSpinner />}
          <Link
            to="/bookings"
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-[#dfa379] hover:text-white hover:border-[#dfa379] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#dfa379] focus:ring-offset-2"
          >
            See all
          </Link>
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
                  Check In
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 border-b">
                  Check Out
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600 border-b">
                  Nights
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
                          {booking.user.email}
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
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(booking.checkIn)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(booking.checkOut)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {booking.numOfNights}{" "}
                    {booking.numOfNights === 1 ? "Night" : "Nights"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          getStatusConfig(booking.paid).bgColor
                        }`}
                      ></div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getStatusConfig(booking.paid).textColor
                        }`}
                      >
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
    </div>
  );
}

export default LatestBookings;
