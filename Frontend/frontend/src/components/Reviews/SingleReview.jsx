import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import useAuthStore from "../../stores/AuthStore";
import { useDeleteReview } from "./AdminReviews/useDeleteReview";
import useUIStore from "../../stores/UiStore";
import Modal from "../Reusable/Modal";
import { IMAGE_URL_USERS } from "../../helpers/imageURL";
import StarRatingDisplay from "../Reusable/StarRatingDisplay";

function SingleReview({ review, idx }) {
  const { isAdmin } = useAuthStore();
  const { deleteReview, isPending, error } = useDeleteReview();
  const { isModalOpen } = useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);
  const handleDeleteReview = () => {
    onModalClose();
  };

  return (
    <>
      {isModalOpen ? (
        <Modal
          action={deleteReview}
          userId={review.id}
          isOpen={isModalOpen}
          onClose={onModalClose}
          title={"Are you sure you want permanently delete this review?"}
          description={"If you delete this review, you can not return it!"}
          onConfirm={handleDeleteReview}
          isPending={isPending}
          opacity="20"
        />
      ) : null}
      <div
        key={idx}
        className="group relative mb-8 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className="shrink-0">
            <img
              src={`${IMAGE_URL_USERS}/${review?.user.photo}`}
              alt="User Avatar"
              className="h-16 w-16 rounded-full border-2 border-white shadow-sm"
            />
          </div>

          {/* Review Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">
                  {review.user.name}
                </h5>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Rating and Actions */}
              <div className="flex items-center gap-2">
                <StarRatingDisplay
                  rating={review.rating}
                  size={16}
                  className="mt-1"
                />
                {isAdmin && (
                  <button
                    onClick={onModalOpen}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Delete review"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-600 leading-relaxed">{review.review}</p>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#dfa974]/20 rounded-xl pointer-events-none transition-all duration-200" />
      </div>
    </>
  );
}

export default SingleReview;
