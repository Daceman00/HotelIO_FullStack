import React from "react";

function CRMButton({ onClick, children, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:hover:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md active:translate-y-0.5"
      type="button"
      aria-label="Info"
      disabled={disabled}
      aria-disabled={disabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      {children}
    </button>
  );
}

export default CRMButton;
