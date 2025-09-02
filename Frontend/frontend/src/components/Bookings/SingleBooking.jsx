import {
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import WarningButton from "../Reusable/WarningButton";
import UpdateButton from "../Reusable/UpdateButton";
import { useDeleteBooking } from "./useDeleteBooking";
import useUIStore from "../../stores/UiStore";
import Modal from "../Reusable/Modal";
import PaymentModal from "../Payments/PaymentModal";
import { useState } from "react";
import {
  eachDayOfInterval,
  format,
  parseISO,
  isAfter,
  set,
  subDays,
} from "date-fns";

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-red-100 text-red-800",
  missed: "bg-orange-100 text-orange-800",
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PaymentBadge = ({ paymentStatus }) => {
  const getPaymentLabel = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "unpaid":
        return "Unpaid";
      case "missed":
        return "Missed";
      default:
        return "Unpaid";
    }
  };

  const status = paymentStatus?.toLowerCase();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
      ${statusStyles[status] || statusStyles.unpaid}`}
    >
      {getPaymentLabel(paymentStatus)}
    </span>
  );
};

function SingleBooking({ booking }) {
  const { deleteBooking, isPending, error } = useDeleteBooking();
  const { isBookingModalOpen } = useUIStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const selectedBookingId = useUIStore((state) => state.selectedBookingId);
  const onBookingModalOpen = useUIStore((state) => state.onBookingModalOpen);
  const onBookingModalClose = useUIStore((state) => state.onBookingModalClose);

  const now = new Date();
  const today = new Date();
  const paymentDeadline = set(today, {
    hours: 11,
    minutes: 30,
    seconds: 0,
    milliseconds: 0,
  });

  const isDateBooked = () => {
    const checkInDate = parseISO(booking.checkIn);
    const isCheckInToday =
      format(checkInDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");

    if (isCheckInToday) {
      return isAfter(now, paymentDeadline);
    }
    return isAfter(now, checkInDate);
  };

  const handleConfirmModal = () => {
    onBookingModalClose();
  };

  const isPaid = booking.paid === "paid" || booking.paid === "missed";

  return (
    <>
      {isBookingModalOpen && selectedBookingId === booking.id && (
        <Modal
          action={deleteBooking}
          id={selectedBookingId}
          isOpen={isBookingModalOpen}
          onClose={onBookingModalClose}
          title={"Are you sure you want permanently delete this booking?"}
          description={"If you delete this booking, it cannot be recovered!"}
          onConfirm={handleConfirmModal}
          isPending={isPending}
          opacity="50"
        />
      )}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 max-w-lg">
        <div className="bg-[#dfa379] text-white p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">
              Room {booking.room.roomNumber}
            </h3>
            <p className="text-indigo-100 capitalize">Standard Room</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">${booking.price}</div>
            <div className="text-indigo-100 text-sm">
              for {booking.numOfNights} nights
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h4 className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
              Guest
            </h4>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center text-indigo-600 font-bold">
                {booking.user.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
              <div>
                <div className="font-semibold">{booking.user.name}</div>
                <div className="text-sm text-gray-500">
                  {booking.user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
                Check In
              </h4>
              <p className="font-medium">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
                Check Out
              </h4>
              <p className="font-medium">{formatDate(booking.checkOut)}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">
                  Payment Status
                </h4>
                <PaymentBadge paymentStatus={booking.paid} />
              </div>
              <div className="text-sm text-gray-500">
                Booked on {formatDate(booking.createdAt)}
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <UpdateButton
                isPaid={isPaid}
                isPast={isDateBooked()}
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Pay
              </UpdateButton>
              <WarningButton
                disabled={isDateBooked()}
                onClick={() => onBookingModalOpen(booking.id)}
              >
                Cancel
              </WarningButton>
            </div>
          </div>
        </div>
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingId={booking.id}
        />
      </div>
    </>
  );
}

export default SingleBooking;
