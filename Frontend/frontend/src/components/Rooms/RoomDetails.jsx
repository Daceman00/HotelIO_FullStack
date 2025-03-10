import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IMAGE_URL } from "../../helpers/imageURL";
import Loading from "../Reusable/Loading";
import { useGetRoom } from "./useGetRoom";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { modes } from "../../hooks/useServiceConfig";
import CreateReview from "../Reviews/CreateReview";
import CreateBookingForm from "../Bookings/CreateBookingForm";
import SingleReview from "../Reviews/SingleReview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import useUIStore from "../../stores/UiStore";
import CreateRoom from "./CreateRoom";
import useAuthStore from "../../stores/AuthStore";
import AddRoomImages from "./AddRoomImages";

const RoomDetails = () => {
  const { isAdmin } = useAuthStore();
  const { room, isPending, error } = useGetRoom();
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <>
      <Loading mode={modes.all} />
      <section className="pt-0 pb-[80px] px-[200px] relative">
        <FontAwesomeIcon
          icon={faPencilAlt}
          className="absolute top-8 right-8 text-gray-600 cursor-pointer"
        />

        <div className="container mx-auto flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <div className="pt-[70px] mb-[50px] flex justify-center items-center flex-col text-center">
              <div className="container text-center">
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
              {room?.data.room.images.length > 1 ? (
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true }}
                  navigation
                  loop={room?.data.room.images.length > 1}
                  slidesPerView={1}
                  className="w-full max-h-[450px] lg:max-w-[2000px] lg:max-h-[1333px] rounded-lg shadow mb-[40px]"
                >
                  {room?.data.room.images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={`${IMAGE_URL}/${image}`}
                        sizes="(max-width: 600px) 600px,
                       (max-width: 1200px) 1200px,
                       2000px"
                        alt={`Room Image ${idx + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <AddRoomImages />
              )}

              <div className="space-y-4">
                <h3 className="text-3xl font-semibold text-gray-800 overflow-hidden flex items-center justify-between">
                  <span>
                    {room?.data.room.roomType
                      .trim()
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase())}{" "}
                    Room
                  </span>
                  <span className="flex space-x-1 text-[#dfa479]">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${
                          i < room?.data.room.averageRating
                            ? "text-[#dfa479]"
                            : "text-gray-300"
                        }`}
                      ></i>
                    ))}
                  </span>
                </h3>

                <h2 className="text-2xl font-bold text-[#dfa794]">
                  {room?.data.room.price.toFixed(2)}$
                  <span className="text-gray-600 text-sm">/Pernight</span>
                </h2>

                <table className="table-auto w-full text-sm text-gray-700">
                  <tbody>
                    <tr>
                      <td className="font-semibold">Size:</td>
                      <td>{capitalizeFirstLetter(room?.data.room.roomType)}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Capacity:</td>
                      <td>{room?.data.room.maxGuests}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Services:</td>
                      <td>
                        {room?.data.room.features.map((feature, idx) => (
                          <span key={idx}>
                            {capitalizeFirstLetter(feature)}
                            {idx < room?.data.room.features.length - 1 && ", "}
                          </span>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-10">
                  <p className="text-gray-600">{room?.data.room.description}</p>
                </div>
                <div className="pt-14 border-t border-gray-300 mb-12">
                  <h4 className="text-gray-800 tracking-wide mb-11">Reviews</h4>
                  {room?.data.room.reviews.map((review, idx) => (
                    <SingleReview review={review} idx={idx} key={review.id} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <CreateBookingForm />
        </div>
        <CreateReview />
      </section>
    </>
  );
};

export default RoomDetails;
