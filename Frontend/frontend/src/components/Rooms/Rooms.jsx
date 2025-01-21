import React from "react";
import SingleRoom from "./SingleRoom";
import { useGetAllRooms } from "./useGetAllRooms";

function Rooms() {
  const { rooms } = useGetAllRooms();

  return (
    <div className="w-full flex flex-col py-24 dark:bg-gray-800">
      <div className="flex flex-col w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            <span className="text-[#dfa974]">Our Available Rooms</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover the perfect room for your stay, with comfort and luxury at
            your fingertips.
          </p>
        </div>
        <section className="flex justify-center py-16 bg-gray-50">
          <div className="container ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms?.data.data.map((room, idx) => (
                <SingleRoom room={room} key={room._id} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Rooms;
