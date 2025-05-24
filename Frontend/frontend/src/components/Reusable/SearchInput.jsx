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
    <div className="mb-4">
      <div className={`relative w-[${width}px]`}>
        <input
          ref={inputFocusRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          className=" text-sm bg-transparent w-full box-border px-2 py-[0.7em] border-b border-gray-300 focus:outline-none focus:bg-blue-100/10 peer"
        />
        <div className="absolute bg-[#dfa379] w-0 h-[2px] bottom-0 left-0 transition-all duration-300 peer-focus:w-full"></div>
      </div>
      {searchQuery.length > 0 && searchQuery.length < 3 && (
        <p className="text-sm text-gray-500 mt-1">
          Type at least 3 characters to search
        </p>
      )}
    </div>
  );
}

export default SearchInput;
