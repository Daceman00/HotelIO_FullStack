import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import Login from "./../Auth/Login";
import Signup from "../Auth/Signup";
import useUIStore from "../../stores/UiStore";
import useAuthStore from "../../stores/AuthStore";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { IMAGE_URL_MENU } from "../../helpers/imageURL";

function Dashboard() {
  const images = [
    "/images/hero-1.jpg",
    "/images/hero-2.jpg",
    "/images/hero-3.jpg",
  ];

  const { authTab } = useUIStore();
  const setAuthTab = useUIStore((state) => state.setAuthTab);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);

  // Check user login status on component mount
  useEffect(() => {
    isUserLoggedIn;
  }, [isUserLoggedIn]);

  const handleRedirect = () => {
    const section = document.getElementById("rooms");
    section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="dashboard" className="relative h-screen pt-16">
      <div className="absolute inset-0 h-16 bg-transparent z-0 pointer-events-none" />
      {/* Swiper with navigation */}
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        pagination={{ clickable: true }}
        className="h-full absolute inset-0 z-0"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={`${IMAGE_URL_MENU}${image}`}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/30 z-20" />
      {/* Content container */}
      <div className="container mx-auto relative z-20 h-[calc(100%-4rem)] flex items-center px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6 w-full max-w-5xl lg:max-w-6xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-3 md:space-y-2 lg:space-y-6 text-white"
          >
            <h1 className="text-3xl md:text-4xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-[#dfa974] to-[#e8b18d] text-transparent bg-clip-text">
                HotelIO
              </span>
              <br />A New Dimension of Luxury
            </h1>

            <p className="text-base md:text-2xl lg:text-lg text-gray-200 max-w-lg">
              Experience unparalleled elegance with our curated collection of
              world-class amenities and bespoke services
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRedirect}
              className="inline-flex items-center px-6 md:px-4 lg:px-8 py-3 md:py-2 lg:py-4 bg-[#dfa974] hover:bg-[#c68a5e] text-base md:text-sm lg:text-lg font-semibold rounded-lg shadow-lg transition-all duration-300"
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
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-2 lg:p-4 shadow-xl border border-white/20 mx-auto w-full max-w-md md:max-w-xs lg:max-w-md self-center"
            >
              <div className="flex justify-center mb-4 md:mb-2 lg:mb-4">
                <div className="inline-flex bg-gray-900/10 rounded-lg p-1 md:p-0.5 lg:p-1">
                  {["login", "signup"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAuthTab(tab)}
                      className={`px-6 md:px-4 lg:px-6 py-3 md:py-2 lg:py-3 rounded-lg text-sm md:text-xs lg:text-sm font-medium transition-colors ${
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

              <div className="min-h-[420px] md:min-h-[380px] lg:min-h-[420px] flex flex-col">
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
