import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <a
        href="/api/auth/github"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with GitHub
      </a>
    </div>
  );
};

export default LoginPage;
