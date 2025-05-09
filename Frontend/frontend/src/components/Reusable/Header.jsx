import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsLoggedIn } from "../Auth/useAuth";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useAuthStore from "../../stores/AuthStore";

const Header = React.memo(function Header() {
  const { user, isPending } = useIsLoggedIn();
  const isUserLoggedIn = useAuthStore((state) => state.isUserLoggedIn);
  const setUserLoggedIn = useAuthStore((state) => state.setUserLoggedIn);

  useEffect(() => {
    setUserLoggedIn(!!user);
  }, [user, setUserLoggedIn]);

  return (
    <>
      <div>
        <header
          className=" sticky top-0 z-0 bg-white shadow-sm"
          style={{
            boxShadow: "0px 12px 15px rgba(36, 11, 12, 0.05)",
          }}
        >
          {/* Top Navigation */}
          <div className="top-nav bg-gray-100 border-b lg:flex lg:justify-between lg:items-center lg:px-16 lg:py-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-between items-center py-2 lg:py-0">
                {/* Left Section */}
                <ul className="flex space-x-6 text-gray-600 text-sm">
                  <li className="flex items-center">
                    <i className="fa fa-phone text-[#dfa974] mr-2"></i> (12) 345
                    67890
                  </li>
                  <li className="flex items-center">
                    <i className="fa fa-envelope text-[#dfa974] mr-2"></i>{" "}
                    info.colorlib@gmail.com
                  </li>
                </ul>

                {/* Center Section */}
                <span className="text-gray-700 text-lg font-bold">HotelIO</span>

                {/* Right Section */}
                <Link to="/rooms">
                  <div className="flex items-center space-x-6">
                    {/* Booking Button */}
                    <div className="px-6 py-2 text-white bg-[#dfa974] rounded font-semibold text-sm uppercase hover:bg-[#c68a5e]">
                      Booking Now
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <div className="menu-item bg-white shadow lg:flex lg:justify-between lg:items-center lg:px-8 lg:py-4">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-4 lg:py-0">
                {/* Logo */}
                <div className="logo">
                  <a href="./index.html">
                    <img src="img/logo.png" alt="Logo" className="h-8" />
                  </a>
                </div>

                {/* Navigation */}
                <nav className="mainmenu">
                  <ul className="flex space-x-8 text-gray-700 text-sm font-medium">
                    <li className="relative group">
                      <Link
                        to="/"
                        className="hover:text-[#dfa974] group-hover:after:opacity-100 after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-[#dfa974] after:opacity-0 after:transition-opacity"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/rooms" className="hover:text-[#dfa974]">
                        Rooms
                      </Link>
                    </li>
                    <li>
                      <a
                        href="./about-us.html"
                        className="hover:text-[#dfa974]"
                      >
                        About Us
                      </a>
                    </li>

                    <li>
                      <a href="./blog.html" className="hover:text-[#dfa974]">
                        News
                      </a>
                    </li>
                    <li>
                      <a href="./contact.html" className="hover:text-[#dfa974]">
                        Contact
                      </a>
                    </li>
                  </ul>
                </nav>

                <div className="inline-block relative"></div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
});

export default Header;
