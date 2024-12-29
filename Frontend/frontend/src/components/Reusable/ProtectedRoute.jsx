import React from "react";
import { useIsLoggedIn } from "../Auth/useAuth";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

function ProtectedRoute({ children }) {
  const { user, isPending, isError } = useIsLoggedIn();

  if (isPending) {
    return <Loading />;
  }

  if (!user || isError) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
