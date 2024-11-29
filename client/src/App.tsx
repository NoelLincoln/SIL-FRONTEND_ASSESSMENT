// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/Home";
import Home from "./components/Home";
import UserDetails from "./components/UserDetails";
import AllAlbums from "./components/Albums"; // Import the new Albums component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users/:userId" element={<UserDetails />} />
        <Route path="/albums" element={<AllAlbums />} />
      </Routes>
    </Router>
  );
};

export default App;
