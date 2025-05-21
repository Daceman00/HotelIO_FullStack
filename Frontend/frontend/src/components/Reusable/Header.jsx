import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useIsLoggedIn } from "../Auth/useAuth";
import useAuthStore from "../../stores/AuthStore";
import useUIStore from "../../stores/UiStore";
import Logo from "./Logo";

const Header = React.memo(function Header() {
  const { user, isPending } = useIsLoggedIn();
  const setUserLoggedIn = useAuthStore((state) => state.setUserLoggedIn);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUserLoggedIn(!!user);
  }, [user, setUserLoggedIn]);

  return (
    <div className="sticky top-0 z-50 bg-white">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-wrap justify-between items-center py-2">
            {/* Contact Info */}
            <ul className="flex flex-wrap items-center space-x-6 text-gray-600 text-sm">
              <li className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-amber-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>(12) 345 67890</span>
              </li>
              <li className="hidden sm:flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-amber-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@hotelio.com</span>
              </li>
            </ul>

            {/* Logo for small screens */}
            <span className="md:hidden text-gray-800 text-lg font-bold font-serif tracking-tight">
              HotelIO
            </span>

            {/* Social Media Icons */}
            <div className="hidden sm:flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-amber-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-amber-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-amber-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="relative text-gray-800 hover:text-amber-600 font-medium text-sm py-2 transition-colors duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-amber-600 after:transition-all"
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className="relative text-gray-800 hover:text-amber-600 font-medium text-sm py-2 transition-colors duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-amber-600 after:transition-all"
              >
                Rooms
              </Link>
              <Link
                to="/about"
                className="relative text-gray-800 hover:text-amber-600 font-medium text-sm py-2 transition-colors duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-amber-600 after:transition-all"
              >
                About Us
              </Link>
              <Link
                to="/news"
                className="relative text-gray-800 hover:text-amber-600 font-medium text-sm py-2 transition-colors duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-amber-600 after:transition-all"
              >
                News
              </Link>
              <Link
                to="/contact"
                className="relative text-gray-800 hover:text-amber-600 font-medium text-sm py-2 transition-colors duration-300 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-amber-600 after:transition-all"
              >
                Contact
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                to="/rooms"
                className="px-6 py-2.5 bg-amber-600 text-white rounded-md font-medium text-sm uppercase tracking-wider hover:bg-amber-700 transition-colors duration-300 shadow-sm hover:shadow"
              >
                Book Now
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="py-3 space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-800 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className="block px-4 py-2 text-gray-800 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Rooms
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-800 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/news"
                className="block px-4 py-2 text-gray-800 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-800 hover:bg-amber-50 hover:text-amber-600 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-4 py-3 border-t border-gray-200">
                <Link
                  to="/rooms"
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-md font-medium text-sm uppercase tracking-wider hover:bg-amber-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Header;
