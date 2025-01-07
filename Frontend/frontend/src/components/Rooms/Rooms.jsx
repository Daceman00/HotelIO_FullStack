import React from "react";
import SingleRoom from "./SingleRoom";
import { useGetAllRooms } from "./useGetAllRooms";
import Loading from "../Reusable/Loading";

function Rooms() {
  const { rooms, isPending, error } = useGetAllRooms();

  if (isPending) return <Loading />;

  return (
    <div className="w-full flex flex-col py-24 dark:bg-gray-800">
      <div className="flex flex-col w-[90%] lg:w-4/5 2xl:w-3/5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {rooms?.data.data.map((room) => (
            <SingleRoom room={room} key={room.roomNumber} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rooms;
