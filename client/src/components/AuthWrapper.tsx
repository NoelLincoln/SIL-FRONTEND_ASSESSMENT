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
    const username = searchParams.get("username");

    console.log("Username from params", username)

    if (id && username) {
      // Save user info to cookies
      Cookies.set("authUser", JSON.stringify({ id, username }), {
        expires: 7, // Cookie expiry in days
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      // Dispatch auth state to Redux
      dispatch(setAuthState({ id, username }));
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
