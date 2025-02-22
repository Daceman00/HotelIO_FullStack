import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDoorOpen,
  faCogs,
  faFolderOpen,
  faClipboard,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import useUIStore from "../../stores/UiStore";
import { useIsLoggedIn } from "../Auth/useAuth";
import useAuthStore from "../../stores/AuthStore";
import { useLogout } from "../Auth/useLogout";
import { IMAGE_URL_USERS } from "../../helpers/imageURL";

const Sidebar = React.memo(function Sidebar() {
  const { user } = useIsLoggedIn();
  const { logout } = useLogout();

  const { sidebarVisible } = useUIStore();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const { isAdmin } = useAuthStore();
  const { isUserLoggedIn } = useAuthStore();

  console.log(`${IMAGE_URL_USERS}/${user?.data.photo}`);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-transform duration-300 ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="p-6 text-center ">
          {/* User Info */}
          <img
            src={`${IMAGE_URL_USERS}/${user?.data.photo}`}
            alt="User Avatar"
            className="w-24 h-24 mx-auto rounded-full border-4 border-[#dfa974]"
          />
          <h3 className="text-xl font-semibold mt-4">{user?.data.name}</h3>
          <p className="text-sm text-[#dfa974]">{isAdmin ? "Admin" : ""}</p>
        </div>

        {/* Menu Items */}
        <ul className="mt-6 space-y-4 px-4">
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

          <Link to="/bookings">
            <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
              <FontAwesomeIcon icon={faFolderOpen} className="w-6" />
              <span className="ml-4">Bookings</span>
            </li>
          </Link>

          {isAdmin && (
            <>
              <hr className="border-gray-700 my-4" />

              <Link to="/stats">
                <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                  <FontAwesomeIcon icon={faChartLine} className="w-6" />
                  <span className="ml-4">Stats</span>
                </li>
              </Link>

              <Link to="/users">
                <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                  <FontAwesomeIcon icon={faUser} className="w-6" />
                  <span className="ml-4">Users</span>
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

          {isUserLoggedIn && (
            <Link>
              <li className="block py-2 px-4 rounded-lg hover:bg-[#dfa974] transition">
                <button onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-6" />
                  <span className="ml-4">Logout</span>
                </button>
              </li>
            </Link>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarVisible ? "ml-64" : "ml-0"
        }`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-[#dfa974] text-white px-4 py-2 rounded-lg focus:outline-none shadow-lg"
        >
          ☰
        </button>
      </div>
    </div>
  );
});

export default Sidebar;
