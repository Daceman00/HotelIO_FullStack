import React from "react";

function Header({ toggleSidebar, isOpen }) {
  return (
    <header className="shadow-lg p-4 flex justify-between items-center transition-all duration-300 ease-in-out">
      <button
        onClick={toggleSidebar}
        className=" p-2 focus:outline-none transition-transform transform hover:scale-110"
      >
        {isOpen ? (
          <div className="space-y-1">
            <span className="block w-8 h-1 bg-black transform rotate-45 translate-y-2"></span>
            <span className="block w-8 h-1 bg-black opacity-0"></span>
            <span className="block w-8 h-1 bg-black transform -rotate-45 -translate-y-2"></span>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="block w-8 h-1 bg-black"></span>
            <span className="block w-8 h-1 bg-black"></span>
            <span className="block w-8 h-1 bg-black"></span>
          </div>
        )}
      </button>

      <h1 className="ml-4 text-3xl font-extrabold  tracking-wide transition-colors duration-300 ease-in-out">
        Hotel.IO
      </h1>

      {/* Add a user profile icon or any other interactive element */}
      <div className="flex items-center space-x-4">
        <button className=" font-semibold px-4 py-2 rounded-full transition-transform transform hover:scale-110 hover:shadow-md">
          Log In
        </button>
        <button className=" font-semibold px-4 py-2 rounded-full transition-transform transform hover:scale-110 hover:shadow-md">
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default Header;
