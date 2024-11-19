import React from "react";

function RoomDetails() {
  const room = {
    id: 1,
    name: "Deluxe Room",
    price: 120,
    beds: 2,
    maxOccupancy: 4,
    description: "A luxurious room with all amenities for a comfortable stay.",
    status: "Available",
    imageUrl: "https://example.com/room-image.jpg",
  };
  return (
    <div className="flex flex-col h-[90vh] bg-white_primary">
      {/* Room Image */}
      <div className="relative h-1/2 md:h-2/5 lg:h-1/2">
        <img
          className="w-full h-full object-cover"
          src={room.imageUrl}
          alt={room.name}
        />
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
      </div>

      {/* Room Information */}
      <div className="p-4 md:p-6 lg:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className=" text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {room.name}
          </h3>
          <p className=" text-2xl mb-4">${room.price} / night</p>
          <p className="text-gray-700 text-base md:text-lg lg:text-xl mb-4">
            {room.description}
          </p>

          {/* Room Features */}
          <div className="mb-4">
            <p className=" text-base md:text-lg mb-2">Beds: {room.beds}</p>
            <p className=" text-base md:text-lg mb-2">
              Max Occupancy: {room.maxOccupancy}
            </p>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-4">
          <p className="text-lg  font-semibold mb-2">
            {room.status === "Available" ? "Available" : "Booked"}
          </p>
          <button className=" hover:  font-bold py-2 md:py-4 w-full rounded-lg transition-transform transform hover:scale-105">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
