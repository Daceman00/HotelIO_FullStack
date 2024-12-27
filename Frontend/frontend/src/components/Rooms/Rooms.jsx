import React from "react";
import Button from "../Reusable/Button";
import SingleRoom from "./SingleRoom";
import Loading from "../Reusable/Loading";
import { useIsLoggedIn } from "../Auth/useAuth";

function Rooms() {
  const rooms = [
    { number: 101, type: "Single", status: "Available" },
    { number: 102, type: "Double", status: "Occupied" },
    { number: 103, type: "Suite", status: "Available" },
    { number: 104, type: "Double", status: "Maintenance" },
    { number: 105, type: "Single", status: "Occupied" },
    { number: 106, type: "Single", status: "Occupied" },
  ];

  const { user, isLoading } = useIsLoggedIn();
  if (isLoading) return <Loading />;

  return (
    <div className="flex-1 p-6 ">
      <h1 className=" text-3xl font-bold mb-6"></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <SingleRoom room={room} key={room.number} />
        ))}
        <img src={user?.data.photo} alt="user-photo"></img>
      </div>
    </div>
  );
}

export default Rooms;
