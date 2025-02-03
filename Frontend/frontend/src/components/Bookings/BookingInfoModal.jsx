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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#dfa379] p-6">
          <h3 className="text-2xl font-bold text-white text-center">
            Booking Confirmed!
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {bookingData && (
            <>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-600">Check-In:</span>
                <span className="text-gray-800">
                  {format(parseISO(bookingData.checkIn), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-600">Check-Out:</span>
                <span className="text-gray-800">
                  {format(parseISO(bookingData.checkOut), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Guests:</span>
                <span className="text-gray-800">{bookingData.numOfGuests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-600">Price:</span>
                <span className="text-gray-800">${bookingData.price}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#dfa379] text-[#dfa379] rounded hover:bg-[#fff7f2] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingInfoModal;
