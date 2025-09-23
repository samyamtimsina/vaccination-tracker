import { useMemo, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
  FaSpinner,
  FaChevronLeft,
  FaBaby,
  FaEye,
  FaUser,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaSyringe,
  FaPrint,
  FaCheckCircle,
  FaPlus,
  FaWeight,
  FaClock,
  FaUserMd,
  FaExclamationTriangle,
  FaTimesCircle,
  FaChartLine,
} from 'react-icons/fa';
import {
  safeFormatDate,
  safeFormatDateYYMMDD,
} from '../utils/date.js';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import VaccinationCardOverlay from '../components/print';
import { useChildContext } from '../context/ChildContext';
import { useVaccineScheduleContext } from '../context/VaccineScheduleContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ViewChildren() {
  const navigate = useNavigate();
  const { sewaDartaNumber } = useParams();
  const { t, i18n } = useTranslation('viewChildren');

  // All hooks declared at the top
  const [expandedDoses, setExpandedDoses] = useState({});
  const [selectedChild, setSelectedChild] = useState(null);
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [loadingVaccineTypes, setLoadingVaccineTypes] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  // Primary compact search functionality
  const [filters, setFilters] = useState({
    name: '',

    serviceRegistrationNumber: '',
    phoneNumber: '',
    createdByMe: false,
    gender: '',
    isComplete: false,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const { childrenData, error, loading, fetchChildren } = useChildContext();
  const { user } = useAuth();
  const { vaccineSchedule, loading: scheduleLoading } = useVaccineScheduleContext();

  const itemsPerPage = 12;
  const resultsPerPage = 10;

  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Safe date conversion function
  const safeAdToBs = (dateString) => {
    try {
      if (!dateString) return '';
      const formattedDate = safeFormatDateYYMMDD(dateString);
      return formattedDate ? adToBs(formattedDate) : '';
    } catch (error) {
      console.error('Error converting date to BS:', error, dateString);
      return '';
    }
  };

  // Calculate age in a more detailed format
  const calculateDetailedAge = (birthDate) => {
    if (!birthDate) return { years: 0, months: 0, formatted: 'Unknown' };

    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years === 0) {
      return {
        years: 0,
        months,
        formatted: `${months}mo`
      };
    } else {
      return {
        years,
        months,
        formatted: months > 0 ? `${years}y ${months}m` : `${years}y`
      };
    }
  };

  // Calculate age in days
  const calculateAgeInDays = (birthDate) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    return Math.floor((today - birth) / (1000 * 60 * 60 * 24));
  };

  // Fetch children data
  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // Handle direct sewaDartaNumber navigation
  useEffect(() => {
    if (sewaDartaNumber && !selectedChild) {
      handleDirectSearch(sewaDartaNumber);
    }
  }, [sewaDartaNumber, selectedChild]);

  // Check if filters are active
  useEffect(() => {
    const hasFilters = filters.name || filters.serviceRegistrationNumber || filters.phoneNumber || filters.gender || filters.wardNumber || filters.isComplete || filters.createdByMe;
    setHasActiveFilters(hasFilters);
  }, [filters]);

  // Primary search functionality - debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!hasActiveFilters || !user) {
        setSearchResults([]);
        return;
      }

      setIsLoadingSearch(true);

      try {
        // Choose API based on role
        let endpoint = '/api/child/search-ward'; // default for WARD_OFFICER
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
          endpoint = '/api/child/search'; // superadmin/admin endpoint
        }

        const res = await axiosClient.get(endpoint, {
          params: {
            name: filters.name,
            phoneNumber: filters.phoneNumber,
            sewaDartaNumber: filters.serviceRegistrationNumber,
            gender: filters.gender,
            createdByMe: filters.createdByMe,
            isComplete: filters.isComplete,
          },
        });

        let results = [];
        if (Array.isArray(res.data)) {
          results = res.data;
        } else if (res.data && Array.isArray(res.data.children)) {
          results = res.data.children;
        } else if (res.data && Array.isArray(res.data.data)) {
          results = res.data.data;
        } else if (res.data && Array.isArray(res.data.items)) {
          results = res.data.items;
        }

        setSearchResults(results);
        console.log('search results', results);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      } finally {
        setIsLoadingSearch(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [filters, hasActiveFilters, user]);

  // Handle direct search by sewaDartaNumber
  const handleDirectSearch = async (number) => {
    try {
      setIsSearching(true);
      const response = await axiosClient.get(`/api/child/${number}`);
      if (response.data) {
        setSelectedChild(response.data);
      }
    } catch (error) {
      console.error('Direct search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleViewDetails = async (child) => {
    try {
      setIsSearching(true);
      const response = await axiosClient.get(`/api/child/${child.sewaDartaNumber}`);
      if (response.data) {
        setSelectedChild(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch child details:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle child select from search results - always fetch complete data
  const handleChildSelect = (child) => {
    if (!child) return;
    handleViewDetails(child);
  };

  // Extract children array
  const childrenArray = useMemo(() => {
    if (!childrenData) return [];
    if (Array.isArray(childrenData)) return childrenData;
    if (childrenData.children && Array.isArray(childrenData.children)) {
      return childrenData.children;
    }
    return [];
  }, [childrenData]);

  console.log('selected child', selectedChild)
  // Get filtered children - use search results if searching, otherwise show all
  const filteredChildren = useMemo(() => {
    if (hasActiveFilters) {
      return searchResults;
    }
    return childrenArray;
  }, [childrenArray, searchResults, hasActiveFilters]);

  // Fix pagination - convert to 0-based for backend compatibility
  const currentChildren = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredChildren.slice(indexOfFirst, indexOfLast);
  }, [filteredChildren, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      name: '',
      serviceRegistrationNumber: '',
      phoneNumber: '',
      wardNumber: '',
      createdByMe: false,
      gender: '',
      isComplete: false,
    });
    setSearchResults([]);
    setCurrentPage(1);
  };

  // Toggle section expansion
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Organize vaccines by type
  const organizeVaccinesByType = (child) => {
    const vaccineTypeMap = {};

    // Initialize with all vaccine types
    vaccineTypes.forEach(vt => {
      vaccineTypeMap[vt.name] = {
        id: vt.id,
        name: vt.name,
        completed: [],
        due: [],
        overdue: []
      };
    });

    // Add completed vaccinations
    if (child.vaccinations) {
      child.vaccinations.forEach(vacc => {
        const typeName = vacc.vaccineType?.name || 'Unknown';
        if (vaccineTypeMap[typeName]) {
          vaccineTypeMap[typeName].completed.push({
            ...vacc,
            type: 'completed'
          });
        }
      });
    }

    // Add due vaccines
    if (child.dueVaccines) {
      child.dueVaccines.forEach(due => {
        if (!due.isCompleted) {
          const vaccineType = vaccineTypes.find(vt => vt.id === due.vaccineTypeId);
          const typeName = vaccineType?.name || 'Unknown';
          const isOverdue = new Date(due.dueDate) < new Date();

          if (vaccineTypeMap[typeName]) {
            if (isOverdue) {
              vaccineTypeMap[typeName].overdue.push({
                ...due,
                type: 'overdue',
                name: typeName
              });
            } else {
              vaccineTypeMap[typeName].due.push({
                ...due,
                type: 'due',
                name: typeName
              });
            }
          }
        }
      });
    }

    // Filter out vaccine types with no data
    const result = {};
    Object.keys(vaccineTypeMap).forEach(key => {
      const vaccine = vaccineTypeMap[key];
      if (vaccine.completed.length > 0 || vaccine.due.length > 0 || vaccine.overdue.length > 0) {
        result[key] = vaccine;
      }
    });

    return result;
  };

  // Create vaccination template
  const createVaccinationTemplate = (child) => {
    if (!vaccineSchedule?.doses) return {};

    const childAgeDays = calculateAgeInDays(child.birthDate);
    const vaccinationTemplate = {};

    // Create template structure from vaccine schedule
    Object.entries(vaccineSchedule.doses).forEach(([vaccineTypeName, scheduleDoses]) => {
      vaccinationTemplate[vaccineTypeName] = {
        name: vaccineTypeName,
        doses: scheduleDoses.map(scheduleDose => {
          // Find matching vaccination record
          const actualVaccination = child.vaccinations?.find(vacc =>
            vacc.vaccineType?.name === vaccineTypeName &&
            vacc.doseNumber === scheduleDose.doseNumber
          );

          // Find matching due vaccine
          const dueVaccine = child.dueVaccines?.find(due =>
            due.vaccineTypeId === scheduleDose.vaccineTypeId &&
            due.doseNumber === scheduleDose.doseNumber
          );

          // Calculate max age in days (approximate)
          let maxAgeDays = null;
          if (scheduleDose.maxAgeDays !== null) {
            maxAgeDays = scheduleDose.maxAgeDays;
          } else if (scheduleDose.maxAgeWeeks !== null) {
            maxAgeDays = scheduleDose.maxAgeWeeks * 7;
          } else if (scheduleDose.maxAgeMonths !== null) {
            maxAgeDays = scheduleDose.maxAgeMonths * 30.4375;
          } else if (scheduleDose.maxAgeYears !== null) {
            maxAgeDays = scheduleDose.maxAgeYears * 365.25;
          }

          // Calculate status
          let status = 'pending';
          let statusColor = 'badge-info';
          let statusIcon = 'FaClock';

          if (actualVaccination) {
            status = 'completed';
            statusColor = 'badge-success';
            statusIcon = 'FaCheckCircle';
          } else if (dueVaccine && !dueVaccine.isCompleted) {
            const isOverdue = new Date(dueVaccine.dueDate) < new Date();
            const isMissed = isOverdue && maxAgeDays !== null && childAgeDays > maxAgeDays;
            if (isMissed) {
              status = 'missed';
              statusColor = 'badge-secondary';
              statusIcon = 'FaExclamationTriangle';
            } else if (isOverdue) {
              status = 'overdue';
              statusColor = 'badge-error';
              statusIcon = 'FaExclamationTriangle';
            } else {
              status = 'due';
              statusColor = 'badge-warning';
              statusIcon = 'FaClock';
            }
          }

          return {
            doseNumber: scheduleDose.doseNumber,
            scheduleInfo: {
              isPrimary: scheduleDose.isPrimary,
              isBooster: scheduleDose.isBooster,
              recommendedAtDays: scheduleDose.recommendedAtDays,
              recommendedAtWeeks: scheduleDose.recommendedAtWeeks,
              recommendedAtMonths: scheduleDose.recommendedAtMonths,
              recommendedAtYears: scheduleDose.recommendedAtYears,
              maxAgeDays: scheduleDose.maxAgeDays,
              maxAgeWeeks: scheduleDose.maxAgeWeeks,
              maxAgeMonths: scheduleDose.maxAgeMonths,
              maxAgeYears: scheduleDose.maxAgeYears,
            },
            actualVaccination,
            dueVaccine,
            status,
            statusColor,
            statusIcon,
            dateGiven: actualVaccination?.dateGiven || null,
            dueDate: dueVaccine?.dueDate || null,
            administeredBy: actualVaccination?.administeredBy?.name || null,
            createdBy: actualVaccination?.createdBy?.name || null,
            isCatchUp: dueVaccine?.isCatchUp || scheduleDose.isBooster || false,
            overdueDays: dueVaccine && new Date(dueVaccine.dueDate) < new Date()
              ? Math.floor((new Date() - new Date(dueVaccine.dueDate)) / (1000 * 60 * 60 * 24))
              : null,
            daysUntilDue: dueVaccine && new Date(dueVaccine.dueDate) >= new Date()
              ? Math.ceil((new Date(dueVaccine.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
              : null
          };
        })
      };
    });

    return vaccinationTemplate;
  };

  // Get recommended age display
  const getRecommendedAgeDisplay = (scheduleInfo) => {
    if (scheduleInfo.recommendedAtDays !== null) {
      return scheduleInfo.recommendedAtDays === 0 ? 'At birth' : `${scheduleInfo.recommendedAtDays} days`;
    }
    if (scheduleInfo.recommendedAtWeeks !== null) {
      return `${scheduleInfo.recommendedAtWeeks} weeks`;
    }
    if (scheduleInfo.recommendedAtMonths !== null) {
      return `${scheduleInfo.recommendedAtMonths} months`;
    }
    if (scheduleInfo.recommendedAtYears !== null) {
      return `${scheduleInfo.recommendedAtYears} years`;
    }
    return 'Schedule TBD';
  };

  // Get vaccination stats - FIXED: Count both primary and catchup vaccines separately
  const getVaccinationStats = (child) => {
    const vaccinationTemplate = createVaccinationTemplate(child);

    // Count primary doses
    let totalPrimaryDoses = 0;
    let completedPrimaryDoses = 0;
    let pendingPrimaryDoses = 0;
    let overduePrimaryDoses = 0;

    // Count catchup/booster doses
    let totalCatchupDoses = 0;
    let completedCatchupDoses = 0;
    let pendingCatchupDoses = 0;
    let overdueCatchupDoses = 0;

    Object.values(vaccinationTemplate).forEach(vaccineData => {
      vaccineData.doses.forEach(dose => {
        if (dose.scheduleInfo.isPrimary) { // Primary doses
          totalPrimaryDoses++;
          if (dose.status === 'completed') {
            completedPrimaryDoses++;
          } else if (dose.status === 'overdue' || dose.status === 'missed') {
            overduePrimaryDoses++;
            pendingPrimaryDoses++;
          } else if (dose.status === 'due' || dose.status === 'pending') {
            pendingPrimaryDoses++;
          }
        } else if (dose.scheduleInfo.isBooster || dose.isCatchUp) { // Catchup/booster doses
          totalCatchupDoses++;
          if (dose.status === 'completed') {
            completedCatchupDoses++;
          } else if (dose.status === 'overdue' || dose.status === 'missed') {
            overdueCatchupDoses++;
            pendingCatchupDoses++;
          } else if (dose.status === 'due' || dose.status === 'pending') {
            pendingCatchupDoses++;
          }
        }
      });
    });

    const totalGiven = completedPrimaryDoses + completedCatchupDoses;
    const totalRequired = totalPrimaryDoses + totalCatchupDoses;
    const totalPending = pendingPrimaryDoses + pendingCatchupDoses;
    const totalOverdue = overduePrimaryDoses + overdueCatchupDoses;

    return {
      totalGiven,
      totalRequired,
      totalPending,
      totalOverdue,
      primaryStats: {
        total: totalPrimaryDoses,
        completed: completedPrimaryDoses,
        pending: pendingPrimaryDoses,
        overdue: overduePrimaryDoses
      },
      catchupStats: {
        total: totalCatchupDoses,
        completed: completedCatchupDoses,
        pending: pendingCatchupDoses,
        overdue: overdueCatchupDoses
      },
      isFullyVaccinated: completedPrimaryDoses === totalPrimaryDoses
    };
  };

  // Loading state for schedule
  if (scheduleLoading || !vaccineSchedule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold text-base-content">Loading Vaccination Schedule</h2>
          <p className="text-base-content/60 mt-2">Please wait while we load the data...</p>
        </div>
      </div>
    );
  }

  // Main loading state
  if (loading || loadingVaccineTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
          <h2 className="text-xl font-semibold text-base-content">Loading Children Records</h2>
          <p className="text-base-content/60 mt-2">Please wait while we fetch the data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="bg-base-100 rounded-lg shadow-lg max-w-md w-full p-8 text-center">
          <FaExclamationTriangle className="text-4xl text-error mb-4 mx-auto" />
          <h2 className="text-xl font-semibold text-base-content mb-2">Error Loading Data</h2>
          <p className="text-base-content/70 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render child card
  const renderChildCard = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const hasWeightRecords = child.weightRecords && child.weightRecords.length > 0;
    const latestWeight = hasWeightRecords ?
      child.weightRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;
    const vaccinationCount = child._count?.vaccinations || 0;
    const genderDisplay = child.gender === 'MALE' ? 'Male' : child.gender === 'FEMALE' ? 'Female' : child.gender || 'N/A';

    return (
      <div
        key={child.id}
        className="bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden group"
        onClick={() => handleChildSelect(child)}
      >
        {/* Header Bar with Status */}
        <div className="bg-gradient-to-r from-base-200 to-base-200/50 px-6 py-4 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <FaBaby className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-base-content group-hover:text-primary transition-colors">
                  {child.fullName} {child.lastName || ''}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-base-content/70 mt-1">
                  <span className="flex items-center space-x-1">
                    <FaClock className="text-xs" />
                    <span>{age.formatted}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaMapMarkerAlt className="text-xs" />
                    <span>Ward {child.wardNumber}</span>
                  </span>
                  <span className="font-mono text-xs bg-base-300/50 px-2 py-1 rounded">
                    #{child.sewaDartaNumber}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className={`badge badge-lg ${child.purnaKhop ? 'badge-success' : 'badge-warning'}`}>
                {child.purnaKhop ? (
                  <>
                    <FaCheckCircle className="mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle className="mr-1" />
                    Pending
                  </>
                )}
              </span>
              <div className="text-xs text-base-content/60 text-right">
                {vaccinationCount} vaccines given
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Personal Information Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600 text-xs" />
                </div>
                <h4 className="font-semibold text-base-content">Personal Information</h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                  <span className="text-sm text-base-content/70">Parent Name</span>
                  <span className="font-semibold text-base-content text-right max-w-32 truncate" title={child.parentName}>
                    {child.parentName || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                  <span className="text-sm text-base-content/70">Gender</span>
                  <span className="font-semibold text-base-content">{genderDisplay}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                  <span className="text-sm text-base-content/70">Tole</span>
                  <span className="font-semibold text-base-content text-right max-w-32 truncate" title={child.tole}>
                    {child.tole || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                  <span className="text-sm text-base-content/70">Caste</span>
                  <span className="font-semibold text-base-content">{child.casteCode || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-base-content/70">Other Municipality</span>
                  <span className={`badge badge-sm ${child.isFromOtherMunicipality ? 'badge-info' : 'badge-ghost'}`}>
                    {child.isFromOtherMunicipality ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates & Records Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FaClock className="text-green-600 text-xs" />
                </div>
                <h4 className="font-semibold text-base-content">Dates & Records</h4>
              </div>

              <div className="space-y-3">
                <div className="bg-base-200/30 rounded-lg p-3">
                  <div className="text-xs text-base-content/60 mb-1">Birth Date</div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">AD:</span>
                    <span className="font-semibold">{safeFormatDate(child.birthDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">BS:</span>
                    <span className="font-semibold">{safeAdToBs(child.birthDate)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                  <span className="text-sm text-base-content/70">Vaccines Given</span>
                  <span className="badge badge-primary badge-lg font-bold">{vaccinationCount}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-base-300/50">
                  <span className="text-sm text-base-content/70">Created</span>
                  <span className="font-semibold text-base-content text-sm">{safeFormatDate(child.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-base-content/70">Created by</span>
                  <button
                    className="font-semibold text-primary hover:text-primary-focus hover:underline transition-colors text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/users/${child.createdBy.id}`);
                    }}
                  >
                    {child.createdBy.name}
                  </button>
                </div>
              </div>
            </div>

            {/* Records & Actions Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaChartLine className="text-purple-600 text-xs" />
                </div>
                <h4 className="font-semibold text-base-content">Records & Actions</h4>
              </div>

              {/* Counts Display - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20 text-center">
                  <div className="text-xl font-bold text-primary mb-1">
                    {child._count?.vaccinations || 0}
                  </div>
                  <div className="text-xs text-base-content/60">Vaccines</div>
                </div>

                <div className="bg-gradient-to-r from-purple/5 to-purple/10 rounded-lg p-3 border border-purple/20 text-center">
                  <div className="text-xl font-bold text-purple-600 mb-1">
                    {child._count?.weightRecords || 0}
                  </div>
                  <div className="text-xs text-base-content/60">Weights</div>
                </div>
              </div>

              {/* Latest Weight Info if available */}
              {latestWeight && (
                <div className="text-center text-sm text-base-content/70 bg-base-200/30 rounded p-2">
                  Latest: <span className="font-semibold text-purple-600">{latestWeight.weight} kg</span>
                  <div className="text-xs text-base-content/50">
                    {safeFormatDate(latestWeight.createdAt)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  className="w-full btn btn-primary group-hover:btn-primary-focus"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChildSelect(child);
                  }}
                >
                  <FaEye className="mr-2" />
                  View Full Details
                </button>

                <button
                  className="w-full btn btn-outline btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/edit-child', {
                      state: {
                        selectedChild: child,
                        sewaDartaNumber: child.sewaDartaNumber
                      }
                    });
                  }}
                >
                  <FaUser className="mr-2" />
                  Edit Record
                </button>

                {child._count?.weightRecords > 0 && (
                  <button
                    className="w-full btn btn-outline btn-secondary btn-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/graph", { state: { childrenData: child } });
                    }}
                  >
                    <FaChartLine className="mr-1" />
                    View Graph
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const toggleDose = (type, doseNumber) => {
    const key = `${type}-${doseNumber}`;
    setExpandedDoses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderChildDetails = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const vaccinationStats = getVaccinationStats(child);
    const vaccinationTemplate = createVaccinationTemplate(child);

    const goToProfile = (userId) => {
      if (!userId) return;
      navigate(`/profile/${userId}`);
    };

    return (
      <div className="min-h-screen bg-base-200">
        {/* Top Navigation */}
        <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setSelectedChild(null)} className="btn btn-ghost">
              <FaChevronLeft /> Back to List
            </button>
            <h1 className="text-xl font-semibold">Child Details</h1>
            <button onClick={() => window.print()} className="btn btn-primary">
              <FaPrint /> Print
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="xl:col-span-4 space-y-6 print:hidden">
              {/* Basic Info */}
              <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
                <div className="bg-primary text-primary-content px-6 py-4 rounded-t-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-content/20 rounded-full flex items-center justify-center">
                      <FaBaby className="text-xl" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">
                        {child.fullName} {child.lastName || ""}
                      </h1>
                      <p className="text-primary-content/80">{age.formatted}</p>
                      <div className="flex items-center space-x-3 mt-2 text-sm">
                        <span className="bg-primary-content/20 px-2 py-1 rounded">
                          <FaMapMarkerAlt className="inline mr-1" /> Ward {child.wardNumber}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${child.purnaKhop
                            ? "bg-success text-success-content"
                            : "bg-warning text-warning-content"
                            }`}
                        >
                          {child.purnaKhop ? "Fully Vaccinated" : "Incomplete"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
                <div className="px-6 py-4 border-b border-base-300">
                  <h3 className="font-semibold text-base-content flex items-center">
                    <FaUser className="text-primary mr-2" /> Personal Information
                  </h3>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div>
                    <label className="text-xs text-base-content/60">Service Registration</label>
                    <div className="font-medium">#{child.sewaDartaNumber}</div>
                  </div>
                  <div>
                    <label className="text-xs text-base-content/60">Birth Date</label>
                    <div className="flex space-x-3">
                      <span>BS: {safeAdToBs(child.birthDate)}</span>
                      <span>AD: {safeFormatDate(child.birthDate)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-base-content/60">Created By</label>
                    <div>
                      <button
                        onClick={() => navigate(`/profile/${child.createdBy.id}`)}
                        className="text-primary hover:underline"
                      >
                        {child.createdBy.name}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vaccination Summary */}
              <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
                <div className="px-6 py-4 border-b border-base-300">
                  <h3 className="font-semibold text-base-content flex items-center">
                    <FaShieldAlt className="text-primary mr-2" /> Vaccination Summary
                  </h3>
                </div>
                <div className="p-6 text-sm grid grid-cols-2 gap-3">
                  <div className="bg-success/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-success">
                      {vaccinationStats.primaryStats.completed}
                    </p>
                    <p className="text-xs">Primary Complete</p>
                  </div>
                  <div className="bg-error/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-error">
                      {vaccinationStats.primaryStats.overdue}
                    </p>
                    <p className="text-xs">Primary Overdue</p>
                  </div>
                  <div className="bg-warning/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-warning">
                      {vaccinationStats.primaryStats.pending}
                    </p>
                    <p className="text-xs">Primary Pending</p>
                  </div>
                  <div className="bg-info/10 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-info">
                      {vaccinationStats.catchupStats.completed}
                    </p>
                    <p className="text-xs">Catchup Complete</p>
                  </div>
                </div>
              </div>

              {/* Weight Records */}
              {child.weightRecords?.length > 0 && (
                <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
                  <div className="px-6 py-4 border-b border-base-300">
                    <h3 className="font-semibold text-base-content flex items-center">
                      <FaWeight className="text-primary mr-2" /> Weight Records
                    </h3>
                  </div>
                  <div className="p-6 max-h-80 overflow-y-auto space-y-3">
                    {child.weightRecords
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((rec, idx) => (
                        <div key={rec.id} className="bg-base-200/50 rounded-lg p-3 flex justify-between">
                          <div>
                            <div className="font-bold text-lg">
                              {rec.weight} kg{" "}
                              {idx === 0 && <span className="badge badge-primary badge-sm">Latest</span>}
                            </div>
                            <div className="text-sm text-base-content/70">
                              Recorded: {safeFormatDate(rec.createdAt)}
                            </div>
                          </div>
                          <button
                            className="btn btn-xs btn-primary"
                            onClick={() => navigate("/graph", { state: { childrenData: child } })}
                          >
                            <FaChartLine /> Show Graph
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vaccination Records */}
            <div className="xl:col-span-8">
              <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
                <div className="bg-primary text-primary-content px-6 py-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold flex items-center">
                    <FaSyringe className="mr-2" /> Vaccination Records
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* === Print Compact Header === */}
                  <div className="print:block hidden text-xs mb-6">
                    <table className="w-full border text-xs">
                      <tbody>
                        <tr>
                          <td className="border px-2 py-1 font-semibold">Child</td>
                          <td className="border px-2 py-1">{child.fullName} {child.lastName || ""}</td>
                          <td className="border px-2 py-1 font-semibold">Age</td>
                          <td className="border px-2 py-1">{age.formatted}</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1 font-semibold">Parent</td>
                          <td className="border px-2 py-1">{child.parentName}</td>
                          <td className="border px-2 py-1 font-semibold">Ward</td>
                          <td className="border px-2 py-1">{child.wardNumber}</td>
                        </tr>
                        <tr>
                          <td className="border px-2 py-1 font-semibold">Birth</td>
                          <td className="border px-2 py-1">
                            BS: {safeAdToBs(child.birthDate)} | AD: {safeFormatDate(child.birthDate)}
                          </td>
                          <td className="border px-2 py-1 font-semibold">Weight</td>
                          <td className="border px-2 py-1">
                            {child.weightRecords?.[0]?.weight
                              ? `${child.weightRecords[0].weight} kg`
                              : "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* === Print Vaccination Tables === */}
                  <div className="hidden print:block space-y-6 text-sm">
                    {Object.entries(vaccinationTemplate).map(([vType, vData]) => (
                      <div key={vType} className="break-inside-avoid">
                        <h3 className="font-semibold text-lg mb-2 border-b pb-1">{vType}</h3>
                        <table className="w-full border text-xs">
                          <thead className="bg-base-200">
                            <tr>
                              <th className="border px-2 py-1">Dose</th>
                              <th className="border px-2 py-1">Type</th>
                              <th className="border px-2 py-1">Status</th>
                              <th className="border px-2 py-1">Date (BS)</th>
                              <th className="border px-2 py-1">Date (AD)</th>
                              <th className="border px-2 py-1">Given By</th>
                              <th className="border px-2 py-1">Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vData.doses.map((dose) => {
                              const isGiven = !!dose.actualVaccination;
                              let statusDisplay;
                              if (isGiven) {
                                statusDisplay = <><FaCheckCircle className="text-success inline" /> Given</>;
                              } else if (dose.status === "missed") {
                                statusDisplay = <><FaExclamationTriangle className="text-error inline" /> Missed {dose.overdueDays && `(by ${dose.overdueDays} days)`}</>;
                              } else if (dose.status === "overdue") {
                                statusDisplay = <><FaExclamationTriangle className="text-error inline" /> Overdue {dose.overdueDays && `(${dose.overdueDays} days)`}</>;
                              } else if (dose.status === "due") {
                                statusDisplay = <><FaClock className="text-warning inline" /> Due {dose.daysUntilDue && `(in ${dose.daysUntilDue} days)`}</>;
                              } else {
                                statusDisplay = "Pending";
                              }

                              return (
                                <tr key={`${vType}-${dose.doseNumber}`}>
                                  <td className="border px-2 py-1">Dose {dose.doseNumber}</td>
                                  <td className="border px-2 py-1">{dose.scheduleInfo.isPrimary ? "Primary" : "Catchup"}</td>
                                  <td className="border px-2 py-1">{statusDisplay}</td>
                                  <td className="border px-2 py-1">{isGiven ? safeAdToBs(dose.dateGiven) : dose.dueDate ? safeAdToBs(dose.dueDate) : "-"}</td>
                                  <td className="border px-2 py-1">{isGiven ? safeFormatDate(dose.dateGiven) : dose.dueDate ? safeFormatDate(dose.dueDate) : "-"}</td>
                                  <td className="border px-2 py-1">{dose.actualVaccination?.administeredBy?.name || "-"}</td>
                                  <td className="border px-2 py-1">{dose.actualVaccination?.notes || dose.dueVaccine?.notes || "-"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>

                  {/* === Onscreen Vaccination === */}
                  <div className="print:hidden space-y-8">
                    {Object.entries(vaccinationTemplate).map(([vType, vData]) => {
                      const primaryDoses = vData.doses.filter((d) => d.scheduleInfo.isPrimary);
                      const catchupDoses = vData.doses.filter((d) => d.scheduleInfo.isBooster || d.isCatchUp);
                      const primaryCompleted = primaryDoses.filter((d) => d.status === "completed").length;
                      const catchupCompleted = catchupDoses.filter((d) => d.status === "completed").length;

                      return (
                        <div key={vType} className="rounded-xl border shadow-md overflow-hidden">
                          <div className="px-4 py-3 flex items-center justify-between bg-primary/10 border-l-4 border-primary">
                            <h4 className="font-semibold text-lg text-primary">{vType}</h4>
                            <div className="text-xs flex space-x-2">
                              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                                Primary: {primaryCompleted}/{primaryDoses.length}
                              </span>
                              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                                Catchup: {catchupCompleted}/{catchupDoses.length}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            {vData.doses.map((dose) => {
                              const key = `${vType}-${dose.doseNumber}`;
                              const isGiven = !!dose.actualVaccination;
                              let icon = <FaClock className="text-warning" />;
                              if (isGiven) icon = <FaCheckCircle className="text-success" />;
                              else if (dose.status === "overdue" || dose.status === "missed") icon = <FaExclamationTriangle className="text-error" />;

                              return (
                                <div key={key} className="bg-base-100 border rounded-lg p-4 hover:shadow-sm transition">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                      {icon}
                                      <div>
                                        <div className="font-medium">
                                          Dose {dose.doseNumber} ({dose.scheduleInfo.isPrimary ? "Primary" : "Catchup"})
                                        </div>
                                        <div className="text-sm text-base-content/70">
                                          {isGiven
                                            ? `Given: ${safeFormatDate(dose.dateGiven)}`
                                            : dose.dueDate
                                              ? `Due: ${safeFormatDate(dose.dueDate)}`
                                              : "Pending"}
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      className="btn btn-outline btn-xs"
                                      onClick={() => toggleDose(vType, dose.doseNumber)}
                                    >
                                      {expandedDoses[key] ? "Hide" : "Details"}
                                    </button>
                                  </div>

                                  {expandedDoses[key] && (
                                    <div className="mt-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-200/40 p-3 rounded-lg">
                                      {isGiven ? (
                                        <>
                                          <div>
                                            <p><strong>BS:</strong> {safeAdToBs(dose.dateGiven)}</p>
                                            <p><strong>AD:</strong> {safeFormatDate(dose.dateGiven)}</p>
                                            <p><strong>Given By:</strong>{" "}
                                              {dose.actualVaccination?.administeredBy?.id ? (
                                                <button
                                                  onClick={() => goToProfile(dose.actualVaccination.administeredBy.id)}
                                                  className="text-primary hover:underline"
                                                >
                                                  {dose.actualVaccination.administeredBy.name}
                                                </button>
                                              ) : "-"}
                                            </p>
                                            <p><strong>Created By:</strong>{" "}
                                              {dose.actualVaccination?.createdBy?.id ? (
                                                <button
                                                  onClick={() => goToProfile(dose.actualVaccination.createdBy.id)}
                                                  className="text-primary hover:underline"
                                                >
                                                  {dose.actualVaccination.createdBy.name}
                                                </button>
                                              ) : "-"}
                                            </p>
                                          </div>
                                          <div>
                                            <p><strong>Recorded:</strong>{" "}
                                              {dose.actualVaccination?.createdAt ? safeFormatDate(dose.actualVaccination.createdAt) : "-"}
                                            </p>
                                            {dose.actualVaccination?.notes && (
                                              <p><strong>Remarks:</strong> {dose.actualVaccination.notes}</p>
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div>
                                            <p><strong>Due BS:</strong> {dose.dueDate ? safeAdToBs(dose.dueDate) : "-"}</p>
                                            <p><strong>Due AD:</strong> {dose.dueDate ? safeFormatDate(dose.dueDate) : "-"}</p>
                                            {dose.overdueDays !== null && (
                                              <p className="text-error"><strong>Overdue by:</strong> {dose.overdueDays} days</p>
                                            )}
                                            {dose.daysUntilDue !== null && (
                                              <p className="text-warning"><strong>Due in:</strong> {dose.daysUntilDue} days</p>
                                            )}
                                            <p><strong>Status:</strong> {dose.status}</p>
                                          </div>
                                          {dose.dueVaccine?.notes && (
                                            <div><strong>Remarks:</strong> {dose.dueVaccine.notes}</div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };




  // Main view
  return (
    <div className="min-h-screen bg-base-200">
      {showPrintComponent && selectedChild && (
        <VaccinationCardOverlay
          child={selectedChild}
          onClose={() => setShowPrintComponent(false)}
        />
      )}

      {isSearching ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
            <p className="text-base-content/60">Searching...</p>
          </div>
        </div>
      ) : selectedChild ? (
        renderChildDetails(selectedChild)
      ) : (
        <div>
          {/* Header */}
          <div className="bg-base-100 border-b border-base-300">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl font-bold text-base-content">Children Records</h1>
                  <p className="text-base-content/70">Manage and track vaccination records for all children</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="join">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`btn btn-sm join-item ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage('ne')}
                      className={`btn btn-sm join-item ${i18n.language === 'ne' ? 'btn-primary' : 'btn-outline'}`}
                    >
                      नेपाली
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('/add-child')}
                    className="btn btn-primary"
                  >
                    <FaPlus />
                    Add Child
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Compact Primary Search Section */}
            <div className="bg-base-100 shadow-sm rounded-lg border border-base-300 p-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="form-control">
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                    className="input input-bordered input-sm w-full"
                    placeholder="Search by name..."
                  />
                </div>
                <div className="form-control">
                  <input
                    type="text"
                    value={filters.serviceRegistrationNumber}
                    onChange={(e) => setFilters((prev) => ({ ...prev, serviceRegistrationNumber: e.target.value }))}
                    className="input input-bordered input-sm w-full"
                    placeholder="Service registration no..."
                  />
                </div>
                <div className="form-control">
                  <input
                    type="text"
                    value={filters.phoneNumber}
                    onChange={(e) => setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    className="input input-bordered input-sm w-full"
                    placeholder="Phone number..."
                  />
                </div>
                <div className="form-control">
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                    className="select select-bordered select-sm w-full"
                  >
                    <option value="">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>



              {hasActiveFilters && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-base-300">
                  <span className="text-sm text-base-content/70">
                    {isLoadingSearch ? (
                      <span className="flex items-center">
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        Searching...
                      </span>
                    ) : (
                      `Found ${filteredChildren.length} result${filteredChildren.length !== 1 ? 's' : ''}`
                    )}
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    <FaTimesCircle />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaBaby className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-base-content">{filteredChildren.length}</p>
                    <p className="text-sm text-base-content/70">
                      {hasActiveFilters ? 'Search Results' : 'Total Children'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-base-content">
                      {filteredChildren.filter((child) => child.purnaKhop).length}
                    </p>
                    <p className="text-sm text-base-content/70">Fully Vaccinated</p>
                  </div>
                </div>
              </div>

              <div className="bg-base-100 rounded-lg p-4 shadow-sm border border-base-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                    <FaExclamationTriangle className="text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-base-content">
                      {filteredChildren.filter((child) => !child.purnaKhop).length}
                    </p>
                    <p className="text-sm text-base-content/70">Incomplete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Children Grid or Empty State */}
            {filteredChildren.length === 0 ? (
              <div className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-12 text-center">
                <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBaby className="text-2xl text-base-content/40" />
                </div>
                <h2 className="text-xl font-semibold text-base-content mb-2">
                  {hasActiveFilters ? 'No children found' : 'No children records yet'}
                </h2>
                <p className="text-base-content/70 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'Try adjusting your search criteria to find what you\'re looking for.'
                    : 'Get started by adding your first child record to track their vaccination progress.'}
                </p>
                {!hasActiveFilters && (
                  <button
                    onClick={() => navigate('/add-child')}
                    className="btn btn-primary"
                  >
                    <FaPlus />
                    Add First Child
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {currentChildren.map(renderChildCard)}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-primary disabled:opacity-50"
                    >
                      <FaChevronLeft />
                      Previous
                    </button>
                    <span className="text-base-content font-medium bg-base-100 px-4 py-2 rounded-lg border border-base-300">
                      Page {currentPage} of {totalPages} ({filteredChildren.length} total)
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-primary disabled:opacity-50"
                    >
                      Next
                      <FaChevronLeft className="rotate-180" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}