import React from "react";

function CreateButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative min-w-[120px] h-[40px] flex flex-shrink-0 items-center justify-center cursor-pointer bg-[#dfa379] border-none rounded-md shadow-md transition-all duration-200 hover:bg-[#c68a5e] focus:outline-none group overflow-hidden sm:min-w-[100px] sm:h-[35px] lg:min-w-[140px] lg:h-[45px] xl:min-w-[160px] xl:h-[50px] ml-auto"
    >
      <span className="text-white font-bold transition-all duration-200 group-hover:text-transparent pl-4 pr-[40px] sm:pr-[35px] lg:pr-[45px] xl:pr-[50px]">
        Create
      </span>
      <span className="absolute border-l border-[#c68a5e] transition-all duration-200 right-0 h-full w-[40px] flex items-center justify-center group-hover:w-full group-hover:border-none sm:w-[35px] lg:w-[45px] xl:w-[50px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="text-white fill-white transition-all duration-200 group-active:scale-90 w-[15px] h-[15px] sm:w-[12px] sm:h-[12px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </span>
    </button>
  );
}

export default CreateButton;
