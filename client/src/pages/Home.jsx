import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded shadow text-center">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to the Vaccination Tracker
      </h1>
      <p className="mb-6 text-lg text-gray-700">
        Track vaccination records and manage children and mothers easily.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-block px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-100 transition"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
