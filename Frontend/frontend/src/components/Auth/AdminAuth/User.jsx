import React from "react";
import { useDeleteUser } from "./useDeleteUser";
import WarningButton from "../../Reusable/WarningButton";
import useUIStore from "../../../stores/UiStore";
import Modal from "../../Reusable/Modal";
import { IMAGE_URL_USERS } from "../../../helpers/imageURL";
import { UserIcon } from "@heroicons/react/24/outline";

function User({ user }) {
  const { deleteUser, error, isPending } = useDeleteUser();
  const { isModalOpen, selectedId } = useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);

  const handleConfirmModal = () => {
    onModalClose();
  };

  return (
    <>
      {isModalOpen && selectedId === user.id ? (
        <Modal
          action={deleteUser}
          id={selectedId}
          isOpen={isModalOpen}
          onClose={onModalClose}
          title={"Are you sure you want permanently delete this user?"}
          description={"If you delete this user, it will lose all his data!"}
          onConfirm={handleConfirmModal}
          isPending={isPending}
          opacity="10"
        />
      ) : null}

      {/* User Row - removed tbody wrapper */}
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
        {/* Name Column - matches w-2/5 from header */}
        <td className="w-2/5 px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user?.photo ? (
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={`${IMAGE_URL_USERS}/${user.photo}`}
                  alt="User Avatar"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </div>
            </div>
          </div>
        </td>

        {/* Role Column - matches w-1/5 from header */}
        <td className="w-1/5 px-6 py-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {user.role.toUpperCase()}
          </span>
        </td>

        {/* Status Column - matches w-1/5 from header */}
        <td className="w-1/5 px-6 py-4">
          <div className="flex items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full mr-2 ${
                user.active ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                user.active
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {user.active ? "Active" : "Not active"}
            </span>
          </div>
        </td>

        {/* Actions Column - matches w-1/5 from header */}
        <td className="w-1/5 px-6 py-4">
          <WarningButton onClick={() => onModalOpen(user.id)}>
            Delete
          </WarningButton>
        </td>
      </tr>
    </>
  );
}

export default User;
