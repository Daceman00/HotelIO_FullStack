import React from "react";
import { useDeleteUser } from "./useDeleteUser";
import WarningButton from "../../Reusable/WarningButton";
import useUIStore from "../../../stores/UiStore";
import Modal from "../../Reusable/Modal";

function User({ user }) {
  const { deleteUser, error, isPending } = useDeleteUser();
  const { isModalOpen } = useUIStore();
  const onModalOpen = useUIStore((state) => state.onModalOpen);
  const onModalClose = useUIStore((state) => state.onModalClose);

  const handleConfirmModal = () => {
    onModalClose();
  };

  return (
    <>
      {isModalOpen ? (
        <Modal
          action={deleteUser}
          userId={user.id}
          isOpen={isModalOpen}
          onClose={onModalClose}
          title={"Are you sure you want permanently delete this user?"}
          description={"If you delete this user, it will lose all his data!"}
          onConfirm={handleConfirmModal}
          isPending={isPending}
          opacity="30"
        />
      ) : null}
      <tbody>
        {/* User Row */}
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ">
          <th
            scope="row"
            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
          >
            <img
              className="w-10 h-10 rounded-full"
              src="/docs/images/people/profile-picture-1.jpg"
              alt="profile-photo"
            />
            <div className="ps-3">
              <div className="text-base font-semibold">{user.name}</div>
              <div className="font-normal text-gray-500">{user.email}</div>
            </div>
          </th>
          <td className="px-6 py-4">{user.role.toUpperCase()}</td>
          <td className="px-6 py-4">
            <div className="flex items-center">
              <div
                className={`h-2.5 w-2.5 rounded-full me-2 ${
                  user.active ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              {user.active ? "Active" : "Not active"}
            </div>
          </td>
          <td className="px-6 py-4">
            <WarningButton onClick={onModalOpen} />
          </td>
        </tr>
      </tbody>
    </>
  );
}

export default User;
