// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import UserDetails from "./components/UserDetails";
import AllAlbums from "./components/Albums";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <ProtectedRoute path="/home" element={<Home />} />
        <ProtectedRoute path="/users/:userId" element={<UserDetails />} />
        <ProtectedRoute path="/albums" element={<AllAlbums />} />
      </Routes>
    </Router>
  );
};

export default App;
