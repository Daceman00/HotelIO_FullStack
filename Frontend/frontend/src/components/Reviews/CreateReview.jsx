import React from "react";
import StarRating from "../Reusable/StarRating";
import useStarRatingStore from "../../stores/StarRatingStore";
import useFormStore from "../../stores/FormStore";
import { useCreateReview } from "./useCreateReview";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
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
      <Loading mode={modes.all} />
      <div className="mb-11">
        <h4 className="text-gray-800 tracking-wide "></h4>
        <form onSubmit={handleSubmit}>
          <div className="lg:w-1/2">
            <div>
              <h5 className="text-lg text-gray-800 mb-6 float-left mr-2">
                You Rating:
              </h5>
              <StarRating
                onSetRating={setRating} // Capture rating changes
                defaultRating={rating} // Pass current rating
                className="float-left" // Position stars next to the label
                size={24} // Adjust star size as needed
              />
            </div>
            <textarea
              value={reviewData.review}
              onChange={(e) => setReviewData("review", e.target.value)}
              className="w-full h-32 border border-gray-300 text-base text-gray-400 px-5 pt-3 mb-6 resize-none"
            ></textarea>
            <button className="text-xs font-bold uppercase text-white tracking-wide bg-[#dfa479] border-0 px-8 py-3 inline-block">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateReview;
