import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/sessionContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loggedIn } = useSession();

  console.log("ProtectedRoute: loggedIn status:", loggedIn);

  if (!loggedIn) {
    console.log("User is not logged in. Redirecting to login...");
    return <Navigate to="/" />;
  }

  console.log("User is logged in. Rendering protected content...");
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
