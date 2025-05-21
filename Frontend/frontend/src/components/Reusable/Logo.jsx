import React from "react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <span className="hidden md:block text-2xl font-serif font-bold text-gray-800">
          Hotel<span className="text-amber-600">IO</span>
        </span>
      </Link>
    </div>
  );
}

export default Logo;
