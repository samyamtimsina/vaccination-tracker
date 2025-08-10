import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  FaChild,
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserCircle,
  FaFemale,
  FaSignOutAlt,
  FaTachometerAlt,
  FaGripVertical,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const menuItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <FaTachometerAlt />,
    type: 'link',
    color: 'from-blue-500 to-blue-600',
  },
  {
    to: '/add-child',
    label: 'Add Child',
    icon: <FaChild />,
    type: 'link',
    color: 'from-green-500 to-green-600',
  },
  {
    to: '/view-children',
    label: 'View Children',
    icon: <FaUsers />,
    type: 'link',
    color: 'from-purple-500 to-purple-600',
  },
  {
    to: '/add-mother',
    label: 'Add Mother',
    icon: <FaUserPlus />,
    type: 'link',
    color: 'from-pink-500 to-pink-600',
  },
  {
    to: '/view-mothers',
    label: 'View Mothers',
    icon: <FaFemale />,
    type: 'link',
    color: 'from-rose-500 to-rose-600',
  },
  {
    to: '/search-records',
    label: 'Search Records',
    icon: <FaSearch />,
    type: 'link',
    color: 'from-orange-500 to-orange-600',
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: <FaUserCircle />,
    type: 'link',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    to: '/',
    label: 'Logout',
    icon: <FaSignOutAlt />,
    type: 'button',
    color: 'from-red-500 to-red-600',
  },
];

export default function SidebarNav() {
  const location = useLocation();
  const { logout } = useAuth();
  const { theme } = useTheme();
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const SNAP_POINTS = {
    COLLAPSED: 72,
    COMPACT: 128,
    EXPANDED: 256,
  };

  const EXPANDED_THRESHOLD = 160;
  const COLLAPSED_THRESHOLD = 100;

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleResize = useCallback(
    (e) => {
      const newWidth = Math.max(
        SNAP_POINTS.COLLAPSED,
        Math.min(e.clientX, 384),
      );
      setSidebarWidth(newWidth);
    },
    [SNAP_POINTS.COLLAPSED],
  );

  const startResizing = () => {
    setIsResizing(true);
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
  }, [isResizing, handleResize, stopResizing]);

  useEffect(() => {
    if (!isResizing) {
      const snapTo = Object.values(SNAP_POINTS).reduce((prev, curr) =>
        Math.abs(curr - sidebarWidth) < Math.abs(prev - sidebarWidth)
          ? curr
          : prev,
      );
      setSidebarWidth(snapTo);
    }
  }, [isResizing, sidebarWidth, SNAP_POINTS]);

  const showText = sidebarWidth > EXPANDED_THRESHOLD;
  const isCompactMode = sidebarWidth < COLLAPSED_THRESHOLD;

  return (
    <aside
      className={`min-h-screen flex flex-col relative overflow-hidden bg-base-100 ${
        isCompactMode ? 'items-center' : ''
      } ${!isResizing && 'transition-all duration-300 ease-in-out'}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Header */}
        {showText && (
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaTachometerAlt className="text-white text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-base-content">Navigation</h2>
                <p className="text-xs text-base-content/70">Vaccine System</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-2">
          {menuItems.map(({ to, label, icon, type, color }, index) => (
            <div key={label} className="w-full">
              {type === 'link' ? (
                <Link
                  to={to}
                  className={`group relative flex items-center p-3 rounded-xl w-full overflow-hidden ${
                    !isResizing && 'transition-all duration-200'
                  } ${showText ? 'gap-3' : 'justify-center'} ${
                    location.pathname === to
                      ? `bg-base-200 shadow-lg border border-base-300/50 text-base-content transform scale-[1.02]`
                      : `text-base-content/70 hover:bg-base-200/70 hover:shadow-md hover:scale-[1.01] backdrop-blur-sm`
                  }`}
                >
                  {/* Active indicator gradient background */}
                  {location.pathname === to && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${color} opacity-10 rounded-xl`}
                    ></div>
                  )}

                  {/* Icon container */}
                  <div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-lg ${
                      location.pathname === to
                        ? `bg-gradient-to-br ${color} shadow-lg`
                        : `bg-base-200/50 backdrop-blur-sm hover:bg-base-300/50`
                    } transition-all duration-200`}
                  >
                    <span
                      className={`text-sm ${
                        location.pathname === to
                          ? 'text-white'
                          : 'text-base-content/70'
                      }`}
                    >
                      {icon}
                    </span>
                  </div>

                  {showText && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium text-sm text-base-content">
                        {label}
                      </span>
                      {location.pathname === to && (
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} animate-pulse shadow-sm`}
                        />
                      )}
                    </div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!showText && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-base-200 text-base-content text-sm rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 border border-base-300/50">
                      {label}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-base-200 rotate-45 border-l border-b border-base-300/50"></div>
                    </div>
                  )}
                </Link>
              ) : (
                <button
                  onClick={logout}
                  className={`group relative flex items-center p-3 rounded-xl w-full overflow-hidden ${
                    !isResizing && 'transition-all duration-200'
                  } ${showText ? 'gap-3' : 'justify-center'} bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-[1.01]`}
                >
                  {/* Icon container */}
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm">
                    <span className="text-sm text-white">{icon}</span>
                  </div>

                  {showText && (
                    <span className="font-medium text-sm text-white">
                      {label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {!showText && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-base-200 text-base-content text-sm rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 border border-base-300/50">
                      {label}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-base-200 rotate-45 border-l border-b border-base-300/50"></div>
                    </div>
                  )}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {showText && (
          <div className="pt-6 border-t border-base-300/50">
            <div className="text-center">
              <p className="text-xs font-medium text-base-content/70">
                Vaccine Tracking System
              </p>
              <p className="text-xs mt-1 text-base-content/50">Version 1.0.0</p>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        className={`absolute top-0 right-0 w-1 h-full group cursor-col-resize ${
          !isResizing && 'transition-all duration-200'
        }`}
        onMouseDown={startResizing}
      >
        <div
          className={`w-full h-full ${
            isResizing
              ? 'bg-gradient-to-b from-blue-500 to-purple-600'
              : 'bg-base-300/50 group-hover:bg-gradient-to-b group-hover:from-blue-500 group-hover:to-purple-600'
          } transition-all duration-200`}
        ></div>

        {/* Resize grip indicator */}
        <div className="absolute top-1/2 right-1 transform -translate-y-1/2 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-base-200 text-base-content p-1 rounded shadow-lg">
            <FaGripVertical className="text-xs" />
          </div>
        </div>
      </div>

      {/* Resize overlay */}
      {isResizing && (
        <div
          className="fixed inset-0 cursor-col-resize z-50"
          style={{ backgroundColor: 'transparent' }}
        />
      )}
    </aside>
  );
}
