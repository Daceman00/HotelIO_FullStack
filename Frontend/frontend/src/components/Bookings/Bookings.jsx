import { modes } from "../../hooks/useServiceConfig";
import useUIStore from "../../stores/UiStore";
import Loading from "../Reusable/Loading";
import SingleBooking from "./SingleBooking";
import { useGetAllBookings } from "./useGetAllBookings";
import { format, isBefore, isAfter } from "date-fns";

function Bookings() {
  const { bookings, isPending, error } = useGetAllBookings();
  const { bookingActiveTab } = useUIStore();
  const setBookingActiveTab = useUIStore((state) => state.setBookingActiveTab);

  if (isPending) return <Loading mode={modes.all} />;

  console.log("Bookings", bookings?.data.data); // Access bookings directly

  const filterBookings = (status) => {
    const now = new Date();
    return bookings?.data?.data.filter((booking) => {
      // Access bookings directly
      const startDate = new Date(booking.checkIn);
      const endDate = new Date(booking.checkOut);

      if (status === "upcoming") return isAfter(startDate, now);
      if (status === "current")
        return isBefore(startDate, now) && isAfter(endDate, now);
      if (status === "past") return isBefore(endDate, now);
      return true;
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Bookings</h1>

        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 justify-start">
            {["upcoming", "current", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setBookingActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  bookingActiveTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                {filterBookings(tab).length})
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterBookings(bookingActiveTab).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No {bookingActiveTab} bookings found
              </p>
            </div>
          ) : (
            filterBookings(bookingActiveTab).map((booking) => (
              <SingleBooking key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Bookings;
