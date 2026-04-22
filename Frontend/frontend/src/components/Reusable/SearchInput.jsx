import React, { useEffect, useRef } from "react";
import useUIStore from "../../stores/UiStore";

function SearchInput({
  placeholder = "Search...",
  searchQuery,
  setSearchQuery,
  width,
}) {
  const inputFocusRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length < 3) {
      useUIStore.getState().setCurrentPage(1);
    }
  };

  useEffect(() => {
    if (inputFocusRef.current) {
      inputFocusRef.current.focus();
    }
  }, []);

  return (
    <div className="mb-8">
      <div className="relative max-w-sm">
        {/* Search icon */}
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
          <svg
            className="w-4 h-4 text-[#dfa379]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <input
          ref={inputFocusRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className="
            w-full pl-10 pr-9 py-2.5
            bg-white/80 backdrop-blur-sm
            border border-[#dfa379]/25
            rounded-xl
            text-sm text-gray-700 placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:border-[#dfa379]/70 focus:bg-white/95
            focus:ring-2 focus:ring-[#dfa379]/10
            hover:border-[#dfa379]/40 hover:shadow-sm
          "
        />

        {/* Clear button */}
        {searchQuery.length > 0 && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M18 6 6 18M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {searchQuery.length > 0 && searchQuery.length < 3 && (
        <p className="text-xs text-gray-400 mt-1.5 ml-1">
          Type at least 3 characters to search
        </p>
      )}
    </div>
  );
}

export default SearchInput;
