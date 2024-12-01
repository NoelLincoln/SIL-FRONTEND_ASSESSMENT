import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./redux/reducers/userSlice";
import { fetchAlbums } from "./redux/reducers/albumSlice";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import UserDetails from "./components/UserDetails";
import Albums from "./components/Albums";
import ProtectedRoute from "./components/ProtectedRoute";
import { RootState, AppDispatch } from "./redux/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch user and album details on app start
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAlbums());
  }, [dispatch]);

  // Get albums and loading state from Redux store
  const { albums, loading, error } = useSelector((state: RootState) => state.albums);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/albums"
          element={
            <ProtectedRoute>
              <Albums albums={albums} loading={loading} error={error} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
