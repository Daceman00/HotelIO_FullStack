function SingleBooking(booking) {
  return (
    <div className=" text-white_primary p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <h3 className="text-xl font-bold mb-2">{booking.guestName}</h3>
      <p className="mb-1">Room: {booking.roomNumber}</p>
      <p className="mb-1">
        Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
      </p>
      <p className="mb-1">
        Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
      </p>
      <p className="font-semibold">
        Status:{" "}
        <span
          className={`${
            booking.status === "Confirmed"
              ? "text-green_secondary"
              : booking.status === "Pending"
              ? ""
              : ""
          }`}
        >
          {booking.status}
        </span>
      </p>
    </div>
  );
}

export default SingleBooking;
