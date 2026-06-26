import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useIsLoggedIn } from "../Auth/useAuth";
import useAuthStore from "../../stores/AuthStore";
import Logo from "./Logo";
import { NotificationBell } from "../Notifications/NotificationBell";

const navLinks = [
  { to: "/dashboard", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/about", label: "About Us" },
];

const Header = React.memo(function Header() {
  const { user } = useIsLoggedIn();
  const setUserLoggedIn = useAuthStore((state) => state.setUserLoggedIn);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setUserLoggedIn(!!user);
  }, [user, setUserLoggedIn]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top info strip */}
      <div className="bg-gray-950 text-gray-400 text-xs">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-wrap justify-between items-center py-2 gap-2">
            <ul className="flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>(12) 345 67890</span>
              </li>
              <li className="hidden sm:flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@hotelio.com</span>
              </li>
            </ul>

            <div className="hidden sm:flex items-center gap-3">
              {["twitter", "facebook", "instagram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-500 hover:text-amber-400 transition-colors duration-200"
                  aria-label={social}
                >
                  <i className={`fab fa-${social} text-xs`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm shadow-gray-900/5">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16">
            <Logo />

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    isActive(link.to)
                      ? "text-amber-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <NotificationBell />
              <Link
                to="/rooms"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-sm shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Book Now
              </Link>
            </div>

            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-amber-50 text-amber-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-100 flex items-center gap-3">
                <NotificationBell />
                <Link
                  to="/rooms"
                  className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-sm shadow-md"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Header;
