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

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-red-100 text-red-800",
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const PaymentBadge = ({ isPaid }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
    ${isPaid ? statusStyles.paid : statusStyles.unpaid}`}
  >
    {isPaid ? "Paid" : "Unpaid"}
  </span>
);

function SingleBooking({ booking }) {
  const { deleteBooking, isPending, error } = useDeleteBooking();
  const { isModalOpen } = useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);

  const handleConfirmModal = () => {
    onModalClose();
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          action={deleteBooking}
          userId={booking.id}
          isOpen={isModalOpen}
          onClose={onModalClose}
          title={"Are you sure you want permanently delete this user?"}
          description={"If you delete this user, it will lose all his data!"}
          onConfirm={handleConfirmModal}
          isPending={isPending}
          opacity="10"
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
                <PaymentBadge isPaid={booking.paid} />
              </div>
              <div className="text-sm text-gray-500">
                Booked on {formatDate(booking.createdAt)}
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <UpdateButton>Update</UpdateButton>
              <WarningButton onClick={onModalOpen}>Delete</WarningButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleBooking;
