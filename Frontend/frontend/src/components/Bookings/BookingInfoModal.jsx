import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Error from "../Reusable/Error";
import PaymentModal from "../Payments/PaymentModal";

function BookingInfoModal({
  isOpen,
  onClose,
  bookingData,
  isPending,
  isError,
  opacity = 50,
}) {
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
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
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-8 relative">
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
                <div className="space-y-4">
                  {/* Guest Info */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "#dfa379" }}
                      >
                        <svg
                          className="w-6 h-6 text-white"
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
                      <h4 className="text-base font-bold text-gray-800">
                        Guest Information
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50/80 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">
                          Name:
                        </span>
                        <span className="text-gray-900 font-semibold text-xs">
                          {bookingData.user.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50/80 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">
                          Email:
                        </span>
                        <span className="text-gray-900 break-all max-w-[150px] truncate font-semibold text-xs">
                          {bookingData.user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-[#dfa379] rounded-lg">
                        <svg
                          className="w-6 h-6 text-white"
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
                      <h4 className="text-base font-bold text-gray-800">
                        Booking Details
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50/80 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">
                          Room:
                        </span>
                        <span className="text-gray-900 font-bold text-sm">
                          #{bookingData.room.roomNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50/80 rounded-lg">
                          <div className="text-gray-600 font-medium text-xs mb-1">
                            Check-in:
                          </div>
                          <div className="text-gray-900 font-semibold text-xs">
                            {format(
                              parseISO(bookingData.checkIn),
                              "MMM dd, yyyy"
                            )}
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50/80 rounded-lg">
                          <div className="text-gray-600 font-medium text-xs mb-1">
                            Check-out:
                          </div>
                          <div className="text-gray-900 font-semibold text-xs">
                            {format(
                              parseISO(bookingData.checkOut),
                              "MMM dd, yyyy"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-2 bg-gray-50/80 rounded-lg">
                        <span className="text-gray-600 font-medium text-xs">
                          Guests:
                        </span>
                        <span className="text-gray-900 font-semibold text-xs">
                          {bookingData.numOfGuests}{" "}
                          {bookingData.numOfGuests === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>

                      <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-800 font-bold text-sm">
                            Total Price:
                          </span>
                          <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            ${bookingData.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
              >
                View Bookings
              </button>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex-1 bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pay Now
              </button>
              <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                bookingId={bookingData.id}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingInfoModal;
