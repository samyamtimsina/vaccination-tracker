import { Link } from 'react-router-dom';
import {
  FaChild,
  FaFemale,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
  FaUserPlus,
  FaBell,
  FaCalendarAlt,
  FaClock,
} from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import SidebarNav from '../components/SideBar';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { FaGripHorizontal } from 'react-icons/fa';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [activityHeight, setActivityHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const SNAP_POINTS = {
    COLLAPSED: 200,
    COMPACT: 400,
    EXPANDED: 600,
  };

  const startResizing = () => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const handleResize = (e) => {
    const newHeight = Math.max(SNAP_POINTS.COLLAPSED, Math.min(e.clientY, 800));
    setActivityHeight(newHeight);
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
        Math.abs(curr - activityHeight) < Math.abs(prev - activityHeight)
          ? curr
          : prev,
      );
      setActivityHeight(snapTo);
    }
  }, [isResizing, activityHeight]);

  const stats = [
    {
      label: 'Children',
      value: 120,
      icon: <FaChild className="text-white text-2xl" />,
      link: '/view-children',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      change: '+12%',
    },
    {
      label: 'Mothers',
      value: 80,
      icon: <FaFemale className="text-white text-2xl" />,
      link: '/view-mothers',
      bgGradient: 'bg-gradient-to-br from-pink-500 to-pink-700',
      change: '+8%',
    },
    {
      label: 'Upcoming Vaccinations',
      value: 24,
      icon: <FaCalendarAlt className="text-white text-2xl" />,
      link: '/search-records',
      bgGradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
      change: '+5',
    },
  ];

  const recentActivity = [
    {
      action: 'Child record added',
      by: user?.name || 'User',
      time: '2 mins ago',
      icon: <FaChild className="text-blue-500 dark:text-blue-400" />,
      status: 'success',
    },
    {
      action: 'Mother record updated',
      by: 'Health Officer',
      time: '15 mins ago',
      icon: <FaFemale className="text-pink-500 dark:text-pink-400" />,
      status: 'info',
    },
    {
      action: 'Vaccination scheduled',
      by: 'Admin',
      time: '1 hour ago',
      icon: (
        <FaCalendarAlt className="text-emerald-500 dark:text-emerald-400" />
      ),
      status: 'success',
    },
    {
      action: 'SMS reminder sent',
      by: 'System',
      time: '3 hours ago',
      icon: <FaBell className="text-orange-500 dark:text-orange-400" />,
      status: 'warning',
    },
  ];

  const quickActions = [
    {
      label: 'Add Child',
      icon: <FaChild />,
      to: '/add-child',
      color:
        'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-200 dark:shadow-blue-900/50',
    },
    {
      label: 'Add Mother',
      icon: <FaUserPlus />,
      to: '/add-mother',
      color:
        'bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 shadow-pink-200 dark:shadow-pink-900/50',
    },
    {
      label: 'Search Records',
      icon: <FaSearch />,
      to: '/search-records',
      color:
        'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-200 dark:shadow-emerald-900/50',
    },
  ];

  // Dark mode aware classes
  const isDark = theme === 'dark';

  return (
    <main className="min-h-screen bg-base-100 flex flex-col relative overflow-hidden">
      {/* Background layers with dark mode support */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 dark:from-primary/5 dark:to-secondary/5"></div>
      <div
        className="absolute inset-0 opacity-20 dark:opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.15)'} 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="flex flex-1">
        {/* Main Content */}
        <section className="flex-1 p-8 space-y-8 max-w-7xl mx-auto relative z-10">
          {/* Hero Welcome Header */}
          <div className="relative bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-8 text-primary-content overflow-hidden shadow-2xl dark:shadow-xl">
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-primary-content/90 bg-clip-text text-transparent">
                    Welcome, {user?.name || 'User'} 👋
                  </h1>
                  <p className="text-xl text-primary-content/90 font-medium">
                    Here's what's happening with your vaccination program today.
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/30 dark:border-white/20 text-primary-content px-6 py-3 rounded-2xl hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <FaSignOutAlt className="text-lg" /> Logout
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 dark:border-white/20">
                  <FaClock className="text-blue-200 dark:text-blue-300" />
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 dark:border-white/20">
                  <FaBell className="text-yellow-200 dark:text-yellow-300" />
                  <span className="font-medium">3 notifications</span>
                </div>
                <div className="flex items-center gap-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 dark:border-white/20">
                  <FaArrowTrendUp className="text-green-200 dark:text-green-300" />
                  <span className="font-medium">All systems active</span>
                </div>
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 dark:bg-white/3 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 dark:from-yellow-400/10 dark:to-pink-400/10 rounded-full blur-xl"></div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map(({ label, value, icon, link, bgGradient, change }) => (
              <Link key={label} to={link} className="group relative">
                <div className="bg-base-200/80 dark:bg-base-300/20 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:shadow-3xl transition-all duration-500 p-8 border border-base-300/50 dark:border-base-content/10 hover:border-base-300/70 dark:hover:border-base-content/20 transform hover:-translate-y-2 hover:scale-105">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`${bgGradient} p-4 rounded-2xl shadow-lg dark:shadow-xl transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      {icon}
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/80 dark:to-emerald-800/80 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-700/50">
                      {change}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl font-black text-base-content group-hover:text-primary transition-colors duration-300">
                      {value.toLocaleString()}
                    </div>
                    <div className="text-base-content/70 font-semibold text-lg">
                      {label}
                    </div>
                  </div>

                  <div className="mt-4 text-primary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    View details →
                  </div>

                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 dark:to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Redesigned Quick Actions */}
          <div className="bg-base-200/80 dark:bg-base-300/20 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-base-300/50 dark:border-base-content/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg dark:shadow-xl">
                <FaArrowTrendUp className="text-primary-content text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-base-content">
                Quick Actions
              </h3>
              <div className="h-px bg-gradient-to-r from-primary/20 dark:from-primary/30 to-transparent flex-1 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map(({ label, icon, to, color }) => (
                <Link
                  key={label}
                  to={to}
                  className={`${color} text-white px-8 py-6 rounded-2xl transition-all duration-300 flex items-center gap-4 font-bold text-lg shadow-lg dark:shadow-xl hover:shadow-2xl dark:hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 group`}
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {icon}
                  </div>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Modern Activity Feed */}
          <div className="relative bg-base-200/80 dark:bg-base-300/20 backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-base-300/50 dark:border-base-content/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-accent to-secondary rounded-xl shadow-lg dark:shadow-xl">
                <FaClock className="text-accent-content text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-base-content">
                Recent Activity
              </h3>
              <div className="h-px bg-gradient-to-r from-accent/20 dark:from-accent/30 to-transparent flex-1 ml-4"></div>
            </div>

            <div
              className="space-y-4 overflow-auto"
              style={{ maxHeight: `${activityHeight}px` }}
            >
              {recentActivity.map(({ action, by, time, icon, status }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-6 p-6 bg-base-100 dark:bg-base-200/50 rounded-xl border border-base-300/50 dark:border-base-content/10 hover:border-base-300 dark:hover:border-base-content/20 hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="p-3 bg-base-200 dark:bg-base-300/50 rounded-xl shadow-md dark:shadow-lg">
                    {icon}
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-base-content text-lg">
                      {action}
                    </p>
                    <p className="text-base-content/70 font-medium">by {by}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-base-content/70 font-medium">
                      {time}
                    </span>
                    <div className="flex justify-end">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          status === 'success'
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600'
                            : status === 'warning'
                              ? 'bg-gradient-to-r from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600'
                              : 'bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600'
                        } shadow-sm`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resize Handle */}
            <div
              className={`absolute bottom-0 left-0 w-full h-1 group cursor-row-resize ${
                !isResizing && 'transition-all duration-200'
              }`}
              onMouseDown={startResizing}
            >
              <div
                className={`w-full h-full ${
                  isResizing
                    ? 'bg-gradient-to-r from-primary to-secondary'
                    : 'bg-base-300/50 dark:bg-base-content/20 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary'
                } transition-all duration-200`}
              ></div>
              <div className="absolute left-1/2 bottom-1 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-base-200 dark:bg-base-300 text-base-content p-1 rounded shadow-lg dark:shadow-xl border border-base-300/50 dark:border-base-content/10">
                  <FaGripHorizontal className="text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Resize overlay */}
          {isResizing && (
            <div className="fixed inset-0 cursor-row-resize z-50 bg-transparent" />
          )}
        </section>
      </div>
    </main>
  );
}
