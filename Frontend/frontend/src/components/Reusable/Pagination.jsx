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
    <div className="flex justify-center mt-8 mb-4">
      <div className="flex items-center gap-1 bg-white rounded-xl shadow-lg border border-gray-100 p-2">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="flex items-center justify-center px-4 py-2.5 text-sm font-medium 
                     bg-gradient-to-r from-[#dfa974] to-[#c8956a] text-white 
                     rounded-lg shadow-sm hover:shadow-md hover:from-[#c8956a] hover:to-[#b8855a]
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm
                     disabled:hover:from-[#dfa974] disabled:hover:to-[#c8956a]
                     transition-all duration-200 ease-in-out transform hover:scale-105 disabled:hover:scale-100
                     min-w-[80px]"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageSelect(number)}
              className={`flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-lg
                         transition-all duration-200 ease-in-out transform hover:scale-110
                         ${
                           currentPage === number
                             ? "bg-gradient-to-r from-[#dfa974] to-[#c8956a] text-white shadow-md scale-110 ring-2 ring-[#dfa974] ring-opacity-30"
                             : "bg-gray-50 text-[#dfa974] hover:bg-[#dfa974] hover:bg-opacity-10 hover:text-[#c8956a] border border-gray-200 hover:border-[#dfa974] hover:border-opacity-30"
                         }`}
            >
              {number}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center px-4 py-2.5 text-sm font-medium 
                     bg-gradient-to-r from-[#dfa974] to-[#c8956a] text-white 
                     rounded-lg shadow-sm hover:shadow-md hover:from-[#c8956a] hover:to-[#b8855a]
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm
                     disabled:hover:from-[#dfa974] disabled:hover:to-[#c8956a]
                     transition-all duration-200 ease-in-out transform hover:scale-105 disabled:hover:scale-100
                     min-w-[80px]"
        >
          Next
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
