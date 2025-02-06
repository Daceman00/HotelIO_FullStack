import React, { useEffect } from "react";
import useUIStore from "../../stores/UiStore";
import { useDebounce } from "../../hooks/useDebounce";

function SearchInput({ placeholder = "Search..." }) {
  const { searchQuery } = useUIStore();
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length < 3) {
      useUIStore.getState().setCurrentPage(1);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        className="p-2 border rounded-lg w-full max-w-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
      {searchQuery.length > 0 && searchQuery.length < 3 && (
        <p className="text-sm text-gray-500 mt-1">
          Type at least 3 characters to search
        </p>
      )}
    </div>
  );
}

export default SearchInput;
