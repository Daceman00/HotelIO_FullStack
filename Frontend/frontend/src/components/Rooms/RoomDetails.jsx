import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { IMAGE_URL } from "../../helpers/imageURL";

import { useGetRoom } from "./useGetRoom";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import CreateReview from "../Reviews/CreateReview";
import CreateBookingForm from "../Bookings/CreateBookingForm";
import SingleReview from "../Reviews/SingleReview";
import useAuthStore from "../../stores/AuthStore";
import AddRoomImages from "./AddRoomImages";
import UpdateRoom from "./UpdateRoom";
import useUIStore from "../../stores/UiStore";
import FeatureItem from "../Reusable/FeatureItem";
import StarRatingDisplay from "../Reusable/StarRatingDisplay";

const RoomDetails = () => {
  const { isAdmin } = useAuthStore();
  const { room, isPending, error } = useGetRoom();
  const { isRoomUpdateModalOpen } = useUIStore();
  const onRoomUpdateModalOpen = useUIStore(
    (state) => state.onRoomUpdateModalOpen
  );
  const onRoomUpdateModalClose = useUIStore(
    (state) => state.onRoomUpdateModalClose
  );

  const { isRoomImageModalOpen } = useUIStore();
  const onRoomImageModalOpen = useUIStore(
    (state) => state.onRoomImageModalOpen
  );
  const onRoomImageModalClose = useUIStore(
    (state) => state.onRoomImageModalClose
  );

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const latestReviews = useMemo(() => {
    const sorted = [...(room?.data.room.reviews || [])].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return sorted.slice(0, 5);
  }, [room?.data.room.reviews]);

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen">
      {isRoomUpdateModalOpen && (
        <UpdateRoom
          isOpen={isRoomUpdateModalOpen}
          onClose={onRoomUpdateModalClose}
          opacity={50}
        />
      )}

      {isRoomImageModalOpen && (
        <AddRoomImages
          roomId={room?.data.room.id}
          isOpen={isRoomImageModalOpen}
          onClose={onRoomImageModalClose}
          opacity={50}
        />
      )}

      {/* Hero Section with Gallery */}
      <div className="relative h-96 md:h-screen/2 lg:h-screen/2 w-full overflow-hidden">
        {room?.data.room.images.length > 0 && (
          <Swiper
            modules={[Pagination, Navigation, EffectFade, Autoplay]}
            effect="fade"
            pagination={{
              clickable: true,
              dynamicBullets: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={room?.data.room.images.length > 1}
            slidesPerView={1}
            className="h-full w-full"
            style={{ zIndex: 0 }}
          >
            {room?.data.room.images.map((image, idx) => (
              <SwiperSlide key={idx} className="relative">
                <img
                  src={`${IMAGE_URL}/${image}`}
                  alt={`Room ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </SwiperSlide>
            ))}

            <div className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 backdrop-blur-sm p-3 rounded-full text-white hover:bg-opacity-50 transition duration-300">
              <i className="fas fa-chevron-right"></i>
            </div>

            <div className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-30 backdrop-blur-sm p-3 rounded-full text-white hover:bg-opacity-50 transition duration-300">
              <i className="fas fa-chevron-left"></i>
            </div>
          </Swiper>
        )}

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                  {capitalizeFirstLetter(room?.data.room.roomType)} Room
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <StarRatingDisplay rating={room?.data.room.averageRating} />
                  <span className="text-sm text-gray-200">
                    ({room?.data.room.reviews.length} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
                <p className="text-2xl font-bold text-[#dfa379]">
                  ${room?.data.room.price?.toFixed(2)}
                  <span className="text-base font-normal text-gray-500 ml-1">
                    /night
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div className="absolute top-6 right-6 z-10 flex gap-3">
            <button
              onClick={onRoomUpdateModalOpen}
              className="px-4 py-2 bg-[#dfa379] text-white rounded-lg hover:bg-[#c68a5e] transition-colors shadow-md flex items-center"
            >
              <i className="fas fa-edit mr-2" /> Update
            </button>
            <button
              onClick={onRoomImageModalOpen}
              className="px-4 py-2 bg-[#dfa379] text-white rounded-lg hover:bg-[#c68a5e] transition-colors shadow-md flex items-center"
            >
              <i className="fas fa-camera mr-2" /> Add Images
            </button>
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="py-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link to="/" className="hover:text-[#dfa379] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg
                  className="h-5 w-5 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className="hover:text-[#dfa379] transition-colors"
                >
                  Rooms
                </Link>
              </li>
              <li>
                <svg
                  className="h-5 w-5 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li aria-current="page">
                <span className="text-[#dfa379] font-medium">
                  Room {room?.data.room.roomNumber}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Room Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Room Details Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <div className="border-b pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      About This Room
                    </h2>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="px-4 py-2 bg-[#fbf3ee] text-[#dfa379] rounded-full text-sm font-medium">
                        Room #{room?.data.room.roomNumber}
                      </span>
                      <span className="px-4 py-2 bg-[#fbf3ee] text-[#dfa379] rounded-full text-sm font-medium">
                        {capitalizeFirstLetter(room?.data.room.roomType)}
                      </span>
                      <span className="px-4 py-2 bg-[#fbf3ee] text-[#dfa379] rounded-full text-sm font-medium">
                        {room?.data.room.maxGuests} Guests
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {room?.data.room.description}
                    </p>
                  </div>

                  {/* Room Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Room Features
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {room?.data.room.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#fbf3ee] flex items-center justify-center">
                            <i
                              className={`fas fa-${getFeatureIcon(
                                feature
                              )} text-[#dfa379]`}
                            ></i>
                          </div>
                          <span className="text-gray-700">
                            {capitalizeFirstLetter(feature)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Guest Reviews
                      </h3>
                      <div className="flex items-center mt-2">
                        <StarRatingDisplay
                          rating={room?.data.room.averageRating}
                        />
                        <span className="ml-2 text-gray-500">
                          {room?.data.room.averageRating?.toFixed(1)} out of 5 (
                          {room?.data.room.reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/rooms/${room?.data.room.id}/reviews`}
                      className="px-4 py-2 bg-[#dfa379] text-white rounded-lg hover:bg-[#c68a5e] transition-colors shadow-sm text-sm"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      See All Reviews
                    </Link>
                  </div>

                  <div className="space-y-6 divide-y divide-gray-100">
                    {latestReviews.length > 0 ? (
                      latestReviews.map((review) => (
                        <div key={review.id} className="pt-6 first:pt-0">
                          <SingleReview review={review} />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 py-4">
                        No reviews yet. Be the first to review this room!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Review */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Write a Review
                  </h3>
                  <CreateReview />
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="px-6 py-8">
                  <CreateBookingForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper function to get appropriate icon for features
const getFeatureIcon = (feature) => {
  const featureIcons = {
    wifi: "wifi",
    breakfast: "coffee",
    parking: "parking",
    ac: "snowflake",
    tv: "tv",
    refrigerator: "ice-cream",
    minibar: "glass-whiskey",
    balcony: "tree",
    "ocean view": "water",
    "mountain view": "mountain",
    "gym access": "dumbbell",
    "spa access": "spa",
    "room service": "concierge-bell",
    "pet friendly": "paw",
    kitchen: "utensils",
    "wheelchair accessible": "wheelchair",
    smoking: "smoking",
    "non-smoking": "smoking-ban",
    "king bed": "bed",
    "queen bed": "bed",
  };

  const lowercaseFeature = feature.toLowerCase();
  return featureIcons[lowercaseFeature] || "check-circle";
};

export default RoomDetails;
