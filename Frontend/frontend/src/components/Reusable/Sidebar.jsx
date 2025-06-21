import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDoorOpen,
  faFolderOpen,
  faClipboard,
  faUser,
  faSignOutAlt,
  faUsers,
  faHome,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import useUIStore from "../../stores/UiStore";
import { useIsLoggedIn } from "../Auth/useAuth";
import useAuthStore from "../../stores/AuthStore";
import { useLogout } from "../Auth/useLogout";
import { IMAGE_URL_USERS } from "../../helpers/imageURL";
import { UserIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";

const Sidebar = React.memo(function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isPending: isAuthPending } = useIsLoggedIn();
  const { logout } = useLogout();
  const { sidebarVisible, toggleSidebar } = useUIStore();
  const { isAdmin, isUserLoggedIn, logout: zustandLogout } = useAuthStore();

  useEffect(() => {
    if (user) {
      useAuthStore.getState().setUserLoggedIn(true);
      useAuthStore.getState().setRole(user?.data?.role);
    }
  }, [user]);

  // Secure logout handler
  const handleLogout = () => {
    logout({ skipToast: false }); // Use the enhanced logout hook
    zustandLogout(); // Clear Zustand state
  };

  const handleRedirect = () => {
    if (location.pathname === "/dashboard") {
      const section = document.getElementById("dashboard");
      section?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gradient-to-r from-amber-600 to-amber-400"
      : "";
  };

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-950 text-white shadow-xl transition-transform duration-300 ${
            sidebarVisible ? "translate-x-0" : "-translate-x-full"
          } w-72 z-30`}
        >
          {/* Brand */}
          <div className="p-6 mb-4 border-b border-gray-800">
            <div className="flex items-center justify-center">
              <Logo />
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-3 text-center">
            {isUserLoggedIn && user ? (
              <>
                <div className="relative inline-block">
                  {user?.data?.photo ? (
                    <img
                      src={user.data.photo}
                      alt="User Avatar"
                      className="w-20 h-20 mx-auto rounded-full border-2 border-[#dfa379] object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#dfa379] bg-gray-800 flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-950"></div>
                </div>
                <h3 className="text-lg font-medium mt-3 text-white">
                  {user?.data?.name}
                </h3>
                <p className="text-xs text-[#dfa379] uppercase tracking-wider font-semibold">
                  {isAdmin ? "Administrator" : "Guest"}
                </p>
              </>
            ) : (
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-2xl text-gray-400"
                />
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="px-3 py-4">
            <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-4 mb-2">
              Navigation
            </div>
            <nav className="space-y-1">
              <Link to="/dashboard">
                <div
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 ${isActive(
                    "/dashboard"
                  )}`}
                >
                  <FontAwesomeIcon
                    icon={faHome}
                    className="w-5 h-5 text-indigo-400"
                  />
                  <span className="ml-3 text-sm font-medium">Home</span>
                </div>
              </Link>

              <Link to="/rooms">
                <div
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 ${isActive(
                    "/rooms"
                  )}`}
                >
                  <FontAwesomeIcon
                    icon={faDoorOpen}
                    className="w-5 h-5 text-indigo-400"
                  />
                  <span className="ml-3 text-sm font-medium">Rooms</span>
                </div>
              </Link>

              {isUserLoggedIn && (
                <>
                  <Link to="/updateAccount">
                    <div
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 ${isActive(
                        "/updateAccount"
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-5 h-5 text-indigo-400"
                      />
                      <span className="ml-3 text-sm font-medium">
                        My Account
                      </span>
                    </div>
                  </Link>

                  <Link to="/bookings">
                    <div
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 ${isActive(
                        "/bookings"
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={faFolderOpen}
                        className="w-5 h-5 text-indigo-400"
                      />
                      <span className="ml-3 text-sm font-medium">Bookings</span>
                    </div>
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="pt-2 pb-2">
                    <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider px-4 mb-2">
                      Admin Controls
                    </div>
                  </div>

                  <Link to="/users">
                    <div
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 ${isActive(
                        "/users"
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="w-5 h-5 text-indigo-400"
                      />
                      <span className="ml-3 text-sm font-medium">Users</span>
                    </div>
                  </Link>

                  <Link to="/stats">
                    <div
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 ${isActive(
                        "/stats"
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={faChartLine}
                        className="w-5 h-5 text-indigo-400"
                      />
                      <span className="ml-3 text-sm font-medium">
                        Statistics
                      </span>
                    </div>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* User actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            {isUserLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="w-5 h-5 text-[#dfa379]"
                />
                <span className="ml-3">Logout</span>
              </button>
            ) : (
              <button
                onClick={handleRedirect}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-400 hover:from-amber-700 hover:to-amber-500 rounded-lg text-sm font-medium transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                <span className="ml-3">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-[60] bg-[#dfa379] hover:bg-[#c98b62] text-white p-3 rounded-lg focus:outline-none transition-colors shadow-lg"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarVisible ? "ml-72" : "ml-0"
          }`}
        ></div>
      </div>
    </>
  );
});

export default Sidebar;
