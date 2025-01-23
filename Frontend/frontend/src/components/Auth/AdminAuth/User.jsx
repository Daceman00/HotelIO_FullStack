import React from "react";
import { useDeleteUser } from "./useDeleteUser";

function User({ user }) {
  const { deleteUser, error, isPending } = useDeleteUser();

  return (
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
          <button
            disabled={isPending}
            onClick={() => deleteUser(user.id)}
            className="font-medium text-red-600 dark:text-red-500 hover:underline"
          >
            Delete User
          </button>
        </td>
      </tr>
    </tbody>
  );
}

export default User;
