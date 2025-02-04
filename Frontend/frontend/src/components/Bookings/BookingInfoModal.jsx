import { format, parseISO } from "date-fns";
import { useEffect } from "react";

function BookingInfoModal({ isOpen, onClose, bookingData }) {
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

  return (
    <div
      className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#dfa379] to-[#e8b18d] p-6">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h3 className="text-2xl font-bold text-white text-center">
              Booking Confirmed!
            </h3>
            <p className="text-white/90 mt-2 text-sm">
              Thank you for your reservation
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {bookingData && (
            <div className="space-y-4">
              {/* Guest Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#dfa379]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Guest Information</span>
                </div>
                <div className="flex flex-col space-y-2 pl-7">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Name:</span>
                    <span className="text-gray-800 font-medium">
                      {bookingData.user.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-gray-800 break-all">
                      {bookingData.user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#dfa379]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Booking Details</span>
                </div>
                <div className="space-y-3 pl-7">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Room:</span>
                    <span className="text-gray-800">
                      {bookingData.room.roomNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Check-in:</span>
                    <span className="text-gray-800 font-medium">
                      {format(parseISO(bookingData.checkIn), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Check-out:</span>
                    <span className="text-gray-800 font-medium">
                      {format(parseISO(bookingData.checkOut), "MMM dd, yyyy")}
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
                    <span className="text-[#dfa379] font-semibold">
                      ${bookingData.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-[#dfa379] hover:bg-[#d1936c] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingInfoModal;
