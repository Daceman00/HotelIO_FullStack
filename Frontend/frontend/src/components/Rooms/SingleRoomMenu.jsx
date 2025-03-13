import React from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";

function SingleRoomMenu({ room }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-[#dfa974]";
      case "occupied":
        return "bg-blue-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const isMaintenance = room.status.toLowerCase() === "maintenance";

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  console.log(room);

  return (
    <div
      className={`relative flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isMaintenance ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          src={`${IMAGE_URL}/${room.imageCover}`}
          alt={room.roomNumber}
        />
        <div
          className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(
            room.status
          )}`}
        >
          {room.status.toUpperCase()}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 bg-white flex flex-col flex-1">
        {/* Room Info */}
        <div className="mb-4 flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-gray-800">
              #{room.roomNumber}
            </h3>
            <div className="text-right">
              <p className="text-xl font-bold text-[#dfa974]">{room.price}$</p>
              <p className="text-sm text-gray-500">per night</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-gray-600 mb-4">
            <div>
              <p className="text-sm font-medium">Room Type</p>
              <p className="capitalize">{room.roomType.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Capacity</p>
              <p>{room.maxGuests} Guests</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {room.features.map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate(`/rooms/${room._id}`)}
          className="w-full mt-auto py-2 px-4 bg-gray-800 text-white rounded-lg font-medium
          hover:bg-[#dfa974] transition-colors duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default SingleRoomMenu;
