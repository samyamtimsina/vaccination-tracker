import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaChild,
  FaFemale,
  FaSignOutAlt,
  FaSearch,
  FaUserPlus,
  FaBell,
  FaCalendarAlt,
  FaClock,
  FaGripHorizontal,
} from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [activityHeight, setActivityHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const activityRef = useRef(null);

  const SNAP_POINTS = {
    COLLAPSED: 200,
    EXPANDED: 600,
  };

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResize = useCallback(
    (e) => {
      const newHeight = Math.max(
        SNAP_POINTS.COLLAPSED,
        Math.min(e.clientY, 800),
      );
      setActivityHeight(newHeight);
    },
    [SNAP_POINTS.COLLAPSED],
  );

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResizing);
    }
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, handleResize, stopResizing]);

  useEffect(() => {
    if (!isResizing) {
      const snapTo =
        activityHeight > (SNAP_POINTS.COLLAPSED + SNAP_POINTS.EXPANDED) / 2
          ? SNAP_POINTS.EXPANDED
          : SNAP_POINTS.COLLAPSED;
      setActivityHeight(snapTo);
    }
  }, [isResizing, activityHeight, SNAP_POINTS]);

  const stats = [
    {
      label: 'Children',
      value: 120,
      icon: <FaChild className="text-white text-2xl" />,
      link: '/view-children',
      bg: 'bg-blue-600',
    },
    {
      label: 'Mothers',
      value: 80,
      icon: <FaFemale className="text-white text-2xl" />,
      link: '/view-mothers',
      bg: 'bg-pink-600',
    },
    {
      label: 'Upcoming Vaccinations',
      value: 24,
      icon: <FaCalendarAlt className="text-white text-2xl" />,
      link: '/search-records',
      bg: 'bg-emerald-600',
    },
  ];

  const recentActivity = [
    {
      action: 'Child record added',
      by: user?.name || 'User',
      time: '2 mins ago',
      icon: <FaChild className="text-blue-500" />,
      status: 'success',
    },
    {
      action: 'Mother record updated',
      by: 'Health Officer',
      time: '15 mins ago',
      icon: <FaFemale className="text-pink-500" />,
      status: 'info',
    },
    {
      action: 'Vaccination scheduled',
      by: 'Admin',
      time: '1 hour ago',
      icon: <FaCalendarAlt className="text-emerald-500" />,
      status: 'success',
    },
    {
      action: 'SMS reminder sent',
      by: 'System',
      time: '3 hours ago',
      icon: <FaBell className="text-orange-500" />,
      status: 'warning',
    },
  ];

  const quickActions = [
    {
      label: 'Add Child',
      icon: <FaChild />,
      to: '/add-child',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'Add Mother',
      icon: <FaUserPlus />,
      to: '/add-mother',
      color: 'bg-pink-600 hover:bg-pink-700',
    },
    {
      label: 'Search Records',
      icon: <FaSearch />,
      to: '/search-records',
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
  ];

  return (
    <main className="min-h-screen bg-base-100 flex flex-col relative">
      <div className="flex flex-1">
        {/* Main Content */}
        <section className="flex-1 p-8 space-y-8 max-w-7xl mx-auto relative z-10">
          {/* Hero Welcome Header */}
          <div className="bg-primary text-primary-content rounded-xl p-8 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold">
                  Welcome, {user?.name || 'User'} 👋
                </h1>
                <p className="text-lg font-medium opacity-90">
                  Here's what's happening today.
                </p>
              </div>
              <button
                onClick={logout}
                className="bg-primary-focus/20 text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus transition-all duration-200 flex items-center gap-2 font-semibold"
              >
                <FaSignOutAlt className="text-lg" /> Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map(({ label, value, icon, link, bg }) => (
              <Link key={label} to={link} className="group">
                <div className="bg-base-200 rounded-lg p-6 border border-base-300 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${bg} p-3 rounded-md shadow-md`}>
                      {icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-base-content">
                      {value.toLocaleString()}
                    </div>
                    <div className="text-base-content/70 font-semibold text-lg">
                      {label}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-base-200 rounded-lg p-6 border border-base-300 shadow-md">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-base-content">
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map(({ label, icon, to, color }) => (
                <Link
                  key={label}
                  to={to}
                  className={`${color} text-white px-6 py-4 rounded-lg transition-all duration-200 flex items-center gap-3 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1`}
                >
                  <div className="text-xl">{icon}</div>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div
            className="relative bg-base-200 rounded-lg p-6 border border-base-300 shadow-md"
            ref={activityRef}
          >
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-base-content">
                Recent Activity
              </h3>
            </div>
            <div
              className="space-y-4 overflow-auto"
              style={{ maxHeight: `${activityHeight}px` }}
            >
              {recentActivity.map(({ action, by, time, icon, status }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-base-100 rounded-lg border border-base-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <div className="p-2 bg-base-200 rounded-md shadow-sm">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base-content">{action}</p>
                    <p className="text-base-content/70 font-medium text-sm">
                      by {by}
                    </p>
                  </div>
                  <span className="text-base-content/70 font-medium text-sm">
                    {time}
                  </span>
                </div>
              ))}
            </div>

            {/* Resize Handle */}
            <div
              className="absolute bottom-0 left-0 w-full h-2 group cursor-row-resize flex items-center justify-center transition-all duration-200"
              onMouseDown={startResizing}
            >
              <div
                className={`w-12 h-1 rounded-full ${
                  isResizing
                    ? 'bg-primary'
                    : 'bg-base-300 group-hover:bg-primary'
                } transition-all duration-200`}
              ></div>
            </div>
          </div>

          {/* Resize overlay */}
          {isResizing && (
            <div
              className="fixed inset-0 cursor-row-resize z-50 bg-transparent"
              onMouseUp={stopResizing}
            />
          )}
        </section>
      </div>
    </main>
  );
}
