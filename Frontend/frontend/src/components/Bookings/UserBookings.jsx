import React, { useEffect } from "react";
import { useGetBookingsByUser } from "./useGetBookingsByUser";
import { useGetUsersBookingsCount } from "./useGetUsersBookingsCounts";
import { useInView } from "react-intersection-observer";
import useUIStore from "../../stores/UiStore";
import SingleBooking from "./SingleBooking";
import LoadingSpinner from "../Reusable/LoadingSpinner";

function UserBookings() {
  const { bookingActiveTab, setBookingActiveTab } = useUIStore();
  const {
    bookings,
    isPending,
    total,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetBookingsByUser(bookingActiveTab);

  const { bookings_counts, error_count, isPending_count } =
    useGetUsersBookingsCount();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section with Glass Effect */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-2xl p-6 mb-8 shadow-xl shadow-gray-200/50">
            <nav className="flex flex-wrap items-center justify-between gap-6">
              {/* Tab Navigation */}
              <div className="flex items-center space-x-2 bg-gray-100/80 rounded-xl p-1.5 backdrop-blur-sm">
                {isPending_count ? (
                  <div className="flex space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-10 w-24 bg-gray-300/60 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ["upcoming", "current", "past", "missed"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setBookingActiveTab(tab)}
                      className={`relative px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        bookingActiveTab === tab
                          ? "bg-gradient-to-r from-[#dfa379] to-[#c4916b] text-white shadow-lg shadow-[#dfa379]/30 transform scale-105"
                          : "text-gray-600 hover:text-[#dfa379] hover:bg-white/60 hover:shadow-md"
                      }`}
                    >
                      <span className="relative z-10">
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </span>
                      <span
                        className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                          bookingActiveTab === tab
                            ? "bg-white/20 text-white"
                            : "bg-gray-200/80 text-gray-600"
                        }`}
                      >
                        {bookings_counts?.data[tab] || 0}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </nav>
          </div>

          {/* Content Section */}
          {isPending ? (
            <div className="flex justify-center py-20">
              <div className="relative">
                <LoadingSpinner />
                <div className="absolute inset-0 bg-gradient-to-r from-[#dfa379]/20 to-[#c4916b]/20 rounded-full blur-xl animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookings?.length === 0 ? (
                <div className="col-span-full">
                  <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No bookings found
                    </h3>
                    <p className="text-gray-500">
                      No {bookingActiveTab} bookings found.
                    </p>
                  </div>
                </div>
              ) : (
                bookings?.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SingleBooking booking={booking} />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Load More Section */}
          {hasNextPage && (
            <div ref={ref} className="w-full flex justify-center py-8 mt-8">
              {isFetchingNextPage ? (
                <div className="relative">
                  <LoadingSpinner />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#dfa379]/20 to-[#c4916b]/20 rounded-full blur-xl animate-pulse"></div>
                </div>
              ) : (
                <div className="h-10 w-full bg-gradient-to-r from-transparent via-gray-200/30 to-transparent" />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserBookings;
