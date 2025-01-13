import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IMAGE_URL } from "../../helpers/imageURL";
import Loading from "../Reusable/Loading";
import { useGetRoom } from "./useGetRoom";
import { useMoveBack } from "../../hooks/useMoveBack";

const RoomDetails = () => {
  const { room, isPending, error } = useGetRoom();
  const moveBack = useMoveBack();

  if (isPending) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-6 relative">
      <button
        onClick={moveBack}
        type="button"
        className="absolute top-4 right-4 text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:focus:ring-emerald-700"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5H1m0 0l4-4M1 5l4 4"
          />
        </svg>
        <span className="sr-only">Move back</span>
      </button>
      {/* Room Title and Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {room?.data.roomType
            .trim()
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase())}{" "}
          Room
        </h1>
        <p className="text-gray-500 mt-1">Room #{room?.data.roomNumber}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-yellow-400">
            ★ {room?.data.averageRating || "N/A"}
          </span>
          <span className="text-gray-500">
            ({room?.data.reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-6">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
          loop={room?.data.images.length > 1}
          slidesPerView={1}
          className="w-full max-h-96"
        >
          {room?.data.images.map((image, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={`${IMAGE_URL}/${image}`}
                alt={`Room Image ${idx + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Room Description */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          About This Room
        </h2>
        <p className="text-gray-600 mt-2">{room?.data.description}</p>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Amenities</h2>
        <ul className="mt-2 grid grid-cols-2 gap-4 text-gray-600">
          {room?.data.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-emerald-600">✔</span> {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Reviews */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Guest Reviews</h2>
        <div className="mt-2 space-y-4">
          {room?.data.reviews.length > 0 ? (
            room?.data.reviews.map((review, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700"
              >
                <p className="text-gray-800 font-medium">{review.user.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mt-2">{review.review}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-gray-400 ml-2">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews available.</p>
          )}
        </div>
      </div>

      {/* Booking Section */}
      <div className="border-t pt-4">
        <h2 className="text-2xl font-semibold text-gray-800">Book This Room</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-lg">
              Price:{" "}
              <span className="font-bold text-emerald-600">
                ${room?.data.price.toFixed(2)}
              </span>{" "}
              / Night
            </p>
            <p className="text-sm text-gray-500">
              Includes all taxes and fees.
            </p>
          </div>
          <button className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-emerald-700 transition">
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
