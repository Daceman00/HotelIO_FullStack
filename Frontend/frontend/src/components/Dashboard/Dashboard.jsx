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
import { EffectFade } from "swiper/modules";
import { motion } from "framer-motion";

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
    <section className="relative h-screen min-h-[800px]">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/30" />

      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        pagination={{ clickable: true }}
        loop={images.length > 1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${IMAGE_URL}${image}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="container mx-auto relative z-10 h-full flex items-center px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8 text-white"
          >
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#dfa974] to-[#e8b18d] text-transparent bg-clip-text">
                HotelIO
              </span>
              <br />A New Dimension of Luxury
            </h1>

            <p className="text-xl lg:text-2xl text-gray-200 max-w-2xl">
              Experience unparalleled elegance with our curated collection of
              world-class amenities and bespoke services
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRedirect}
              className="inline-flex items-center px-8 py-4 bg-[#dfa974] hover:bg-[#c68a5e] text-lg font-semibold rounded-lg shadow-lg transition-all duration-300"
            >
              Explore Rooms
              <i className="fas fa-arrow-right ml-3" />
            </motion.button>
          </motion.div>

          {/* Auth Section */}
          {!isUserLoggedIn && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20"
            >
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-gray-900/10 rounded-xl p-1">
                  {["login", "signup"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAuthTab(tab)}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                        authTab === tab
                          ? "bg-[#dfa974] text-white"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {authTab === "signup" ? <Signup /> : <Login />}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
