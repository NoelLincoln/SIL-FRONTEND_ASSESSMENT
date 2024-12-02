import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"
        data-testid="loading-spinner" // Add a test ID for easier selection
      ></div>
    </div>
  );
};

export default LoadingSpinner;
