import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "user") return <Navigate to="/dashboard" replace />;
    if (role === "owner")
      return <Navigate to="/store-owner/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
