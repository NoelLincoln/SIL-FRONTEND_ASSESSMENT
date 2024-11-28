import React, { useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("user@example.com");

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
          <a href="/" className="hover:text-gray-400">
            Home
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
                <p>{userEmail}</p>
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
      <div
        className={`lg:hidden bg-gray-900 text-white py-6 px-6 absolute top-0 right-0 bottom-0 z-20 transition-transform duration-300 ease-in-out transform ${
          isNavOpen ? "translate-x-0" : "translate-x-full"
        } w-1/2`}
      >
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
                <p>{userEmail}</p>
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
