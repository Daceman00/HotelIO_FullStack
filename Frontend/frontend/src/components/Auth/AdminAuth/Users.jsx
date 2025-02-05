import React from "react";
import { useUsers } from "./useUsers";
import Loading from "../../Reusable/Loading";
import User from "./User";
import useUIStore from "../../../stores/UiStore";
import { useMoveBack } from "../../../hooks/useMoveBack";
import { modes } from "../../../hooks/useServiceConfig";
import Pagination from "../../Reusable/Pagination"; // Import the new Pagination component
import SearchInput from "../../Reusable/SearchInput";

function Users() {
  const { isLoader } = useUIStore();
  const moveBack = useMoveBack();

  const { currentPage } = useUIStore();
  const setCurrentPage = useUIStore((state) => state.setCurrentPage);

  const { users, total, isPending, error } = useUsers(currentPage);

  const itemsPerPage = 10; // Should match your default limit
  const totalPages = Math.ceil(total / itemsPerPage);

  if (isPending) return <Loading />;

  if (!users || error) return <p>No users found</p>;

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="p-6 relative overflow-x-auto shadow-md sm:rounded-lg bg-white dark:bg-gray-800">
      <SearchInput placeholder="Search..." />
      <button
        onClick={moveBack}
        type="button"
        className="absolute top-4 right-4 text-white bg-[#dfa974] hover:bg-[#c68a5e] focus:ring-4 focus:outline-none focus:ring-[#c68a5e] font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-[#c68a5e] dark:hover:bg-[#b07a54] dark:focus:ring-[#b07a54]"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5H1m0 0l4-4M1 5l4 4"
          />
        </svg>
        <span className="sr-only">Move back</span>
      </button>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        {isLoader ? (
          <tr>
            <td colSpan="5" className="px-6 py-4 text-center">
              <Loading mode={modes.all} />
            </td>
          </tr>
        ) : (
          users?.data?.map((user) => <User key={user._id} user={user} />)
        )}
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}

export default Users;
