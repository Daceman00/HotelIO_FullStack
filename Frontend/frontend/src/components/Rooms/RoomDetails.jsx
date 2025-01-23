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
import { Link } from "react-router-dom";

const RoomDetails = () => {
  const { room, isPending, error } = useGetRoom();
  const moveBack = useMoveBack();

  if (isPending) return <Loading />;

  return (
    <section className="py-16">
      <div className="container mx-auto flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3">
          <div className="pt-[70px] pb-[80px] flex justify-center items-center flex-col text-center">
            <div className="container">
              <h2 className="text-4xl text-gray-800 mb-4">Our Rooms</h2>

              <div className="flex items-center text-lg text-[#19191a] font-medium justify-center">
                <Link to="/" className="text-gray-400 relative mr-2">
                  Home
                </Link>

                <svg
                  className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>

                <span className="text-gray-800 ">Rooms</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              loop={room?.data.room.images.length > 1}
              slidesPerView={1}
              className="w-full max-h-96 rounded-lg shadow"
            >
              {room?.data.room.images.map((image, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={`${IMAGE_URL}/${image}`}
                    alt={`Room Image ${idx + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="space-y-4">
              <h3 className="text-3xl font-semibold text-gray-800">
                {room?.data.room.roomType
                  .trim()
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                Room
              </h3>

              <h2 className="text-2xl font-bold text-yellow-500">
                ${room?.data.room.price.toFixed(2)}
                <span className="text-gray-600 text-sm">/Pernight</span>
              </h2>
              <table className="table-auto w-full text-sm text-gray-700">
                <tbody>
                  <tr>
                    <td className="font-semibold">Size:</td>
                    <td>30 ft</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Capacity:</td>
                    <td>Max person 5</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Bed:</td>
                    <td>King Beds</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Services:</td>
                    <td>Wifi, Television, Bathroom,...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 flex items-start lg:items-center">
          <div className="bg-gray-100 p-8 rounded-lg shadow-lg space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Your Reservation
            </h3>
            <form className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="date-in" className="text-sm text-gray-600">
                  Check In:
                </label>
                <input
                  type="text"
                  id="date-in"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="date-out" className="text-sm text-gray-600">
                  Check Out:
                </label>
                <input
                  type="text"
                  id="date-out"
                  className="w-full border border-gray-300 rounded px-4 py-2 text-gray-700"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded font-semibold uppercase"
              >
                Check Availability
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
