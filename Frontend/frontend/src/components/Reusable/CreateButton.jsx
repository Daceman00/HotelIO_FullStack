import React from "react";

function CreateButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1"
      type="button"
      aria-label="Create"
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export default CreateButton;
