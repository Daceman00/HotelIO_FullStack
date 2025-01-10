import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";

function SingleRoom({ room }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeInDown border border-gray-100 dark:!border-gray-600 rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg">
      <div className="relative">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          loop={room.images.length > 1} // Enable loop only for multiple slides
          slidesPerView={Math.min(room.images.length, 1)} // Adjust for single image
          slidesPerGroup={Math.min(room.images.length, 1)} // Adjust for single image
          className="w-full max-h-96"
        >
          {room.images.map((image, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={`${IMAGE_URL}/${image}`}
                alt={`${room.type} Room ${idx + 1}`}
                className="w-full object-cover max-h-96 rounded-t-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-sm uppercase px-3 py-1 rounded-md z-10">
          {room.status}
        </div>
      </div>
      <div className="px-6 py-4">
        <p className="text-sm text-gray-300 dark:text-gray-600 font-semibold">
          Room #{room.roomNumber}
        </p>
        <h1 className="text-2xl font-bold text-gray-600">
          <span className="text-emerald-600">
            {room.roomType
              .trim()
              .toLowerCase()
              .replace(/^\w/, (c) => c.toUpperCase())}
          </span>{" "}
          Room
        </h1>
        <p className="text-sm text-gray-500 line-clamp-3 hover:line-clamp-none mt-2">
          Experience comfort in our {room.roomType} room. Hover to read more
          about its features.
        </p>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:!border-gray-600">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <span className="mr-1">$</span>
          <span>{room.price ? room.price.toFixed(2) : "N/A"} ¬ Night</span>
        </div>
        <div className="text-yellow-400 font-semibold">
          {"★".repeat(room.averageRating)}{" "}
          <span className="text-gray-500">
            {"☆".repeat(5 - room.averageRating)}
          </span>
        </div>
        <div className="px-4 py-3 text-center">
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md transition-transform transform hover:scale-105 hover:bg-emerald-700"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleRoom;
