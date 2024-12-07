import React, { useState, useEffect } from "react";

// Function to get the backend URL based on the environment
const getBackendUrl = (): string => {
  const isProduction = import.meta.env.VITE_NODE_ENV === "production";
  return isProduction
    ? import.meta.env.VITE_GHUB_CALLBACK_URL || ""
    : import.meta.env.VITE_GHUB_CALLBACK_URL_DEV || "";
};

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(false); // state to track loading status
  const [imageSrc, setImageSrc] = useState("/images/background-image-auth.png");
  const backendUrl = getBackendUrl();

  const handleSignInClick = () => {
    setLoading(true); // Start loading when the button is clicked
  };

  // Preload the high-quality image once the component is mounted
  useEffect(() => {
    const loadHighQualityImage = () => {
      setImageSrc("/images/background-image-auth.png"); // Replace with high-quality image
    };
    loadHighQualityImage();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${imageSrc})` }} // Set the background image dynamically
    >
      <div className="flex flex-col items-center w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-xl p-6 sm:p-8 mx-4 sm:mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to SIL</h1>
        <p className="text-lg text-gray-700 mb-6">
          Manage your albums effortlessly. Sign in to get started and explore
          our features!
        </p>
        <a
          href={backendUrl}
          onClick={handleSignInClick} // Trigger loading state on button click
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-8 rounded transition duration-200 ease-in-out flex items-center justify-center"
        >
          {loading ? (
            // Show loading spinner when loading is true
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          ) : (
            "Sign in with GitHub"
          )}
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
