import React from "react";

function WarningButton({ isPending, cancelAction, data }) {
  return (
    <button
      disabled={isPending}
      onClick={() => cancelAction(data._id)}
      className="relative w-[150px] h-[40px] flex items-center cursor-pointer bg-red-500 border-none rounded-md shadow-md transition-all duration-200 hover:bg-red-500 focus:outline-none group"
    >
      <span className="text-white font-bold transform transition-all duration-200 translate-x-[35px] group-hover:text-transparent">
        Delete
      </span>
      <span className="absolute border-l border-red-600 transform transition-all duration-200 translate-x-[110px] h-[40px] w-[40px] flex items-center justify-center group-hover:w-full group-hover:border-none group-hover:translate-x-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          className="fill-gray-200 transition-all duration-200 group-active:scale-90"
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
        </svg>
      </span>
    </button>
  );
}

export default WarningButton;
