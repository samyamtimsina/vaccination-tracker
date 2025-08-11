import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  FaUser,
  FaBirthdayCake,
  FaSyringe,
  FaSpinner,
  FaSadTear,
  FaEye,
  FaChild,
  FaChevronLeft,
  FaCalendar,
  FaCheckCircle,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaGenderless,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Helper function to format Bikram Sambat dates
const formatBikramSambathDate = (dateString) => {
  if (!dateString) return 'Not provided';
  try {
    const [year, month, day] = dateString.split('T')[0].split('-');
    const monthNames = [
      'Baishakh',
      'Jestha',
      'Ashadh',
      'Shrawan',
      'Bhadra',
      'Ashwin',
      'Kartik',
      'Mangsir',
      'Poush',
      'Magh',
      'Falgun',
      'Chaitra',
    ];
    const monthIndex = parseInt(month, 10) - 1; // Month is 1-indexed
    const monthName = monthNames[monthIndex] || month;
    return `${monthName} ${parseInt(day, 10)}, ${year} B.S.`;
  } catch (e) {
    console.error('Failed to format date:', e);
    return 'Invalid Date';
  }
};

// Main component that fetches data and handles UI state
export default function AllChildren() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    // Function to fetch data from the backend
    const fetchChildren = async () => {
      try {
        const response = await axiosClient.get('/api/mothers');
        setChildren(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching children:', err);
        setError(
          err.response?.data?.message ||
            'Could not load children data. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, []);

  // Format data for the bar chart (vaccinations per child)
  const chartData = children.map((child) => ({
    name: child.fullName,
    vaccinations: child.vaccinations.length,
  }));

  // Format data for pie chart (vaccination completion status)
  const completionData = [
    {
      name: 'Completed',
      value: children.filter((child) => child.purnaKhop).length,
    },
    {
      name: 'Incomplete',
      value: children.filter((child) => !child.purnaKhop).length,
    },
  ];

  // Format data for horizontal bar chart (vaccine type distribution)
  const vaccineCounts = children.reduce((acc, child) => {
    child.vaccinations.forEach((vaccination) => {
      const type = vaccination.vaccineType;
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {});
  const vaccineData = Object.entries(vaccineCounts).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Helper function to group vaccinations by vaccine type
  const groupVaccinations = (vaccinations) => {
    return vaccinations.reduce((acc, vaccine) => {
      const { vaccineType } = vaccine;
      if (!acc[vaccineType]) {
        acc[vaccineType] = [];
      }
      acc[vaccineType].push(vaccine);
      return acc;
    }, {});
  };

  // Display a loading indicator while the data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="flex flex-col items-center justify-center p-8 bg-base-100 card shadow-xl animate-fade-in">
          <FaSpinner className="animate-spin text-5xl text-primary mb-4" />
          <p className="text-xl font-medium text-base-content">
            Loading children records...
          </p>
        </div>
      </div>
    );
  }

  // Display an error message if fetching data failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="alert alert-error animate-fade-in max-w-lg mx-auto">
          <FaSadTear className="text-2xl" />
          <span className="text-lg font-medium">{error}</span>
        </div>
      </div>
    );
  }

  // --- Child Detail View ---
  if (selectedChild) {
    const groupedVaccinations = groupVaccinations(selectedChild.vaccinations);
    const vaccineTypes = Object.keys(groupedVaccinations);

    return (
      <main className="min-h-screen bg-base-200 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedChild(null)}
            className="btn btn-ghost btn-sm text-primary mb-6"
          >
            <FaChevronLeft />
            <span>Back to All Children</span>
          </button>

          <div className="bg-base-100 card p-8 rounded-2xl border border-base-200 shadow-lg animate-fade-in">
            <header className="flex items-center space-x-4 mb-6 pb-4 border-b border-base-300">
              <FaChild className="text-4xl text-primary" />
              <h2 className="text-3xl font-extrabold text-base-content">
                {selectedChild.fullName}
              </h2>
            </header>

            {/* Main Details Section */}
            <div className="space-y-6 mb-8">
              {/* Personal Info */}
              <div className="bg-base-200 p-6 rounded-xl shadow-inner">
                <h3 className="text-xl font-bold text-base-content mb-3 flex items-center space-x-2">
                  <FaUser />
                  <span>Personal Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base-content">
                  <p>
                    <span className="font-semibold">Parent Name:</span>{' '}
                    {selectedChild.parentName || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Gender:</span>{' '}
                    {selectedChild.gender || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Date of Birth:</span>{' '}
                    {formatBikramSambathDate(selectedChild.birthDate)}
                    <span className="text-xs ml-2 text-base-content text-opacity-50">
                      ({selectedChild.birthDate.split('T')[0]})
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Sewa Darta Number:</span>{' '}
                    {selectedChild.sewaDartaNumber || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-base-200 p-6 rounded-xl shadow-inner">
                <h3 className="text-xl font-bold text-base-content mb-3 flex items-center space-x-2">
                  <FaMapMarkerAlt />
                  <span>Address</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base-content">
                  <p>
                    <span className="font-semibold">Ward Number:</span>{' '}
                    {selectedChild.wardNumber || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Tole:</span>{' '}
                    {selectedChild.tole || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Other Info */}
              <div className="bg-base-200 p-6 rounded-xl shadow-inner">
                <h3 className="text-xl font-bold text-base-content mb-3 flex items-center space-x-2">
                  <FaInfoCircle />
                  <span>Other Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base-content">
                  <p>
                    <span className="font-semibold">Phone Number:</span>{' '}
                    {selectedChild.phoneNumber || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Remarks:</span>{' '}
                    {selectedChild.remarks || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vaccination History Section (fully visible) */}
            <h3 className="text-2xl font-bold text-base-content mt-8 mb-4 pt-4 border-t border-base-300">
              Vaccination History
            </h3>
            {vaccineTypes.length > 0 ? (
              <div className="space-y-6">
                {vaccineTypes.map((vaccineType) => (
                  <div
                    key={vaccineType}
                    className="bg-base-200 p-6 rounded-xl shadow-md"
                  >
                    <h4 className="font-bold text-primary text-lg mb-4 flex items-center space-x-2">
                      <FaSyringe />
                      <span>{vaccineType}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupedVaccinations[vaccineType].map(
                        (vaccination, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 bg-base-100 p-4 rounded-lg shadow-sm"
                          >
                            <FaCheckCircle className="text-success text-xl" />
                            <div>
                              <p className="font-medium text-base-content">
                                Dose {vaccination.doseNumber || 'N/A'}
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-base-content text-opacity-70 mt-1">
                                <FaCalendar className="text-primary-focus" />
                                <span>
                                  {formatBikramSambathDate(
                                    vaccination.dateGiven,
                                  )}
                                </span>
                                <span className="text-xs text-base-content text-opacity-50">
                                  ({vaccination.dateGiven.split('T')[0]})
                                </span>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-base-content text-opacity-50 italic">
                No vaccination records found for this child.
              </p>
            )}
          </div>
        </div>
      </main>
    );
  }

  // --- Main Children List View ---
  return (
    <main className="min-h-screen bg-base-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between flex-wrap">
          <h1 className="text-4xl font-extrabold text-primary tracking-tight leading-tight">
            All Children Records
          </h1>
          <Link
            to="/add-child"
            className="mt-4 md:mt-0 flex items-center space-x-2 btn btn-primary"
          >
            <FaChild />
            <span>Add New Child</span>
          </Link>
        </header>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart: Vaccinations per Child */}
          <div className="card bg-base-100 p-6 rounded-2xl border border-base-200 shadow-md">
            <h2 className="text-2xl font-bold text-base-content mb-4">
              Vaccinations per Child
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vaccinations" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: Vaccination Completion Status */}
          <div className="card bg-base-100 p-6 rounded-2xl border border-base-200 shadow-md">
            <h2 className="text-2xl font-bold text-base-content mb-4">
              Vaccination Completion Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {completionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#4f46e5' : '#a5b4fc'}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horizontal Bar Chart: Vaccine Type Distribution */}
        <div className="card bg-base-100 p-6 rounded-2xl border border-base-200 shadow-md mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Vaccine Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vaccineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Children List Section */}
        {children.length === 0 ? (
          <div className="alert alert-info max-w-lg mx-auto text-center animate-fade-in">
            <p className="text-lg font-medium">No children records found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <div
                key={child.id}
                className="card bg-base-100 rounded-2xl border border-base-200 shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
              >
                <div className="card-body p-6">
                  <h3 className="card-title text-2xl font-bold text-primary mb-2">
                    {child.fullName}
                  </h3>
                  <div className="space-y-3 text-base-content">
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-primary" />
                      <span className="font-medium">Parent:</span>
                      <span>{child.parentName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaBirthdayCake className="text-primary" />
                      <span className="font-medium">Date of Birth:</span>
                      <span>{formatBikramSambathDate(child.birthDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaSyringe className="text-primary" />
                      <span className="font-medium">Vaccinations:</span>
                      <span>{child.vaccinations.length} completed</span>
                    </div>
                  </div>
                </div>
                <div className="card-actions p-4 border-t border-base-200">
                  <button
                    onClick={() => setSelectedChild(child)}
                    className="flex items-center justify-center space-x-2 w-full btn btn-primary"
                  >
                    <FaEye />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
