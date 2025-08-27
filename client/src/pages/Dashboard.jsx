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
  FaBars,
  FaChevronRight,
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClipboardList,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
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

  // Dynamic data (to be replaced with API calls)
  const mainStats = [
    {
      label: t('main_stats.children_registered.label'),
      value: 1247, // Dynamic
      icon: <FaChild className="text-2xl" />,
      link: '/view-children',
      change: '12.5', // Dynamic
      changeType: 'positive',
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
      description: t('main_stats.children_registered.description'),
    },
    {
      label: t('main_stats.mothers_registered.label'),
      value: 894, // Dynamic
      icon: <FaFemale className="text-2xl" />,
      link: '/view-mothers',
      change: '8.3', // Dynamic
      changeType: 'positive',
      bgColor: 'bg-rose-500',
      lightBg: 'bg-rose-50',
      description: t('main_stats.mothers_registered.description'),
    },
    {
      label: t('main_stats.pending_vaccinations.label'),
      value: 156, // Dynamic
      icon: <FaCalendarAlt className="text-2xl" />,
      link: '/search-records',
      change: '5.2', // Dynamic
      changeType: 'negative',
      bgColor: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      description: t('main_stats.pending_vaccinations.description'),
    },
    {
      label: t('main_stats.completed_today.label'),
      value: 23, // Dynamic
      icon: <FaCheckCircle className="text-2xl" />,
      link: '/search-records',
      change: '15.8', // Dynamic
      changeType: 'positive',
      bgColor: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      description: t('main_stats.completed_today.description'),
    },
  ];

  const alertsAndNotifications = [
    {
      type: 'urgent',
      title: t('alerts.vaccination_due.title'),
      message: t('alerts.vaccination_due.message', { count: 15 }), // Dynamic count
      time: t('alerts.vaccination_due.time', { time: '2 hours' }), // Dynamic time
      icon: <FaExclamationTriangle className="text-red-500" />,
      action: '/view-children?filter=overdue',
    },
    {
      type: 'info',
      title: t('alerts.weekly_report.title'),
      message: t('alerts.weekly_report.message'),
      time: t('alerts.weekly_report.time', { time: '1 day' }), // Dynamic time
      icon: <FaClipboardList className="text-blue-500" />,
      action: '/reports',
    },
    {
      type: 'success',
      title: t('alerts.goal_achieved.title'),
      message: t('alerts.goal_achieved.message'),
      time: t('alerts.goal_achieved.time', { time: '2 days' }), // Dynamic time
      icon: <FaCheckCircle className="text-emerald-500" />,
      action: '/dashboard',
    },
  ];

  const recentActivity = [
    {
      action: t('recent_activity.child_registration.action'),
      details: 'Rajesh Kumar (Age: 2 months)', // Dynamic
      by: t('recent_activity.child_registration.by', { user: user?.name || 'Health Worker' }), // Dynamic user
      time: t('recent_activity.child_registration.time', { time: '5 minutes' }), // Dynamic time
      icon: <FaChild className="text-blue-500" />,
      status: 'success',
      location: t('recent_activity.child_registration.location', { location: 'Birtamod Clinic' }), // Dynamic location
    },
    {
      action: t('recent_activity.vaccination_administered.action'),
      details: 'BCG vaccine for Sita Rai', // Dynamic
      by: t('recent_activity.vaccination_administered.by', { user: 'Dr. Sharma' }), // Dynamic user
      time: t('recent_activity.vaccination_administered.time', { time: '12 minutes' }), // Dynamic time
      icon: <FaCheckCircle className="text-emerald-500" />,
      status: 'success',
      location: t('recent_activity.vaccination_administered.location', { location: 'Main Health Center' }), // Dynamic location
    },
    {
      action: t('recent_activity.mother_record_updated.action'),
      details: 'Contact information updated', // Dynamic
      by: t('recent_activity.mother_record_updated.by', { user: 'Registration Officer' }), // Dynamic user
      time: t('recent_activity.mother_record_updated.time', { time: '25 minutes' }), // Dynamic time
      icon: <FaFemale className="text-rose-500" />,
      status: 'info',
      location: t('recent_activity.mother_record_updated.location', { location: 'Sub Health Post' }), // Dynamic location
    },
    {
      action: t('recent_activity.appointment_scheduled.action'),
      details: '5 children scheduled for next week', // Dynamic
      by: t('recent_activity.appointment_scheduled.by', { user: 'System' }), // Dynamic user
      time: t('recent_activity.appointment_scheduled.time', { time: '45 minutes' }), // Dynamic time
      icon: <FaCalendarAlt className="text-amber-500" />,
      status: 'info',
      location: t('recent_activity.appointment_scheduled.location', { location: 'Multiple locations' }), // Dynamic location
    },
    {
      action: t('recent_activity.sms_reminders.action'),
      details: '127 mothers notified about upcoming vaccinations', // Dynamic
      by: t('recent_activity.sms_reminders.by', { user: 'System' }), // Dynamic user
      time: t('recent_activity.sms_reminders.time', { time: '1 hour' }), // Dynamic time
      icon: <FaBell className="text-purple-500" />,
      status: 'info',
      location: t('recent_activity.sms_reminders.location', { location: 'District wide' }), // Dynamic location
    },
    {
      action: t('recent_activity.stock_alert.action'),
      details: 'DPT vaccine stock running low', // Dynamic
      by: t('recent_activity.stock_alert.by', { user: 'Inventory System' }), // Dynamic user
      time: t('recent_activity.stock_alert.time', { time: '2 hours' }), // Dynamic time
      icon: <FaExclamationTriangle className="text-red-500" />,
      status: 'warning',
      location: t('recent_activity.stock_alert.location', { location: 'Central Store' }), // Dynamic location
    },
  ];

  const quickActions = [
    {
      label: t('quick_actions.register_child.label'),
      icon: <FaChild />,
      to: '/add-child',
      description: t('quick_actions.register_child.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      count: null,
    },
    {
      label: t('quick_actions.register_mother.label'),
      icon: <FaUserPlus />,
      to: '/add-mother',
      description: t('quick_actions.register_mother.description'),
      color: 'text-rose-600',
      bgColor: 'bg-rose-500',
      count: null,
    },
    {
      label: t('quick_actions.search_records.label'),
      icon: <FaSearch />,
      to: '/search-records',
      description: t('quick_actions.search_records.description'),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500',
      count: null,
    },
    {
      label: t('quick_actions.view_all_children.label'),
      icon: <FaUsers />,
      to: '/view-children',
      description: t('quick_actions.view_all_children.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-500',
      count: t('quick_actions.view_all_children.count', { count: '1,247' }), // Dynamic count
    },
    {
      label: t('quick_actions.pending_vaccinations.label'),
      icon: <FaCalendarAlt />,
      to: '/pending-vaccinations',
      description: t('quick_actions.pending_vaccinations.description'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-500',
      count: t('quick_actions.pending_vaccinations.count', { count: '156' }), // Dynamic count
    },
    {
      label: t('quick_actions.generate_report.label'),
      icon: <FaChartLine />,
      to: '/reports',
      description: t('quick_actions.generate_report.description'),
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
          <h1 className="font-bold text-base-content">{t('mobile_header.title')}</h1>
          <p className="text-xs text-base-content/60">{t('mobile_header.subtitle')}</p>
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
          aria-label={t('welcome.logout')}
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
                      {currentTime.getHours() < 12
                        ? t('welcome.greeting_morning', { name: user?.name || 'User' })
                        : currentTime.getHours() < 17
                          ? t('welcome.greeting_afternoon', { name: user?.name || 'User' })
                          : t('welcome.greeting_evening', { name: user?.name || 'User' })}
                    </h1>
                    <p className="text-primary-content/90 text-sm sm:text-base lg:text-lg">
                      {t('welcome.overview')}
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center gap-4">
                    <div className="bg-primary-content/10 px-4 py-3 rounded-lg backdrop-blur-sm">
                      <div className="text-sm text-primary-content/70">
                        {t('welcome.system_status')}
                      </div>
                      <div className="flex items-center gap-2 text-primary-content font-semibold">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        {t('welcome.online')}
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-primary-content/10 hover:bg-primary-content/20 backdrop-blur-sm px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FaSignOutAlt />
                      <span>{t('welcome.logout')}</span>
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
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${changeType === 'positive'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {changeType === 'positive' ? (
                          <FaArrowTrendUp className="text-xs" />
                        ) : (
                          <FaArrowTrendDown className="text-xs" />
                        )}
                        {t(`main_stats.${changeType === 'positive' ? 'change_positive' : 'change_negative'}`, { value: change })}
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
                    {t('alerts.title')}
                  </h3>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    3
                  </span>
                </div>
                <div className="space-y-3">
                  {Array.isArray(alertsAndNotifications) ? (
                    alertsAndNotifications.slice(0, 3).map((alert, idx) => (
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
                    ))
                  ) : (
                    <p className="text-red-300">Alerts not available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="bg-base-100 border border-base-300 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-base-content mb-6">
                  {t('quick_actions.title')}
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
                {t('recent_activity.title')}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/60">
                  {t('recent_activity.live_updates')}
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
              {Array.isArray(recentActivity) ? (
                recentActivity.map(
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
                                {by}
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
                )
              ) : (
                <p className="text-red-300">Activity not available</p>
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
                    className={`w-12 h-1 rounded-full ${isResizing
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