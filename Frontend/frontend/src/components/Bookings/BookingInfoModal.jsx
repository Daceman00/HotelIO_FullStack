import { format, parseISO } from "date-fns";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Error from "../Reusable/Error";

function BookingInfoModal({
  isOpen,
  onClose,
  bookingData,
  isPending,
  isError,
  opacity = 50,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (isError) return <Error message={isError} />;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000] p-4"
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity / 100})` }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md lg:max-w-2xl overflow-hidden relative z-[1001] max-h-full lg:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {isPending ? (
          <div className="p-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-400 p-8 relative">
              {/* Animated checkmark circle */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-100/30 rounded-full" />
              <div className="flex flex-col items-center relative">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-green-200/30 rounded-full animate-ping" />
                  <div className="relative flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  Booking Confirmed! 🎉
                </h3>
                <p className="text-white/95 text-sm">
                  Your reservation has been successfully created
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {bookingData && (
                <div className="space-y-6">
                  {/* Guest Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg
                          className="w-5 h-5 text-green-600"
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
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Guest Information
                      </h4>
                    </div>
                    <div className="space-y-3 pl-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Name:</span>
                        <span className="text-gray-800 font-medium">
                          {bookingData.user.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-800 break-all max-w-[160px] truncate">
                          {bookingData.user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Booking Details
                      </h4>
                    </div>
                    <div className="space-y-4 pl-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Room:</span>
                        <span className="text-gray-800 font-medium">
                          {bookingData.room.roomNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Check-in:</span>
                        <span className="text-gray-800">
                          {format(
                            parseISO(bookingData.checkIn),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Check-out:</span>
                        <span className="text-gray-800">
                          {format(
                            parseISO(bookingData.checkOut),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Guests:</span>
                        <span className="text-gray-800">
                          {bookingData.numOfGuests}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Total Price:</span>
                        <span className="text-green-600 font-semibold">
                          ${bookingData.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-medium py-3 px-4 rounded-lg transition-all"
              >
                View Bookings
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingInfoModal;
