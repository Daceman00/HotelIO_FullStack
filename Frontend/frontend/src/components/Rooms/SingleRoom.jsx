import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";

function SingleRoom({ room }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-emerald-600";
      case "occupied":
        return "bg-red-600";
      case "maintenance":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const isMaintenance = room.status.toLowerCase() === "maintenance";

  return (
    <div
      key={room.roomNumber}
      className="hp-room-item  w-full h-full left-0 top-0 group relative bg-cover bg-center rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${IMAGE_URL}/${room.imageCover})`,
        height: "350px",
      }}
    >
      <div className="absolute left-11 right-6 bottom-[-250px] transition-all duration-500 ease-linear group-hover:bottom-[135px] bg-black bg-opacity-60 p-4 rounded-t-lg">
        <h3 className="text-white text-lg font-semibold mb-4">{room.title}</h3>
        <h2 className="text-yellow-500 text-2xl font-bold mb-12 group-hover:mb-7 transition-all duration-200">
          {room.price}
          <span className="text-sm text-white ml-2">/Pernight</span>
        </h2>
        <table className="w-full text-sm text-white mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <tbody>
            <tr>
              <td className="w-[120px] font-semibold">Status:</td>
              <td>{room.status}</td>
            </tr>
            <tr>
              <td className="w-[120px] font-semibold">Capacity:</td>
              <td>{room.roomType}</td>
            </tr>
          </tbody>
        </table>
        <a
          href="#"
          className="primary-btn px-6 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-white hover:text-yellow-500 transition-colors duration-300"
        >
          More Details
        </a>
      </div>
    </div>
  );
}

export default SingleRoom;
