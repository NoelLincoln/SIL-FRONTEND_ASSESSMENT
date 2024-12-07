import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { fetchAlbums } from "../redux/slices/albumSlice";
import { fetchUsers } from "../redux/slices/userSlice";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Retrieve the authUser cookie and parse it
    const authUser = Cookies.get("authUser");

    if (authUser) {
      try {
        const user = JSON.parse(authUser); // Parse JSON string
        const { id,username } = user;

        if (id && username) {
          setIsAuthenticated(true);

          // Fetch necessary data once authenticated
          dispatch(fetchAlbums());
          dispatch(fetchUsers());
          return;
        }
      } catch (error) {
        console.error("Error parsing authUser cookie:", error);
      }
    }

    // If parsing fails or user data is missing, set as unauthenticated
    setIsAuthenticated(false);
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
