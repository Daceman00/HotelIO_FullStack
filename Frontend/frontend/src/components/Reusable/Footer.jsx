import React from "react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const exploreLinks = [
  { name: "Our Properties", url: "#properties" },
  { name: "Rooms & Suites", url: "/rooms" },
  { name: "Experiences", url: "/dashboard#reviews" },
  { name: "About Us", url: "/about" },
];

const socialLinks = [
  { icon: "instagram", label: "Instagram" },
  { icon: "twitter", label: "Twitter" },
  { icon: "linkedin", label: "LinkedIn" },
];

const Footer = React.memo(function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 to-gray-900 text-gray-300 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-6">
            <Logo light />
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Redefining luxury hospitality across the globe. Exceptional stays,
              unforgettable experiences.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10 transition-all duration-300"
                >
                  <i className={`fab fa-${social.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.url}
                    className="group flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-amber-400 transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
              Stay Connected
            </h3>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-white font-semibold text-sm shadow-lg shadow-amber-900/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Sign up for special offers and exclusive updates.
              </p>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} HotelIO. All rights reserved.
            </p>
            <ul className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              {["Privacy", "Terms", "Sitemap"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-amber-400 transition-colors duration-200">
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
