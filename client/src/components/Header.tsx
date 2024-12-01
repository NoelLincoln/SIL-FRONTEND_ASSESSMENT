import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle, FaAngleLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logoutUser, fetchAuthUser } from "../redux/slices/authSlice
import { AppDispatch } from "../redux/store";

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Access the user email, authentication state, and loading/error from Redux
  const { email, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const dispatch = useDispatch<AppDispatch>();

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

    // Go back to the previous page
    const goBack = () => {
      window.history.back();
    };

  // Logout user by dispatching the async logoutUser action
  const handleLogout = async () => {
    try {
      // Dispatch the logoutUser action to perform logout API call
      await dispatch(logoutUser());
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // If the user is not authenticated and there's no loading, perform the API call to fetch user data
      dispatch(fetchAuthUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center text-2xl font-semibold space-x-2">
          {/* Angle Left Icon - Visible Only on Small Devices */}
          <div className="flex items-center text-2xl font-semibold space-x-2">
          {/* Angle Left Icon - Visible Only on Small Devices and Clickable to Go Back */}
          <FaAngleLeft
            size={30}
            className="lg:hidden block cursor-pointer"
            onClick={goBack}
          />
          </div>
           <span>ALBUM GENIE</span>
        </div>

        {/* Nav for Large Screens */}
        <nav className="hidden lg:flex space-x-6">
          <a href="/home" className="hover:text-gray-400">
            Home
          </a>
          <a href="/albums" className="hover:text-gray-400">
            Albums
          </a>
         
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
                    disabled={loading} // Disable the logout button if loading
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
              )}
            </div>
          )}
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
                      disabled={loading} // Disable the logout button if loading
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
