import React from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

function SingleRoom({ room }) {
  const navigate = useNavigate();

  return (
    <div
      key={room.roomNumber}
      className="w-full h-full left-0 top-0 group relative bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${IMAGE_URL}/${room.imageCover})`,
        height: "400px",
      }}
    >
      <div className="absolute left-11 right-6 bottom-[-150px] transition-all duration-300 ease-linear group-hover:bottom-[135px] bg-opacity-0 p-4 rounded-t-lg">
        <h3 className="text-white text-lg font-semibold mb-4">
          Room: {room.roomNumber}
        </h3>
        <h2 className="text-[#dfa974] text-2xl font-bold mb-12 group-hover:mb-7 transition-all duration-200">
          {room.price}$
          <span className="text-sm text-white ml-2">/Pernight</span>
        </h2>
        <table className="w-full text-sm text-white mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <tbody>
            <tr>
              <td className="w-[120px] font-semibold">Capacity:</td>
              <td>{room.maxGuests}</td>
            </tr>
            <tr>
              <td className="w-[120px] font-semibold">Type:</td>
              <td>{room.roomType}</td>
            </tr>
            <tr>
              <td className="w-[120px] font-semibold">Rating:</td>
              <td>
                <div className="flex items-center mt-2">
                  <span className="text-[#dfa974]">
                    {[...Array(Math.floor(room.averageRating))].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </span>
                  <span className="text-gray-400 ml-2">
                    {[...Array(5 - Math.floor(room.averageRating))].map(
                      (_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      )
                    )}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={() => navigate(`/rooms/${room._id}`)}
          className="primary-btn px-6 py-2 bg-light_brown text-white font-semibold rounded hover:bg-[#dfa974] transition-colors duration-300"
        >
          More Details
        </button>
      </div>
    </div>
  );
}

export default SingleRoom;
