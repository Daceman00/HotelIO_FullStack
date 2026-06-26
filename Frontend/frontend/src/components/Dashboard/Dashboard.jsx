import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Login from "./../Auth/Login";
import Signup from "../Auth/Signup";
import useUIStore from "../../stores/UiStore";
import useAuthStore from "../../stores/AuthStore";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGE_URL_MENU } from "../../helpers/imageURL";

function Dashboard() {
  const images = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"];

  const { authTab } = useUIStore();
  const setAuthTab = useUIStore((state) => state.setAuthTab);
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);

  useEffect(() => {
    isUserLoggedIn;
  }, [isUserLoggedIn]);

  const handleRedirect = () => {
    const section = document.getElementById("rooms");
    section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="dashboard" className="relative h-screen overflow-hidden">
      {/* Hero Swiper */}
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        speed={1200}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        pagination={{ clickable: true, el: ".hero-pagination" }}
        className="hero-swiper h-full absolute inset-0 z-0"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={`${IMAGE_URL_MENU}${image}`}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover hero-ken-burns"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Layered overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-gray-950/70 via-gray-900/50 to-amber-950/30" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(223,169,116,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.4),_transparent_50%)]" />

      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/8 rounded-full blur-3xl z-10 pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto relative z-20 h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
          {/* Left — Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center lg:text-left space-y-6 lg:space-y-8 text-white"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs sm:text-sm font-medium tracking-widest uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Luxury Redefined
            </motion.span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-transparent bg-clip-text">
                HotelIO
              </span>
              <br />
              <span className="text-white/95 font-light">
                A New Dimension
              </span>
              <br />
              <span className="text-white font-semibold">of Luxury</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300/90 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
              Experience unparalleled elegance with our curated collection of
              world-class amenities and bespoke services.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRedirect}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-base font-semibold rounded-2xl shadow-xl shadow-amber-900/30 hover:shadow-amber-500/40 transition-all duration-300"
              >
                Explore Rooms
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <i className="fas fa-arrow-right text-sm group-hover:translate-x-0.5 transition-transform" />
                </span>
              </motion.button>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-white">50+</span>
                  <span className="text-xs uppercase tracking-wider">Suites</span>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-white">4.9</span>
                  <span className="text-xs uppercase tracking-wider">Rating</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Auth panel */}
          {!isUserLoggedIn && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mx-auto w-full max-w-md self-center"
            >
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-white/30 via-white/10 to-amber-500/20 shadow-2xl shadow-black/20">
                <div className="rounded-3xl bg-gray-950/40 backdrop-blur-2xl p-6 sm:p-7">
                  {/* Tab switcher */}
                  <div className="relative flex bg-white/5 rounded-2xl p-1 mb-6">
                    {["login", "signup"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAuthTab(tab)}
                        className={`relative flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-300 z-10 ${
                          authTab === tab
                            ? "text-gray-900"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {authTab === tab && (
                          <motion.div
                            layoutId="authTabIndicator"
                            className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg shadow-amber-500/25"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Form area */}
                  <div className="min-h-[420px] flex flex-col overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={authTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="flex-1"
                      >
                        {authTab === "signup" ? (
                          <Signup embedded />
                        ) : (
                          <Login embedded />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Swiper pagination */}
      <div className="hero-pagination absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2" />

      {/* Scroll indicator */}
      <motion.button
        onClick={handleRedirect}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors cursor-pointer"
        aria-label="Scroll to rooms"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Discover</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-amber-400" />
        </motion.div>
      </motion.button>
    </section>
  );
}

export default Dashboard;
