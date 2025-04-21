import React from "react";
import { PuffLoader } from "react-spinners";
import useServiceConfig, { modes } from "../../hooks/useServiceConfig";

function Loading({ mode = modes.all, className = "" }) {
  const [isPending] = useServiceConfig(mode);

  if (!isPending) {
    return null;
  }

  const isFullScreen = mode === modes.all;
  const isSmall = mode === modes.small;

  return (
    <div
      className={`
        ${
          isFullScreen
            ? "fixed inset-0 bg-white bg-opacity-90 z-50"
            : "relative flex justify-center"
        } 
        flex justify-center items-center
        ${isSmall ? "p-2" : "py-4"}
        ${className}
      `}
    >
      <PuffLoader
        color="#dfa974"
        size={isFullScreen ? 80 : isSmall ? 20 : 40}
      />
    </div>
  );
}

export default Loading;
