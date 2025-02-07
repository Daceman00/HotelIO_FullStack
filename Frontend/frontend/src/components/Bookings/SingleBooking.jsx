function SingleBooking({
  guestName,
  roomNumber,
  checkInDate,
  checkOutDate,
  status,
}) {
  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
      <h3 className="text-xl font-bold mb-2">{guestName}</h3>
      <p className="mb-1">Room: {roomNumber}</p>
      <p className="mb-1">
        Check-in: {new Date(checkInDate).toLocaleDateString()}
      </p>
      <p className="mb-1">
        Check-out: {new Date(checkOutDate).toLocaleDateString()}
      </p>
      <p className="font-semibold">
        Status:{" "}
        <span
          className={`${
            status === "Confirmed"
              ? "text-green-500"
              : status === "Pending"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {status}
        </span>
      </p>
    </div>
  );
}

export default SingleBooking;
