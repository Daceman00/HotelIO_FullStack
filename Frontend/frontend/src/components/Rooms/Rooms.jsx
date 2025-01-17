import React from "react";
import SingleRoom from "./SingleRoom";
import { useGetAllRooms } from "./useGetAllRooms";
import Loading from "../Reusable/Loading";
import { IMAGE_URL } from "../../helpers/imageURL";

function Rooms() {
  const { rooms, isPending, error } = useGetAllRooms();

  if (isPending) return <Loading />;

  return (
    <div className="w-full flex flex-col py-24 dark:bg-gray-800">
      <div className="flex flex-col w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            <span className="text-emerald-600">Our Available Rooms</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover the perfect room for your stay, with comfort and luxury at
            your fingertips.
          </p>
        </div>
        <section className="hp-room-section py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms?.data.data.map((room, idx) => (
                <div
                  key={room.roomNumber}
                  className="hp-room-item group relative bg-cover bg-center rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: `url(${room.image})`,
                    height: "600px",
                  }}
                >
                  <div className="hr-text absolute left-11 right-6 bottom-[-250px] transition-all duration-500 ease-linear group-hover:bottom-[135px] bg-black bg-opacity-60 p-4 rounded-t-lg">
                    <h3 className="text-white text-lg font-semibold mb-4">
                      {room.title}
                    </h3>
                    <h2 className="text-yellow-500 text-2xl font-bold mb-12 group-hover:mb-7 transition-all duration-200">
                      {room.price}
                      <span className="text-sm text-white ml-2">/Pernight</span>
                    </h2>
                    <table className="w-full text-sm text-white mb-6">
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
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Rooms;
