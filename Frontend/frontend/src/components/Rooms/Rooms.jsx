import React, { useMemo } from "react";
import { motion } from "framer-motion";
import SingleRoom from "./SingleRoom";
import { useGetAllRooms } from "./useGetAllRooms";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function Rooms() {
  const { rooms, isPending } = useGetAllRooms({ sort: "-averageRating" });

  const top4ratedRooms = useMemo(
    () =>
      rooms?.filter((room) => room.status === "available")?.slice(0, 8) || [],
    [rooms],
  );

  return (
    <div
      id="rooms"
      className="relative w-full py-24 md:py-36 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-amber-50/30"
    >
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center relative mb-16 md:mb-20"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Luxury Accommodations
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
              Our Available Rooms
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Discover the perfect room for your stay, with comfort and luxury
            at your fingertips.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">
                  {isPending ? "—" : top4ratedRooms.length}
                </span>
                <span className="text-xs uppercase tracking-wider mt-0.5">Available</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">5★</span>
                <span className="text-xs uppercase tracking-wider mt-0.5">Service</span>
              </div>
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
          </motion.div>
        </motion.div>

        {/* Room carousel */}
        <section className="relative flex justify-center items-center min-h-[500px]">
          {isPending ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : top4ratedRooms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm max-w-md mx-auto"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                <i className="fas fa-bed text-2xl text-amber-500" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">No rooms available</p>
              <p className="text-sm text-gray-500">
                Check back soon for newly available suites.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-4xl mx-auto"
            >
              {/* Glass frame */}
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-200/20 via-white/40 to-amber-100/20 blur-sm pointer-events-none" />

              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={{
                    prevEl: ".rooms-swiper-button-prev",
                    nextEl: ".rooms-swiper-button-next",
                  }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop={top4ratedRooms.length > 1}
                  className="rooms-swiper pb-14"
                >
                  {top4ratedRooms.map((room) => (
                    <SwiperSlide key={room._id}>
                      <SingleRoom room={room} />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {top4ratedRooms.length > 1 && (
                  <>
                    <button
                      aria-label="Previous room"
                      className="rooms-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg shadow-gray-900/5 border border-gray-100 hover:shadow-xl hover:bg-amber-50 hover:border-amber-200 transition-all duration-300 flex items-center justify-center group"
                    >
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      aria-label="Next room"
                      className="rooms-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg shadow-gray-900/5 border border-gray-100 hover:shadow-xl hover:bg-amber-50 hover:border-amber-200 transition-all duration-300 flex items-center justify-center group"
                    >
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </section>

        {/* CTA */}
        {!isPending && top4ratedRooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-16 text-center"
          >
            <Link
              to="/rooms"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300"
            >
              View All Rooms
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Rooms;
