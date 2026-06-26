import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useGetAllReviews } from "./useGetAllReviews";
import StarRatingDisplay from "../Reusable/StarRatingDisplay";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Error from "../Reusable/Error";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ReviewCard({ review }) {
  return (
    <div className="group relative h-full">
      {/* Gradient border glow */}
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-amber-200/40 via-transparent to-amber-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative h-full flex flex-col p-7 md:p-8 bg-white/80 backdrop-blur-sm border border-gray-100/80 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-amber-900/5 hover:-translate-y-1 transition-all duration-500">
        {/* Quote icon */}
        <div className="absolute top-6 right-7 text-amber-200/60 group-hover:text-amber-300/80 transition-colors">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Rating */}
        <div className="mb-5">
          <StarRatingDisplay rating={review.rating} size={18} />
        </div>

        {/* Review text */}
        <blockquote className="flex-1 mb-6">
          <p className="text-base leading-relaxed text-gray-600 line-clamp-4 italic">
            "{review.review}"
          </p>
        </blockquote>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-amber-200/60 via-gray-100 to-transparent mb-5" />

        {/* Author */}
        <div className="flex items-center gap-4 mt-auto">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white text-sm font-bold shadow-md shadow-amber-500/20">
            {getInitials(review.user.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{review.user.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <i className="fas fa-door-open text-amber-500/70 text-xs" />
              Room {review.room.roomNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  const { reviews, isPending, error } = useGetAllReviews();

  const latestReviews = useMemo(() => {
    if (!reviews?.data?.data) return [];
    return [...reviews.data.data]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (!latestReviews.length) return null;
    const sum = latestReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / latestReviews.length).toFixed(1);
  }, [latestReviews]);

  if (error) return <Error message={error.message} />;

  return (
    <section
      id="reviews"
      className="relative py-24 md:py-36 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white"
    >
      {/* Background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-100/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-amber-50/40 rounded-full blur-3xl pointer-events-none" />

      {isPending ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="relative container px-4 mx-auto max-w-7xl">
          {/* Section header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-2xl mx-auto text-center mb-14 lg:mb-20"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Testimonials
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600">
                Guest Experience
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-gray-500 mb-8 leading-relaxed"
            >
              Read authentic experiences from our valued guests. Their stories
              and feedback help us maintain our commitment to excellence.
            </motion.p>

            {avgRating && (
              <motion.div variants={fadeUp} custom={3} className="flex items-center justify-center gap-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">{avgRating}</span>
                  <div className="text-left">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-xs ${
                            i < Math.round(Number(avgRating))
                              ? "text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Average Rating
                    </span>
                  </div>
                </div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
              </motion.div>
            )}
          </motion.div>

          {/* Reviews carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {latestReviews.length > 0 ? (
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                loop={latestReviews.length > 1}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2, spaceBetween: 28 },
                  1024: { slidesPerView: 3, spaceBetween: 28 },
                }}
                spaceBetween={24}
                className="reviews-swiper !pb-14"
              >
                {latestReviews.map((review) => (
                  <SwiperSlide key={review.id} className="!h-auto">
                    <ReviewCard review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="py-12 text-center">
                <div className="max-w-md px-8 py-10 mx-auto bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <i className="fas fa-comment-dots text-2xl text-amber-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">No reviews yet</p>
                  <p className="text-sm text-gray-500">
                    Be the first to share your experience!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default Reviews;
