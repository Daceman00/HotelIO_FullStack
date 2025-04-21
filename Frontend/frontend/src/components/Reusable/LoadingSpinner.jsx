import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex justify-center my-4">
      <div className="animate-spin h-8 w-8 border-4 border-[#dfa379] rounded-full border-t-transparent"></div>
    </div>
  );
}

export default LoadingSpinner;
