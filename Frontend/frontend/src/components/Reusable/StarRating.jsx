import React, { useEffect } from "react";
import useStarRatingStore from "../../stores/StarRatingStore";

function StarRating({
  maxRating = 5,
  color = "text-yellow-400",
  size = 24,
  className = "",
  defaultRating = 0,
  onSetRating,
}) {
  const { rating, tempRating, setRating, setTempRating, setDefault } =
    useStarRatingStore();

  useEffect(() => {
    setDefault(defaultRating);
  }, [defaultRating, setDefault]);

  const handleRating = (newRating) => {
    setRating(newRating);
    onSetRating?.(newRating);
  };

  const fullStars = Math.floor(tempRating || rating);
  const hasHalfStar = (tempRating || rating) % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => {
          const isFull = i < fullStars;
          const isHalf = hasHalfStar && i === fullStars;

          return (
            <svg
              key={i}
              className={`cursor-pointer transition-colors ${
                isFull ? "text-yellow-400" : "text-gray-300"
              }`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                color: isFull || isHalf ? color : undefined,
              }}
              fill="currentColor"
              viewBox="0 0 20 20"
              onMouseEnter={() => setTempRating(i + 1)}
              onMouseLeave={() => setTempRating(0)}
              onClick={() => handleRating(i + 1)}
            >
              {isFull ? (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              ) : isHalf ? (
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
          );
        })}
      </div>
      <p style={{ color, fontSize: `${size / 1.5}px` }}>
        {tempRating || rating || ""}
      </p>
    </div>
  );
}

export default StarRating;
