import React from "react";
import { PuffLoader } from "react-spinners";
import useServiceConfig, { modes } from "../../hooks/useServiceConfig";

function Loading({ mode = modes.all }) {
  const [isPending] = useServiceConfig(mode);

  if (!isPending) {
    return null;
  }

  return (
    <div
      className={`
      ${
        mode === modes.all
          ? "fixed inset-0 bg-white bg-opacity-90 z-50"
          : "inline-block"
      } 
      flex justify-center items-center
    `}
    >
      <PuffLoader
        color="#dfa974"
        size={mode === modes.all ? 80 : 40}
        css={mode === modes.small ? "display: inline-block" : ""}
      />
    </div>
  );
}

export default Loading;
