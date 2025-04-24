import { useEffect, useState, useRef, useCallback } from "react";
import useUIStore from "../../../stores/UiStore";
import SingleBooking from "../SingleBooking";
import { useInView } from "react-intersection-observer";
import { useGetBookingsCount } from "../AdminBookings/useGetBookingsCount";
import { useGetAllBookings } from "./useGetAllBookings";
import SearchInput from "../../Reusable/SearchInput";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "../../Reusable/LoadingSpinner";
import Error from "../../Reusable/Error";

function Bookings() {
  const location = useLocation();
  const { bookingActiveTab, setBookingActiveTab } = useUIStore();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const { selectedSortOption, sortOrder } = useUIStore();
  const setSelectedSortOption = useUIStore(
    (state) => state.setSelectedSortOption
  );
  const toggleSortOrder = useUIStore((state) => state.toggleSortOrder);
  const { bookingsSearchQuery } = useUIStore();
  const setBookingsSearchQuery = useUIStore(
    (state) => state.setBookingsSearchQuery
  );

  const sortingOptions = {
    created: "createdAt",
    checkIn: "checkIn",
    checkOut: "checkOut",
    numOfGuests: "numOfGuests",
    price: "price",
    paid: "paid",
  };

  // this function to combine sort order with field
  const getSortString = () => {
    const sortField = sortingOptions[selectedSortOption];
    return `${sortOrder}${sortField}`;
  };

  const {
    bookings,
    isPending,
    total,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllBookings(bookingActiveTab, getSortString());

  const { bookings_counts, error_count, isPending_count } =
    useGetBookingsCount();

  // Replace the existing useInView implementation with this one
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const dropdownRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsSortDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    setBookingsSearchQuery("");
    setSelectedSortOption("created");
  }, [location.pathname, setBookingsSearchQuery, setSelectedSortOption]);

  if (error) return <Error message={error.message} />;

  return (
    <>
      <div className="my-6 mx-6 px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 justify-start">
            {isPending_count ? (
              <div className="flex space-x-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              ["upcoming", "current", "past"].map((tab) => (
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
              ))
            )}

            {/* Date Sorting Dropdown */}
            {/* Sorting Controls */}
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

              {/* Sort Direction Toggle */}
              <button
                onClick={toggleSortOrder}
                className="p-2 border border-gray-200 rounded-lg hover:border-[#dfa379] transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-5 h-5 transition-transform ${
                    sortOrder === "" ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#dfa379"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-3-3m3 3l3-3"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>

        <SearchInput
          placeholder="Search bookings (room, user)"
          searchQuery={bookingsSearchQuery}
          setSearchQuery={setBookingsSearchQuery}
        />

        {isPending ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookings.length === 0 ? (
              <div className="col-span-full">
                <Error message={`No ${bookingActiveTab} bookings found`} />
              </div>
            ) : (
              bookings?.map((booking) => (
                <SingleBooking key={booking.id} booking={booking} />
              ))
            )}
          </div>
        )}

        {/* Update the loading section */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="w-full flex justify-center py-4 mt-4"
          >
            {isFetchingNextPage ? (
              <LoadingSpinner />
            ) : (
              <div className="h-10" /> // Spacer for intersection observer
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Bookings;
