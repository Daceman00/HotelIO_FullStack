import React from "react";
import { useIsLoggedIn } from "../Auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuthStore from "../../stores/AuthStore";
import LoadingSpinner from "./LoadingSpinner";

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { user, isPending } = useIsLoggedIn();
  const isAuthenticated = useAuthStore((state) => state.isUserLoggedIn);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  // Show loading state while checking auth status
  if (isPending || isAuthenticated === undefined) {
    return <LoadingSpinner />;
  }

  // Redirect conditions
  if (!isAuthenticated || !user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (requiredRole && user?.data.role !== requiredRole) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Sync Zustand state with query state
  if (isAuthenticated !== !!user || isAdmin !== (user?.data.role === "admin")) {
    useAuthStore.getState().setUserLoggedIn(!!user);
    if (user) {
      useAuthStore.getState().setRole(user?.data.role);
    }
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOf(["admin", "user"]),
};

export default React.memo(ProtectedRoute);
