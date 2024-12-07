import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthState } from "../redux/slices/authSlice";
import Cookies from "js-cookie";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    if (id && email && name) {
      // Save user info to cookies
      Cookies.set("authUser", JSON.stringify({ id, email, name }), {
        expires: 7, // Cookie expiry in days
        secure: process.env.NODE_ENV === "development",
        sameSite: "Lax",
      });

      // Dispatch auth state to Redux
      dispatch(setAuthState({ id, email, name }));
    } else {
      // Check cookies for existing user info
      const storedUser = Cookies.get("authUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch(setAuthState(user));
      }
    }
  }, [dispatch, location.search]);

  return <>{children}</>;
};

export default AuthWrapper;
