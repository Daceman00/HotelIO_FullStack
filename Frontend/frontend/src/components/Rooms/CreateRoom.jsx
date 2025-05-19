import React, { useEffect, useState, useRef } from "react";
import FileUploadInput from "../Reusable/FileUploadInput";
import { useCreateRoom } from "./useCreateRoom";
import useFormStore from "../../stores/FormStore";
import LoadingSpinner from "../Reusable/LoadingSpinner";

function CreateRoom({ isOpen, onClose, opacity }) {
  const { createRoom, isPending, error } = useCreateRoom();
  const { roomData } = useFormStore();
  const setRoomData = useFormStore((state) => state.setRoomData);
  const resetRoomData = useFormStore((state) => state.resetRoomData);
  const [featuresInput, setFeaturesInput] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const modalRef = useRef(null);

  const handleFeaturesChange = (e) => {
    setFeaturesInput(e.target.value);
    const featuresArray = e.target.value
      .split(",")
      .map((feature) => feature.trim())
      .filter((feature) => feature !== "");
    setRoomData("features", featuresArray);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  const handleRoomTypeChange = (value) => {
    setRoomData("roomType", value);

    // Automatically set max guests when room type changes
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
    createRoom(roomData, {
      onSettled: () => {
        resetRoomData();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity / 100})` }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-gray-900/30 transition-all duration-300 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {isPending ? (
          <div className="flex items-center justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 p-8">
              <div className="flex justify-center mb-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-[#dfa379] to-[#c48960] bg-clip-text text-transparent">
                  Add Room Details
                </h1>
              </div>
              <p className="text-gray-500 dark:text-gray-300 text-sm text-center mb-8">
                Manage your room information and settings
              </p>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="flex justify-center">
                  <FileUploadInput className="group relative h-24 w-24 md:h-32 md:w-32 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Room Number */}
                  <div className="group relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:border-[#dfa379] focus:ring-2 focus:ring-[#dfa379]/20 focus:outline-none transition-all duration-200 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                      value={roomData.roomNumber}
                      onChange={(e) =>
                        setRoomData("roomNumber", e.target.value)
                      }
                      placeholder="Enter room number"
                    />
                  </div>

                  {/* Room Type */}
                  <div className="relative w-full col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Type
                    </label>
                    <div
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:border-[#dfa379] focus:ring-2 focus:ring-[#dfa379]/20 focus:outline-none transition-all duration-200 shadow-sm text-gray-800 dark:text-white cursor-pointer flex items-center justify-between"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      <span>
                        {roomData.roomType
                          ? roomData.roomType.charAt(0).toUpperCase() +
                            roomData.roomType.slice(1)
                          : "Select Room Type"}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          isSelectOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>

                    {isSelectOpen && (
                      <ul className="z-50 absolute left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        {options.map((option) => (
                          <li
                            key={option.value}
                            className="px-5 py-3 text-gray-800 dark:text-white cursor-pointer hover:bg-[#dfa379]/10 transition-colors"
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
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:border-[#dfa379] focus:ring-2 focus:ring-[#dfa379]/20 focus:outline-none transition-all duration-200 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white min-h-[100px] resize-none"
                      value={roomData.description}
                      onChange={(e) =>
                        setRoomData("description", e.target.value)
                      }
                      placeholder="Describe the room amenities and features"
                    ></textarea>
                  </div>

                  {/* Features */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Features
                    </label>
                    <textarea
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:border-[#dfa379] focus:ring-2 focus:ring-[#dfa379]/20 focus:outline-none transition-all duration-200 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white min-h-[80px] resize-none"
                      value={featuresInput}
                      onChange={handleFeaturesChange}
                      placeholder="e.g. Air conditioning, Wi-Fi, Mini bar"
                    ></textarea>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      Separate features with commas
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
                      className="w-full px-5 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:border-[#dfa379] focus:ring-2 focus:ring-[#dfa379]/20 focus:outline-none transition-all duration-200 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                      value={roomData.maxGuests}
                      onChange={(e) => {
                        const value = Math.min(
                          Number(e.target.value),
                          maxGuestsMap[roomData.roomType] || 4
                        );
                        setRoomData("maxGuests", value.toString());
                      }}
                      placeholder="Maximum number of guests"
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">
                          $
                        </span>
                      </div>
                      <input
                        type="text"
                        className="w-full pl-10 pr-16 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:border-[#dfa379] focus:ring-2 focus:ring-[#dfa379]/20 focus:outline-none transition-all duration-200 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                        value={roomData.price}
                        onChange={(e) => setRoomData("price", e.target.value)}
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 pr-5">
                          USD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-xl mt-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>
                      {error?.message ||
                        "An error occurred while creating the room."}
                    </span>
                  </div>
                )}

                {/* Buttons */}
                <div className="col-span-2 flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-[#dfa379] to-[#c48960] hover:from-[#c48960] hover:to-[#a8734e] text-white font-semibold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#dfa379] focus:ring-opacity-50 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Create Room
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:flex-1 py-3.5 px-6 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateRoom;
