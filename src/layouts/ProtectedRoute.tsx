import React from "react";
// import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  tokenKey?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  // redirectTo = "/login",
}) => {
  // If authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
