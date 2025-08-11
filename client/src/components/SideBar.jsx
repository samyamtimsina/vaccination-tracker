import { Link, useLocation } from 'react-router-dom';
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
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

// Placeholder contexts to make this example runnable.
// In your actual app, these should be from your AuthContext and ThemeContext files.
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const ThemeContext = createContext(null);
const useTheme = () => useContext(ThemeContext);

const menuItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: <FaTachometerAlt />,
    type: 'link',
  },
  { to: '/add-child', label: 'Add Child', icon: <FaChild />, type: 'link' },
  {
    to: '/view-children',
    label: 'View Children',
    icon: <FaUsers />,
    type: 'link',
  },
  {
    to: '/add-mother',
    label: 'Add Mother',
    icon: <FaUserPlus />,
    type: 'link',
  },
  {
    to: '/view-mothers',
    label: 'View Mothers',
    icon: <FaFemale />,
    type: 'link',
  },
  {
    to: '/search-records',
    label: 'Search Records',
    icon: <FaSearch />,
    type: 'link',
  },
  { to: '/profile', label: 'Profile', icon: <FaUserCircle />, type: 'link' },
  { to: '/', label: 'Logout', icon: <FaSignOutAlt />, type: 'button' },
];

export default function SidebarNav() {
  const location = useLocation();
  // Using placeholder logout function for this example
  const logout = () => {
    console.log('User logged out');
  };

  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const SNAP_POINTS = {
    COLLAPSED: 72,
    EXPANDED: 256,
  };
  const EXPANDED_THRESHOLD = 160;

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
      const snapTo =
        sidebarWidth > (SNAP_POINTS.COLLAPSED + SNAP_POINTS.EXPANDED) / 2
          ? SNAP_POINTS.EXPANDED
          : SNAP_POINTS.COLLAPSED;
      setSidebarWidth(snapTo);
    }
  }, [isResizing, sidebarWidth, SNAP_POINTS]);

  const showText = sidebarWidth > EXPANDED_THRESHOLD;

  return (
    <aside
      className={`min-h-screen flex flex-col relative bg-base-100 border-r border-base-300 ${
        !isResizing && 'transition-all duration-300 ease-in-out'
      }`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div className="relative z-10 flex flex-col h-full p-4 overflow-x-hidden">
        {/* Header */}
        {showText && (
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-content">
                <FaTachometerAlt className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-base-content">Navigation</h2>
                <p className="text-xs text-base-content/70">Vaccine System</p>
              </div>
            </div>
          </div>
        )}
        <nav className="flex-1 space-y-2">
          {menuItems.map(({ to, label, icon, type }) => {
            const isActive = location.pathname === to;
            const linkClasses = `group flex items-center p-3 rounded-lg w-full ${
              showText ? 'gap-3' : 'justify-center'
            } ${
              isActive
                ? 'bg-primary text-primary-content font-semibold'
                : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
            }`;

            const buttonClasses = `group flex items-center p-3 rounded-lg w-full ${
              showText ? 'gap-3' : 'justify-center'
            } bg-error text-error-content font-semibold hover:bg-error-focus`;

            const iconContainerClasses = `w-8 h-8 rounded-lg flex items-center justify-center ${
              isActive
                ? 'bg-primary-content/20'
                : 'bg-base-200 group-hover:bg-primary-focus/10 text-base-content/70'
            }`;

            return type === 'link' ? (
              <Link key={label} to={to} className={linkClasses}>
                <div className={iconContainerClasses}>
                  <span className="text-sm">{icon}</span>
                </div>
                {showText && <span className="flex-1 text-sm">{label}</span>}
                {!showText && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-base-200 text-base-content text-sm rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    {label}
                  </div>
                )}
              </Link>
            ) : (
              <button key={label} onClick={logout} className={buttonClasses}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-error-content/20">
                  <span className="text-sm">{icon}</span>
                </div>
                {showText && <span className="flex-1 text-sm">{label}</span>}
                {!showText && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-base-200 text-base-content text-sm rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                    {label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
        {/* Footer */}
        {showText && (
          <div className="mt-auto pt-6 border-t border-base-300">
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
            isResizing ? 'bg-primary' : 'bg-base-300/50 group-hover:bg-primary'
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
          onMouseUp={stopResizing}
        />
      )}
    </aside>
  );
}
