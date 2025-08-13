import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FaChild,
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserCircle,
  FaFemale,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

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
  const { logout } = useAuth();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SNAP_POINTS = { COLLAPSED: 72, EXPANDED: 256 };
  const [sidebarWidth, setSidebarWidth] = useState(SNAP_POINTS.EXPANDED);

  const showText = sidebarWidth > SNAP_POINTS.COLLAPSED;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleSidebar = () => {
    setSidebarWidth((prev) =>
      prev === SNAP_POINTS.EXPANDED
        ? SNAP_POINTS.COLLAPSED
        : SNAP_POINTS.EXPANDED,
    );
  };

  // Mobile menu toggle (consistent button style)
  const MobileMenuToggle = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg bg-base-100 border border-base-300 hover:bg-base-200 transition-colors"
      aria-label="Toggle menu"
    >
      {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
    </button>
  );

  const MobileSidebar = () => (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-base-100 border-r border-base-300 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: SNAP_POINTS.EXPANDED }}
      >
        <div className="flex flex-col h-full">
          {/* Header with toggle button */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-content">
                <FaTachometerAlt />
              </div>
              <span className="font-bold">Navigation</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-base-200"
            >
              <FaTimes />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map(({ to, label, icon, type }) => {
              const isActive = location.pathname === to;
              const baseClasses =
                'flex items-center gap-3 p-3 rounded-lg transition-colors';
              return type === 'link' ? (
                <Link
                  key={label}
                  to={to}
                  className={`${baseClasses} ${
                    isActive
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-200 text-base-content/80'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {icon}
                  </div>
                  <span>{label}</span>
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={handleLogout}
                  className={`${baseClasses} bg-error text-error-content hover:bg-error-focus w-full`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {icon}
                  </div>
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );

  const DesktopSidebar = () => (
    <aside
      className="hidden md:flex flex-col bg-base-100 border-r border-base-300 transition-all duration-300 ease-in-out"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        {showText && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-content">
              <FaTachometerAlt />
            </div>
            <span className="font-bold">Navigation</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-base-200 transition-colors"
        >
          {showText ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map(({ to, label, icon, type }) => {
          const isActive = location.pathname === to;
          const baseClasses = `flex items-center ${
            showText ? 'gap-3 p-3' : 'justify-center p-3'
          } rounded-lg transition-colors`;
          return type === 'link' ? (
            <Link
              key={label}
              to={to}
              className={`${baseClasses} ${
                isActive
                  ? 'bg-primary text-primary-content'
                  : 'hover:bg-base-200 text-base-content/80'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {icon}
              </div>
              {showText && <span>{label}</span>}
            </Link>
          ) : (
            <button
              key={label}
              onClick={handleLogout}
              className={`${baseClasses} bg-error text-error-content hover:bg-error-focus w-full`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {icon}
              </div>
              {showText && <span>{label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileMenuToggle />
          <MobileSidebar />
        </>
      ) : (
        <DesktopSidebar />
      )}
    </>
  );
}
