import React from "react";
import StarRating from "../Reusable/StarRating";
import useStarRatingStore from "../../stores/StarRatingStore";
import useFormStore from "../../stores/FormStore";
import { useCreateReview } from "./useCreateReview";

import { useParams } from "react-router-dom";

function CreateReview() {
  const { roomId } = useParams();

  const { rating } = useStarRatingStore();
  const setRating = useStarRatingStore((state) => state.setRating);

  const { reviewData } = useFormStore();
  const setReviewData = useFormStore((state) => state.setReviewData);
  const resetReviewData = useFormStore((state) => state.resetReviewData);

  const { createReview } = useCreateReview();

  const handleSubmit = (e) => {
    e.preventDefault();
    createReview(
      {
        roomId: roomId,
        reviewData: {
          ...reviewData,
          rating: rating, // Add rating to reviewData
        },
      },
      {
        onSettled: () => {
          setRating(0);
          resetReviewData();
        },
      }
    );
  };

  return (
    <>
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Write a Review
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h5 className="text-lg text-gray-800 whitespace-nowrap">
                Your Rating:
              </h5>
              <StarRating
                onSetRating={setRating}
                defaultRating={rating}
                size={24}
                className="flex-grow"
              />
            </div>

            <textarea
              value={reviewData.review}
              onChange={(e) => setReviewData("review", e.target.value)}
              placeholder="Share your experience..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#dfa974] focus:border-transparent resize-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-[#dfa974] text-white font-semibold rounded-lg hover:bg-[#c79162] transition-colors duration-200"
          >
            Submit Review
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateReview;
