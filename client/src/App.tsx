import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import AuthWrapper from "./components/AuthWrapper";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <AuthWrapper>
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
      </AuthWrapper>
    </>
  );
};

export default App;
