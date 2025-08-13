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
  FaBars,
  FaChevronRight,
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClipboardList,
  FaMapMarkerAlt,
  FaPhone,
  FaEye,
} from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [activityHeight, setActivityHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const activityRef = useRef(null);

  const SNAP_POINTS = {
    COLLAPSED: 200,
    EXPANDED: 600,
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const startResizing = () => {
    if (!isMobile) setIsResizing(true);
  };

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResize = useCallback(
    (e) => {
      if (isMobile) return;
      const newHeight = Math.max(
        SNAP_POINTS.COLLAPSED,
        Math.min(e.clientY, 800),
      );
      setActivityHeight(newHeight);
    },
    [SNAP_POINTS.COLLAPSED, isMobile],
  );

  useEffect(() => {
    if (isResizing && !isMobile) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResizing);
    }
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, handleResize, stopResizing, isMobile]);

  useEffect(() => {
    if (!isResizing && !isMobile) {
      const snapTo =
        activityHeight > (SNAP_POINTS.COLLAPSED + SNAP_POINTS.EXPANDED) / 2
          ? SNAP_POINTS.EXPANDED
          : SNAP_POINTS.COLLAPSED;
      setActivityHeight(snapTo);
    }
  }, [isResizing, activityHeight, SNAP_POINTS, isMobile]);

  const mainStats = [
    {
      label: 'Total Children Registered',
      value: 1247,
      icon: <FaChild className="text-2xl" />,
      link: '/view-children',
      change: '+12.5%',
      changeType: 'positive',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      description: 'This month',
    },
    {
      label: 'Total Mothers Registered',
      value: 894,
      icon: <FaFemale className="text-2xl" />,
      link: '/view-mothers',
      change: '+8.3%',
      changeType: 'positive',
      bgColor: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      description: 'This month',
    },
    {
      label: 'Pending Vaccinations',
      value: 156,
      icon: <FaCalendarAlt className="text-2xl" />,
      link: '/search-records',
      change: '-5.2%',
      changeType: 'negative',
      bgColor: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      description: 'Next 7 days',
    },
    {
      label: 'Completed Today',
      value: 23,
      icon: <FaCheckCircle className="text-2xl" />,
      link: '/search-records',
      change: '+15.8%',
      changeType: 'positive',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      description: 'Today',
    },
  ];

  const alertsAndNotifications = [
    {
      type: 'urgent',
      title: 'Vaccination Due',
      message: '15 children have overdue vaccinations',
      time: '2 hours ago',
      icon: <FaExclamationTriangle className="text-red-500" />,
      action: '/view-children?filter=overdue',
    },
    {
      type: 'info',
      title: 'Weekly Report',
      message: 'Weekly vaccination report is ready',
      time: '1 day ago',
      icon: <FaClipboardList className="text-blue-500" />,
      action: '/reports',
    },
    {
      type: 'success',
      title: 'Goal Achieved',
      message: 'Monthly vaccination target reached',
      time: '2 days ago',
      icon: <FaCheckCircle className="text-emerald-500" />,
      action: '/dashboard',
    },
  ];

  const recentActivity = [
    {
      action: 'Child registration completed',
      details: 'Rajesh Kumar (Age: 2 months)',
      by: user?.name || 'Health Worker',
      time: '5 minutes ago',
      icon: <FaChild className="text-blue-500" />,
      status: 'success',
      location: 'Birtamod Clinic',
    },
    {
      action: 'Vaccination administered',
      details: 'BCG vaccine for Sita Rai',
      by: 'Dr. Sharma',
      time: '12 minutes ago',
      icon: <FaCheckCircle className="text-emerald-500" />,
      status: 'success',
      location: 'Main Health Center',
    },
    {
      action: 'Mother record updated',
      details: 'Contact information updated',
      by: 'Registration Officer',
      time: '25 minutes ago',
      icon: <FaFemale className="text-rose-500" />,
      status: 'info',
      location: 'Sub Health Post',
    },
    {
      action: 'Appointment scheduled',
      details: '5 children scheduled for next week',
      by: 'System',
      time: '45 minutes ago',
      icon: <FaCalendarAlt className="text-amber-500" />,
      status: 'info',
      location: 'Multiple locations',
    },
    {
      action: 'SMS reminders sent',
      details: '127 mothers notified about upcoming vaccinations',
      by: 'System',
      time: '1 hour ago',
      icon: <FaBell className="text-purple-500" />,
      status: 'info',
      location: 'District wide',
    },
    {
      action: 'Stock alert generated',
      details: 'DPT vaccine stock running low',
      by: 'Inventory System',
      time: '2 hours ago',
      icon: <FaExclamationTriangle className="text-red-500" />,
      status: 'warning',
      location: 'Central Store',
    },
  ];

  const quickActions = [
    {
      label: 'Register Child',
      icon: <FaChild />,
      to: '/add-child',
      description: 'Add new child to the system',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      count: null,
    },
    {
      label: 'Register Mother',
      icon: <FaUserPlus />,
      to: '/add-mother',
      description: 'Register expecting or new mother',
      color: 'text-rose-600',
      bgColor: 'bg-rose-500',
      count: null,
    },
    {
      label: 'Search Records',
      icon: <FaSearch />,
      to: '/search-records',
      description: 'Find child or mother records',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500',
      count: null,
    },
    {
      label: 'View All Children',
      icon: <FaUsers />,
      to: '/view-children',
      description: 'Browse all registered children',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      count: '1,247',
    },
    {
      label: 'Pending Vaccinations',
      icon: <FaCalendarAlt />,
      to: '/pending-vaccinations',
      description: 'View upcoming vaccination schedule',
      color: 'text-amber-600',
      bgColor: 'bg-amber-500',
      count: '156',
    },
    {
      label: 'Generate Report',
      icon: <FaChartLine />,
      to: '/reports',
      description: 'Create vaccination reports',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500',
      count: null,
    },
  ];

  // Mobile header
  const MobileHeader = () => (
    <div className="md:hidden bg-base-100 border-b border-base-300 px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.toggleSidebar?.()}
          className="p-2 hover:bg-base-200 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <FaBars className="text-base-content" />
        </button>
        <div>
          <h1 className="font-bold text-base-content">Dashboard</h1>
          <p className="text-xs text-base-content/60">Vaccine System</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right mr-2">
          <div className="text-xs text-base-content/60">
            {currentTime.toLocaleDateString()}
          </div>
          <div className="text-sm font-medium text-base-content">
            {currentTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 hover:bg-base-200 rounded-lg transition-colors text-base-content/70"
          aria-label="Logout"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <MobileHeader />
      <main className="min-h-screen bg-base-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Welcome Section with Time */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-primary/90 text-primary-content rounded-xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-focus opacity-20"></div>
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-content/80 text-sm">
                      <FaClock />
                      <span>
                        {currentTime.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="ml-2">
                        {currentTime.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                      Good{' '}
                      {currentTime.getHours() < 12
                        ? 'Morning'
                        : currentTime.getHours() < 17
                          ? 'Afternoon'
                          : 'Evening'}
                      , {user?.name || 'User'}
                    </h1>
                    <p className="text-primary-content/90 text-sm sm:text-base lg:text-lg">
                      Here's your vaccination management system overview
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center gap-4">
                    <div className="bg-primary-content/10 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <div className="text-sm text-primary-content/70">
                        System Status
                      </div>
                      <div className="flex items-center gap-2 text-primary-content font-semibold">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Online
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-primary-content/10 hover:bg-primary-content/20 backdrop-blur-sm px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {mainStats.map(
              ({
                label,
                value,
                icon,
                link,
                change,
                changeType,
                bgColor,
                lightBg,
                description,
              }) => (
                <Link key={label} to={link} className="group block">
                  <div className="bg-base-100 border border-base-300 rounded-xl p-6 hover:shadow-lg hover:border-base-content/20 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`${bgColor} text-white p-3 rounded-lg shadow-md`}
                      >
                        {icon}
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          changeType === 'positive'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {changeType === 'positive' ? (
                          <FaArrowTrendUp className="text-xs" />
                        ) : (
                          <FaArrowTrendDown className="text-xs" />
                        )}
                        {change}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-base-content">
                        {value.toLocaleString()}
                      </div>
                      <div className="text-base-content/60 font-medium">
                        {label}
                      </div>
                      <div className="text-xs text-base-content/50">
                        {description}
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>

          {/* Alerts and Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
            {/* Alerts */}
            <div className="lg:col-span-1">
              <div className="bg-base-100 border border-base-300 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
                    <FaBell className="text-amber-500" />
                    Alerts
                  </h3>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    3
                  </span>
                </div>
                <div className="space-y-3">
                  {alertsAndNotifications.slice(0, 3).map((alert, idx) => (
                    <Link
                      key={idx}
                      to={alert.action}
                      className="block p-3 bg-base-50 hover:bg-base-200 rounded-lg border border-base-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{alert.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base-content text-sm">
                            {alert.title}
                          </div>
                          <div className="text-xs text-base-content/60 mt-1">
                            {alert.message}
                          </div>
                          <div className="text-xs text-base-content/50 mt-1">
                            {alert.time}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-base-100 border border-base-300 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-base-content mb-6">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickActions.map(
                    ({
                      label,
                      icon,
                      to,
                      description,
                      color,
                      bgColor,
                      count,
                    }) => (
                      <Link key={label} to={to} className="group relative">
                        <div className="bg-base-50 hover:bg-base-200 border border-base-200 hover:border-base-300 p-4 rounded-lg transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className={`${bgColor} text-white p-2 rounded-lg text-sm shadow-sm`}
                            >
                              {icon}
                            </div>
                            {count && (
                              <span className="bg-base-300 text-base-content text-xs px-2 py-1 rounded-full font-semibold">
                                {count}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-base-content text-sm mb-1">
                              {label}
                            </h4>
                            <p className="text-xs text-base-content/60">
                              {description}
                            </p>
                          </div>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaChevronRight className="text-base-content/40 text-xs" />
                          </div>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div
            className="bg-base-100 border border-base-300 rounded-xl p-6 relative"
            ref={activityRef}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
                <FaClipboardList className="text-blue-500" />
                Recent Activity
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/60">
                  Live updates
                </span>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div
              className="space-y-4 overflow-auto"
              style={{
                maxHeight: isMobile ? '400px' : `${activityHeight}px`,
                height: isMobile ? 'auto' : `${activityHeight}px`,
              }}
            >
              {recentActivity.map(
                (
                  { action, details, by, time, icon, status, location },
                  idx,
                ) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-base-50 hover:bg-base-200 rounded-lg border border-base-200 transition-all duration-200"
                  >
                    <div className="flex-shrink-0 p-2 bg-base-100 rounded-lg border border-base-300 mt-1">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-base-content text-sm">
                            {action}
                          </p>
                          {details && (
                            <p className="text-sm text-base-content/70 mt-1">
                              {details}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
                            <span className="flex items-center gap-1">
                              <FaUsers className="text-xs" />
                              by {by}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-xs" />
                              {location}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-xs text-base-content/60 font-medium">
                          {time}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Desktop Resize Handle */}
            {!isMobile && (
              <div
                className="absolute bottom-0 left-0 w-full h-4 group cursor-row-resize flex items-center justify-center"
                onMouseDown={startResizing}
              >
                <div className="flex items-center justify-center h-full">
                  <div
                    className={`w-12 h-1 rounded-full ${
                      isResizing
                        ? 'bg-primary'
                        : 'bg-base-300 group-hover:bg-primary'
                    } transition-all duration-200`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Resize Overlay */}
          {isResizing && !isMobile && (
            <div
              className="fixed inset-0 cursor-row-resize z-50 bg-transparent"
              onMouseUp={stopResizing}
            />
          )}
        </div>
      </main>
    </>
  );
}
