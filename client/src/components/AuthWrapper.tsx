import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAuthUser } from "../redux/slices/authSlice";
import { fetchAlbums } from "../redux/slices/albumSlice";
import { fetchUsers } from "../redux/slices/userSlice";
import { AppDispatch } from "../redux/store";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch authentication and necessary global data
    dispatch(fetchAuthUser());
    dispatch(fetchUsers());
    dispatch(fetchAlbums());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
