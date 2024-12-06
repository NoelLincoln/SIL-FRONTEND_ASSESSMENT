
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthState } from "../redux/slices/authSlice";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Check if query params contain user info
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    if (id && email && name) {
      // Dispatch setAuthState if user data is found in query params
      dispatch(setAuthState({ id, email, name }));
    }
  }, [dispatch, location.search]);

  return <>{children}</>;
};

export default AuthWrapper;
