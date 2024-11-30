// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ element: Component, ...rest }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/check-session",
          { withCredentials: true },
        );
        setIsAuthenticated(response.data.loggedIn);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <Route
      {...rest}
      element={isAuthenticated ? <Component /> : <Navigate to="/" />}
    />
  );
};

export default ProtectedRoute;
