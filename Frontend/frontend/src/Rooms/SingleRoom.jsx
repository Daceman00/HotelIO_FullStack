import React from "react";
import Button from "../../Reusable/Button";
import { Link } from "react-router-dom";

function SingleRoom({ room }) {
  return (
    <div className="animate-fadeInDown -rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative">
        <img
          src={room.image}
          alt={`Room ${room.number}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
      </div>
      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-font-bold text-xl">Room {room.number}</h3>
          <p className="text-dark_gray mb-2">Type: {room.type}</p>
          <p
            className={`text-${
              room.status === "Available"
                ? "green_secondary"
                : room.status === "Occupied"
                ? ""
                : ""
            }`}
          >
            Status: {room.status}
          </p>
        </div>
        <Button>
          <Link to={`/rooms/${room.number}`}>
            {room.status === "Available" ? "Book" : "Details"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default SingleRoom;
