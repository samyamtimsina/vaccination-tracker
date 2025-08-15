import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  FaMoon,
  FaSun,
  FaGripHorizontal,
  FaShieldAlt,
  FaArrowRight,
  FaStar,
  FaHeart,
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation('home');
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [cardHeight, setCardHeight] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  const isDark = theme === 'dark';

  const SNAP_POINTS = {
    COLLAPSED: 200,
    COMPACT: 320,
    EXPANDED: 400,
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const handleResize = (e) => {
    const newHeight = Math.max(SNAP_POINTS.COLLAPSED, Math.min(e.clientY, 480));
    setCardHeight(newHeight);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResizing);
    }
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  useEffect(() => {
    if (!isResizing) {
      const snapTo = Object.values(SNAP_POINTS).reduce((prev, curr) =>
        Math.abs(curr - cardHeight) < Math.abs(prev - cardHeight) ? curr : prev,
      );
      setCardHeight(snapTo);
    }
  }, [isResizing, cardHeight]);

  const features = t('features', { returnObjects: true }).map((feature, index) => ({
    ...feature,
    icon: [
      <svg key="0" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>,
      <svg key="1" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg key="2" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>,
      <svg key="3" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>,
      <svg key="4" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM12 17l-7-7 7-7m5 7l7-7-7 7" />
      </svg>,
      <svg key="5" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>,
    ][index],
    gradient: [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-emerald-500 to-blue-500',
    ][index],
    color: ['blue', 'purple', 'green', 'orange', 'indigo', 'emerald'][index],
  }));

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${isDark
          ? 'bg-gray-900'
          : 'bg-gray-50'
        }`}
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-24 left-1/2 transform -translate-x-1/2 w-2/3 h-96 ${isDark ? 'bg-blue-900/10' : 'bg-blue-100'
            } rounded-3xl blur-2xl`}
        ></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(90deg, ${isDark ? '#1e293b' : '#e0e7ef'
              } 1px, transparent 1px), linear-gradient(${isDark ? '#1e293b' : '#e0e7ef'
              } 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full mx-auto">
          {/* Hero Section */}
          <div
            className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaShieldAlt className="w-8 h-8 text-white" />
              </div>
            </div>
            {/* Title */}
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('title')}
            </h1>
            <h2 className={`text-xl font-medium mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('welcome')}
            </h2>
            {/* Description */}
            <div
              className={`max-w-2xl mx-auto mb-8 p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } shadow`}
            >
              <p className={`text-base ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {t('description')}
              </p>
            </div>
            {/* CTA Button */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
            >
              <FaShieldAlt className="w-5 h-5" />
              <span>{t('get_started')}</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl border ${isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                  } shadow-sm hover:shadow-md transition p-6 flex flex-col items-center`}
                style={{
                  minHeight: `${cardHeight}px`,
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                {/* Icon */}
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 text-white shadow">
                  {feature.icon}
                </div>
                {/* Title */}
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                {/* Description */}
                <p className={`text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
            {/* Resize Handle */}
            <div
              className="absolute bottom-0 left-0 w-full h-2 cursor-row-resize"
              onMouseDown={startResizing}
            >
              <div
                className={`w-full h-full rounded-full ${isResizing
                    ? 'bg-blue-600'
                    : `${isDark ? 'bg-gray-700' : 'bg-gray-300'}`
                  } transition`}
              ></div>
              <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className={`bg-gray-800 text-white p-2 rounded shadow`}>
                  <FaGripHorizontal className="text-xs" />
                </div>
              </div>
            </div>
          </div>
          {isResizing && (
            <div
              className="fixed inset-0 cursor-row-resize z-50"
              style={{ backgroundColor: 'transparent' }}
            />
          )}

          {/* Stats Section */}
          <div
            className={`mt-10 text-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className={`inline-flex flex-col lg:flex-row gap-6 p-6 rounded-xl border ${isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
                } shadow`}
            >
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <div className="text-sm font-medium text-blue-700 mb-1">
                  {t('stats.total_users')}
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  10,000+
                </div>
                <div className="text-xs text-blue-500 flex items-center justify-center gap-1">
                  <FaStar className="w-3 h-3" />
                  {t('stats.daily_growth')}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <div className="text-sm font-medium text-purple-700 mb-1">
                  {t('stats.vaccination_records')}
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  50,000+
                </div>
                <div className="text-xs text-purple-500 flex items-center justify-center gap-1">
                  <FaShieldAlt className="w-3 h-3" />
                  {t('stats.secure_storage')}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50">
                <div className="text-sm font-medium text-green-700 mb-1">
                  {t('stats.service_availability')}
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  99.9%
                </div>
                <div className="text-xs text-green-500 flex items-center justify-center gap-1">
                  <FaHeart className="w-3 h-3" />
                  {t('stats.24_7_service')}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div
            className={`mt-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className={`p-8 rounded-xl border ${isDark
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
                } shadow`}
            >
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t('cta.title')}
              </h2>
              <p className={`text-base mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
                >
                  <FaShieldAlt className="w-5 h-5" />
                  <span>{t('login')}</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}