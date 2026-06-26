import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function SingleRoom({ room }) {
  const navigate = useNavigate();
  const rating = Math.floor(room.averageRating) || 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative h-80 w-full overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-900/5 border border-gray-100/80 flex"
    >
      {/* Image */}
      <div
        className="relative h-full w-3/5 overflow-hidden"
        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
      >
        <img
          src={room.imageCover}
          alt={`Room ${room.roomNumber}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 via-transparent to-transparent" />

        {/* Rating badge */}
        <div className="absolute left-5 top-5 flex items-center gap-2 rounded-2xl bg-gray-950/60 backdrop-blur-md px-3.5 py-2 border border-white/10">
          <i className="fas fa-star text-amber-400 text-sm" />
          <span className="text-sm font-semibold text-white">
            {room.averageRating ? room.averageRating.toFixed(1) : "0.0"}
          </span>
        </div>

        {/* Available badge */}
        <div className="absolute left-5 bottom-5 flex items-center gap-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">Available</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center p-7 min-w-0">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
              Suite
            </p>
            <h3 className="text-3xl font-bold text-gray-900 truncate">
              #{room.roomNumber}
            </h3>
            <p className="text-base capitalize text-gray-500 truncate mt-0.5">
              {room.roomType}
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50">
                <i className="fas fa-users text-amber-500 text-xs" />
              </span>
              <span>{room.maxGuests} Guests</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50">
                <i className="fas fa-star text-amber-500 text-xs" />
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star text-xs ${
                      i < rating ? "text-amber-400" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-bold text-gray-900">${room.price}</span>
              <span className="text-sm text-gray-400">/ night</span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/rooms/${room._id}`)}
            className="group/btn inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all duration-300"
          >
            View Details
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover/btn:bg-white/30 transition-colors">
              <i className="fas fa-arrow-right text-xs group-hover/btn:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default SingleRoom;
