import SingleBooking from "./SingleBooking";

function Bookings() {
  const bookings = [
    {
      guestName: "John Doe",
      roomNumber: "101",
      checkInDate: "2023-10-01",
      checkOutDate: "2023-10-05",
      status: "Confirmed",
    },
    {
      guestName: "Jane Smith",
      roomNumber: "102",
      checkInDate: "2023-10-02",
      checkOutDate: "2023-10-06",
      status: "Pending",
    },
    // Add more bookings as needed
  ];

  return (
    <div className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-4">Bookings Overview</h1>
      <div className="animate-fadeInDown grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bookings.map((booking, index) => (
          <SingleBooking key={index} {...booking} />
        ))}
      </div>
    </div>
  );
}

export default Bookings;
