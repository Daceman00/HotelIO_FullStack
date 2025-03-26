import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useGetAllReviews } from "./useGetAllReviews";
import StarRatingDisplay from "../Reusable/StarRatingDisplay";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

function Reviews() {
  const { reviews, isPending } = useGetAllReviews();

  const latestReviews = (reviews, count = 3) => {
    if (!reviews?.data?.data) return [];
    return reviews?.data?.data
      ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, count);
  };

  if (isPending) return <Loading mode={modes.all} />;

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 lg:mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold tracking-wider text-[#dfa974] uppercase rounded-full bg-[#dfa974]/10">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Guest Experiences
          </h2>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {latestReviews(reviews, 5).length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet bg-gray-300 opacity-100",
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
    </section>
  );
}

export default Reviews;
