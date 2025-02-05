import React, { useEffect } from "react";
import useStarRatingStore from "../../stores/StarRatingStore";
import Star from "./Star";

function StarRating({
  maxRating = 5,
  color = "#dfa379",
  size = 64,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const { rating, tempRating, setRating, setTempRating, setDefault } =
    useStarRatingStore();

  // Initialize default rating
  useEffect(() => {
    setDefault(defaultRating);
  }, [defaultRating, setDefault, rating]);

  function handleRating(newRating) {
    setRating(newRating);
    onSetRating?.(newRating);
  }
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={{ color: color, fontSize: `${size / 1.5}px` }}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

export default StarRating;
