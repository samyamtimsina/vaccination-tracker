import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dummy stats for now
  const stats = [
    { label: 'Total Citizens', value: 1234 },
    { label: 'Total Vaccinations', value: 987 },
    { label: 'Pending Doses', value: 45 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user.name} ({user.role})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded shadow p-4 flex flex-col items-center"
          >
            <div className="text-3xl font-semibold">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-x-4">
        <button
          onClick={() => navigate('/citizens')}
          className="bg-blue-600 text-white px-4 py-2 rounded
             transition-all duration-300 ease-in-out
             hover:bg-blue-700 hover:shadow-lg hover:scale-105
             cursor-pointer"
        >
          Citizens List
        </button>
        <button
          onClick={() => navigate('/addRecord')}
          className="bg-blue-600 text-white px-4 py-2 rounded
             transition-all duration-300 ease-in-out
             hover:bg-blue-700 hover:shadow-lg hover:scale-105
             cursor-pointer"
        >
          Add Records
        </button>
        <button
          onClick={() => navigate('/vaccination')}
          className="bg-green-600 text-white px-4 py-2 rounded
             transition-all duration-300 ease-in-out
             hover:bg-blue-700 hover:shadow-lg hover:scale-105
             cursor-pointer"
        >
          Vaccination Form
        </button>
        <button
          onClick={() => navigate('/reports')}
          className="bg-purple-600 text-white px-4 py-2 rounded
             transition-all duration-300 ease-in-out
             hover:bg-blue-700 hover:shadow-lg hover:scale-105
             cursor-pointer"
        >
          Reports
        </button>
      </div>
    </div>
  );
}
