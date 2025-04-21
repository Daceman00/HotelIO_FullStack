import React, { useEffect } from "react";
import { useGetAllRooms } from "./useGetAllRooms";
import SingleRoomMenu from "./SingleRoomMenu";
import { Link, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import CreateButton from "../Reusable/CreateButton";
import useUIStore from "../../stores/UiStore";
import CreateRoom from "./CreateRoom";
import useAuthStore from "../../stores/AuthStore";
import LoadingSpinner from "../Reusable/LoadingSpinner";

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
      {/* Render the RoomModal if it is open */}
      {isRoomModalOpen ? (
        <CreateRoom
          isOpen={isRoomModalOpen}
          opacity={50}
          onClose={onRoomModalClose}
        />
      ) : null}
      <div className="pt-[70px] pb-[80px] flex justify-center items-center flex-col text-center lg:pt-[100px] lg:pb-[120px] md:pt-[80px] md:pb-[100px]">
        <div className="container lg:max-w-screen-lg md:max-w-screen-md">
          <h2 className="text-4xl text-gray-800 mb-4">Our Rooms</h2>
          {isAdmin && (
            <CreateButton color={"primary"} onClick={onRoomModalOpen}>
              Create
            </CreateButton>
          )}
          <div className="flex items-center text-lg text-[#19191a] font-medium justify-center">
            <Link to="/" className="text-gray-400 relative mr-2">
              Home
            </Link>

            <svg
              className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>

            <span className="text-gray-800 ">Rooms</span>
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
    </>
  );
}

export default RoomsMenu;
