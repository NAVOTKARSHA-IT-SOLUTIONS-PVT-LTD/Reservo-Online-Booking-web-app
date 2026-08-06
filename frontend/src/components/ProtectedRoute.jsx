import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../services/auth.service";
import ErrorScreen from "./ErrorScreen";

/**
 * Route guard component to restrict pages to authenticated users and specific roles.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    // Redirect to login and save the location they tried to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If authenticated but role is not allowed, show unauthorized screen
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-bg-light">
        <ErrorScreen 
          type="unauthorized" 
          message="You do not have the necessary permissions to access this administrative portal."
        />
      </div>
    );
  }

  return children;
}
