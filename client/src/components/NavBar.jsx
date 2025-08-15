import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaCog,
  FaSun,
  FaMoon,
  FaShieldAlt,
  FaChevronDown,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { i18n, t } = useTranslation('common');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(newLang);
  };
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
    <nav className="bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 group hover:scale-105 transition-all duration-300"
        >
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FaShieldAlt className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-base-content">
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
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-base-200 text-base-content hover:bg-base-300 transition-colors duration-200 cursor-pointer"
          >
            {theme === 'light' ? (
              <FaMoon className="text-xl text-primary" />
            ) : (
              <FaSun className="text-xl text-accent" />
            )}
          </button>

          {/* language change button (Desktop) */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 w-24 border rounded-md transition-colors duration-300 flex items-center justify-center
            bg-base-200 text-base-content border-base-300
            hover:bg-base-300 hover:border-base-400 cursor-pointer"
          >
            <span className="mr-2">🌐</span>
            {i18n.language === 'en' ? 'नेपाली' : 'English'}
          </button>
          
          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white bg-primary hover:bg-primary-focus transition-colors duration-200 font-medium"
              >
                <FaSignInAlt className="text-sm" />
                Sign In
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end" ref={menuRef}>
              <label
                tabIndex={0}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-base-200 hover:bg-base-300 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
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
                className="dropdown-content menu p-2 bg-base-100 rounded-lg border border-base-300 w-64 mt-2"
              >
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-all duration-200 text-base-content/70 hover:text-primary"
                  >
                    <FaCog className="text-base-content/50" />
                    <span className="font-medium">Profile Settings</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-error/10 transition-all duration-200 text-error cursor-pointer"
                  >
                    <FaSignOutAlt className="text-error" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-200"
          >
            {theme === 'light' ? (
              <FaMoon className="text-primary" />
            ) : (
              <FaSun className="text-primary" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2.5 rounded-lg bg-base-200 hover:bg-base-300 transition-colors duration-200"
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
          className="md:hidden bg-base-100 border-t border-base-300 shadow-xl"
          ref={menuRef}
        >
          {/* Mobile-specific options container */}
          <div className="p-4 space-y-2 border-b border-base-300">
            {/* language change button (Mobile) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-start w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-all duration-200 text-base-content/70 hover:text-primary"
            >
              <span className="mr-4 text-xl">🌐</span>
              <span className="font-medium">
                {i18n.language === 'en' ? 'नेपाली' : 'English'}
              </span>
            </button>
          </div>
          {!user ? (
            <div className="p-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 w-full p-4 rounded-lg hover:bg-base-200 transition-all duration-200 text-base-content/70 hover:text-primary"
              >
                <FaSignInAlt className="text-base-content/50" />
                <span className="font-medium">Sign In</span>
              </Link>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-3 p-4 mb-4 rounded-lg bg-base-200 border border-base-300">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
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
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 w-full p-4 rounded-lg hover:bg-base-200 transition-all duration-200 text-base-content/70 hover:text-primary"
                >
                  <FaCog className="text-base-content/50" />
                  <span className="font-medium">Profile Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-4 rounded-lg hover:bg-error/10 transition-all duration-200 text-error"
                >
                  <FaSignOutAlt className="text-error" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}