import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle, FaAngleLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser, fetchAuthUser } from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const { email, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeNav = () => {
    if (isNavOpen) setIsNavOpen(false);
  };

  const closeProfile = () => {
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const goBack = () => {
    window.history.back();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  // Prevent horizontal scrolling when menu or profile dropdown is open
  useEffect(() => {
    if (isProfileOpen || isNavOpen) {
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflowX = "auto";
    }
  }, [isProfileOpen, isNavOpen]);

  // Close the profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileDropdown = document.querySelector(
        '.relative div'
      );
      if (profileDropdown && !profileDropdown.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="flex items-center text-2xl font-semibold space-x-2">
          <div className="flex items-center text-2xl font-semibold space-x-2">
            <FaAngleLeft
              size={30}
              className="lg:hidden block cursor-pointer"
              data-testid="back-button"
              onClick={goBack}
            />
          </div>
          <Link to="/home">
            <img
              src="/images/logo.png"
              alt="Album Genie Logo"
              width={150}
              height={150}
              className="transition-transform duration-200 hover:scale-105 cursor-pointer"
            />
          </Link>
        </div>

        <nav className="hidden lg:flex space-x-6">
          <Link to="/home" className="hover:text-gray-400">
            Home
          </Link>
          <Link to="/albums" className="hover:text-gray-400">
            Albums
          </Link>

          {isAuthenticated && (
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
                  <p>{email || "Loading..."}</p>
                  <button
                    className="text-red-500 mt-2"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
              )}
            </div>
          )}
        </nav>

        <button className="lg:hidden text-white" onClick={toggleNav}>
          {isNavOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>
      </div>

      {isNavOpen && (
        <div className="lg:hidden bg-gray-900 text-white py-6 px-6 absolute top-0 right-0 bottom-0 z-20 transition-transform duration-300 ease-in-out transform translate-x-0 w-10/12">
          <div className="flex flex-col items-center space-y-6">
            <button
              className="absolute top-6 right-6 text-white"
              onClick={closeNav}
            >
              <FaTimes size={30} />
            </button>

            <Link
              to="/home"
              className="block text-lg font-medium hover:text-gray-400"
              onClick={closeNav}
            >
              Home
            </Link>
            <Link
              to="/albums"
              className="block text-lg font-medium hover:text-gray-400"
              onClick={closeNav}
            >
              Albums
            </Link>

            {isAuthenticated && (
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
                    <p>{email || "Loading..."}</p>
                    <button
                      className="text-red-500 mt-2"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      {loading ? "Logging out..." : "Logout"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
