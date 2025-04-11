import React, { useState, useRef, useEffect } from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";

import Loading from "../Reusable/Loading";
import { modes } from "../../hooks/useServiceConfig";
import { useUpdateRoomStatus } from "./useUpdateRoomStatus";
import useAuthStore from "../../stores/AuthStore";

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

  if (isPending || !room) {
    return <Loading mode={modes.all} />;
  }

  return (
    <div
      className={`relative flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
        !isAdmin && isMaintenance ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative h-60 overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          src={`${IMAGE_URL}/${room.imageCover}`}
          alt={room.roomNumber}
        />
        {/* Dropdown Menu - Only show for admins */}
        {isAdmin && (
          <div ref={dropdownRef} className="absolute top-2 left-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1 text-white hover:bg-black/20 rounded-full transition-colors duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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

        <div
          className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(
            room.status
          )}`}
        >
          {room.status.toUpperCase()}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 bg-white flex flex-col flex-1">
        {/* Room Info */}
        <div className="mb-4 flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-gray-800">
              #{room.roomNumber}
            </h3>
            <div className="text-right">
              <p className="text-xl font-bold text-[#dfa974]">{room.price}$</p>
              <p className="text-sm text-gray-500">per night</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-gray-600 mb-4">
            <div>
              <p className="text-sm font-medium">Room Type</p>
              <p className="capitalize">{room.roomType.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Capacity</p>
              <p>{room.maxGuests} Guests</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {room.features.map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate(`/rooms/${room._id}`)}
          className="w-full mt-auto py-2 px-4 bg-gray-800 text-white rounded-lg font-medium
          hover:bg-[#dfa974] transition-colors duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default SingleRoomMenu;
