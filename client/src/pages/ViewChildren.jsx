import { useMemo, useState, useEffect } from 'react';
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
  FaPrint,
  FaCheckCircle,
  FaPlus,
  FaSearch,
  FaStickyNote,
  FaVenusMars,
} from 'react-icons/fa';
import {
  safeCalculateAge,
  safeFormatDate,
  safeFormatDateYYMMDD,
} from '../utils/date.js';
import { vaccineSchedule } from '../utils/vaccineSchedule.js';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import VaccinationCardOverlay from '../components/print';

export default function AllChildren() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axiosClient.get('/api/child');
        setChildren(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Could not load children data.',
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const filteredChildren = useMemo(() => {
    if (!children) {
      return [];
    }
    return children.filter(
      (child) =>
        child.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (child.lastName &&
          child.lastName.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [children, searchTerm]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filteredChildren, currentPage, itemsPerPage]);

  const currentChildren = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredChildren.slice(indexOfFirst, indexOfLast);
  }, [filteredChildren, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

  const getRecommendedAgeText = (scheduleItem) => {
    if (scheduleItem.recommendedAtDays !== undefined) {
      return scheduleItem.recommendedAtDays === 0
        ? 'At birth'
        : `${scheduleItem.recommendedAtDays} days`;
    }
    if (scheduleItem.recommendedAtWeeks !== undefined) {
      return `${scheduleItem.recommendedAtWeeks} weeks`;
    }
    if (scheduleItem.recommendedAtMonths !== undefined) {
      return `${scheduleItem.recommendedAtMonths} months`;
    }
    return 'Unknown';
  };

  const getOverallVaccinationStats = (child) => {
    const givenVaccinations = child.vaccinations || [];
    const vaccinationMap = {};
    givenVaccinations.forEach((vacc) => {
      const vaccineType = vacc.vaccineType;
      if (!vaccinationMap[vaccineType]) {
        vaccinationMap[vaccineType] = [];
      }
      vaccinationMap[vaccineType].push({
        date: vacc.givenDate || vacc.dateGiven || vacc.createdAt,
        dose: vacc.doseNumber || vaccinationMap[vaccineType].length + 1,
      });
    });

    Object.keys(vaccinationMap).forEach((vaccine) => {
      vaccinationMap[vaccine].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
    });

    let totalGiven = 0;
    let totalRequired = 0;
    let completeVaccines = 0;
    let inProgressVaccines = 0;
    let notStartedVaccines = 0;

    Object.entries(vaccineSchedule).forEach(([vaccineName, schedule]) => {
      const givenDoses = vaccinationMap[vaccineName] || [];
      const given = givenDoses.length;
      const required = schedule.length;

      totalGiven += given;
      totalRequired += required;

      if (given === required) completeVaccines++;
      else if (given > 0) inProgressVaccines++;
      else notStartedVaccines++;
    });

    return {
      totalGiven,
      totalRequired,
      completeVaccines,
      inProgressVaccines,
      notStartedVaccines,
      overallPercentage: Math.round((totalGiven / totalRequired) * 100) || 0,
      vaccinationMap,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-3" />
          <p className="text-base-content">Loading children records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-error/20 max-w-md mx-4">
          <div className="text-center">
            <h2 className="text-lg font-bold text-base-content mb-2">
              Error Loading Data
            </h2>
            <p className="text-base-content text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedChild) {
    const age = safeCalculateAge(selectedChild.birthDate);
    const vaccinationStats = getOverallVaccinationStats(selectedChild);
    const { vaccinationMap } = vaccinationStats;

    return (
      <div className="min-h-screen bg-base-200">
        <div className="bg-base-100 shadow-sm border-b border-base-300">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between">
            <button
              onClick={() => setSelectedChild(null)}
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-focus transition-colors font-medium cursor-pointer"
            >
              <FaChevronLeft className="text-sm" />
              <span>Back to All Children</span>
            </button>

            <button
              onClick={() => setShowPrintComponent(!showPrintComponent)}
              className="inline-flex items-center space-x-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-content transition-all duration-200 hover:bg-primary-focus hover:shadow-lg cursor-pointer"
            >
              <FaPrint className="text-lg" />
              <span>Print Record</span>
            </button>
          </div>
        </div>

        {showPrintComponent ? (
          <VaccinationCardOverlay
            data={{
              ...selectedChild,
              birthDate: adToBs(safeFormatDateYYMMDD(selectedChild.birthDate)),
              vaccinations: selectedChild.vaccinations.map((vaccine) => ({
                ...vaccine,
                dateGiven: adToBs(safeFormatDateYYMMDD(vaccine.dateGiven)),
              })),
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <div className="xl:col-span-4 space-y-4">
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden">
                  <div className="bg-primary text-primary-content p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <FaBaby className="text-lg" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-xl font-bold">
                          {selectedChild.fullName}{' '}
                          {selectedChild.lastName || ''}
                        </h1>
                        <p className="text-primary-content/90 text-sm">
                          {age.formatted} old
                        </p>
                        <div className="flex items-center space-x-3 mt-2 text-xs">
                          <span className="flex items-center space-x-1">
                            <FaMapMarkerAlt />
                            <span>Ward {selectedChild.wardNumber}</span>
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedChild.purnaKhop
                                ? 'bg-success text-success-content'
                                : 'bg-warning text-warning-content'
                            }`}
                          >
                            {selectedChild.purnaKhop
                              ? 'Fully Vaccinated'
                              : 'Incomplete'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                  <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                    <FaUser className="text-primary" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        Service Registration
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        #{selectedChild.sewaDartaNumber}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider flex items-center space-x-1">
                        <FaVenusMars className="text-xs" />
                        <span>Gender</span>
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.gender}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        Parent Name
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.parentName}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        Tole
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.tole}
                      </p>
                    </div>

                    {selectedChild.phoneNumber && (
                      <div>
                        <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                          Phone
                        </label>
                        <p className="font-semibold text-base-content mt-1">
                          {selectedChild.phoneNumber}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        Municipality
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.isFromOtherMunicipality
                          ? 'Other Municipality'
                          : 'Local Municipality'}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
                        Caste Code
                      </label>
                      <p className="font-semibold text-base-content mt-1">
                        {selectedChild.casteCode}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-base-content/60 uppercase tracking-wider flex items-center space-x-1">
                        <FaBirthdayCake className="text-xs" />
                        <span>Birth Date</span>
                      </label>
                      <div className="flex space-x-4 mt-1">
                        <span className="font-semibold text-base-content">
                          B.S:{' '}
                          {adToBs(
                            safeFormatDateYYMMDD(selectedChild.birthDate),
                          )}
                        </span>
                        <span className="font-semibold text-base-content">
                          A.D: {safeFormatDate(selectedChild.birthDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                  <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                    <FaShieldAlt className="text-primary" />
                    <span>Vaccination Summary</span>
                  </h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-16 h-16">
                      <svg
                        className="w-16 h-16 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-base-300"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            vaccinationStats.overallPercentage === 100
                              ? 'text-success'
                              : 'text-primary'
                          }
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${vaccinationStats.overallPercentage}, 100`}
                          strokeLinecap="round"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-sm font-bold ${vaccinationStats.overallPercentage === 100 ? 'text-success' : 'text-primary'}`}
                        >
                          {vaccinationStats.overallPercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-base-content/70">
                        Overall Progress
                      </p>
                      <p className="font-semibold text-base-content">
                        {vaccinationStats.totalGiven} of{' '}
                        {vaccinationStats.totalRequired} doses given
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-success/10 rounded-lg p-2">
                      <p className="text-xl font-bold text-success">
                        {vaccinationStats.completeVaccines}
                      </p>
                      <p className="text-xs text-base-content/80">Complete</p>
                    </div>
                    <div className="bg-warning/10 rounded-lg p-2">
                      <p className="text-xl font-bold text-warning">
                        {vaccinationStats.inProgressVaccines}
                      </p>
                      <p className="text-xs text-base-content/80">Progress</p>
                    </div>
                    <div className="bg-base-300 rounded-lg p-2">
                      <p className="text-xl font-bold text-base-content">
                        {vaccinationStats.notStartedVaccines}
                      </p>
                      <p className="text-xs text-base-content/80">Pending</p>
                    </div>
                  </div>
                </div>

                {selectedChild.remarks && (
                  <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-4">
                    <h3 className="font-bold text-base-content mb-3 flex items-center space-x-2">
                      <FaStickyNote className="text-primary" />
                      <span>Notes</span>
                    </h3>
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <p className="text-base-content text-sm leading-relaxed">
                        {selectedChild.remarks}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:col-span-8">
                <div className="bg-base-100 rounded-lg shadow-md border border-base-300 overflow-hidden">
                  <div className="bg-primary text-primary-content px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold flex items-center space-x-2">
                          <FaSyringe />
                          <span>Vaccination Records</span>
                        </h2>
                        <p className="text-primary-content/90 text-xs mt-1">
                          Detailed immunization tracking
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>Given</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {Object.entries(vaccineSchedule).map(
                        ([vaccineName, schedule]) => {
                          const givenDoses = vaccinationMap[vaccineName] || [];
                          const totalGiven = givenDoses.length;
                          const totalRequired = schedule.length;
                          const completionPercentage = Math.round(
                            (totalGiven / totalRequired) * 100,
                          );

                          return (
                            <div
                              key={vaccineName}
                              className="border border-base-300 rounded-lg p-3 bg-base-50"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-base-content text-sm">
                                  {vaccineName}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      totalGiven === totalRequired
                                        ? 'bg-success/20 text-success'
                                        : totalGiven > 0
                                          ? 'bg-warning/20 text-warning'
                                          : 'bg-base-300 text-base-content'
                                    }`}
                                  >
                                    {totalGiven}/{totalRequired}
                                  </span>
                                  <span className="text-xs font-medium text-base-content">
                                    {completionPercentage}%
                                  </span>
                                </div>
                              </div>

                              <div className="w-full bg-base-300 rounded-full h-1 mb-3">
                                <div
                                  className={`h-1 rounded-full transition-all ${
                                    completionPercentage === 100
                                      ? 'bg-success'
                                      : 'bg-primary'
                                  }`}
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>

                              <div className="space-y-1">
                                {schedule.map((scheduleItem, index) => {
                                  const dose = givenDoses[index];
                                  const isGiven = dose !== undefined;

                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-xs py-1 px-2 bg-base-200 rounded"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div
                                          className={`w-1.5 h-1.5 rounded-full ${isGiven ? 'bg-success' : 'bg-base-content/30'}`}
                                        />
                                        <span className="font-medium">
                                          Dose {scheduleItem.dose}
                                        </span>
                                        <span className="text-base-content/60 bg-base-300 px-1 py-0.5 rounded text-xs">
                                          {getRecommendedAgeText(scheduleItem)}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        {isGiven ? (
                                          <div>
                                            <p className="font-medium text-base-content">
                                              {adToBs(
                                                safeFormatDateYYMMDD(dose.date),
                                              )}
                                            </p>
                                            <p className="text-base-content/60">
                                              {safeFormatDate(dose.date)}
                                            </p>
                                          </div>
                                        ) : (
                                          <span className="text-base-content/50 italic">
                                            Pending
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-sm border-b border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-base-content mb-1">
                Children Health Records
              </h1>
              <p className="text-base-content/70 text-sm">
                Manage and track children's health information and vaccination
                records
              </p>
            </div>
            <button className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-focus text-primary-content px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md">
              <FaPlus />
              <span>Add New Child</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="Search children by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-base-content placeholder:text-base-content/60"
              />
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <FaBaby className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {children.length}
                </p>
                <p className="text-xs text-base-content/70">Total Children</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
            <div className="flex items-center space-x-3">
              <div className="bg-success/10 p-2 rounded-lg">
                <FaCheckCircle className="text-success text-lg" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {children.filter((child) => child.purnaKhop).length}
                </p>
                <p className="text-xs text-base-content/70">Fully Vaccinated</p>
              </div>
            </div>
          </div>
        </div>

        {filteredChildren.length === 0 ? (
          <div className="bg-base-100 rounded-lg shadow-md border border-base-300 p-8 text-center">
            <FaBaby className="text-4xl text-base-content/40 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-base-content mb-2">
              {searchTerm
                ? 'No matching children found'
                : 'No children records found'}
            </h2>
            <p className="text-base-content/70 text-sm mb-4">
              {searchTerm
                ? 'Try adjusting your search terms or clear the search to see all children.'
                : 'Get started by adding your first child record.'}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentChildren.map((child) => {
                const age = safeCalculateAge(child.birthDate);

                return (
                  <div
                    key={child.id}
                    className="bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-base-300 overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedChild(child)}
                  >
                    <div className="bg-base-200 border-b border-base-300 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FaBaby className="text-primary" />
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            child.purnaKhop
                              ? 'bg-success/20 text-success border border-success/30'
                              : 'bg-warning/20 text-warning border border-warning/30'
                          }`}
                        >
                          {child.purnaKhop ? 'Vaccinated' : 'Pending'}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-base-content">
                        {child.fullName} {child.lastName || ''}
                      </h3>
                      <p className="text-base-content/70 text-sm">
                        {age.formatted}
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">
                            Birth Date (B.S.)
                          </span>
                          <span className="font-medium text-base-content">
                            {adToBs(safeFormatDateYYMMDD(child.birthDate))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">
                            Birth Date (A.D.)
                          </span>
                          <span className="font-medium text-base-content">
                            {safeFormatDate(child.birthDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-base-content/70">Ward</span>
                          <span className="font-medium text-base-content">
                            {child.wardNumber}
                          </span>
                        </div>
                      </div>
                      <button className="w-full bg-base-200 hover:bg-primary hover:text-primary-content text-base-content py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-base-300 group-hover:bg-primary group-hover:text-primary-content">
                        <FaEye />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-primary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-base-content">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-primary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
