import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  FaSpinner,
  FaChevronLeft,
  FaBaby,
  FaEye,
  FaBirthdayCake,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSyringe,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaSearch,
} from 'react-icons/fa';
import {
  safeGregorianToNepali,
  safeCalculateAge,
  safeFormatDate,
} from '../utils/date.js';

export default function AllChildren() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axiosClient.get('/api/child/ward');
        console.log('Raw API response:', response.data);
        setChildren(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching children:', err);
        setError(
          err.response?.data?.message || 'Could not load children data.',
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const filteredChildren = children.filter(
    (child) =>
      child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (child.lastName &&
        child.lastName.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <FaSpinner className="animate-spin text-6xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading children records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-md mx-4">
          <div className="text-center">
            <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedChild) {
    const age = safeCalculateAge(selectedChild.birthDate);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <button
              onClick={() => setSelectedChild(null)}
              className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
            >
              <FaChevronLeft className="text-sm" />
              <span>Back to All Children</span>
            </button>
          </div>
        </div>

        {/* Child Details */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Child Header Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaBaby className="text-2xl" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    {selectedChild.fullName} {selectedChild.lastName || ''}
                  </h1>
                  <p className="text-indigo-100 text-lg mt-2">
                    {age.formatted} old
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-indigo-100">
                <span className="flex items-center space-x-2">
                  <FaMapMarkerAlt />
                  <span>Ward {selectedChild.wardNumber}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <FaShieldAlt />
                  <span>
                    {selectedChild.purnaKhop
                      ? 'Fully Vaccinated'
                      : 'Vaccination Incomplete'}
                  </span>
                </span>
              </div>
            </div>

            {/* Basic Information */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaUser className="text-indigo-600" />
                <span>Personal Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {selectedChild.gender}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Parent Name
                  </label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {selectedChild.parentName}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Tole
                  </label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {selectedChild.tole}
                  </p>
                </div>

                {selectedChild.phoneNumber && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </label>
                    <p className="text-lg font-semibold text-gray-800 mt-1 flex items-center space-x-2">
                      <FaPhone className="text-indigo-600" />
                      <span>{selectedChild.phoneNumber}</span>
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Birth Date (B.S.)
                  </label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {safeGregorianToNepali(selectedChild.birthDate)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Birth Date (A.D.)
                  </label>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {safeFormatDate(selectedChild.birthDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccination Records */}
          {selectedChild.vaccines && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-6 text-white">
                <h2 className="text-2xl font-bold flex items-center space-x-3">
                  <FaSyringe className="text-2xl" />
                  <span>Vaccination Records</span>
                </h2>
                <p className="text-green-100 mt-1">
                  Track immunization progress
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(selectedChild.vaccines).map(
                    ([vaccineName, doses]) => (
                      <div
                        key={vaccineName}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-800">
                            {vaccineName}
                          </h3>
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {doses.filter((dose) => dose).length} /{' '}
                            {doses.length} doses
                          </div>
                        </div>

                        <div className="space-y-3">
                          {doses.map((doseDate, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${doseDate ? 'bg-green-500' : 'bg-gray-300'}`}
                                ></div>
                                <span className="font-medium text-gray-700">
                                  Dose {index + 1}
                                </span>
                              </div>
                              <div className="text-right">
                                {doseDate ? (
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {safeGregorianToNepali(doseDate)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {safeFormatDate(doseDate)}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400 italic">
                                    Not administered
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Remarks */}
          {selectedChild.remarks && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <FaCalendarAlt className="text-indigo-600" />
                  <span>Additional Notes</span>
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedChild.remarks}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Children Health Records
              </h1>
              <p className="text-gray-600">
                Manage and track children's health information and vaccination
                records
              </p>
            </div>
            <button className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
              <FaPlus />
              <span>Add New Child</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search children by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBaby className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {children.length}
                </p>
                <p className="text-sm text-gray-600">Total Children</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">
                  {children.filter((child) => child.purnaKhop).length}
                </p>
                <p className="text-sm text-gray-600">Fully Vaccinated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Children Cards */}
        {filteredChildren.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
            <FaBaby className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm
                ? 'No matching children found'
                : 'No children records found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms or clear the search to see all children.'
                : 'Get started by adding your first child record.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredChildren.map((child) => {
              const age = safeCalculateAge(child.birthDate);

              return (
                <div
                  key={child.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedChild(child)}
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <FaBaby className="text-lg" />
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          child.purnaKhop
                            ? 'bg-green-400 text-green-900'
                            : 'bg-yellow-400 text-yellow-900'
                        }`}
                      >
                        {child.purnaKhop ? 'Vaccinated' : 'Pending'}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-1">
                      {child.fullName} {child.lastName || ''}
                    </h3>
                    <p className="text-indigo-100 text-sm">{age.formatted}</p>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Birth Date (B.S.)</span>
                        <span className="font-medium text-gray-800">
                          {safeGregorianToNepali(child.birthDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Birth Date (A.D.)</span>
                        <span className="font-medium text-gray-800">
                          {safeFormatDate(child.birthDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Ward</span>
                        <span className="font-medium text-gray-800">
                          {child.wardNumber}
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-700 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 group-hover:bg-indigo-600 group-hover:text-white">
                      <FaEye />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
