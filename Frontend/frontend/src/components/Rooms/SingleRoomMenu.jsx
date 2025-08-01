import React, { useState, useRef, useEffect } from "react";
import { IMAGE_URL } from "../../helpers/imageURL";
import { useNavigate } from "react-router-dom";
import { useUpdateRoomStatus } from "./useUpdateRoomStatus";
import useAuthStore from "../../stores/AuthStore";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import { useDeleteRoom } from "./useDeleteRoom";
import Modal from "../Reusable/Modal";
import useUIStore from "../../stores/UiStore";

function SingleRoomMenu({ room }) {
  const { isAdmin } = useAuthStore();
  const { updateRoomStatus, error, isPending } = useUpdateRoomStatus(room._id);
  const {
    deleteRoom,
    error: deleteError,
    isPending: isDeletePending,
  } = useDeleteRoom();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isDeleteRoomModalOpen = useUIStore(
    (state) => state.isDeleteRoomModalOpen
  );
  const onDeleteRoomModalOpen = useUIStore(
    (state) => state.onDeleteRoomModalOpen
  );
  const onDeleteRoomModalClose = useUIStore(
    (state) => state.onDeleteRoomModalClose
  );
  const selectedRoomId = useUIStore((state) => state.selectedRoomId);

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
        return "bg-amber-500";
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

  const handleConfirmModal = () => {
    onDeleteRoomModalClose();
  };

  return (
    <>
      {/* Add Modal component */}
      {isAdmin && isDeleteRoomModalOpen && selectedRoomId === room.id && (
        <Modal
          isOpen={isDeleteRoomModalOpen}
          action={deleteRoom}
          id={selectedRoomId}
          onClose={onDeleteRoomModalClose}
          title="Delete Room"
          description={`Are you sure you want to delete Room #${room.roomNumber}? This action cannot be undone.`}
          onConfirm={handleConfirmModal}
          confirmText="Yes, delete room"
          cancelText="No, keep room"
          isPending={isDeletePending}
          opacity={75}
        />
      )}

      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
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
                src={room.imageCover}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
              />

              {/* Price Tag */}
              <div className="absolute bottom-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 text-white py-1 px-3 rounded-tr-lg font-medium">
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
                        <div className="border-t">
                          <button
                            onClick={() => onDeleteRoomModalOpen(room.id)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete Room
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-6">
              {/* Room Info Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Room #{room.roomNumber}
                  </h3>
                  <p className="text-sm capitalize text-gray-600">
                    {room.roomType.toLowerCase()} Room
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-amber-500">
                    ${room.price}
                  </p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-center text-gray-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-amber-400"
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
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Details Button */}
              <button
                onClick={() => navigate(`/rooms/${room._id}`)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-500 transition-colors duration-300 flex items-center justify-center shadow-sm"
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
    </>
  );
}

export default SingleRoomMenu;
