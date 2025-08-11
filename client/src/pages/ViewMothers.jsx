import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  FaSpinner,
  FaChevronLeft,
  FaUser,
  FaEye,
  FaBirthdayCake,
  FaPhone,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSyringe,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaSearch,
  FaIdCard,
  FaBuilding,
  FaStickyNote,
  FaHome,
  FaPrint,
} from 'react-icons/fa';
import {
  safeCalculateAge,
  safeFormatDate,
  safeFormatDateYYMMDD,
} from '../utils/date.js';
import { adToBs } from '@sbmdkl/nepali-date-converter';

export default function AllMothers() {
  const [mothers, setMothers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMother, setSelectedMother] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMothers = async () => {
      try {
        const response = await axiosClient.get('/api/mothers');
        console.log('Raw API response:', response.data);
        setMothers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching mothers:', err);
        setError(err.response?.data?.message || 'Could not load mothers data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMothers();
  }, []);

  const filteredMothers = mothers.filter((mother) =>
    mother.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getTDDoses = (mother) => {
    return [
      { label: 'TD Dose 1', date: mother.tdDose1 },
      { label: 'TD Dose 2', date: mother.tdDose2 },
      { label: 'TD Dose 2+', date: mother.tdDose2Plus },
    ];
  };

  const getVaccinationStats = (doses) => {
    const given = doses.filter((d) => d.date !== null).length;
    const total = 3;
    return {
      given,
      total,
      percentage: Math.round((given / total) * 100) || 0,
    };
  };

  const handlePrintSingle = (mother) => {
    setSelectedMother(mother);
    setTimeout(() => {
      window.print();
    }, 0);
  };

  const handlePrintAll = () => {
    setSelectedMother(null);
    setTimeout(() => {
      window.print();
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-3" />
          <p className="text-base-content">Loading mothers records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-error/20 max-w-md mx-4">
          <div className="text-center">
            <FaTimesCircle className="text-3xl text-error mx-auto mb-3" />
            <h2 className="text-lg font-bold text-base-content mb-2">
              Error Loading Data
            </h2>
            <p className="text-base-content text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedMother) {
    const doses = getTDDoses(selectedMother);
    const stats = getVaccinationStats(doses);

    return (
      <div className="min-h-screen bg-base-200">
        {/* Header */}
        <div className="bg-base-100 shadow-sm border-b border-base-300 print:hidden">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedMother(null)}
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-focus transition-colors font-medium cursor-pointer"
            >
              <FaChevronLeft className="text-sm" />
              <span>Back to All Mothers</span>
            </button>
            <button
              onClick={() => handlePrintSingle(selectedMother)}
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-focus transition-colors font-medium cursor-pointer"
            >
              <FaPrint className="text-sm" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6 print:hidden">
          {/* Mother Header Section */}
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FaUser className="text-2xl text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-base-content mb-1">
                    {selectedMother.name}
                  </h1>
                  <p className="text-base-content/70 mb-2">
                    {selectedMother.age} years old • Ward{' '}
                    {selectedMother.wardNumber}
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-base-content/60">
                      Service Registration: #{selectedMother.sewaDartaNumber}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    stats.given >= 2
                      ? 'bg-success/20 text-success'
                      : 'bg-warning/20 text-warning'
                  }`}
                >
                  {stats.given >= 2
                    ? '✓ Fully Vaccinated'
                    : '⚠ Vaccination Incomplete'}
                </span>
                <p className="text-sm text-base-content/60 mt-1">
                  {stats.given} of {stats.total} doses completed
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Information */}
              <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
                <h3 className="font-bold text-base-content mb-4 flex items-center space-x-2">
                  <FaUser className="text-primary" />
                  <span>Personal Information</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                    <span className="text-sm text-base-content/60">Age</span>
                    <span className="font-medium text-base-content">
                      {selectedMother.age}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                    <span className="text-sm text-base-content/60">
                      Caste Code
                    </span>
                    <span className="font-medium text-base-content">
                      {selectedMother.casteCode}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                    <span className="text-sm text-base-content/60">
                      Phone Number
                    </span>
                    <span className="font-medium text-base-content">
                      {selectedMother.phoneNumber || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                    <span className="text-sm text-base-content/60">Tole</span>
                    <span className="font-medium text-base-content">
                      {selectedMother.tole || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                    <span className="text-sm text-base-content/60">
                      Municipality
                    </span>
                    <span className="font-medium text-base-content">
                      {selectedMother.isFromOtherMunicipality
                        ? 'Other'
                        : 'Local'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-base-300 last:border-b-0">
                    <span className="text-sm text-base-content/60">
                      Pregnancy Count
                    </span>
                    <span className="font-medium text-base-content">
                      {selectedMother.pregnancyCount}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-base-content/60">
                      Previous TD Taken
                    </span>
                    <span className="font-medium text-base-content">
                      {selectedMother.previousTDTakenCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vaccination Summary */}
              <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
                <h3 className="font-bold text-base-content mb-4 flex items-center space-x-2">
                  <FaShieldAlt className="text-primary" />
                  <span>Vaccination Summary</span>
                </h3>

                {/* Progress */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stats.percentage}%
                  </div>
                  <p className="text-sm text-base-content/70">
                    {stats.given} of {stats.total} doses completed
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-base-300 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      stats.percentage === 100 ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div className="bg-success/10 rounded-lg p-3">
                    <p className="text-xl font-bold text-success">
                      {stats.given}
                    </p>
                    <p className="text-xs text-base-content/70">Given</p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-3">
                    <p className="text-xl font-bold text-base-content">
                      {stats.total - stats.given}
                    </p>
                    <p className="text-xs text-base-content/70">Pending</p>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedMother.remarks && (
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-6">
                  <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                    <FaStickyNote className="text-primary" />
                    <span>Remarks</span>
                  </h3>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <p className="text-base-content text-sm leading-relaxed">
                      {selectedMother.remarks}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - TD Doses Records */}
            <div className="lg:col-span-2">
              <div className="bg-base-100 rounded-lg shadow-md border border-base-300">
                <div className="bg-primary text-primary-content px-6 py-4 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                      <FaSyringe />
                      <span>TD Vaccination Records</span>
                    </h2>
                    <div className="text-sm">
                      Status: {stats.given}/{stats.total} Completed
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-base-300">
                          <th className="text-left py-3 px-2 font-semibold text-base-content">
                            Dose
                          </th>
                          <th className="text-left py-3 px-2 font-semibold text-base-content">
                            Status
                          </th>
                          <th className="text-left py-3 px-2 font-semibold text-base-content">
                            Date (Nepali)
                          </th>
                          <th className="text-left py-3 px-2 font-semibold text-base-content">
                            Date (English)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {doses.map((dose, index) => {
                          const isGiven = dose.date !== null;
                          return (
                            <tr
                              key={index}
                              className="border-b border-base-200 hover:bg-base-50"
                            >
                              <td className="py-4 px-2">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      isGiven ? 'bg-success' : 'bg-base-300'
                                    }`}
                                  />
                                  <span className="font-medium text-base-content">
                                    {dose.label}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-2">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    isGiven
                                      ? 'bg-success/20 text-success'
                                      : 'bg-base-300 text-base-content/60'
                                  }`}
                                >
                                  {isGiven ? 'Completed' : 'Pending'}
                                </span>
                              </td>
                              <td className="py-4 px-2">
                                {isGiven ? (
                                  <span className="font-mono text-sm text-base-content">
                                    {adToBs(safeFormatDateYYMMDD(dose.date))}
                                  </span>
                                ) : (
                                  <span className="text-base-content/50 italic">
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-2">
                                {isGiven ? (
                                  <span className="font-mono text-sm text-base-content">
                                    {safeFormatDateYYMMDD(dose.date)}
                                  </span>
                                ) : (
                                  <span className="text-base-content/50 italic">
                                    -
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print-friendly section for single mother */}
        <div className="hidden print:block p-4">
          <h1 className="text-2xl font-bold mb-4">Mother Vaccination Report</h1>
          <h2 className="text-xl font-semibold mb-2">{selectedMother.name}</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Field</th>
                <th className="border border-gray-300 p-2 text-left">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">
                  Service Registration
                </td>
                <td className="border border-gray-300 p-2">
                  #{selectedMother.sewaDartaNumber}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Age</td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.age}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Caste Code</td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.casteCode}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Phone Number</td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.phoneNumber || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Tole</td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.tole || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Ward Number</td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.wardNumber}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Municipality</td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.isFromOtherMunicipality
                    ? 'Other Municipality'
                    : 'Local Municipality'}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Pregnancy Count</td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.pregnancyCount}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Previous TD Taken Count
                </td>
                <td className="border border-gray-300 p-2">
                  {selectedMother.previousTDTakenCount}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Vaccination Status
                </td>
                <td className="border border-gray-300 p-2">
                  {stats.given >= 2 ? 'Fully Vaccinated' : 'Incomplete'}
                </td>
              </tr>
              {selectedMother.remarks && (
                <tr>
                  <td className="border border-gray-300 p-2">Remarks</td>
                  <td className="border border-gray-300 p-2">
                    {selectedMother.remarks}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            TD Vaccination Records
          </h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Dose</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">
                  Date Given (B.S.)
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Date Given (A.D.)
                </th>
              </tr>
            </thead>
            <tbody>
              {doses.map((dose, index) => {
                const isGiven = dose.date !== null;
                return (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">{dose.label}</td>
                    <td className="border border-gray-300 p-2">
                      {isGiven ? 'Given' : 'Pending'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {isGiven
                        ? adToBs(safeFormatDateYYMMDD(dose.date))
                        : 'Pending'}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {isGiven ? safeFormatDateYYMMDD(dose.date) : 'Pending'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm border-b border-base-300 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-1">
                Mothers Health Records
              </h1>
              <p className="text-base-content/70">
                Manage and track mothers' health information and TD vaccination
                records
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                <FaPlus />
                <span>Add New Mother</span>
              </button>
              <button
                onClick={handlePrintAll}
                className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary-focus text-secondary-content px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                <FaPrint />
                <span>Print All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6 print:hidden">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="Search mothers by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-base-content placeholder:text-base-content/60"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {mothers.length}
                </p>
                <p className="text-sm text-base-content/70">Total Mothers</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <FaUser className="text-primary text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {mothers.filter((m) => m.tdDose2 || m.tdDose2Plus).length}
                </p>
                <p className="text-sm text-base-content/70">Fully Vaccinated</p>
              </div>
              <div className="bg-success/10 p-3 rounded-full">
                <FaCheckCircle className="text-success text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {
                    mothers.filter(
                      (m) => m.tdDose1 && !m.tdDose2 && !m.tdDose2Plus,
                    ).length
                  }
                </p>
                <p className="text-sm text-base-content/70">
                  Partially Vaccinated
                </p>
              </div>
              <div className="bg-warning/10 p-3 rounded-full">
                <FaSyringe className="text-warning text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-6 shadow-sm border border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {mothers.filter((m) => !m.tdDose1).length}
                </p>
                <p className="text-sm text-base-content/70">Not Started</p>
              </div>
              <div className="bg-error/10 p-3 rounded-full">
                <FaTimesCircle className="text-error text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Mothers Table */}
        {filteredMothers.length === 0 ? (
          <div className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-8 text-center">
            <FaUser className="text-4xl text-base-content/40 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-base-content mb-2">
              {searchTerm
                ? 'No matching mothers found'
                : 'No mothers records found'}
            </h2>
            <p className="text-base-content/70 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms or clear the search to see all mothers.'
                : 'Get started by adding your first mother record.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-base-100 rounded-lg shadow-sm border border-base-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-base-content">
                      Name
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-base-content">
                      Age
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-base-content">
                      Ward
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-base-content">
                      Pregnancy
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-base-content">
                      TD Status
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-base-content">
                      Progress
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-base-content">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMothers.map((mother) => {
                    const givenDoses = [
                      mother.tdDose1,
                      mother.tdDose2,
                      mother.tdDose2Plus,
                    ].filter((d) => d).length;
                    const progressPercentage = (givenDoses / 3) * 100;

                    return (
                      <tr
                        key={mother.id}
                        className="border-b border-base-200 hover:bg-base-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-base-content">
                              {mother.name}
                            </div>
                            <div className="text-sm text-base-content/60">
                              #{mother.sewaDartaNumber}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-base-content">
                          {mother.age}
                        </td>
                        <td className="py-4 px-4 text-base-content">
                          {mother.wardNumber}
                        </td>
                        <td className="py-4 px-4 text-base-content">
                          {mother.pregnancyCount}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              givenDoses >= 2
                                ? 'bg-success/20 text-success'
                                : givenDoses > 0
                                  ? 'bg-warning/20 text-warning'
                                  : 'bg-error/20 text-error'
                            }`}
                          >
                            {givenDoses >= 2
                              ? 'Complete'
                              : givenDoses > 0
                                ? 'Partial'
                                : 'Not Started'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-base-300 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  givenDoses >= 2 ? 'bg-success' : 'bg-primary'
                                }`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-base-content/70">
                              {givenDoses}/3
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => setSelectedMother(mother)}
                              className="inline-flex items-center space-x-1 bg-primary hover:bg-primary-focus text-primary-content px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                            >
                              <FaEye className="text-xs" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handlePrintSingle(mother)}
                              className="inline-flex items-center space-x-1 bg-secondary hover:bg-secondary-focus text-secondary-content px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                            >
                              <FaPrint className="text-xs" />
                              <span>Print</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Print-friendly section for all mothers */}
      <div className="hidden print:block p-4">
        <h1 className="text-2xl font-bold mb-4">Mothers Vaccination Report</h1>
        <p className="mb-4">Generated on: {new Date().toLocaleDateString()}</p>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Age</th>
              <th className="border border-gray-300 p-2 text-left">Ward</th>
              <th className="border border-gray-300 p-2 text-left">
                Pregnancy Count
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Previous TD Taken
              </th>
              <th className="border border-gray-300 p-2 text-left">
                TD Status
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Doses Given
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMothers.map((mother) => {
              const doses = getTDDoses(mother);
              const stats = getVaccinationStats(doses);
              return (
                <tr key={mother.id}>
                  <td className="border border-gray-300 p-2">{mother.name}</td>
                  <td className="border border-gray-300 p-2">{mother.age}</td>
                  <td className="border border-gray-300 p-2">
                    {mother.wardNumber}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {mother.pregnancyCount}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {mother.previousTDTakenCount}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {stats.given >= 2 ? 'Fully Vaccinated' : 'Incomplete'}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {stats.given}/{stats.total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 12pt;
            font-family: Arial, sans-serif;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th,
          td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          h1,
          h2,
          h3 {
            color: black;
            margin-bottom: 10px;
          }
          p {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
}
