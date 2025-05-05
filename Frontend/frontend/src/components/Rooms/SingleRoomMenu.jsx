import React, { useState, useRef, useEffect } from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";
import { useUpdateRoomStatus } from "./useUpdateRoomStatus";
import useAuthStore from "../../stores/AuthStore";
import LoadingSpinner from "../Reusable/LoadingSpinner";

function SingleRoomMenu({ room }) {
  const { isAdmin } = useAuthStore();
  const { updateRoomStatus, error, isPending } = useUpdateRoomStatus(room._id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "maintenance", label: "Maintenance" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-[#dfa974]";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const isMaintenance = room.status.toLowerCase() === "maintenance";

  const handleStatusChange = (newStatus) => {
    updateRoomStatus(newStatus);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        !isAdmin && isMaintenance ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isPending || !room ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img
              src={`${IMAGE_URL}/${room.imageCover}`}
              alt={`Room ${room.roomNumber}`}
              className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
            />

            {/* Price Tag */}
            <div className="absolute bottom-0 left-0 bg-[#dfa974] text-white py-1 px-3 rounded-tr-lg font-medium">
              ${room.price}/night
            </div>

            {/* Status Badge */}
            <div
              className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(
                room.status
              )}`}
            >
              {room.status.toUpperCase()}
            </div>

            {/* Admin Dropdown Menu */}
            {isAdmin && (
              <div ref={dropdownRef} className="absolute top-3 left-3">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-300 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <span className="font-medium">Current Status: </span>
                        <span
                          className={`${getStatusColor(
                            room.status
                          )} px-2 py-1 rounded-full text-white text-xs`}
                        >
                          {room.status.toUpperCase()}
                        </span>
                      </div>
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleStatusChange(option.value)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                          ${
                            room.status.toLowerCase() === option.value
                              ? "bg-gray-50"
                              : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${getStatusColor(
                                option.value
                              )}`}
                            ></span>
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="p-6">
            {/* Room Info Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  Room #{room.roomNumber}
                </h3>
                <p className="text-sm capitalize text-gray-600">
                  {room.roomType.toLowerCase()} Room
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#dfa974]">
                  ${room.price}
                </p>
                <p className="text-xs text-gray-500">per night</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="flex items-center text-gray-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Up to {room.maxGuests} guests</span>
            </div>

            {/* Features */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {room.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => navigate(`/rooms/${room._id}`)}
              className="w-full py-2.5 px-4 bg-[#dfa974] text-white rounded-lg font-medium hover:bg-[#c99764] transition-colors duration-300 flex items-center justify-center"
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleRoomMenu;
