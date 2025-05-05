import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useGetAllReviews } from "./useGetAllReviews";
import StarRatingDisplay from "../Reusable/StarRatingDisplay";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Error from "../Reusable/Error";

function Reviews() {
  const { reviews, isPending, error } = useGetAllReviews();

  const latestReviews = (reviews, count = 3) => {
    if (!reviews?.data?.data) return [];
    return reviews?.data?.data
      ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, count);
  };

  if (error) return <Error message={error.message} />;
  return (
    <section className="py-16 bg-white">
      {isPending ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="container px-4 mx-auto">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-sm font-medium mb-3">
              Testimonials
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                Guest Experience
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Read authentic experiences from our valued guests. Their stories
              and feedback help us maintain our commitment to excellence and
              hospitality.
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full mx-auto"></div>
          </div>

          {/* Reviews Carousel */}
          <div className="relative">
            {latestReviews(reviews, 5).length > 0 ? (
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                  clickable: true,
                  bulletClass:
                    "swiper-pagination-bullet bg-gray-300 opacity-100",
                  bulletActiveClass: "!bg-[#dfa974]",
                }}
                loop={reviews?.data.data?.length > 1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2, spaceBetween: 32 },
                  1024: { slidesPerView: 3, spaceBetween: 32 },
                }}
                spaceBetween={24}
                className="!pb-12"
              >
                {latestReviews(reviews, 5).map((review) => (
                  <SwiperSlide key={review.id}>
                    <div className="h-full p-6 transition-all duration-300 bg-white border rounded-2xl hover:shadow-lg border-gray-100/80">
                      <div className="flex flex-col h-full">
                        {/* Rating */}
                        <div className="mb-4">
                          <StarRatingDisplay rating={review.rating} size={20} />
                        </div>

                        {/* Review Text */}
                        <blockquote className="flex-1 mb-6">
                          <p className="text-lg leading-relaxed text-gray-600 line-clamp-4">
                            "{review.review}"
                          </p>
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4 mt-auto">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">
                              {review.user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Room {review.room.roomNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="py-12 text-center">
                <div className="max-w-md px-4 py-8 mx-auto bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500 text-lg">
                    No reviews yet. Be the first to share your experience!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Reviews;
