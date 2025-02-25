import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import useAuthStore from "../../stores/AuthStore";
import { useDeleteReview } from "./AdminReviews/useDeleteReview";
import useUIStore from "../../stores/UiStore";
import Modal from "../Reusable/Modal";
import { IMAGE_URL_USERS } from "../../helpers/imageURL";

function SingleReview({ review, idx }) {
  const { isAdmin } = useAuthStore();
  const { deleteReview, isPending, error } = useDeleteReview();
  const { isModalOpen } = useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);
  const handleDeleteReview = () => {
    onModalClose();
  };
  console.log(review?.user.photo);
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
      <div key={idx} className="mb-[32px] flex">
        <div className="mr-[32px]">
          <img
            src={`${IMAGE_URL_USERS}/${review?.user.photo}`}
            alt="User Avatar"
            className="h-[70px] w-[70px] rounded-full"
          />
        </div>
        <div className="relative pl-[30px] flex-1 border-l border-gray-300">
          <span className="text-xs text-[#dfa479] uppercase tracking-widest">
            {review.createdAt.toString().split("T")[0]}
          </span>
          <div className="absolute right-0 top-0 flex items-center">
            <span className="text-[#dfa974]">
              {[...Array(Math.floor(review.rating))].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </span>
            <span className="text-gray-400">
              {[...Array(5 - Math.floor(review.rating))].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </span>
            {isAdmin && (
              <TrashIcon
                onClick={onModalOpen}
                className="h-5 w-5 text-gray-400 cursor-pointer ml-2"
              />
            )}
          </div>
          <h5 className="text-gray-800 mt-1 mb-2">{review.user.name}</h5>
          <p className="text-gray-600 mb-0">{review.review}</p>
        </div>
      </div>
    </>
  );
}

export default SingleReview;
