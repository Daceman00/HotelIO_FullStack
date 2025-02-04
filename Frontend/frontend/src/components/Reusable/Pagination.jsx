import React from "react";

const Pagination = ({ currentPage, totalPages, onPrevious, onNext }) => {
  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm bg-[#dfa974] text-white rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 text-sm bg-[#dfa974] text-white rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
