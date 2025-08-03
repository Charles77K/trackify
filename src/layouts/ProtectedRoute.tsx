import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import TokenStorage from "../services/tokenStorage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  tokenKey?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const location = useLocation();

  // Check if user is authenticated by looking for token in localStorage
  const isAuthenticated = (): boolean => {
    try {
      const token = TokenStorage.getAccessToken();

      // Check if token exists and is not empty
      if (!token || token.trim() === "") {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return false;
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
