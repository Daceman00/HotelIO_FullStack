import React from "react";
import { useDeleteUser } from "./useDeleteUser";
import WarningButton from "../../Reusable/WarningButton";
import useUIStore from "../../../stores/UiStore";
import Modal from "../../Reusable/Modal";
import { UserIcon } from "@heroicons/react/24/outline";
import { useChangeRole } from "./useChangeRole";
import ChangeRole from "./ChangeRole";
import CRMDetailsModal from "../../CRM/CRMDetailsModal";

function User({ user }) {
  const { deleteUser, error, isPending } = useDeleteUser();
  const { isCrmModalOpen, selectedCrmId } = useUIStore();
  const { isModalOpen, selectedId, onCrmModalClose, onCrmModalOpen } =
    useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);
  const {
    changeRole,
    isPending: isPendingRoleChange,
    error: isErrorRoleChange,
  } = useChangeRole();

  const handleConfirmModal = () => {
    onModalClose();
  };

  const handleRoleChange = (newRole) => {
    if (newRole !== user.role) {
      changeRole({
        userID: user.id,
        role: newRole,
      });
    }
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

      {isCrmModalOpen && selectedCrmId === user.crm?.[0]?._id && (
        <CRMDetailsModal
          crmId={user.crm?.[0]?._id}
          isOpen={isCrmModalOpen}
          onClose={onCrmModalClose}
        />
      )}

      {/* User Row - removed tbody wrapper */}
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
        {/* Name Column - matches w-2/5 from header */}
        <td className="w-2/5 px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user?.photo ? (
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={user.photo}
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

        {/* Role Column with Dropdown */}
        <td className="w-1/5 px-6 py-4">
          <ChangeRole
            currentRole={user.role}
            onRoleChange={handleRoleChange}
            disabled={isPending || isPendingRoleChange}
          />
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
        {/* CRM Info Column */}
        <td className="w-1/6 px-6 py-4">
          <button
            onClick={() => onCrmModalOpen(user.crm?.[0]?._id)}
            disabled={!user.crm?.[0]?._id}
            className="disabled:cursor-not-allowed disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md active:translate-y-0.5 inline-flex items-center justify-center"
            style={{ backgroundColor: "#4f89d8" }}
            title="View CRM Details"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-medium">View CRM</span>
          </button>
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
