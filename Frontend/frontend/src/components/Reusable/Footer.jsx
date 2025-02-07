import "@fortawesome/fontawesome-free/css/all.min.css";
import React from "react";

const Footer = React.memo(function Footer() {
  return (
    <footer className=" bg-[#393D4A] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="footer-text">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div>
              <div className="ft-about">
                <div className="logo mb-4">
                  <a href="#">
                    <img
                      src="img/footer-logo.png"
                      alt="Logo"
                      className="h-12"
                    />
                  </a>
                </div>
                <p className="text-sm">
                  We inspire and reach millions of travelers
                  <br /> across 90 local websites.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <div className="ft-contact">
                <h6 className="text-lg font-bold text-[#dfa974] mb-4">
                  Contact Us
                </h6>
                <ul className="space-y-2 text-sm">
                  <li>(12) 345 67890</li>
                  <li>info.colorlib@gmail.com</li>
                  <li>856 Cordia Extension Apt. 356, Lake, United States</li>
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div>
              <div className="ft-newslatter">
                <h6 className="text-lg font-bold text-[#dfa974] mb-4">
                  Newsletter
                </h6>
                <p className="text-sm mb-4">
                  Get the latest updates and offers.
                </p>
                <form action="#" className="fn-form flex items-center">
                  <input
                    type="text"
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded-l bg-[#393D4A] text-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#dfa974] rounded-r text-white hover:bg-yellow-600"
                  >
                    <i className="fa fa-send"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="copyright-option bg-[#10141F33] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-[#dfa974]">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#dfa974]">
                  Terms of use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#dfa974]">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#dfa974]">
                  Environmental Policy
                </a>
              </li>
            </ul>
            <div className="co-text text-gray-400 text-sm text-center md:text-right">
              <p>
                Copyright &copy; {new Date().getFullYear()} All rights reserved
                | This template is made with{" "}
                <i className="fa fa-heart text-[#dfa974]"></i> by{" "}
                <a
                  href="https://colorlib.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#dfa974] hover:underline"
                >
                  Colorlib
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
