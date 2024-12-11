import React from "react";
import useUIStore from "../../stores/UiStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function UserAvatar() {
  const setToggleUserCard = useUIStore((state) => state.setToggleUserCard);
  return (
    <button
      onClick={setToggleUserCard}
      className="font-semibold px-4 py-2 rounded-full transition-transform transform hover:scale-110 hover:shadow-md"
    >
      <FontAwesomeIcon icon={faUser} />
    </button>
  );
}

export default UserAvatar;
