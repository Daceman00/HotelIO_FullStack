import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDoorOpen,
  faCogs,
  faFolderOpen,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import useUIStore from "../../stores/UiStore";

function Sidebar() {
  const { sidebarVisible } = useUIStore();

  return (
    <div
      className={`h-screen transition-all duration-300 ${
        sidebarVisible ? "w-64" : "hidden"
      } min-h-full bg-gradient-to-b from-emerald-500 to-teal-600 rounded-r-lg shadow-lg`}
    >
      <div className="p-4 animate-fadeInLeft">
        <h1 className="text-white text-2xl font-bold mb-6">Hotel.IO</h1>
        <ul className="space-y-4 text-white border-t-2 border-gray-300 pt-4">
          <Link to="/dashboard">
            <li className="flex items-center font-bold p-2 rounded hover:bg-emerald-700 transition-colors duration-200">
              <FontAwesomeIcon icon={faClipboard} className="w-6" />
              <span className="ml-4">Dashboard</span>
            </li>
          </Link>

          <Link to="/rooms">
            <li className="flex items-center font-bold p-2 rounded hover:bg-emerald-700 transition-colors duration-200">
              <FontAwesomeIcon icon={faDoorOpen} className="w-6" />
              <span className="ml-4">Rooms</span>
            </li>
          </Link>

          <Link to="/bookings">
            <li className="flex items-center font-bold p-2 rounded hover:bg-emerald-700 transition-colors duration-200">
              <FontAwesomeIcon icon={faFolderOpen} className="w-6" />
              <span className="ml-4">Bookings</span>
            </li>
          </Link>

          <Link to="/stats">
            <li className="flex items-center font-bold p-2 rounded hover:bg-emerald-700 transition-colors duration-200">
              <FontAwesomeIcon icon={faChartLine} className="w-6" />
              <span className="ml-4">Stats</span>
            </li>
          </Link>

          <Link to="/settings">
            <li className="flex items-center font-bold p-2 rounded hover:bg-emerald-700 transition-colors duration-200">
              <FontAwesomeIcon icon={faCogs} className="w-6" />
              <span className="ml-4">Settings</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
