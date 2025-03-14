import React from "react";

function StarRatingDisplay({ rating = 0, color = "#FFEE58", size = 24 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`${
            index < fullStars ? "text-yellow-400" : "text-gray-300"
          }`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            color:
              index < fullStars || (hasHalfStar && index === fullStars)
                ? color
                : undefined,
          }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {index < fullStars ? (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          ) : hasHalfStar && index === fullStars ? (
            <path
              fillRule="evenodd"
              d="M10 1.944l1.832 5.656h5.932l-4.8 3.488 1.832 5.657L10 13.256l-4.8 3.488 1.832-5.657-4.8-3.488h5.932L10 1.944zm0 3.712L8.616 7.81H5.6l2.592 1.884-.992 3.058L10 10.844l2.8 2.033-.992-3.058L14.4 7.81h-3.016L10 5.656z"
              clipRule="evenodd"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M10 1.944l1.832 5.656h5.932l-4.8 3.488 1.832 5.657L10 13.256l-4.8 3.488 1.832-5.657-4.8-3.488h5.932L10 1.944z"
              clipRule="evenodd"
            />
          )}
        </svg>
      ))}
    </div>
  );
}

export default StarRatingDisplay;
