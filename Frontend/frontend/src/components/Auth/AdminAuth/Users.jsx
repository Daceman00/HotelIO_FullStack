import React, { useEffect, useRef, useState } from "react";
import { useUsers } from "./useUsers";
import User from "./User";
import useUIStore from "../../../stores/UiStore";
import { useMoveBack } from "../../../hooks/useMoveBack";
import Pagination from "../../Reusable/Pagination";
import SearchInput from "../../Reusable/SearchInput";
import { useLocation, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../Reusable/LoadingSpinner";

function Users() {
  const location = useLocation();
  const moveBack = useMoveBack();
  const [searchParams, setSearchParams] = useSearchParams();

  const { userSearchQuery } = useUIStore();
  const setUserSearchQuery = useUIStore((state) => state.setUserSearchQuery);

  const { currentPage } = useUIStore();
  const setCurrentPage = useUIStore((state) => state.setCurrentPage);

  const { users, total, error, isPending, hasNextPage, hasPrevPage } =
    useUsers();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePrevious = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), page: newPage }));
  };

  const handleNext = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(newPage);
    setSearchParams((prev) => ({ ...Object.fromEntries(prev), page: newPage }));
  };

  const handlePageSelect = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSearchParams((prev) => ({
      ...Object.fromEntries(prev),
      page: pageNumber,
    }));
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    const pageQuery = parseInt(searchParams.get("page")) || 1;
    setUserSearchQuery(searchQuery);
    setCurrentPage(pageQuery);
  }, [searchParams, setUserSearchQuery, setCurrentPage]);

  useEffect(() => {
    const params = { ...Object.fromEntries(searchParams) };
    if (userSearchQuery) {
      params.search = userSearchQuery;
    } else {
      delete params.search;
    }
    params.page = currentPage;
    setSearchParams(params);
  }, [userSearchQuery, currentPage, setSearchParams]);

  useEffect(() => {
    setUserSearchQuery("");
    setCurrentPage(1);
  }, [setUserSearchQuery, setCurrentPage, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl pb-1 font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                Manage and search through your user database
              </p>
            </div>

            <button
              onClick={moveBack}
              className="group relative inline-flex items-center justify-center p-3 overflow-hidden font-medium text-white transition duration-300 ease-out rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-amber-300 dark:focus:ring-amber-800"
              style={{ backgroundColor: "#dfa379" }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <svg
                className="relative w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="sr-only">Go back</span>
            </button>
          </div>

          {/* Search Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
              <SearchInput
                placeholder="Search users by name, email, or role..."
                searchQuery={userSearchQuery}
                setSearchQuery={setUserSearchQuery}
                width="250"
              />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: "linear-gradient(to right, #f59e0b, #d97706)",
                }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#dfa379" }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Current Page
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentPage}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4 shadow-sm">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: "linear-gradient(to right, #fbbf24, #f59e0b)",
                }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Pages
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalPages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-amber-500/5 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200/50 dark:border-gray-600/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  style={{ color: "#dfa379" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Users Directory
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-fixed divide-y divide-gray-200/50 dark:divide-gray-600/50">
                <thead className="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm">
                  <tr>
                    <th
                      scope="col"
                      className="w-2/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-amber-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Name</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: "#dfa379" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <span>Role</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Status</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-orange-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                        <span>Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-gray-600/50 bg-white dark:bg-gray-800">
                  {isPending ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <LoadingSpinner />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Loading users...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : users?.data?.length > 0 ? (
                    users.data.map((user, index) => (
                      <User key={user._id} user={user} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-gray-400 dark:text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                              />
                            </svg>
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                              No users found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              {userSearchQuery
                                ? `No users match "${userSearchQuery}". Try adjusting your search.`
                                : "There are no users to display at this time."}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(hasNextPage || hasPrevPage) && (
              <div className="bg-gradient-to-r from-gray-50/80 to-amber-50/80 dark:from-gray-700/80 dark:to-gray-600/80 backdrop-blur-sm px-6 py-4 border-t border-gray-200/50 dark:border-gray-600/50">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onPageSelect={handlePageSelect}
                />
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                  Error Loading Users
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                  {error?.message ||
                    "An unexpected error occurred while loading users."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
