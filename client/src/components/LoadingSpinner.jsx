// Spinner.jsx
import React from "react";

const LoadingSpinner = ({ size = "w-12 h-12", color = "border-blue-600" }) => {
    return (
        <div className="flex justify-center items-center">
            <div
                className={`animate-spin rounded-full border-4 border-t-4 ${color} border-gray-200 ${size}`}
            ></div>
        </div>
    );
};

export default LoadingSpinner;
