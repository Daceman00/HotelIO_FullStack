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
          <div className="absolute inset-0 bg-cover bg-center opacity-10"></div>
          <div className="container mx-auto px-4 py-24 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">
                  Our Rooms
                </span>
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
              <div className="mt-8 inline-flex items-center">
                {isAdmin && (
                  <CreateButton onClick={onRoomModalOpen}>
                    Create New Room
                  </CreateButton>
                )}
              </div>
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
