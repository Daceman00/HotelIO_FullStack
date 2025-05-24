import React from "react";
import StarRating from "../Reusable/StarRating";
import useStarRatingStore from "../../stores/StarRatingStore";
import useFormStore from "../../stores/FormStore";
import { useCreateReview } from "./useCreateReview";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { useParams } from "react-router-dom";

function CreateReview() {
  const { roomId } = useParams();

  const { rating } = useStarRatingStore();
  const setRating = useStarRatingStore((state) => state.setRating);

  const { reviewData } = useFormStore();
  const setReviewData = useFormStore((state) => state.setReviewData);
  const resetReviewData = useFormStore((state) => state.resetReviewData);

  const { createReview, isPending } = useCreateReview();

  const handleSubmit = (e) => {
    e.preventDefault();
    createReview(
      {
        roomId: roomId,
        reviewData: {
          ...reviewData,
          rating: rating,
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
    <div className="mt-16 relative">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-orange-50/20 rounded-3xl blur-3xl -z-10 transform -rotate-1"></div>

      {/* Main container with glassmorphism effect */}
      <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Share Your Experience
          </h3>
          <p className="text-gray-600 text-sm">
            Your feedback helps others make better decisions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating section */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center space-y-4">
              <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                Rate Your Stay
              </h5>
              <div className="flex items-center gap-3">
                <StarRating
                  onSetRating={setRating}
                  defaultRating={rating}
                  size={28}
                  className="transition-all duration-300 hover:scale-105"
                />
                {rating > 0 && (
                  <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium animate-fade-in">
                    {rating} star{rating !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Review text section */}
          <div className="space-y-4">
            <label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Your Review
            </label>
            <div className="relative group">
              <textarea
                value={reviewData.review}
                onChange={(e) => setReviewData("review", e.target.value)}
                placeholder="Tell us about your experience - what made your stay memorable? What could be improved?"
                className="w-full h-40 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-300 resize-none transition-all duration-300 text-gray-700 placeholder-gray-400 shadow-sm group-hover:shadow-md"
                maxLength={1000}
              />
              <div className="absolute bottom-3 right-4 text-xs text-gray-400">
                {reviewData.review?.length || 0}/1000
              </div>
              {/* Floating accent */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isPending || !rating || !reviewData.review?.trim()}
              className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-orange-500 flex items-center justify-center min-w-[160px] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Button background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

              <div className="relative flex items-center gap-2">
                {isPending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 7.707 6.621a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Publish Review</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl -z-10"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl -z-10"></div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default CreateReview;
