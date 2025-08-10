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

export default function Home() {
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

  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: 'खोप अभिलेख',
      description:
        'बालबालिका र आमाहरूको खोप रेकर्डहरू सजिलै ट्र्याक र व्यवस्थापन गर्नुहोस्।',
      gradient: 'from-blue-500 to-cyan-500',
      color: 'blue',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'प्रोफाइल व्यवस्थापन',
      description:
        'प्रोफाइलहरू थप्नुहोस् र एकै ठाउँमा सबै जानकारी व्यवस्थित गर्नुहोस्।',
      gradient: 'from-purple-500 to-pink-500',
      color: 'purple',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: 'सुरक्षित र सजिलो',
      description:
        'हाम्रो प्लेटफर्मले डेटा सुरक्षित राख्छ र प्रयोग गर्न सजिलो बनाउँछ।',
      gradient: 'from-green-500 to-teal-500',
      color: 'green',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: 'प्रगति ट्र्याकिङ',
      description: 'खोप कार्यक्रमको प्रगति र समयसूची निगरानी गर्नुहोस्।',
      gradient: 'from-orange-500 to-red-500',
      color: 'orange',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-5 5v-5zM12 17l-7-7 7-7m5 7l7-7-7 7"
          />
        </svg>
      ),
      title: 'स्मार्ट अलर्ट',
      description: 'आगामी खोपका लागि स्वचालित रिमाइन्डर र सूचनाहरू पाउनुहोस्।',
      gradient: 'from-indigo-500 to-purple-500',
      color: 'indigo',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: 'स्वास्थ्य निगरानी',
      description: 'समग्र स्वास्थ्य र खोप इतिहासको व्यापक रेकर्ड राख्नुहोस्।',
      gradient: 'from-emerald-500 to-blue-500',
      color: 'emerald',
    },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div
          className={`absolute top-20 left-10 w-72 h-72 ${
            isDark ? 'bg-blue-500/10' : 'bg-blue-400/20'
          } rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-20 right-10 w-96 h-96 ${
            isDark ? 'bg-purple-500/10' : 'bg-purple-400/20'
          } rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${
            isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/20'
          } rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: '0.5s' }}
        ></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${
              isDark ? 'bg-white/10' : 'bg-blue-300/30'
            } rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${
              isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.1)'
            } 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Enhanced Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`relative group p-4 rounded-2xl ${
            isDark
              ? 'bg-gray-800/80 hover:bg-gray-700/80 border-gray-600/50'
              : 'bg-white/80 hover:bg-blue-50/80 border-blue-200/50'
          } backdrop-blur-md border shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
          aria-label="Toggle Theme"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {theme === 'light' ? (
            <FaMoon className="text-blue-600 w-5 h-5 relative z-10" />
          ) : (
            <FaSun className="text-yellow-400 w-5 h-5 relative z-10" />
          )}
        </button>
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full">
          {/* Enhanced Hero Section */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            {/* Enhanced Logo */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Enhanced Title */}
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                  खोप अनुगमन प्रणाली
                </span>
                <br />
                <span
                  className={`${
                    isDark ? 'text-gray-100' : 'text-gray-800'
                  } text-3xl sm:text-4xl lg:text-5xl font-bold`}
                >
                  मा स्वागत छ
                </span>
              </h1>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-70"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full animate-pulse opacity-70"></div>
            </div>

            {/* Enhanced Description */}
            <div
              className={`relative max-w-4xl mx-auto mb-12 p-6 rounded-2xl ${
                isDark
                  ? 'bg-gray-800/30 border-gray-700/50'
                  : 'bg-white/50 border-blue-200/30'
              } backdrop-blur-sm border shadow-lg`}
            >
              <p
                className={`text-lg sm:text-xl ${
                  isDark ? 'text-gray-200' : 'text-gray-700'
                } leading-relaxed`}
              >
                छोराछोरी र आमाहरूको खोप अभिलेख सजिलै व्यवस्थापन गर्नुहोस्।
                हाम्रो सहज र सुरक्षित प्लेटफर्मले तपाईंको स्वास्थ्य डेटा
                व्यवस्थित र पहुँचयोग्य बनाउँछ।
              </p>
            </div>

            {/* Enhanced CTA Button */}
            <div className="flex justify-center mb-16">
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <FaShieldAlt className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">सुरु गर्नुहोस्</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              </Link>
            </div>
          </div>

          {/* Enhanced Features Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-3xl ${
                  isDark
                    ? 'bg-gray-800/40 hover:bg-gray-700/60 border-gray-600/30'
                    : 'bg-white/60 hover:bg-white/80 border-blue-200/30'
                } backdrop-blur-md p-8 border shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{
                  minHeight: `${cardHeight}px`,
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                ></div>

                {/* Enhanced Icon */}
                <div className="relative mb-6 flex justify-center">
                  <div
                    className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {feature.icon}
                    <div
                      className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                    ></div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative text-center">
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-800'
                    } mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${feature.gradient} group-hover:bg-clip-text transition-all duration-300`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    } leading-relaxed`}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <div
                  className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </div>
            ))}

            {/* Enhanced Resize Handle */}
            <div
              className={`absolute bottom-0 left-0 w-full h-2 group cursor-row-resize ${
                !isResizing && 'transition-all duration-200'
              }`}
              onMouseDown={startResizing}
            >
              <div
                className={`w-full h-full rounded-full ${
                  isResizing
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                    : `${isDark ? 'bg-gray-600/50' : 'bg-gray-300/50'} group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:shadow-lg`
                } transition-all duration-200`}
              ></div>
              <div className="absolute left-1/2 bottom-2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div
                  className={`${
                    isDark ? 'bg-gray-700' : 'bg-gray-800'
                  } text-white p-2 rounded-lg shadow-lg`}
                >
                  <FaGripHorizontal className="text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Resize overlay */}
          {isResizing && (
            <div
              className="fixed inset-0 cursor-row-resize z-50"
              style={{ backgroundColor: 'transparent' }}
            />
          )}

          {/* Enhanced Stats Section */}
          <div
            className={`mt-20 text-center transition-all duration-1000 delay-500 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <div
              className={`inline-flex flex-col lg:flex-row gap-6 p-8 rounded-3xl ${
                isDark
                  ? 'bg-gray-800/40 border-gray-600/30'
                  : 'bg-white/60 border-blue-200/30'
              } backdrop-blur-md border shadow-2xl`}
            >
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <div
                  className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-2`}
                >
                  कुल प्रयोगकर्ता
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                  10,000+
                </div>
                <div
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } flex items-center justify-center gap-1`}
                >
                  <FaStar className="w-3 h-3 text-yellow-500" />
                  दैनिक वृद्धि
                </div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <div
                  className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-2`}
                >
                  खोप रेकर्ड
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  50,000+
                </div>
                <div
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } flex items-center justify-center gap-1`}
                >
                  <FaShieldAlt className="w-3 h-3 text-green-500" />
                  सुरक्षित भण्डारण
                </div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-teal-500/10">
                <div
                  className={`text-sm font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-2`}
                >
                  सेवा उपलब्धता
                </div>
                <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div
                  className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } flex items-center justify-center gap-1`}
                >
                  <FaHeart className="w-3 h-3 text-red-500" />
                  २४/७ सेवा
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div
            className={`mt-20 text-center transition-all duration-1000 delay-700 ${
              isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <div
              className={`relative p-12 rounded-3xl ${
                isDark
                  ? 'bg-gray-800/40 border-gray-600/30'
                  : 'bg-white/60 border-blue-200/30'
              } backdrop-blur-md border shadow-2xl overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
              <div className="relative">
                <h2
                  className={`text-4xl font-black ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } mb-6`}
                >
                  आजै सुरु गर्नुहोस्
                </h2>
                <p
                  className={`text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } mb-8 max-w-2xl mx-auto leading-relaxed`}
                >
                  तपाईंको परिवारको स्वास्थ्य रेकर्ड व्यवस्थापन गर्न र खोप
                  कार्यक्रम ट्र्याक गर्न आज नै सुरु गर्नुहोस्।
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <FaShieldAlt className="w-5 h-5" />
                    <span>लगिन गर्नुहोस्</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to="/register"
                    className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 ${
                      isDark
                        ? 'bg-gray-700/50 hover:bg-gray-600/50 text-white border-gray-600'
                        : 'bg-white/50 hover:bg-white/70 text-gray-700 border-gray-300'
                    } font-bold rounded-2xl border backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                  >
                    <FaHeart className="w-5 h-5" />
                    <span>दर्ता गर्नुहोस्</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
