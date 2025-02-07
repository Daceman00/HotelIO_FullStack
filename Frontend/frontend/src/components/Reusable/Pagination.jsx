import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageSelect,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4 gap-2">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm bg-[#dfa974] text-white rounded disabled:opacity-50"
      >
        Previous
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageSelect(number)}
          className={`px-4 py-2 text-sm rounded border  ${
            currentPage === number
              ? "bg-[#dfa974] text-white"
              : "bg-white text-[#dfa974]"
          }`}
        >
          {number}
        </button>
      ))}
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
