import React, { useEffect, useRef } from "react";
import useUIStore from "../../stores/UiStore";
import { useIsLoggedIn } from "./useAuth";
import { LoaderIcon } from "react-hot-toast";
import { useLogout } from "./useLogout";
import { Link } from "react-router-dom";

function UserCard() {
  const { userCardVisible } = useUIStore();
  const { user, isLoading } = useIsLoggedIn();
  const { logout } = useLogout();

  if (isLoading) return <LoaderIcon />;

  return (
    <>
      {userCardVisible ? (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                {user?.data.name}
              </button>
            </li>
            <li>
              <Link to="/updateAccount">
                <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  Account
                </button>
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default UserCard;
