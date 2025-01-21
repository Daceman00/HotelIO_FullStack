import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Reviews() {
  const testimonials = [
    {
      id: 1,
      text: `After a construction project took longer than expected, my husband, my daughter and I needed a place to stay for a few nights. 
                 As a Chicago resident, we know a lot about our city, neighborhood, and the types of housing options available and absolutely 
                 love our vacation at Sona Hotel.`,
      author: "Alexander Vasquez",
      rating: 4.5,
      image: "img/testimonial-logo.png",
    },
    {
      id: 2,
      text: `After a construction project took longer than expected, my husband, my daughter and I needed a place to stay for a few nights. 
                 As a Chicago resident, we know a lot about our city, neighborhood, and the types of housing options available and absolutely 
                 love our vacation at Sona Hotel.`,
      author: "Alexander Vasquez",
      rating: 4.5,
      image: "img/testimonial-logo.png",
    },
  ];
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

        {/* Testimonials */}
        <div className="flex justify-center">
          <div className="max-w-4xl w-full">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              loop={testimonials.length > 1}
              slidesPerView={Math.min(testimonials.length, 1)}
              slidesPerGroup={Math.min(testimonials.length, 1)}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="mySwiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <div className="ts-item bg-white shadow-md rounded-lg p-8 text-center transition-transform transform hover:scale-105">
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                      {testimonial.text}
                    </p>
                    <div className="ti-author">
                      {/* Ratings */}
                      <div className="rating mb-4 flex justify-center space-x-1">
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`${
                              index < Math.floor(testimonial.rating)
                                ? "text-[#dfa974]"
                                : index < testimonial.rating
                                ? "text-[#dfa974] opacity-50"
                                : "text-gray-300"
                            } fas fa-star`}
                          />
                        ))}
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">
                        - {testimonial.author}
                      </h5>
                    </div>
                    <div className="mt-6">
                      <img
                        src={testimonial.image}
                        alt="Testimonial Logo"
                        className="mx-auto h-12"
                      />
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
