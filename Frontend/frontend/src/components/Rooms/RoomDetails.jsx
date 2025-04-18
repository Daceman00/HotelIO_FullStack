import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { IMAGE_URL } from "../../helpers/imageURL";
import Loading from "../Reusable/Loading";
import { useGetRoom } from "./useGetRoom";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { modes } from "../../hooks/useServiceConfig";
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

  if (isPending) return <Loading mode={modes.all} />;

  return (
    <>
      <Loading mode={modes.all} />
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

      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        {isAdmin && (
          <div className="absolute top-6 right-6 z-10 flex gap-3">
            <button
              onClick={onRoomUpdateModalOpen}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <i className="fas fa-edit mr-2" /> Update
            </button>
            <button
              onClick={onRoomImageModalOpen}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <i className="fas fa-camera mr-2" /> Add Images
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {/* Breadcrumb */}
            <nav className="pt-8 pb-12" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <Link to="/" className="hover:text-gray-700">
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
                <li aria-current="page">
                  <span className="text-gray-700">Rooms</span>
                </li>
              </ol>
            </nav>

            {/* Image Gallery */}
            {room?.data.room.images.length > 0 && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-xl">
                <Swiper
                  modules={[Pagination, Navigation]}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  navigation
                  loop={room?.data.room.images.length > 1}
                  slidesPerView={1}
                  className="aspect-[4/3]"
                  style={{ zIndex: 0 }}
                >
                  {room?.data.room.images.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={`${IMAGE_URL}/${image}`}
                        alt={`Room ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* Room Details */}
            <div className="space-y-6">
              <header className="border-b pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    # Room {room?.data.room.roomNumber}-
                    {capitalizeFirstLetter(room?.data.room.roomType)}
                  </h1>
                  <div className="flex items-center gap-2">
                    <StarRatingDisplay rating={room?.data.room.averageRating} />
                    <span className="text-sm text-gray-500">
                      ({room?.data.room.reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <p className="text-2xl font-bold text-[#dfa974]">
                    ${room?.data.room.price.toFixed(2)}
                    <span className="text-base font-normal text-gray-500 ml-1">
                      /night
                    </span>
                  </p>
                </div>
              </header>

              {/* Room Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
                <FeatureItem icon="users" title="Capacity">
                  {room?.data.room.maxGuests} Guests
                </FeatureItem>
                <FeatureItem icon="bed" title="Room Type">
                  {capitalizeFirstLetter(room?.data.room.roomType)}
                </FeatureItem>
                <FeatureItem icon="star" title="Rating">
                  <StarRatingDisplay rating={room?.data.room.averageRating} />
                </FeatureItem>
                <FeatureItem icon="tags" title="Features">
                  <div className="flex flex-wrap gap-2">
                    {room?.data.room.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {capitalizeFirstLetter(feature)}
                      </span>
                    ))}
                  </div>
                </FeatureItem>
              </div>

              {/* Description */}
              <div className="prose max-w-none text-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  About This Room
                </h3>
                <p className="leading-relaxed">{room?.data.room.description}</p>
              </div>

              {/* Reviews */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Guest Reviews
                  </h3>
                  <Link
                    to={`/rooms/${room?.data.room.id}/reviews`}
                    className="px-4 py-2 bg-[#dfa379] text-white rounded-lg hover:bg-[#c68a5e] transition-colors shadow-sm text-sm"
                  >
                    <i className="fas fa-eye mr-2"></i>
                    See All Reviews
                  </Link>
                </div>
                <div className="space-y-6">
                  {latestReviews.map((review) => (
                    <SingleReview key={review.id} review={review} />
                  ))}
                </div>
              </div>
              <CreateReview />
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="pt-10 top-4 space-y-8">
              <CreateBookingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetails;
