import React from "react";
import useUIStore from "../../stores/UiStore";

function UserCard() {
  const { userCardVisible } = useUIStore();
  return (
    <>
      {userCardVisible && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                Account
              </button>
            </li>
            <li>
              <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default UserCard;
