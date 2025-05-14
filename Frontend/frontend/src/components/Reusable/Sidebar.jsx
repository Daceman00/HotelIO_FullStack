import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDoorOpen,
  faCogs,
  faFolderOpen,
  faClipboard,
  faUser,
  faSignOutAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import useUIStore from "../../stores/UiStore";
import { useIsLoggedIn } from "../Auth/useAuth";
import useAuthStore from "../../stores/AuthStore";
import { useLogout } from "../Auth/useLogout";
import { IMAGE_URL_USERS } from "../../helpers/imageURL";

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
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-transform duration-300 ${
            sidebarVisible ? "translate-x-0" : "-translate-x-full"
          } w-64 z-0`}
        >
          <div className="p-6 text-center ">
            {/* User Info */}
            {isUserLoggedIn && user ? (
              <>
                <img
                  src={`${IMAGE_URL_USERS}/${user?.data?.photo}`}
                  alt="User Avatar"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-[#dfa974]"
                />
                <h3 className="text-xl font-semibold mt-4">
                  {user?.data?.name}
                </h3>
                <p className="text-sm text-[#dfa974]">
                  {isAdmin ? "Admin" : ""}
                </p>
              </>
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-800 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-3xl text-gray-400"
                />
              </div>
            )}
          </div>

          {/* Menu Items */}
          <ul className="mt-6 space-y-4 px-4">
            {isUserLoggedIn && (
              <>
                <Link to="/updateAccount">
                  <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                    <FontAwesomeIcon icon={faUser} className="w-6" />
                    <span className="ml-4">My Account</span>
                  </li>
                </Link>
                <Link to="/bookings">
                  <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                    <FontAwesomeIcon icon={faFolderOpen} className="w-6" />
                    <span className="ml-4">Bookings</span>
                  </li>
                </Link>
              </>
            )}

            <Link to="/dashboard">
              <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                <FontAwesomeIcon icon={faClipboard} className="w-6" />
                <span className="ml-4">Home</span>
              </li>
            </Link>

            <Link to="/rooms">
              <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                <FontAwesomeIcon icon={faDoorOpen} className="w-6" />
                <span className="ml-4">Rooms</span>
              </li>
            </Link>

            {isAdmin && (
              <>
                <hr className="border-gray-700 my-4" />
                <Link to="/users">
                  <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                    <FontAwesomeIcon icon={faUsers} className="w-6" />
                    <span className="ml-4">Users</span>
                  </li>
                </Link>

                <Link to="/stats">
                  <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                    <FontAwesomeIcon icon={faChartLine} className="w-6" />
                    <span className="ml-4">Statistics</span>
                  </li>
                </Link>

                <Link to="/settings">
                  <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                    <FontAwesomeIcon icon={faCogs} className="w-6" />
                    <span className="ml-4">Settings</span>
                  </li>
                </Link>
              </>
            )}

            <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
              {isUserLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-6" />
                  <span className="ml-4">Logout</span>
                </button>
              ) : (
                <button
                  className="block py-2 px-4 rounded-lg bg-gray-800 text-gray-400"
                  onClick={handleRedirect}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-6" />
                  <span className="ml-4">Login Available</span>
                </button>
              )}
            </li>
          </ul>
        </div>

        {/* Toggle button */}

        <button
          onClick={toggleSidebar}
          className="fixed top-12 left-4 z-[60] bg-[#dfa974] text-white px-4 py-2 rounded-lg focus:outline-none shadow-lg hover:bg-[#c5915f] transition"
        >
          ☰
        </button>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarVisible ? "ml-64" : "ml-0"
          }`}
        ></div>
      </div>
    </>
  );
});

export default Sidebar;
