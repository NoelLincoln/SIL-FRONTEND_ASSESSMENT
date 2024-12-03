import React from "react";

const getBackendUrl = (): string => {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.VITE_GHUB_CALLBACK_URL) {
      throw new Error("REACT_APP_GHUB_CALLBACK_URL is not defined");
    }
    return process.env.VITE_GHUB_CALLBACK_URL;
  } else {
    if (!process.env.VITE_GHUB_CALLBACK_URL_DEV) {
      throw new Error("REACT_APP_GHUB_CALLBACK_URL_DEV is not defined");
    }
    return process.env.VITE_GHUB_CALLBACK_URL_DEV;
  }
};

const LandingPage: React.FC = () => {
  const backendUrl = getBackendUrl();

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/images/background-image-auth.jpg')]">
      <div className="flex flex-col items-center w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-xl p-6 sm:p-8 mx-4 sm:mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to SIL
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Manage your albums effortlessly. Sign in to get started and explore
          our features!
        </p>
        <a
          href={backendUrl}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-8 rounded transition duration-200 ease-in-out"
        >
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
