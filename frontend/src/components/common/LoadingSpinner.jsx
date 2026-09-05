import React from "react";

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };
  return (
    <div className="flex justify-center items-center my-8">
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
