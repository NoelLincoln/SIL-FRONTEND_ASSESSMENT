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
    // Log that the fetching process is starting
    console.log("Dispatching actions to fetch authentication and data...");

    

    // Dispatch actions for authentication and data fetching
    dispatch(fetchUsers())
      .unwrap()
      .then(() => {
        console.log("Users fetched successfully");
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    dispatch(fetchAlbums())
      .unwrap()
      .then(() => {
        console.log("Albums fetched successfully");
      })
      .catch((error) => {
        console.error("Error fetching albums:", error);
      });

      dispatch(fetchAuthUser())
    .unwrap()
      .then(() => {
        console.log("Auth user found succesfully");
      })
      .catch((error) => {
        console.error("Error fetching auth users:", error);
      });

  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
