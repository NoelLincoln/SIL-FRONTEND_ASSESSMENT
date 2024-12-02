import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Determine the API base URL dynamically based on the environment
  const API_BASE_URL =
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_PROD_URL
      : import.meta.env.VITE_DEV_URL;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/check-session`, {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.loggedIn);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, [API_BASE_URL]);

  // Prevent rendering any content until the session status is confirmed
  if (isAuthenticated === null) return null;

  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
