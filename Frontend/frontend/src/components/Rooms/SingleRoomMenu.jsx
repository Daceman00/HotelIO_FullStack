import React from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";

function SingleRoomMenu({ room }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-[#dfa974]";
      case "occupied":
        return "bg-blue-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const isMaintenance = room.status.toLowerCase() === "maintenance";

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div
      className={`mb-[20px] relative ${
        isMaintenance ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <img
        className="min-w-[100%]"
        src={`${IMAGE_URL}/${room.imageCover}`}
        alt=""
      />
      <div
        className={`absolute top-0 right-0 m-2 p-2 text-white ${getStatusColor(
          room.status
        )}`}
      >
        {room.status.toUpperCase()}
      </div>
      <div className="border border-gray-200 border-t-0 p-4 px-4 pt-4 pb-5 pl-5">
        <h4 className="text-gray-800 text-lg font-semibold mb-3">
          #{room.roomNumber}
        </h4>
        <h3 className="text-[#dfa974] text-2xl font-bold mb-3">
          {room.price}$
          <span className="text-gray-800 text-sm font-normal ml-1">
            Pernight
          </span>
        </h3>
        <table className="mb-[14px]">
          <tbody className="text-base text-gray-500 leading-[30px]">
            <tr>
              <td className="w-[100px]">Size:</td>
              <td>{capitalizeFirstLetter(room.roomType)}</td>
            </tr>
            <tr>
              <td className="w-[100px]">Capacity:</td>
              <td>{room.maxGuests}</td>
            </tr>

            <tr>
              <td className="w-[100px]">Features:</td>
              {room.features.map((feature) => (
                <td key={feature}>{feature}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <button
          onClick={() => navigate(`/rooms/${room._id}`)}
          className="primary-btn inline-block text-gray-800 font-medium px-4 py-2 border border-gray-800 rounded hover:bg-gray-800 hover:text-white transition-all"
        >
          More Details
        </button>
      </div>
    </div>
  );
}

export default SingleRoomMenu;
