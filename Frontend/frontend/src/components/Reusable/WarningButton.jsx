import React from "react";

function WarningButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="relative min-w-[120px] h-[40px] flex flex-shrink-0 items-center justify-center cursor-pointer bg-red-500 border-none rounded-md shadow-md transition-all duration-200 hover:bg-red-500 focus:outline-none group overflow-hidden sm:min-w-[100px] sm:h-[35px] lg:min-w-[140px] lg:h-[45px] xl:min-w-[160px] xl:h-[50px]"
    >
      <span className="text-white font-bold transition-all duration-200 group-hover:text-transparent pl-4 pr-[40px] sm:pr-[35px] lg:pr-[45px] xl:pr-[50px]">
        {children}
      </span>
      <span className="absolute border-l border-red-600 transition-all duration-200 right-0 h-full w-[40px] flex items-center justify-center group-hover:w-full group-hover:border-none sm:w-[35px] lg:w-[45px] xl:w-[50px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="text-white fill-white transition-all duration-200 group-active:scale-90 w-[15px] h-[15px] sm:w-[12px] sm:h-[12px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]"
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
        </svg>
      </span>
    </button>
  );
}

export default WarningButton;
