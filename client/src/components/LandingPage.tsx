import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
      <p className="text-lg text-center mb-8">
        This application allows you to manage your photos and albums with ease.
        Sign in to get started!
      </p>
      {/* Use a link to trigger the GitHub authentication flow on the backend */}
      <a
        href="http://localhost:5000/api/auth/github" // Redirects to the backend's GitHub auth route
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with GitHub
      </a>
    </div>
  );
};

export default LandingPage;
