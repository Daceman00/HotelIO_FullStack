import React, { useMemo } from "react";
import SingleRoom from "./SingleRoom";
import { useGetAllRooms } from "./useGetAllRooms";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Link } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
// Import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

function Rooms() {
  const { rooms, isPending } = useGetAllRooms({ sort: "-averageRating" });

  const top4ratedRooms = useMemo(
    () =>
      rooms?.filter((room) => room.status === "available")?.slice(0, 8) || [],
    [rooms]
  );

  return (
    <div
      id="rooms"
      className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with decorative elements */}
        <div className="text-center relative mb-16">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg
              className="w-64 h-64"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#dfa974"
                d="M45.7,-57.2C57.4,-46.3,64.1,-30.5,67.6,-13.8C71,2.9,71.3,20.5,63.3,32.6C55.3,44.7,39,51.4,22.8,57.5C6.7,63.5,-9.4,69,-23.6,65.2C-37.8,61.4,-50,48.4,-58.4,33.7C-66.8,19,-71.3,2.5,-68.2,-12.4C-65.1,-27.2,-54.3,-40.4,-41.4,-51.2C-28.4,-61.9,-13.4,-70.3,1.7,-72.3C16.8,-74.3,33.9,-68.1,45.7,-57.2Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          <div className="relative">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-sm font-medium mb-3">
              Luxury Accommodations
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                Our Available Rooms
              </span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Discover the perfect room for your stay, with comfort and luxury
                at your fingertips.
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Room listings with Swiper */}
        <section className="relative flex justify-center items-center min-h-[500px] ">
          {isPending ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {top4ratedRooms.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    No available rooms at the moment.
                  </p>
                </div>
              ) : (
                <div className="relative w-full max-w-4xl mx-auto flex justify-center">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={{
                      prevEl: ".custom-swiper-button-prev",
                      nextEl: ".custom-swiper-button-next",
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    loop={top4ratedRooms.length > 1}
                    // Now shows 2 slides at a time on all screen sizes
                    className="rooms-swiper pb-12"
                  >
                    {top4ratedRooms.map((room) => (
                      <SwiperSlide key={room._id}>
                        <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                          <SingleRoom room={room} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom Navigation Buttons */}
                  {top4ratedRooms.length > 1 && (
                    <>
                      <button className="custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-amber-50 dark:hover:bg-gray-700">
                        <svg
                          className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button className="custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-amber-50 dark:hover:bg-gray-700">
                        <svg
                          className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Decorative elements */}
              <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-100 dark:bg-amber-900/20 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-200 dark:bg-amber-800/20 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
            </>
          )}
        </section>

        {/* Action button */}
        {!isPending && top4ratedRooms.length > 0 && (
          <div className="mt-16 text-center">
            <Link to="/rooms">
              <a className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1">
                View All Rooms
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </Link>
          </div>
        )}
      </div>

      {/* Custom Swiper Styles */}
      <style jsx>{`
        .rooms-swiper .swiper-pagination {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .rooms-swiper .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }

        .rooms-swiper .swiper-pagination-bullet-active {
          background: #d97706;
          transform: scale(1.2);
        }

        .rooms-swiper .swiper-pagination-bullet:hover {
          background: #f59e0b;
        }

        .dark .rooms-swiper .swiper-pagination-bullet {
          background: #6b7280;
        }

        .dark .rooms-swiper .swiper-pagination-bullet-active {
          background: #f59e0b;
        }
      `}</style>
    </div>
  );
}

export default Rooms;
