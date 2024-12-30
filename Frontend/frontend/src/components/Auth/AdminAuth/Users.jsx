import React from "react";
import { useUsers } from "./useUsers";
import Loading from "../../Reusable/Loading";
import User from "./User";
import Search from "../../Reusable/Search";
import useUIStore from "../../../stores/UiStore";

function Users() {
  const { users, isPending, error } = useUsers();
  const { searchQuery } = useUIStore();
  const setSearchQuery = useUIStore((state) => state.setSearchQuery);

  if (isPending) return <Loading />;

  if (!users || error) return <p>No users found</p>;
  console.log(users?.data);
  const searchedUsers = users?.data.filter((user) =>
    searchQuery.length >= 3
      ? user.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false
  );
  return (
    <div className="p-6 relative overflow-x-auto shadow-md sm:rounded-lg">
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        {searchQuery.length >= 3 ? (
          searchedUsers.length > 0 ? (
            searchedUsers.map((user) => <User key={user._id} user={user} />)
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                No users found
              </td>
            </tr>
          )
        ) : (
          users?.data?.map((user) => <User key={user._id} user={user} />)
        )}
      </table>
    </div>
  );
}

export default Users;
