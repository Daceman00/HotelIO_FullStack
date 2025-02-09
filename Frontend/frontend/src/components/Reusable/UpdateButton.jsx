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
          width="15"
          height="15"
          viewBox="0 0 24 24"
          className="fill-gray-200 transition-all duration-200 group-active:scale-90"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
        </svg>
      </span>
    </button>
  );
}

export default UpdateButton;
