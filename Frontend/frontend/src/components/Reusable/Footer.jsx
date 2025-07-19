import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Footer = React.memo(function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Logo />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Redefining luxury hospitality across the globe. Exceptional stays,
              unforgettable experiences.
            </p>
            <div className="flex space-x-5">
              {[
                { icon: "instagram", label: "Instagram" },
                { icon: "twitter", label: "Twitter" },
                { icon: "linkedin", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  aria-label={social.label}
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <i className={`fab fa-${social.icon} text-xl`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Explore</h3>
            <ul className="space-y-4 text-gray-400">
              {[
                { name: "Our Properties", url: "#properties" },
                { name: "Rooms & Suites", url: "/rooms" },
                { name: "Experiences", url: "/dashboard#reviews" },
                { name: "About Us", url: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  {link.action ? (
                    <button
                      onClick={link.action}
                      className="hover:text-indigo-400 transition-colors flex items-center group"
                    >
                      <span className="transform transition-transform group-hover:translate-x-1">
                        {link.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={link.url}
                      className="hover:text-indigo-400 transition-colors flex items-center group"
                    >
                      <span className="transform transition-transform group-hover:translate-x-1">
                        {link.name}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <div className="flex flex-col space-y-4">
              <form className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-lg bg-gray-900 px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#dfa379] px-5 py-3 text-white transition-colors md:whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-gray-500">
                Sign up for our newsletter to receive special offers and updates
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-500 md:text-left">
              © {new Date().getFullYear()} HotelIO. All rights reserved.
            </p>
            <ul className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              {["Privacy", "Terms", "Sitemap"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
