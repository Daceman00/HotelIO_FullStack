import React from "react";
import { Link } from "react-router-dom";

function Logo({ light = false }) {
  return (
    <div className="flex items-center">
      <Link to="/dashboard" className="flex items-center group">
        <span
          className={`text-xl sm:text-2xl font-serif font-bold tracking-tight ${
            light ? "text-white" : "text-gray-800"
          }`}
        >
          Hotel
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 transition-all duration-300">
            IO
          </span>
        </span>
      </Link>
    </div>
  );
}

export default Logo;
