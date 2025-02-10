function UpdateButton({ isPending, updateAction, data }) {
  return (
    <button
      disabled={isPending}
      onClick={() => updateAction(data._id)}
      className="relative w-[150px] h-[40px] flex items-center cursor-pointer bg-blue-500 border-none rounded-md shadow-md transition-all duration-200 hover:bg-blue-600 focus:outline-none group"
    >
      <span className="text-white font-bold transform transition-all duration-200 translate-x-[35px] group-hover:text-transparent">
        Update
      </span>
      <span className="absolute border-l border-blue-600 transform transition-all duration-200 translate-x-[110px] h-[40px] w-[40px] flex items-center justify-center group-hover:w-full group-hover:border-none group-hover:translate-x-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
          />
        </svg>
      </span>
    </button>
  );
}

export default UpdateButton;
