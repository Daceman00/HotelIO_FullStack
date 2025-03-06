import React, { useEffect, useState } from "react";
import FileUploadInput from "../Reusable/FileUploadInput";
import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import { useCreateRoom } from "./useCreateRoom";
import useFormStore from "../../stores/FormStore";

function CreateRoom({ isOpen, onClose, opacity }) {
  const { createRoom, isPending, error } = useCreateRoom();

  const { roomData } = useFormStore();
  const setRoomData = useFormStore((state) => state.setRoomData);
  const [featuresInput, setFeaturesInput] = useState("");

  const handleFeaturesChange = (e) => {
    setFeaturesInput(e.target.value);
    const featuresArray = e.target.value
      .split(",")
      .map((feature) => feature.trim());
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom(roomData);
  };

  return (
    <section
      id="popup-modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity / 100})` }}
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl dark:shadow-gray-900/30 transition-all duration-300">
        {false ? (
          <Loading mode={modes.all} />
        ) : (
          <div className="w-full">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Update Room Details
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                  Manage your room information and settings
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <FileUploadInput className="group relative h-32 w-32 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                    value={roomData.roomNumber}
                    onChange={(e) => setRoomData("roomNumber", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Capacity
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                    value={roomData.maxGuests}
                    onChange={(e) => setRoomData("maxGuests", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                    rows="2"
                    value={roomData.description}
                    onChange={(e) => setRoomData("description", e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Features
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                    rows="1"
                    value={featuresInput}
                    onChange={handleFeaturesChange}
                  ></textarea>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Separate features with commas.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price
                  </label>
                  <span className="relative block">
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[#dfa379] focus:outline-none transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-white"
                      value={roomData.price}
                      onChange={(e) => setRoomData("price", e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      USD
                    </span>
                  </span>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 px-6 bg-gradient-to-r from-[#dfa379] to-[#c48960] hover:from-[#c48960] hover:to-[#a8734e] text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#dfa379] focus:ring-opacity-50"
                  >
                    Create Room
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3.5 px-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CreateRoom;
