import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Login from "./../Auth/Login";
import Signup from "../Auth/Signup";
import useUIStore from "../../stores/UiStore";
import useAuthStore from "../../stores/AuthStore";
import { useEffect } from "react";

function Dashboard() {
  const IMAGE_URL = "http://localhost:5173";
  const images = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ];

  const { authTab } = useUIStore();
  const setAuthTab = useUIStore((state) => state.setAuthTab);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);
  const checkUserLoggedIn = useAuthStore((state) => state.checkUserLoggedIn);

  // Check user login status on component mount
  useEffect(() => {
    checkUserLoggedIn();
  }, [checkUserLoggedIn]);

  const handleRedirect = () => {
    const section = document.getElementById("rooms");
    section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-16 pb-24 bg-cover bg-center h-[50rem]">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop={images.length > 1}
        slidesPerView={Math.min(images.length, 1)}
        slidesPerGroup={Math.min(images.length, 1)}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="absolute inset-0 " // Ensure Swiper takes full height of the section
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-0">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              HotelIO A Luxury Hotel
            </h1>
            <p className="text-white text-lg mb-6">
              Experience unparalleled luxury and comfort at HotelIO, your
              perfect getaway destination. Enjoy world-class amenities,
              exquisite dining, and breathtaking views.
            </p>
            <button
              onClick={handleRedirect}
              className="bg-[#dfa974] text-white px-6 py-3 rounded uppercase font-semibold hover:bg-yellow-600"
            >
              Discover Now
            </button>
          </div>
          {isUserLoggedIn ? null : (
            <div className="bg-white p-3 shadow-md text-sm">
              <div className="flex justify-center">
                <nav className="flex overflow-x-auto items-center p-1 space-x-1 rtl:space-x-reverse text-sm text-gray-600 bg-gray-500/5 rounded-xl dark:bg-gray-500/20">
                  <button
                    role="tab"
                    type="button"
                    className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-[#dfa974] focus:ring-inset ${
                      authTab === "login"
                        ? "text-[#dfa974] shadow bg-white"
                        : "hover:text-[#dfa974] focus:text-[#dfa974]"
                    }`}
                    onClick={() => setAuthTab("login")}
                  >
                    Login
                  </button>
                  <button
                    role="tab"
                    type="button"
                    className={`flex whitespace-nowrap items-center h-8 px-5 font-medium rounded-lg outline-none focus:ring-2 focus:ring-[#dfa974] focus:ring-inset ${
                      authTab === "signup"
                        ? "text-[#dfa974] shadow bg-white"
                        : "hover:text-[#dfa974] focus:text-[#dfa974]"
                    }`}
                    onClick={() => setAuthTab("signup")}
                  >
                    Signup
                  </button>
                </nav>
              </div>
              {authTab === "signup" ? <Signup /> : <Login />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
