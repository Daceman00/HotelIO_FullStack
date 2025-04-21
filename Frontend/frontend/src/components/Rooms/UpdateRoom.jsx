import React, { useEffect, useState } from "react";
import { useUpdateRoom } from "./useUpdateRoom";
import useFormStore from "../../stores/FormStore";
import { useGetRoom } from "./useGetRoom";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../Reusable/LoadingSpinner";

function UpdateRoom({ isOpen, onClose, opacity }) {
  const { roomId } = useParams();
  const { room, isPending: isPendingRoom } = useGetRoom();
  const { updateRoom, isPending: isUpdatePending } = useUpdateRoom();
  const { roomData } = useFormStore();
  const setRoomData = useFormStore((state) => state.setRoomData);
  const resetRoomData = useFormStore((state) => state.resetRoomData);

  const [featuresInput, setFeaturesInput] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const options = [
    { value: "single", label: "Single" },
    { value: "double", label: "Double" },
    { value: "suite", label: "Suite" },
    { value: "deluxe", label: "Deluxe" },
  ];

  const maxGuestsMap = {
    single: 1,
    double: 2,
    suite: 3,
    deluxe: 4,
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (room) {
        // Initialize form with existing room data
        setRoomData("_id", room?.data?.room._id);
        setRoomData("roomNumber", room?.data?.room.roomNumber);
        setRoomData("roomType", room?.data?.room.roomType);
        setRoomData("description", room?.data?.room.description);
        setRoomData("features", room?.data?.room.features);
        setRoomData("maxGuests", room?.data?.room.maxGuests.toString());
        setRoomData("price", room?.data?.room.price);
        setFeaturesInput(room?.data?.room.features.join(", "));
      }
    } else {
      document.body.style.overflow = "unset";
      resetRoomData();
      setFeaturesInput("");
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, room, setRoomData, resetRoomData]);

  const handleFeaturesChange = (e) => {
    setFeaturesInput(e.target.value);
    const featuresArray = e.target.value
      .split(",")
      .map((feature) => feature.trim());
    setRoomData("features", featuresArray);
  };

  const handleRoomTypeChange = (value) => {
    setRoomData("roomType", value);
    const maxAllowed = maxGuestsMap[value] || 1;
    setRoomData("maxGuests", maxAllowed.toString());
    setIsSelectOpen(false);
  };

  const handleClose = () => {
    resetRoomData();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRoom(
      {
        roomId: roomId,
        roomData: roomData,
      },
      {
        onSettled: () => {
          resetRoomData();
          onClose();
        },
      }
    );
  };

  return (
    <section
      id="popup-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity / 100})` }}
    >
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/30 transition-all duration-300 flex flex-col max-h-[90vh]">
        {isPendingRoom || isUpdatePending ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Update Room Details
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  Manage your room information and settings
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Room Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 md:py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                      value={roomData.roomNumber}
                      onChange={(e) =>
                        setRoomData("roomNumber", e.target.value)
                      }
                    />
                  </div>

                  {/* Room Type */}
                  <div className="relative w-full col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Type
                    </label>
                    <div
                      className="w-full px-4 py-2 md:py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors text-gray-800 dark:text-white cursor-pointer"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      {roomData.roomType
                        ? roomData.roomType.charAt(0).toUpperCase() +
                          roomData.roomType.slice(1)
                        : "Select Room Type"}
                    </div>
                    {isSelectOpen && (
                      <ul className="z-50 absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        {options.map((option) => (
                          <li
                            key={option.value}
                            className="px-4 py-2 text-gray-800 dark:text-white cursor-pointer hover:bg-[#dfa379] hover:text-white transition-colors rounded-lg"
                            onClick={() => handleRoomTypeChange(option.value)}
                          >
                            {option.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Description
                    </label>
                    <textarea
                      className="w-full px-4 py-2 md:py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white min-h-[80px]"
                      value={roomData.description}
                      onChange={(e) =>
                        setRoomData("description", e.target.value)
                      }
                    ></textarea>
                  </div>

                  {/* Features */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Features
                    </label>
                    <textarea
                      className="w-full px-4 py-2 md:py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white min-h-[60px]"
                      value={featuresInput}
                      onChange={handleFeaturesChange}
                    ></textarea>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Separate features with commas.
                    </p>
                  </div>

                  {/* Room Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={
                        roomData.roomType ? maxGuestsMap[roomData.roomType] : 4
                      }
                      className="w-full px-4 py-2 md:py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                      value={roomData.maxGuests}
                      onChange={(e) => {
                        const value = Math.min(
                          Number(e.target.value),
                          maxGuestsMap[roomData.roomType] || 4
                        );
                        setRoomData("maxGuests", value.toString());
                      }}
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <span className="relative block">
                      <input
                        type="text"
                        className="w-full px-4 py-2 md:py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                        value={roomData.price}
                        onChange={(e) => setRoomData("price", e.target.value)}
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        USD
                      </span>
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="col-span-2 flex flex-col md:flex-row gap-4 mt-4">
                    <button
                      type="submit"
                      className="w-full md:flex-1 py-2.5 md:py-3.5 px-6 bg-gradient-to-r from-[#dfa379] to-[#c48960] hover:from-[#c48960] hover:to-[#a8734e] text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#dfa379] focus:ring-opacity-50"
                    >
                      Update Room
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full md:flex-1 py-2.5 md:py-3.5 px-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UpdateRoom;
