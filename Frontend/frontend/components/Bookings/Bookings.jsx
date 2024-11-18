import React from "react";
import SingleBooking from "./SingleBooking";

function Bookings() {
  const bookings = [
    {
      id: 1,
      guestName: "John Doe",
      roomNumber: "101",
      checkInDate: "2024-10-25",
      checkOutDate: "2024-10-30",
      status: "Confirmed",
    },
    {
      id: 2,
      guestName: "Jane Smith",
      roomNumber: "102",
      checkInDate: "2024-10-26",
      checkOutDate: "2024-10-31",
      status: "Pending",
    },
    {
      id: 3,
      guestName: "Sam Wilson",
      roomNumber: "103",
      checkInDate: "2024-10-20",
      checkOutDate: "2024-10-25",
      status: "Checked Out",
    },
  ];

  return (
    <div className="flex-1 p-6 ">
      <h1 className="text-3xl font-bold mb-4 ">Bookings Overview</h1>
      <div className="animate-fadeInDown grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-6 ">
        {bookings.map((booking) => (
          <SingleBooking booking={booking} key={booking.id} />
        ))}
      </div>
    </div>
  );
}

export default Bookings;
