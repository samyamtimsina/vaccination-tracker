import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaEdit,
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false); // Close profile dropdown when menu is toggled
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false); // Close mobile menu when profile is toggled
  };

  return (
    <nav className="bg-white text-gray-800 p-4 sticky top-0 z-50 shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
        >
          खोप अनुगमन प्रणाली
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4 cursor-pointer">
          {user && (
            <button
              onClick={toggleProfile}
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full p-1"
              aria-label="Toggle profile menu"
            >
              <FaUserCircle className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded p-1"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Desktop Menu & Profile */}
        <div className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-2 py-2 px-4 text-gray-700 font-medium rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
              >
                <FaSignInAlt className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 py-2 px-4 border border-indigo-400 text-indigo-600 font-medium rounded-md hover:bg-indigo-50 hover:border-indigo-500 transition duration-200"
              >
                <FaUserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 py-2 px-4 text-gray-700 font-medium rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
              >
                <FaHome className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 py-2 px-4 text-gray-700 font-medium rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  aria-expanded={isProfileOpen}
                >
                  <FaUserCircle className="w-5 h-5" />
                  <span>{user.name || user.email || 'User'}</span>
                  <svg
                    className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200 animate-fade-in-down">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-semibold">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUserCircle className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Dropdown Menu (Toggle from hamburger) */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-lg py-2 animate-fade-in-down">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus className="w-5 h-5" />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                {/* Profile info in mobile menu if not already shown in profile dropdown */}
                <div className="px-4 py-3 text-sm text-gray-700 border-t border-gray-100 mt-2">
                  <p className="font-semibold">Logged in as:</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.name || user.email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserCircle className="w-5 h-5" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-200"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
