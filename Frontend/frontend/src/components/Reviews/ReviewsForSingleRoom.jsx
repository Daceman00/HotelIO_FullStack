import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import StarRatingDisplay from "../Reusable/StarRatingDisplay";
import SingleReview from "./SingleReview";
import { Link, useParams } from "react-router-dom";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import { useReviewsForSingleRoom } from "./useGetAllReviewsForRoom";
import { useGetRoom } from "../Rooms/useGetRoom";
import { useInView } from "react-intersection-observer";

function ReviewsForSingleRoom() {
  const { roomId } = useParams();
  const {
    reviews,
    isPending: isPendingReview,
    total,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useReviewsForSingleRoom(roomId);

  const { room, isPending: isPendingRoom } = useGetRoom(roomId);

  const { ref, inView } = useInView({
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* if (isPendingReview || isPendingRoom) return <Loading mode={modes.all} />; */

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to={`/rooms/${roomId}`}
            className="inline-flex items-center text-[#dfa974] hover:text-[#c68a5e] transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Room
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guest Reviews for Room {room.data.room.roomNumber}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <StarRatingDisplay rating={room.data.room.averageRating} />
            <span className="text-lg text-gray-600">
              {room.data.room.reviews.length} reviews
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              // Attach ref to the last element to trigger next page fetch
              ref={index === reviews.length - 1 && hasNextPage ? ref : null}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <SingleReview review={review} />
            </div>
          ))}
        </div>

        {/* After the reviews grid */}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center py-6">
            <Loading mode={modes.fetching} />
          </div>
        )}

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-6 mx-auto w-24 h-24 text-gray-300">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Be the first to share your experience about this room.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ReviewsForSingleRoom;
