import React from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function SingleRoom({ room }) {
  const navigate = useNavigate();
  const rating = Math.floor(room.averageRating) || 0;

  return (
    <div
      className="group relative h-[400px] w-full overflow-hidden rounded-xl bg-cover bg-center shadow-xl transition-all duration-300 hover:shadow-2xl"
      style={{ backgroundImage: `url(${IMAGE_URL}/${room.imageCover})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content Card */}
      <div className="absolute inset-x-4 bottom-0 translate-y-[65%] transform rounded-t-2xl bg-white/90 p-6 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-y-0">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-2xl font-bold text-gray-800">
            #{room.roomNumber}
          </h3>
          <div className="text-right">
            <p className="text-xl font-bold text-[#dfa974]">${room.price}</p>
            <span className="text-sm text-gray-500">per night</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <i className="fas fa-users text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Capacity</p>
              <p className="text-gray-700">{room.maxGuests} Guests</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <i className="fas fa-bed text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="capitalize text-gray-700">{room.roomType}</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <i className="fas fa-star text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <div className="flex gap-1 text-[#ffc107]">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star${i < rating ? "" : "-half-alt"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/rooms/${room._id}`)}
          className="w-full transform rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#dfa974] hover:shadow-lg"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default SingleRoom;
