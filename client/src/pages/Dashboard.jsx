import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaChild,
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt,
  FaFemale,
} from 'react-icons/fa';
import AddChild from '../components/AddChild';

const menuItems = [
  {
    id: 'addChild',
    label: 'Add Child',
    icon: <FaChild className="w-6 h-6" />,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'viewChildren',
    label: 'View Children',
    icon: <FaUsers className="w-6 h-6" />,
    color: 'bg-green-600 hover:bg-green-700',
  },
  {
    id: 'addMother',
    label: 'Add Mother',
    icon: <FaUserPlus className="w-6 h-6" />,
    color: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    id: 'viewMothers',
    label: 'View Mothers',
    icon: <FaFemale className="w-6 h-6" />,
    color: 'bg-pink-600 hover:bg-pink-700',
  },
  {
    id: 'searchRecords',
    label: 'Search Records',
    icon: <FaSearch className="w-6 h-6" />,
    color: 'bg-yellow-600 hover:bg-yellow-700',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <FaUserCircle className="w-6 h-6" />,
    color: 'bg-teal-600 hover:bg-teal-700',
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: <FaSignOutAlt className="w-6 h-6" />,
    color: 'bg-red-600 hover:bg-red-700',
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Initialize state from localStorage or default to 'home'
  const [activeView, setActiveView] = useState(() => {
    const storedView = localStorage.getItem('dashboardActiveView');
    return storedView || 'home';
  });

  // Use useEffect to save the current view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboardActiveView', activeView);
  }, [activeView]);

  const handleLogout = () => {
    // Clear the stored view on logout
    localStorage.removeItem('dashboardActiveView');
    logout();
  };

  const handleClick = (id) => {
    if (id === 'logout') {
      handleLogout();
    } else {
      setActiveView(id);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Welcome, {user?.name}!
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {menuItems.map(({ id, label, icon, color }) => (
                <button
                  key={id}
                  onClick={() => handleClick(id)}
                  className={`${color} flex items-center space-x-3 px-4 py-3 rounded-lg shadow text-white transition`}
                >
                  <span>{icon}</span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </>
        );
      case 'addChild':
        return (
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Back to menu
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Child</h2>
            <AddChild />
          </div>
        );
      case 'viewChildren':
        return (
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Back to menu
            </button>
            <h2 className="text-2xl font-semibold mb-4">Children List</h2>
            <p>Children list and vaccination records will be here.</p>
          </div>
        );
      case 'addMother':
        return (
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Back to menu
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Mother</h2>
            <p>Mother form will be here (coming soon!)</p>
          </div>
        );
      case 'viewMothers':
        return (
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Back to menu
            </button>
            <h2 className="text-2xl font-semibold mb-4">Mothers List</h2>
            <p>Mothers list and related records will be here.</p>
          </div>
        );
      case 'searchRecords':
        return (
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Back to menu
            </button>
            <h2 className="text-2xl font-semibold mb-4">Search Records</h2>
            <p>Search form and results will be here.</p>
          </div>
        );
      case 'profile':
        return (
          <div>
            <button
              onClick={() => setActiveView('home')}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Back to menu
            </button>
            <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Role:</strong> {user?.role}
            </p>
            <p>
              <strong>Ward ID:</strong> {user?.wardId || 'N/A'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {renderView()}
    </main>
  );
}
