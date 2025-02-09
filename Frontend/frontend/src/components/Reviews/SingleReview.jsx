import React from "react";

function SingleReview({ review, idx }) {
  return (
    <div key={idx} className="mb-[32px] flex">
      <div className="mr-[32px]">
        <img
          src={review.user.photo}
          alt="User Avatar"
          className="h-[70px] w-[70px] rounded-full"
        />
      </div>
      <div className="relative pl-[30px] flex-1 border-l border-gray-300">
        <span className="text-xs text-[#dfa479] uppercase tracking-widest">
          {review.createdAt.toString().split("T")[0]}
        </span>
        <div className="absolute right-0 top-0">
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
        </div>
        <h5 className="text-gray-800 mt-1 mb-2">{review.user.name}</h5>
        <p className="text-gray-600 mb-0">{review.review}</p>
      </div>
    </div>
  );
}

export default SingleReview;
