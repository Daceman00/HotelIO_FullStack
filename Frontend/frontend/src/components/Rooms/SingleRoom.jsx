import React from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function SingleRoom({ room }) {
  const navigate = useNavigate();
  const rating = Math.floor(room.averageRating) || 0;

  return (
    <div className="group relative h-80 w-full overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-500 hover:scale-[1.02] flex">
      {/* Image Section with Diagonal Clip */}
      <div
        className="h-full w-3/5 overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
      >
        <img
          src={`${IMAGE_URL}/${room.imageCover}`}
          alt={`Room ${room.roomNumber}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Floating Rating Badge */}
        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 backdrop-blur-sm">
          <i className="fas fa-star text-amber-400" />
          <span className="text-sm font-semibold text-white">
            {room.averageRating ? room.averageRating.toFixed(1) : "0.0"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center p-8 min-w-0">
        <div className="space-y-6">
          {/* Room Header */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 truncate">
              #{room.roomNumber}
            </h3>
            <p className="text-lg capitalize text-gray-600 truncate">
              {room.roomType}
            </p>
          </div>

          {/* Room Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <i className="fas fa-users w-5 text-gray-500" />
              <span className="text-gray-700">{room.maxGuests} Guests</span>
            </div>

            <div className="flex items-center gap-3">
              <i className="fas fa-star w-5 text-amber-400" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star text-sm ${
                      i < rating ? "text-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="fas fa-dollar-sign w-5 text-[#dfa974]" />
              <span className="text-2xl font-bold text-gray-800">
                ${room.price}
              </span>
              <span className="text-gray-500">night</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(`/rooms/${room._id}`)}
            className="group/btn relative overflow-hidden rounded-full bg-gray-800 px-8 py-3 text-white transition-all duration-300 hover:bg-[#dfa974]"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Details
              <i className="fas fa-arrow-right transition-transform group-hover/btn:translate-x-1" />
            </span>
            <div className="absolute inset-0 scale-x-0 bg-gradient-to-r from-[#dfa974] to-[#c8956a] transition-transform duration-300 group-hover/btn:scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleRoom;
