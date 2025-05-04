import React, { useEffect } from "react";
import { useGetAllRooms } from "./useGetAllRooms";
import SingleRoomMenu from "./SingleRoomMenu";
import { Link, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import CreateButton from "../Reusable/CreateButton";
import useUIStore from "../../stores/UiStore";
import CreateRoom from "./CreateRoom";
import useAuthStore from "../../stores/AuthStore";
import LoadingSpinner from "../Reusable/LoadingSpinner";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { IMAGE_URL_MENU } from "../../helpers/imageURL";

function RoomsMenu() {
  const { isAdmin } = useAuthStore();
  const { rooms, isPending } = useGetAllRooms("roomNumber");
  const { isRoomModalOpen } = useUIStore();
  const onRoomModalOpen = useUIStore((state) => state.onRoomModalOpen);
  const onRoomModalClose = useUIStore((state) => state.onRoomModalClose);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <>
      {isRoomModalOpen && (
        <CreateRoom
          isOpen={isRoomModalOpen}
          opacity={50}
          onClose={onRoomModalClose}
        />
      )}

      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="relative bg-indigo-50">
          <div className="absolute inset-0 bg-cover bg-center opacity-10">
            <img
              src={"${IMAGE_URL_MENU}${image}"}
              alt="background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 py-24 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-800 mb-6 tracking-tight">
                Our <span className="text-[#dfa379]">Rooms</span>
              </h1>
              <div className="flex items-center justify-center text-lg">
                <Link
                  to="/"
                  className="text-gray-500 hover:text-[#c68a5e]transition-colors"
                >
                  Home
                </Link>
                <ChevronRightIcon className="mx-2 h-5 w-5 text-gray-400" />
                <span className="text-[#dfa379] font-medium">Rooms</span>
              </div>

              {isAdmin && (
                <button
                  onClick={onRoomModalOpen}
                  className="mt-8 inline-flex items-center px-6 py-3 bg-[#dfa379] hover:bg-[#c68a5e] text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Create New Room
                </button>
              )}
            </div>
          </div>
        </div>

        {isPending ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <section className="pt-[0px] pb-[80px] flex justify-center lg:pt-[20px] lg:pb-[100px] md:pt-[10px] md:pb-[90px]">
            <div className="container lg:max-w-screen-lg md:max-w-screen-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {rooms?.data.data.map((room) => (
                  <SingleRoomMenu room={room} key={room._id} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default RoomsMenu;
