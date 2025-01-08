import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IMAGE_URL } from "../../helpers/imageURL";

const RoomDetails = () => {
  // Dummy Room Data
  const dummyRoom = {
    roomNumber: 101,
    roomType: "Deluxe",
    description:
      "Experience the luxury of our Deluxe Room, equipped with modern amenities to ensure a comfortable stay. Ideal for both business and leisure travelers.",
    price: 150,
    rating: 4.5,
    reviews: [
      {
        reviewerName: "John Doe",
        date: "2024-12-01",
        comment:
          "The room was fantastic! Clean, spacious, and had a great view of the city.",
      },
      {
        reviewerName: "Jane Smith",
        date: "2024-11-20",
        comment:
          "Very comfortable and the staff was extremely friendly. Will definitely return!",
      },
    ],
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Flat-Screen TV",
      "Room Service",
      "Coffee Maker",
      "Mini Bar",
    ],
    images: [
      "room-677be0093292947d0303b060-1736274629868-1.jpeg",
      "room-677be0093292947d0303b060-1736274629869-4.jpeg",
      "room-677af311f808aec841f47bda-1736116817170-2.jpeg",
    ],
  };

  const room = dummyRoom;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Room Title and Info */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {room.roomType} Room
        </h1>
        <p className="text-gray-500 mt-1">Room #{room.roomNumber}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-yellow-400">★ {room.rating || "N/A"}</span>
          <span className="text-gray-500">({room.reviews.length} reviews)</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative mb-6">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
          loop
          slidesPerView={1}
          className="w-full max-h-96"
        >
          {room.images.map((image, idx) => (
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
        <p className="text-gray-600 mt-2">{room.description}</p>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Amenities</h2>
        <ul className="mt-2 grid grid-cols-2 gap-4 text-gray-600">
          {room.amenities.map((amenity, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-emerald-600">✔</span> {amenity}
            </li>
          ))}
        </ul>
      </div>

      {/* Reviews */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Guest Reviews</h2>
        <div className="mt-2 space-y-4">
          {room.reviews.length > 0 ? (
            room.reviews.map((review, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700"
              >
                <p className="text-gray-800 font-medium">
                  {review.reviewerName}
                </p>
                <p className="text-sm text-gray-500">{review.date}</p>
                <p className="text-gray-600 mt-2">{review.comment}</p>
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
                ${room.price.toFixed(2)}
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
