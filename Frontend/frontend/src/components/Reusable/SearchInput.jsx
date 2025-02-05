import React, { useEffect } from "react";
import useUIStore from "../../stores/UiStore";
import { useDebounce } from "../../hooks/useDebounce";

function SearchInput({ placeholder = "Search...", debounceTime = 1000 }) {
  const setCurrentPage = useUIStore((state) => state.setCurrentPage);
  const { searchQuery } = useUIStore();
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);
  const debouncedSearchTerm = useDebounce(searchQuery, debounceTime);

  // Reset to first page when debounced search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, setCurrentPage]);

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border rounded-lg w-full max-w-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
    </div>
  );
}

export default SearchInput;
