import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="font-bold">Vaccination Tracker</div>
      <div className="space-x-4">
        {!user && (
          <>
            <Link to="/" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
        {user && (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
