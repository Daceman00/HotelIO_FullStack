import React from "react";
import { PuffLoader } from "react-spinners";
import useServiceConfig, { modes } from "../../hooks/useServiceConfig"; // Adjust the import path as necessary

function Loading({ mode = modes.all }) {
  const [isPending] = useServiceConfig(mode);

  if (!isPending) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50">
      <PuffLoader color="#dfa974" />
    </div>
  );
}

export default Loading;
