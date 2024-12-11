import React from "react";
import useUIStore from "../../stores/UiStore";

function UserAvatar() {
  const setToggleUserCard = useUIStore((state) => state.setToggleUserCard);
  return (
    <div
      onClick={setToggleUserCard}
      className="h-15 w-15 overflow-hidden rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="h-20 w-20 p-5 text-white bg-gray-500 stroke-current"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        ></path>
      </svg>
    </div>
  );
}

export default UserAvatar;
