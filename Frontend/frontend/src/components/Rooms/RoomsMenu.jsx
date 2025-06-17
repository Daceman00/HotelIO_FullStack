import React, { useEffect, useState } from "react";
import { useGetAllRooms } from "./useGetAllRooms";
import SingleRoomMenu from "./SingleRoomMenu";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import CreateButton from "../Reusable/CreateButton";
import useUIStore from "../../stores/UiStore";
import CreateRoom from "./CreateRoom";
import useAuthStore from "../../stores/AuthStore";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { IMAGE_URL_MENU } from "../../helpers/imageURL";
import Pagination from "../Reusable/Pagination";

function RoomsMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const { rooms, isPending, isFetching, hasMore, nextPage, error } =
    useGetAllRooms({
      sort: "roomNumber",
      limit: 9,
      page: currentPage,
    });
  const { isRoomModalOpen } = useUIStore();
  const onRoomModalOpen = useUIStore((state) => state.onRoomModalOpen);
  const onRoomModalClose = useUIStore((state) => state.onRoomModalClose);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  useEffect(() => {
    setSearchParams({ filter, page: currentPage });
  }, [filter, currentPage, setSearchParams]);

  const filteredRooms = rooms.filter((room) => {
    if (filter === "all") return true;
    return room.status.toLowerCase() === filter.toLowerCase();
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSearchParams({
      ...Object.fromEntries(searchParams),
      filter: newFilter,
      page: 1,
    });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: newPage,
      });
    }
  };

  const handleNext = () => {
    if (hasMore) {
      const newPage = nextPage;
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: newPage,
      });
    }
  };

  const handlePageSelect = (pageNumber) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: pageNumber,
    });
  };

  return (
    <>
      {isRoomModalOpen && (
        <CreateRoom
          isOpen={isRoomModalOpen}
          opacity={50}
          onClose={onRoomModalClose}
        />
      )}

      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen">
        <div className="relative bg-gradient-to-r from-indigo-50 to-amber-50 shadow-md">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url(${IMAGE_URL_MENU}/hotel-pattern.jpg)`,
            }}
          ></div>
          <div className="container mx-auto px-4 py-24 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                  Our Rooms
                </span>
              </h1>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Discover our collection of elegantly designed rooms, each
                crafted for your comfort and relaxation.
              </p>
              <div className="flex items-center justify-center text-lg">
                <Link
                  to="/"
                  className="text-gray-500 hover:text-amber-600 transition-colors"
                >
                  Home
                </Link>
                <ChevronRightIcon className="mx-2 h-5 w-5 text-gray-400" />
                <span className="text-amber-500 font-medium">Rooms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Rooms
              </button>
              <button
                onClick={() => handleFilterChange("available")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === "available"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Available
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleFilterChange("maintenance")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === "maintenance"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Maintenance
                </button>
              )}
            </div>

            {isAdmin && (
              <CreateButton onClick={onRoomModalOpen}>
                Create New Room
              </CreateButton>
            )}
          </div>

          {isPending || isFetching ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : filteredRooms?.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl text-gray-600">
                No rooms match your current filter
              </h3>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {filteredRooms.map((room) => (
                  <SingleRoomMenu room={room} key={room._id} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={nextPage || hasMore ? currentPage + 1 : currentPage}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onPageSelect={handlePageSelect}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default RoomsMenu;
