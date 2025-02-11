import {
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import WarningButton from "../Reusable/WarningButton";
import UpdateButton from "../Reusable/UpdateButton";
import { useDeleteBooking } from "./useDeleteBooking";

const statusStyles = {
  paid: "bg-green-100 text-green-800",
  unpaid: "bg-red-100 text-red-800",
};

function SingleBooking({ booking }) {
  const { deleteBooking, isPending, error } = useDeleteBooking();
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking #{booking.id}
          </h3>
          <p className="text-sm text-gray-500">
            {booking.createdAt.toString().split("T")[0]}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            booking.paid ? statusStyles.paid : statusStyles.unpaid
          }`}
        >
          {booking.paid ? "Paid" : "Unpaid"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">
            {booking.checkIn.toString().split("T")[0]} -{" "}
            {booking.checkOut.toString().split("T")[0]}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <UserIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">
            {booking.numOfGuests} {booking.numOfGuests > 1 ? "guests" : "guest"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">Total: ${booking.price}</span>
        </div>

        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">
            {booking.numOfNights} {booking.numOfNights > 1 ? "nights" : "night"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600">
            Room Number: {booking.room.roomNumber}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-gray-600">
            User: {booking.user.name} ({booking.user.email})
          </span>
        </div>
      </div>

      <div className="border-t pt-4 flex flex-wrap justify-center gap-3">
        <div className="w-full sm:w-auto">
          <UpdateButton />
        </div>
        <div className="w-full sm:w-auto">
          <WarningButton
            cancelAction={deleteBooking}
            isPending={isPending}
            data={booking}
          />
        </div>
      </div>
    </div>
  );
}

export default SingleBooking;
