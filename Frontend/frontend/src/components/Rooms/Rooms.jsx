import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

function Rooms() {
  const rooms = [
    {
      number: 101,
      type: "Single",
      status: "Available",
      images: [
        "https://via.placeholder.com/400x300?text=Room+101+1",
        "https://via.placeholder.com/400x300?text=Room+101+2",
        "https://via.placeholder.com/400x300?text=Room+101+3",
      ],
      price: 89.0,
      rating: 4,
    },
    {
      number: 102,
      type: "Double",
      status: "Occupied",
      images: [
        "https://via.placeholder.com/400x300?text=Room+102+1",
        "https://via.placeholder.com/400x300?text=Room+102+2",
        "https://via.placeholder.com/400x300?text=Room+102+3",
      ],
      price: 119.0,
      rating: 3,
    },
    {
      number: 103,
      type: "Suite",
      status: "Available",
      images: [
        "https://via.placeholder.com/400x300?text=Room+103+1",
        "https://via.placeholder.com/400x300?text=Room+103+2",
        "https://via.placeholder.com/400x300?text=Room+103+3",
      ],
      price: 149.0,
      rating: 5,
    },
  ];

  return (
    <div className="w-full flex flex-col py-24 dark:bg-gray-800">
      <div className="flex flex-col w-[90%] lg:w-4/5 2xl:w-3/5 mx-auto">
        <div className="w-full text-center pt-3 px-4 md:!px-0">
          <h1 className="text-3xl mt-2 md:text-4xl font-semibold text-gray-800">
            The <span className="text-emerald-600">Feature</span> Component
          </h1>
          <p className="text-xl font-thin mb-4 line-clamp-4 mt-4 md:line-clamp-none text-gray-500">
            You can copy and paste it or modify however you want. Feel free to
            name the author in a hidden remark or to set the components as
            favorite.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="border border-gray-100 dark:!border-gray-600 rounded-md overflow-hidden"
            >
              <div className="relative">
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  loop={true}
                  className="w-full max-h-80"
                >
                  {room.images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={image}
                        alt={`${room.type} Room ${idx + 1}`}
                        className="w-full object-cover max-h-80"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-sm uppercase px-3 py-1">
                  {room.status}
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-gray-300 dark:text-gray-600 font-semibold">
                  Room #{room.number}
                </p>
                <h1 className="text-2xl font-bold text-gray-600">
                  <span className="text-emerald-600">{room.type}</span> Room
                </h1>
                <p className="text-sm text-gray-500 line-clamp-3 hover:line-clamp-none mt-2">
                  Experience comfort in our {room.type} room. Hover to read more
                  about its features.
                </p>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:!border-gray-600">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <span className="mr-1">$</span>
                  <span>
                    {room.price ? room.price.toFixed(2) : "N/A"} ¬ Night
                  </span>
                </div>
                <div className="text-yellow-400 font-semibold">
                  {"★".repeat(room.rating)}{" "}
                  <span className="text-gray-500">
                    {"☆".repeat(5 - room.rating)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rooms;
