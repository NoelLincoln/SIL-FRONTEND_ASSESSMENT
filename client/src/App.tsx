// App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./redux/slices/userSlice";
import { fetchAlbums } from "./redux/slices/albumSlice";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import UserDetails from "./components/UserDetails";
import Albums from "./components/Albums";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPhoto from "./components/EditPhoto";
import { RootState, AppDispatch } from "./redux/store";
import AlbumDetails from "./components/AlbumDetails";
import Layout from "./components/Layout"; // Import Layout
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <>
      <ToastContainer />
      <Router>
        <Routes>
          {/* Landing page doesn't need the layout */}
          <Route path="/" element={<LandingPage />} />

          {/* Wrap other routes with the Layout component */}
          <Route
            path="/home"
            element={<ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>} />
          <Route
            path="/users/:userId"
            element={<ProtectedRoute>
              <Layout>
                <UserDetails />
              </Layout>
            </ProtectedRoute>} />
          <Route
            path="/albums/:albumId"
            element={<ProtectedRoute>
              <Layout>
                <AlbumDetails />
              </Layout>
            </ProtectedRoute>} />
          <Route
            path="/photos/edit/:photoId"
            element={<ProtectedRoute>
              <Layout>
                <EditPhoto />
              </Layout>
            </ProtectedRoute>} />
          <Route
            path="/albums"
            element={<ProtectedRoute>
              <Layout>
                <Albums albums={albums} loading={loading} error={error} />
              </Layout>
            </ProtectedRoute>} />
        </Routes>
      </Router></>
  );
};

export default App;
