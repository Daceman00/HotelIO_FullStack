import React from "react";
import { useGetAllRooms } from "./useGetAllRooms";
import SingleRoomMenu from "./SingleRoomMenu";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";

function RoomsMenu() {
  const { rooms, isPending } = useGetAllRooms();

  if (isPending) return <Loading mode={modes.all} />;

  const sortedRooms = rooms?.data.data.sort(
    (a, b) => a.roomNumber - b.roomNumber
  );

  const sortedRooms = rooms?.data.data.sort(
    (a, b) => a.roomNumber - b.roomNumber
  );

  return (
    <>
      <div className="pt-[70px] pb-[80px] flex justify-center items-center flex-col text-center">
        <div className="container">
          <h2 className="text-4xl text-gray-800 mb-4">Our Rooms</h2>

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

      <section className="pt-[0px] pb-[80px] flex justify-center">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {sortedRooms.map((room) => (
              <SingleRoomMenu room={room} key={room._id} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default RoomsMenu;
