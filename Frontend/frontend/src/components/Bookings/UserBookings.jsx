import React, { useEffect } from "react";
import { useGetBookingsByUser } from "./useGetBookingsByUser";
import { useGetUsersBookingsCount } from "./useGetUsersBookingsCounts";
import { useInView } from "react-intersection-observer";
import useUIStore from "../../stores/UiStore";
import SingleBooking from "./SingleBooking";

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
          </nav>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookings?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                You don't have any {bookingActiveTab} bookings
              </p>
            </div>
          ) : (
            bookings?.map((booking) => (
              <SingleBooking key={booking.id} booking={booking} />
            ))
          )}
          <div ref={ref} className="h-2" />
        </div>
        {/* Modified loading section */}
        {(hasNextPage || isFetchingNextPage) && (
          <div ref={ref} className="w-full">
            {isFetchingNextPage && <LoadingSpinner />}
          </div>
        )}
      </div>
    </>
  );
}

export default UserBookings;
