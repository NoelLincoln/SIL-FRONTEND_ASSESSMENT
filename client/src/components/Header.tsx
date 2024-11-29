import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import axios from "axios"; // Import Axios for making API requests

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Default to null until we fetch the email

  // Fetch user email on component mount
  useEffect(() => {
    // Call the /api/auth/me route to get the logged-in user's email
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true }) // Adjust URL to your backend
      .then((response) => {
        setUserEmail(response.data.email); // Set the email state
        console.log("User Id:", response.data.userId);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUserEmail(null); // Handle error (user might not be logged in)
      });
  }, []); // Empty dependency array to run once when component mounts

  // Toggle nav menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Toggle profile dropdown
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close nav menu when clicking outside
  const closeNav = () => {
    if (isNavOpen) setIsNavOpen(false);
  };

  // Close profile dropdown when clicking outside
  const closeProfile = () => {
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo/Brand */}
        <div className="text-2xl font-semibold">ALBUM GENIE</div>

        {/* Nav for Large Screens */}
        <nav className="hidden lg:flex space-x-6">
          <a href="/home" className="hover:text-gray-400">
            Home
          </a>
          <a href="/albums" className="hover:text-gray-400">
            Albums
          </a>
          <a href="/add-album" className="hover:text-gray-400">
            Add Album
          </a>
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 hover:text-gray-400"
            >
              <FaUserCircle size={24} />
              <span>Profile</span>
            </button>
            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 bg-white text-gray-800 p-4 rounded-lg shadow-md w-48"
                onClick={(e) => e.stopPropagation()}
              >
                <p>{userEmail ? userEmail : "Loading..."}</p>
                <button
                  className="text-red-500 mt-2"
                  onClick={() => console.log("Logging out...")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger Menu Icon for Small Screens */}
        <button className="lg:hidden text-white" onClick={toggleNav}>
          {isNavOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isNavOpen && (
        <div className="lg:hidden bg-gray-900 text-white py-6 px-6 absolute top-0 right-0 bottom-0 z-20 transition-transform duration-300 ease-in-out transform translate-x-0 w-1/2">
          <div className="flex flex-col items-center space-y-6">
            {/* Close Icon */}
            <button
              className="absolute top-6 right-6 text-white"
              onClick={closeNav}
            >
              <FaTimes size={30} />
            </button>

            {/* Menu Items */}
            <a
              href="/home"
              className="block text-lg font-medium hover:text-gray-400"
              onClick={closeNav}
            >
              Home
            </a>
            <a
              href="/albums"
              className="block text-lg font-medium hover:text-gray-400"
              onClick={closeNav}
            >
              Albums
            </a>
            <a
              href="/add-album"
              className="block text-lg font-medium hover:text-gray-400"
              onClick={closeNav}
            >
              Add Album
            </a>
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 w-full text-left text-lg font-medium hover:text-gray-400"
              >
                <FaUserCircle size={24} />
                <span>Profile</span>
              </button>
              {isProfileOpen && (
                <div
                  className="absolute left-0 mt-2 bg-white text-gray-800 p-4 rounded-lg shadow-md w-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p>{userEmail ? userEmail : "Loading..."}</p>
                  <button
                    className="text-red-500 mt-2"
                    onClick={() => console.log("Logging out...")}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Background overlay for closing the mobile menu */}
      {isNavOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={closeNav}
        />
      )}
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={closeProfile}
        />
      )}
    </header>
  );
};

export default Header;
