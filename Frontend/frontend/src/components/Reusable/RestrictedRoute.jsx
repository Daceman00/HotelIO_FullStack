import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../../stores/AuthStore";
import toast from "react-hot-toast";

function RestrictedRoute({ allowedRoles, children }) {
  const role = useAuthStore((state) => (state.isAdmin ? "admin" : "user")); // Fetch role

  useEffect(() => {
    if (!allowedRoles.includes(role)) {
      toast.error("You have no permission to access this page.");
    }
  }, [role, allowedRoles]);

  // Redirect unauthorized users
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/rooms" replace />;
  }

  return children;
}

export default RestrictedRoute;
