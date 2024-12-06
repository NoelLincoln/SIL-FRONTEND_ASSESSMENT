import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchAuthUser } from "../redux/slices/authSlice";
import { fetchAlbums } from "../redux/slices/albumSlice";
import { fetchUsers } from "../redux/slices/userSlice";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  console.log("Auth state", isAuthenticated)
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  // Dispatch fetchAlbums and fetchUsers after user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAlbums());
      dispatch(fetchUsers());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-semibold text-red-500">
          Authentication Error: {error}
        </h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
