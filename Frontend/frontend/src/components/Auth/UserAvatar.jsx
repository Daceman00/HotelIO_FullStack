import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useUIStore from "../../stores/UiStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

function UserAvatar() {
  const setToggleUserCard = useUIStore((state) => state.setToggleUserCard);
  const setResetUserCard = useUIStore((state) => state.setResetUserCard);
  const location = useLocation();

  useEffect(() => {
    setResetUserCard();
  }, [location.pathname, setResetUserCard]);

  return (
    <motion.button
      onClick={setToggleUserCard}
      className="font-semibold px-4 py-2 rounded-full bg-gradient-to-br from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/60 dark:border-amber-700/40 shadow-sm hover:shadow-md text-gray-700 dark:text-gray-200 transition-shadow duration-300"
      whileHover={{
        scale: 1.08,
        boxShadow: "0 4px 14px -2px rgba(251, 191, 36, 0.25)",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
    >
      <FontAwesomeIcon icon={faUser} />
    </motion.button>
  );
}

export default UserAvatar;
