import React from "react";
import useUIStore from "../../stores/UiStore";
import { useIsLoggedIn } from "./useAuth";
import { LoaderIcon } from "react-hot-toast";
import { useLogout } from "./useLogout";
import { Link } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";

function UserCard() {
  const { userCardVisible } = useUIStore();
  const { user, isLoading } = useIsLoggedIn();
  const { logout, isPending } = useLogout();
  const { isAdmin } = useAuthStore();

  if (isLoading) return <LoaderIcon />;

  return (
    <>
      {userCardVisible && (
        <div className="absolute right-0 z-10 mt-2 w-48 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
          <button
            type="button"
            className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 transition-colors duration-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-3 h-3 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            {user?.data.name}
          </button>
          <Link to="/updateAccount">
            <button
              type="button"
              className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"
                />
              </svg>
              Account
            </button>
          </Link>
          {isAdmin && (
            <>
              <Link to="/users">
                <button
                  type="button"
                  className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 18"
                    fill="currentColor"
                  >
                    <path d="M18 4H16V9C16 10.0609 15.5786 11.0783 14.8284 11.8284C14.0783 12.5786 13.0609 13 12 13H9L6.846 14.615C7.17993 14.8628 7.58418 14.9977 8 15H11.667L15.4 17.8C15.5731 17.9298 15.7836 18 16 18C16.2652 18 16.5196 17.8946 16.7071 17.7071C16.8946 17.5196 17 17.2652 17 17V15H18C18.5304 15 19.0391 14.7893 19.4142 14.4142C19.7893 14.0391 20 13.5304 20 13V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4Z" />
                    <path d="M12 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V9C0 9.53043 0.210714 10.0391 0.585786 10.4142C0.960859 10.7893 1.46957 11 2 11H3V13C3 13.1857 3.05171 13.3678 3.14935 13.5257C3.24698 13.6837 3.38668 13.8114 3.55279 13.8944C3.71889 13.9775 3.90484 14.0126 4.08981 13.996C4.27477 13.9793 4.45143 13.9114 4.6 13.8L8.333 11H12C12.5304 11 13.0391 10.7893 13.4142 10.4142C13.7893 10.0391 14 9.53043 14 9V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0Z" />
                  </svg>
                  Users
                </button>
              </Link>
              <Link>
                <button
                  type="button"
                  className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 me-2.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                    <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                  </svg>
                  Rooms
                </button>
              </Link>
              <Link>
                <button
                  type="button"
                  className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 me-2.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M14.5 1h-2V0h-5v1h-2A2.5 2.5 0 0 0 3 3.5v14A2.5 2.5 0 0 0 5.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-14A2.5 2.5 0 0 0 14.5 1ZM4 6h12v8H4V6ZM5.5 2h2v1h5V2h2A1.5 1.5 0 0 1 16 3.5V5H4V3.5A1.5 1.5 0 0 1 5.5 2ZM14.5 19h-9A1.5 1.5 0 0 1 4 17.5V15h12v2.5a1.5 1.5 0 0 1-1.5 1.5Z" />
                  </svg>
                  Bookings
                </button>
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={logout}
            className="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-200 hover:text-red-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3 h-3 me-2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3H6.75A2.25 2.25 0 0 0 4.5 5.25v13.5A2.25 2.25 0 0 0 6.75 21h6.75a2.25 2.25 0 0 0 2.25-2.25V15M18 9l3 3m0 0-3 3m3-3H9"
              />
            </svg>
            {isPending ? "Signing out..." : "Sign out"}
          </button>
        </div>
      )}
    </>
  );
}

export default UserCard;
