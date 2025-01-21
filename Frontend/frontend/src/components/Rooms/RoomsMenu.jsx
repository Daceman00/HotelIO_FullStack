import React from "react";
import { useGetAllRooms } from "./useGetAllRooms";
import SingleRoomMenu from "./SingleRoomMenu";
import { Link } from "react-router-dom";

function RoomsMenu() {
  const { rooms } = useGetAllRooms();

  return (
    <>
      <div className="pt-[70px] pb-[80px] flex justify-center">
        <div className="container">
          <div className="row">
            <div className="w-full">
              <div className="text-center">
                <h2 className="text-4xl text-gray-800 mb-3">Our Rooms</h2>
                <div className="inline-block text-lg text-[#19191a] mr-5 relative font-medium">
                  <Link
                    to="/"
                    className="inline-block text-lg text-gray-800 mr-5 relative font-medium after:content-['\f105'] after:absolute after:right-[-13px] after:top-[1px] after:text-lg after:font-awesome after:text-gray-400"
                  >
                    Home
                  </Link>
                  <span className="inline-block text-lg text-gray-400">
                    Rooms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="pt-[0px] pb-[80px] flex justify-center">
        <div className="container">
          <div className="row">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms?.data.data.map((room) => (
                <SingleRoomMenu room={room} key={room._id} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default RoomsMenu;
