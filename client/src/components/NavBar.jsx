import React, { useState, useEffect, useRef } from 'react';
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
  FaCog,
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        event.target.tagName !== 'BUTTON'
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sticky top-0 z-50 shadow-lg border-b border-blue-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-white hover:text-blue-200 transition-colors duration-200"
        >
          खोप अनुगमन प्रणाली
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded p-2"
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
                className="flex items-center space-x-2 py-2 px-4 text-white font-medium rounded-full hover:bg-white hover:text-blue-700 transition duration-200 group transform hover:scale-105"
              >
                <FaSignInAlt className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 py-2 px-4 border border-white text-white font-medium rounded-full hover:bg-white hover:text-blue-700 transition duration-200 group transform hover:scale-105"
              >
                <FaUserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Register</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 py-2 px-4 text-white font-medium rounded-full hover:bg-white hover:text-blue-700 transition duration-200 group transform hover:scale-105"
              >
                <FaHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Dashboard</span>
              </Link>
              <div className="relative " ref={profileRef}>
                <button
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 py-2 px-4 text-white cursor-pointer font-medium rounded-full hover:bg-white hover:text-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 group transform hover:scale-105"
                  aria-expanded={isMenuOpen}
                >
                  <FaUserCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>{user.name || user.email || 'User'}</span>
                  <svg
                    className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}
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
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200 animate-fade-in-down">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-semibold text-blue-700">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaCog className="w-4 h-4" />
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
          <div
            className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg py-2 animate-fade-in-down"
            ref={menuRef}
          >
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus className="w-5 h-5" />
                  <span>Register</span>
                </Link>
              </>
            ) : (
              <>
                <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                  <p className="font-semibold text-blue-700">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaHome className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCog className="w-5 h-5" />
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
