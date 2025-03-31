import { useEffect, useState } from "react";
import { modes } from "../../../hooks/useServiceConfig";
import useUIStore from "../../../stores/UiStore";
import Loading from "../../Reusable/Loading";
import SingleBooking from "../SingleBooking";

import { useInView } from "react-intersection-observer";
import { useGetBookingsCount } from "../AdminBookings/useGetBookingsCount";
import { useGetAllBookings } from "./useGetAllBookings";

function Bookings() {
  const { bookingActiveTab, setBookingActiveTab } = useUIStore();
  const {
    bookings,
    isPending,
    total,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllBookings(bookingActiveTab);

  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const { selectedSortOption } = useUIStore();
  const setSelectedSortOption = useUIStore(
    (state) => state.setSelectedSortOption
  );

  const { bookings_counts, error_count, isPending_count } =
    useGetBookingsCount();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending || isPending_count) return <Loading mode={modes.all} />;

  return (
    <>
      <div className=" my-6 mx-6 px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 justify-start">
            {["upcoming", "current", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setBookingActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  bookingActiveTab === tab
                    ? "border-[#dfa379] text-[#dfa379]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                {bookings_counts?.data[tab] || 0})
              </button>
            ))}

            {/* Date Sorting Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Sort By
              </label>
              <div className="relative">
                <div
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#dfa379] transition-colors flex items-center justify-between"
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
                    {["checkInDate", "checkOutDate"].map((option) => (
                      <li
                        key={option}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          selectedSortOption === option
                            ? "bg-[#dfa379] text-white"
                            : "hover:bg-[#dfa379]/10"
                        }`}
                        onClick={() => {
                          setBookingSortOption(option);
                          setIsSortDropdownOpen(false);
                        }}
                      >
                        {option.replace(/([A-Z])/g, " $1").trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </nav>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No {bookingActiveTab} bookings found
              </p>
            </div>
          ) : (
            bookings?.map((booking) => (
              <SingleBooking key={booking.id} booking={booking} />
            ))
          )}
          <div ref={ref} className="h-2" />
        </div>
        {isFetchingNextPage && <Loading mode={modes.all} />}
      </div>
    </>
  );
}

export default Bookings;
