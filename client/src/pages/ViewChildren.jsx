import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Adjust the import based on your axios client setup

import {
  FaUser,
  FaBirthdayCake,
  FaSyringe,
  FaSpinner,
  FaSadTear,
  FaEye,
} from 'react-icons/fa';

// This component fetches and displays a list of all children
export default function AllChildren() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from the backend using axiosClient
    const fetchChildren = async () => {
      try {
        // Use axiosClient to make the GET request
        const response = await axiosClient.get(
          'http://localhost:5000/api/child',
        );

        // Axios automatically parses the JSON, so we access response.data directly
        setChildren(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching children:', err);
        // Display a user-friendly error message
        setError(
          err.response?.data?.message ||
            'Could not load children data. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // Display a loading indicator while the data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl">
          <FaSpinner className="animate-spin text-4xl text-indigo-500 mb-4" />
          <p className="text-xl font-medium text-gray-700">
            Loading children data...
          </p>
        </div>
      </div>
    );
  }

  // Display an error message if fetching data failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl">
          <FaSadTear className="text-4xl text-red-500 mb-4" />
          <p className="text-xl font-medium text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            All Children Records
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            A comprehensive list of all children in the system.
          </p>
        </header>

        {children.length === 0 ? (
          <div className="p-8 bg-white rounded-xl shadow-lg text-center">
            <p className="text-2xl font-semibold text-gray-500">
              No children records found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-indigo-700 mb-2">
                    {child.fullName}
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-indigo-400" />
                      <span className="font-medium">Parent:</span>
                      <span>{child.parentName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaBirthdayCake className="text-indigo-400" />
                      <span className="font-medium">Date of Birth:</span>
                      <span>
                        {new Date(child.birthDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaSyringe className="text-indigo-400" />
                      <span className="font-medium">Vaccinations:</span>
                      <span>{child.vaccinations.length} completed</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <Link
                    to={`/children/${child.id}`}
                    className="flex items-center justify-center space-x-2 w-full bg-indigo-500 text-white font-medium py-3 rounded-lg shadow-md hover:bg-indigo-600 transition-colors duration-200"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
