function UpdateButton({ isPending, isPaid, onClick, isPast, children }) {
  const isDisabled = isPending || isPaid || isPast;
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`flex items-center gap-2 font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md active:translate-y-0.5 ${
        isDisabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }`}
      type="button"
      aria-label="Update"
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
        <path d="M21 2v6h-6"></path>
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
        <path d="M3 22v-6h6"></path>
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
      </svg>
      {children}
    </button>
  );
}

export default UpdateButton;
