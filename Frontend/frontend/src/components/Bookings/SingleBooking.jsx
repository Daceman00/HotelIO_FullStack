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
      {isModalOpen ? (
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
      ) : null}
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-full max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <div>
            <h3 className="text-lg md:text-base lg:text-pretty font-semibold text-gray-900">
              Booking #{booking.id}
            </h3>
            <p className="text-sm md:text-sm lg:text-[11px] text-gray-500">
              {booking.createdAt.toString().split("T")[0]}
            </p>
          </div>
          <span
            className={`inline-flex items-center mr-2 px-3 py-1 rounded-full text-sm md:text-sm lg:text-[10px] font-medium ${
              booking.paid ? statusStyles.paid : statusStyles.unpaid
            }`}
          >
            {booking.paid ? "Paid" : "Unpaid"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600 text-pretty md:text-xs lg:text-[12px]">
              {booking.checkIn.toString().split("T")[0]} -{" "}
              {booking.checkOut.toString().split("T")[0]}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600 text-pretty md:text-sm lg:text-[12px]">
              {booking.numOfGuests}{" "}
              {booking.numOfGuests > 1 ? "guests" : "guest"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600 text-pretty md:text-sm lg:text-[12px]">
              Total: ${booking.price}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <span className="text-gray-600 text-pretty md:text-sm lg:text-[12px]">
              {booking.numOfNights}{" "}
              {booking.numOfNights > 1 ? "nights" : "night"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-pretty md:text-sm lg:text-[12x]">
              Room Number: {booking.room.roomNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-pretty md:text-pretty lg:text-[14px]">
              User: {booking.user.name} ({booking.user.email})
            </span>
          </div>
        </div>

        <div className="border-t pt-4 flex flex-wrap justify-center gap-3">
          <div className="w-full sm:w-auto">
            <UpdateButton />
          </div>
          <div className="w-full sm:w-auto">
            <WarningButton onClick={onModalOpen}>Delete</WarningButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleBooking;
