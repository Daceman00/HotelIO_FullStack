import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useGetAllReviews } from "./useGetAllReviews";

function Reviews() {
  const { reviews } = useGetAllReviews();

  return (
    <section className="testimonial-section bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="text-[#dfa974] uppercase text-sm font-bold">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            What Customers Say?
          </h2>
        </div>

        {/* Reviews */}
        <div className="flex justify-center">
          <div className="max-w-4xl w-full">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              loop={reviews?.data.data.length > 1}
              slidesPerView={Math.min(reviews?.data.data.length, 1)}
              slidesPerGroup={Math.min(reviews?.data.data.length, 1)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="mySwiper"
            >
              {reviews?.data.data.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="ts-item bg-white shadow-md rounded-lg p-8 text-center transition-transform transform hover:scale-105">
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {review.review}
                    </p>
                    <div className="ti-author">
                      {/* Ratings */}
                      <div className="rating mb-4 flex justify-center space-x-1">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`${
                              index < Math.floor(review.rating)
                                ? "text-[#dfa974]"
                                : index < review.rating
                                ? "text-[#dfa974] opacity-50"
                                : "text-gray-300"
                            } fas fa-star`}
                          />
                        ))}
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">
                        {review.user.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        Visited: Room-{review.room.roomNumber}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
