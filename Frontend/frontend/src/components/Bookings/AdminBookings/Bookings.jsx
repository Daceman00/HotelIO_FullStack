import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import useUIStore from "../../../stores/UiStore";
import SingleBooking from "../SingleBooking";
import { useInView } from "react-intersection-observer";
import { useGetBookingsCount } from "../AdminBookings/useGetBookingsCount";
import { useGetAllBookings } from "./useGetAllBookings";
import SearchInput from "../../Reusable/SearchInput";
import LoadingSpinner from "../../Reusable/LoadingSpinner";
import Error from "../../Reusable/Error";

function Bookings() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
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
    checkIn: "checkIn",
    checkOut: "checkOut",
    created: "createdAt",
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
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    setSelectedSortOption("checkIn");
  }, [location.pathname, setBookingsSearchQuery, setSelectedSortOption]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (
      tabFromUrl &&
      ["upcoming", "current", "past", "missed"].includes(tabFromUrl)
    ) {
      setBookingActiveTab(tabFromUrl);
    } else {
      setSearchParams({ tab: bookingActiveTab });
    }
  }, [searchParams, setBookingActiveTab, bookingActiveTab]);

  if (error) return <Error message={error.message} />;

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
                      onClick={() => {
                        setSearchParams({ tab });
                        setBookingActiveTab(tab);
                      }}
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

              {/* Sorting Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Field Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="min-w-[160px] px-4 py-3 bg-white/80 border border-gray-200/60 rounded-xl cursor-pointer hover:border-[#dfa379]/60 hover:shadow-lg transition-all duration-300 flex items-center justify-between backdrop-blur-sm group"
                    onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    role="button"
                  >
                    <span className="capitalize font-medium text-gray-700 group-hover:text-[#dfa379]">
                      {selectedSortOption.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 group-hover:text-[#dfa379] transform transition-all duration-300 ${
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
                    <ul className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-xl shadow-2xl shadow-gray-200/50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      {Object.keys(sortingOptions).map((option) => (
                        <li
                          key={option}
                          className={`capitalize px-4 py-3 cursor-pointer transition-all duration-200 font-medium ${
                            selectedSortOption === option
                              ? "bg-gradient-to-r from-[#dfa379]/20 to-[#c4916b]/20 text-[#dfa379] border-l-4 border-[#dfa379]"
                              : "hover:bg-gray-50/80 text-gray-700 hover:text-[#dfa379] hover:translate-x-1"
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
                  className="p-3 bg-white/80 border border-gray-200/60 rounded-xl hover:border-[#dfa379]/60 hover:shadow-lg transition-all duration-300 group backdrop-blur-sm hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                      sortOrder === "" ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    strokeWidth="2"
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

          {/* Search Section */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <SearchInput
                placeholder="Search bookings (room, user)"
                searchQuery={bookingsSearchQuery}
                setSearchQuery={setBookingsSearchQuery}
                width="200"
              />
            </div>
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
              {bookings.length === 0 ? (
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
                      No {bookingActiveTab} bookings match your current filters.
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
            <div
              ref={loadMoreRef}
              className="w-full flex justify-center py-8 mt-8"
            >
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

export default Bookings;
