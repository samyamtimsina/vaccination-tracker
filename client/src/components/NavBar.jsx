import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaCog,
  FaSun,
  FaMoon,
  FaShieldAlt,
  FaChevronDown,
} from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-base-100 border-b border-base-300/50 shadow-lg backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <FaShieldAlt className="text-white text-lg" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              खोप अनुगमन प्रणाली
            </h1>
            <p className="text-xs text-base-content/70 -mt-1 hidden sm:block">
              Vaccine Tracking System
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-base-200/50 backdrop-blur-sm hover:bg-base-300/50 border border-base-300/50 shadow-sm hover:shadow-md transition-all duration-200 text-base-content/70 cursor-pointer"
          >
            {theme === 'light' ? (
              <FaMoon className="text-primary" />
            ) : (
              <FaSun className="text-accent" />
            )}
            <span className="text-sm font-medium">
              {theme === 'light' ? 'Dark' : 'Light'}
            </span>
          </button>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-base-content/70 hover:text-primary hover:bg-base-200/50 border border-transparent hover:border-base-300/50 transition-all duration-200 font-medium"
              >
                <FaSignInAlt className="text-sm" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
              >
                <FaUserPlus className="text-sm" />
                Get Started
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end" ref={menuRef}>
              <label
                tabIndex={0}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-base-200/50 backdrop-blur-sm hover:bg-base-300/50 border border-base-300/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="font-medium text-base-content">
                  {user.name || 'User'}
                </span>
                <FaChevronDown className="text-xs text-base-content/50 group-hover:text-primary transition-colors duration-200" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-3 shadow-xl bg-base-100 rounded-2xl border border-base-300/50 w-64 mt-2 backdrop-blur-sm"
              >
                <li className="mb-1">
                  <a
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-all duration-200 cursor-pointer text-base-content/70 hover:text-primary"
                    onClick={() => navigate('/profile')}
                  >
                    <FaCog className="text-base-content/50" />
                    <span className="font-medium">Profile Settings</span>
                  </a>
                </li>
                <li>
                  <a
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-error/10 transition-all duration-200 cursor-pointer text-error hover:text-error-dark"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="text-error" />
                    <span className="font-medium">Sign Out</span>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-base-200/50 backdrop-blur-sm hover:bg-base-300/50 border border-base-300/50 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {theme === 'light' ? (
              <FaMoon className="text-primary" />
            ) : (
              <FaSun className="text-accent" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2.5 rounded-xl bg-base-200/50 backdrop-blur-sm hover:bg-base-300/50 border border-base-300/50 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isMenuOpen ? (
              <FaTimes className="text-base-content/70" />
            ) : (
              <FaBars className="text-base-content/70" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden bg-base-100/95 backdrop-blur-md border-t border-base-300/50 shadow-xl"
          ref={menuRef}
        >
          {!user ? (
            <div className="p-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300/50 transition-all duration-200 text-base-content/70 hover:text-primary"
              >
                <FaSignInAlt className="text-base-content/50" />
                <span className="font-medium">Sign In</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 w-full p-4 rounded-xl text-white bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FaUserPlus className="text-white" />
                <span className="font-medium">Get Started</span>
              </Link>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-base-200 border border-base-300/50">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-base-content">{user.name}</p>
                  <p className="text-sm text-base-content/70 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  onClick={() => {
                    navigate('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-base-200 border border-transparent hover:border-base-300/50 transition-all duration-200 cursor-pointer text-base-content/70 hover:text-primary"
                >
                  <FaCog className="text-base-content/50" />
                  <span className="font-medium">Profile Settings</span>
                </a>
                <a
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-error/10 border border-transparent hover:border-error/20 transition-all duration-200 cursor-pointer text-error hover:text-error-dark"
                >
                  <FaSignOutAlt className="text-error" />
                  <span className="font-medium">Sign Out</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
