import { Link } from 'react-router-dom';
import {
  FaChild,
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaFemale,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  {
    to: '/add-child',
    label: 'बालबालिका थप्नुहोस्',
    icon: <FaChild />,
  },
  {
    to: '/view-children',
    label: 'बालबालिकाहरू हेर्नुहोस्',
    icon: <FaUsers />,
  },
  {
    to: '/add-mother',
    label: 'आमा थप्नुहोस्',
    icon: <FaUserPlus />,
  },
  {
    to: '/view-mothers',
    label: 'आमाहरू हेर्नुहोस्',
    icon: <FaFemale />,
  },
  {
    to: '/search-records',
    label: 'रेकर्डहरू खोज्नुहोस्',
    icon: <FaSearch />,
  },
  {
    to: '/profile',
    label: 'प्रोफाइल',
    icon: <FaUserCircle />,
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full mx-auto card bg-base-100 shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-base-content mb-8 text-center tracking-tight">
          स्वागत छ, <span className="text-primary">{user?.name || 'User'}</span>
          !
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {menuItems.map(({ to, label, icon }) => (
            <Link
              key={label}
              to={to}
              className="card h-40 bg-base-100 border border-base-200 flex flex-col items-center justify-center p-4 shadow-sm text-base-content transition-all duration-200 hover:bg-base-200 hover:border-primary hover:shadow-md hover:-translate-y-1"
            >
              <span className="text-primary text-2xl mb-2">{icon}</span>
              <span className="font-medium text-sm sm:text-base text-center">
                {label}
              </span>
            </Link>
          ))}
          <button
            onClick={logout}
            className="btn btn-error card h-40 flex flex-col items-center justify-center p-4 shadow-sm text-sm sm:text-base transition-all duration-200 hover:-translate-y-1"
          >
            <span className="text-2xl mb-2">
              <FaSignOutAlt />
            </span>
            <span className="font-medium text-center">Logout</span>
          </button>
        </div>
      </div>
    </main>
  );
}
