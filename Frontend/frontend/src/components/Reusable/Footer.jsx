import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";

const Footer = React.memo(function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <a href="#" className="inline-block">
              <img
                src="img/footer-logo.png"
                alt="Logo"
                className="h-12 transition-opacity hover:opacity-80"
              />
            </a>
            <p className="text-gray-400 leading-relaxed">
              We inspire and reach millions of travelers
              <br className="hidden lg:block" /> across 90 local websites.
            </p>
            <div className="flex space-x-4">
              {["facebook", "twitter", "instagram", "linkedin"].map(
                (social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-[#dfa974] transition-colors"
                  >
                    <i className={`fab fa-${social} text-lg`} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#dfa974]">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start space-x-3">
                <i className="fas fa-phone mt-1 text-[#dfa974]" />
                <span>(12) 345 67890</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-envelope mt-1 text-[#dfa974]" />
                <span>info.colorlib@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <i className="fas fa-map-marker-alt mt-1 text-[#dfa974]" />
                <span>856 Cordia Extension Apt. 356, Lake, United States</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#dfa974]">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-400">
              {["About Us", "Rooms", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-[#dfa974] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#dfa974]">Newsletter</h3>
            <p className="text-gray-400">Get the latest updates and offers.</p>
            <form className="flex rounded-lg bg-gray-800 focus-within:ring-2 focus-within:ring-[#dfa974]">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 bg-[#dfa974] text-white transition-colors hover:bg-[#d1936c] rounded-r-lg"
              >
                <i className="fa fa-paper-plane" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <ul className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              {["Terms", "Privacy", "Security", "Status"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-[#dfa974] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-center text-sm text-gray-400 md:text-right">
              © {new Date().getFullYear()} Your Brand. All rights reserved.
              <br className="md:hidden" /> Made with{" "}
              <i className="fas fa-heart text-[#dfa974]" /> by{" "}
              <a
                href="https://colorlib.com"
                className="text-[#dfa974] hover:underline"
              >
                Colorlib
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
