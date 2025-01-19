import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Login from "./../Auth/Login";

function Dashboard() {
  const IMAGE_URL = "http://localhost:5173";
  const images = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ];
  console.log(`${IMAGE_URL}${images[0]}`);
  return (
    <section className="relative pt-16 pb-24 bg-cover bg-center">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={images.length > 1}
        slidesPerView={Math.min(images.length, 1)}
        slidesPerGroup={Math.min(images.length, 1)}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="absolute inset-0 z-0"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${IMAGE_URL}${image}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Sona A Luxury Hotel
            </h1>
            <p className="text-white text-lg mb-6">
              Here are the best hotel booking sites, including recommendations
              for international travel and for finding low-priced hotel rooms.
            </p>
            <a
              href="#"
              className="bg-yellow-500 text-white px-6 py-3 rounded uppercase font-semibold hover:bg-yellow-600"
            >
              Discover Now
            </a>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-xl font-bold mb-4">Booking Your Hotel</h3>
            <Login />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
