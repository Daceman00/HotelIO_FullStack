import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Login from "./../Auth/Login";
import Signup from "../Auth/Signup";

function Dashboard() {
  const IMAGE_URL = "http://localhost:5173";
  const images = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ];

  return (
    <section className="relative pt-16 pb-24 bg-cover bg-center h-[50rem]">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={images.length > 1}
        slidesPerView={Math.min(images.length, 1)}
        slidesPerGroup={Math.min(images.length, 1)}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="absolute inset-0" // Ensure Swiper takes full height of the section
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${IMAGE_URL}${image}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover" // Ensure image covers the fixed height
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              HotelIO A Luxury Hotel
            </h1>
            <p className="text-white text-lg mb-6">
              Experience unparalleled luxury and comfort at HotelIO, your
              perfect getaway destination. Enjoy world-class amenities,
              exquisite dining, and breathtaking views.
            </p>
            <a
              href="#"
              className="bg-[#dfa974] text-white px-6 py-3 rounded uppercase font-semibold hover:bg-yellow-600"
            >
              Discover Now
            </a>
          </div>
          <div className="bg-white p-3 rounded shadow-md text-sm">
            <h3 className="text-base font-bold mb-2">Booking Your Hotel</h3>
            <Signup />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
