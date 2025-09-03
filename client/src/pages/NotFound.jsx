// pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 text-gray-800 px-4">
            {/* Cute syringe illustration or emoji */}
            <div className="text-9xl mb-6 animate-bounce">💉</div>

            <h1 className="text-6xl font-extrabold text-indigo-700 mb-4">404</h1>
            <p className="text-2xl mb-6 text-center max-w-md">
                Oops! Looks like this page didn’t get its shot.
                Don’t worry, you can safely go back to the dashboard!
            </p>

            <Link
                to="/"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-300"
            >
                Go Back Home
            </Link>

            {/* Optional: small friendly message */}
            <p className="mt-6 text-sm text-indigo-500">
                Stay healthy and keep tracking your vaccinations! 💉🩺
            </p>
        </div>
    );
};

export default NotFound;
