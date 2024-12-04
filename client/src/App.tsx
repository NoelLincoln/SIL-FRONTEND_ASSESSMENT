import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAlbums } from "./redux/slices/albumSlice";
import { fetchUsers } from "./redux/slices/userSlice";

import { fetchAuthUser } from "./redux/slices/authSlice";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import UserDetails from "./components/UserDetails";
import Albums from "./components/Albums";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPhoto from "./components/EditPhoto";
import AlbumDetails from "./components/AlbumDetails";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch } from "./redux/store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch user authentication state on app load
    dispatch(fetchAuthUser());
    dispatch(fetchUsers());
    // Fetch albums
    dispatch(fetchAlbums());
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/albums/:albumId"
            element={
              <ProtectedRoute>
                <Layout>
                  <AlbumDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/photos/edit/:photoId"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditPhoto />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/albums"
            element={
              <ProtectedRoute>
                <Layout>
                  <Albums />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
