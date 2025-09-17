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
  FaWeight,
  FaClock,
  FaUserMd,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCalendarCheck,
  FaBell,
  FaIdCard,
  FaHome,
  FaEnvelope,
  FaInfoCircle,
  FaHistory,
  FaFilter,
  FaTimesCircle,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaHeart,
  FaAward,
} from 'react-icons/fa';
import {
  safeCalculateAge,
  safeFormatDate,
  safeFormatDateYYMMDD,
} from '../utils/date.js';
import { adToBs } from '@sbmdkl/nepali-date-converter';
import VaccinationCardOverlay from '../components/print';
import { useChildContext } from '../context/ChildContext';
import { useVaccineScheduleContext } from '../context/VaccineScheduleContext';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function ViewChildren() {
  const navigate = useNavigate();
  const { sewaDartaNumber } = useParams();
  const { t, i18n } = useTranslation('viewChildren');

  // All hooks declared at the top
  const [selectedChild, setSelectedChild] = useState(null);
  const [universalSearch, setUniversalSearch] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    gender: '',
    ward: '',
    createdByMe: false,
    vaccinationStatus: '',
  });
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [loadingVaccineTypes, setLoadingVaccineTypes] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const { childrenData, error, loading, fetchChildren } = useChildContext();
  const { vaccineSchedule, loading: scheduleLoading } = useVaccineScheduleContext();
  console.log('vaccineSchedule', vaccineSchedule);

  const itemsPerPage = 12;

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

  // Extract children array
  const childrenArray = useMemo(() => {
    if (!childrenData) return [];
    if (Array.isArray(childrenData)) return childrenData;
    if (childrenData.children && Array.isArray(childrenData.children)) {
      console.log('childrenData.children from the extract children array function in around like 170', childrenData.children)
      return childrenData.children;
    }
    return [];
  }, [childrenData]);

  // Universal search handler
  const handleUniversalSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      if (/^\d+$/.test(searchTerm.trim())) {
        try {
          const response = await axiosClient.get(`/api/child/${searchTerm.trim()}`);
          if (response.data) {
            setSearchResults([response.data]);
            setIsSearching(false);
            return;
          }
        } catch (error) {
          // Fall through to general search if direct search fails
        }
      }

      const response = await axiosClient.get('/api/child/search', {
        params: {
          name: searchTerm,
          phoneNumber: searchTerm,
          sewaDartaNumber: searchTerm,
        },
      });

      let results = [];
      if (Array.isArray(response.data)) {
        results = response.data;
      } else if (response.data?.children) {
        results = response.data.children;
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Advanced filter handler
  const applyAdvancedFilters = (children) => {
    return children.filter(child => {
      if (advancedFilters.gender && child.gender !== advancedFilters.gender) {
        return false;
      }
      if (advancedFilters.ward && child.wardNumber !== parseInt(advancedFilters.ward)) {
        return false;
      }
      if (advancedFilters.vaccinationStatus === 'complete' && !child.purnaKhop) {
        return false;
      }
      if (advancedFilters.vaccinationStatus === 'incomplete' && child.purnaKhop) {
        return false;
      }
      return true;
    });
  };

  // Get filtered children
  const filteredChildren = useMemo(() => {
    let children = [];

    if (hasSearched) {
      children = searchResults;
    } else {
      children = childrenArray;
    }

    children = applyAdvancedFilters(children);

    return children;
  }, [childrenArray, searchResults, hasSearched, advancedFilters]);

  // Pagination
  const currentChildren = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return filteredChildren.slice(indexOfFirst, indexOfLast);
  }, [filteredChildren, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredChildren.length / itemsPerPage);

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

  // NEW FUNCTION: Create vaccination template
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
            maxAgeDays = scheduleDose.maxAgeMonths * 30.4375; // average days per month
          } else if (scheduleDose.maxAgeYears !== null) {
            maxAgeDays = scheduleDose.maxAgeYears * 365.25; // average days per year
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
            // Helper properties
            dateGiven: actualVaccination?.dateGiven || null,
            dueDate: dueVaccine?.dueDate || null,
            administeredBy: actualVaccination?.administeredBy?.name || null,
            createdBy: actualVaccination?.createdBy?.name || null,

            isCatchUp: dueVaccine?.isCatchUp || scheduleDose.isBooster || false, // Map isBooster to isCatchUp
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

  // NEW FUNCTION: Get recommended age display
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

  // NEW FUNCTION: Get max age display
  const getMaxAgeDisplay = (scheduleInfo) => {
    if (scheduleInfo.maxAgeDays !== null) {
      return `${scheduleInfo.maxAgeDays} days`;
    }
    if (scheduleInfo.maxAgeWeeks !== null) {
      return `${scheduleInfo.maxAgeWeeks} weeks`;
    }
    if (scheduleInfo.maxAgeMonths !== null) {
      return `${scheduleInfo.maxAgeMonths} months`;
    }
    if (scheduleInfo.maxAgeYears !== null) {
      return `${scheduleInfo.maxAgeYears} years`;
    }
    return 'No limit';
  };

  // Get vaccination stats
  const getVaccinationStats = (child) => {
    const totalVaccinations = child._count?.vaccinations || 0;
    const dueVaccines = child.dueVaccines || [];
    const overdueCount = dueVaccines.filter(v =>
      !v.isCompleted && new Date(v.dueDate) < new Date()
    ).length;
    const pendingCount = dueVaccines.filter(v => !v.isCompleted).length;

    return {
      totalGiven: totalVaccinations,
      overdueCount,
      pendingCount,
      whatsLeft: child.whatsLeft || 0,
      isFullyVaccinated: child.purnaKhop
    };
  };

  // Clear all filters
  const clearAllFilters = () => {
    setUniversalSearch('');
    setAdvancedFilters({
      gender: '',
      ward: '',
      createdByMe: false,
      vaccinationStatus: '',
    });
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  // Toggle section expansion
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Loading state for schedule
  if (scheduleLoading || !vaccineSchedule) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="animate-spin text-5xl text-primary" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-base-content mb-1">Loading Vaccination Schedule</h2>
            <p className="text-base-content/60">Please wait while we load the data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main loading state
  if (loading || loadingVaccineTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="animate-spin text-5xl text-primary" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-base-content mb-1">Loading Children Records</h2>
            <p className="text-base-content/60">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="bg-base-100 rounded-lg border border-error/20 shadow-sm max-w-md w-full">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-2xl text-error" />
            </div>
            <h2 className="text-lg font-semibold text-base-content mb-2">Error Loading Data</h2>
            <p className="text-base-content/70 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm mt-4"
            >
              Try Again
            </button>
          </div>
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

    return (
      <div
        key={child.id}
        className="bg-base-100 border border-base-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-primary/30"
        onClick={() => setSelectedChild(child)}
      >
        {/* Header */}
        <div className="bg-base-200/50 px-4 py-3 border-b border-base-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <FaBaby className="text-primary text-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-base-content text-sm">
                  {child.fullName} {child.lastName || ''}
                </h3>
                <p className="text-base-content/60 text-xs">{age.formatted}</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${child.purnaKhop
                ? 'bg-success/10 text-success'
                : 'bg-warning/10 text-warning'
              }`}>
              {child.purnaKhop ? 'Complete' : 'Pending'}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Birth (BS)</span>
                <span className="font-medium text-base-content bg-base-200 px-2 py-0.5 rounded">
                  {safeAdToBs(child.birthDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Ward</span>
                <span className="font-medium text-base-content bg-base-200 px-2 py-0.5 rounded">
                  {child.wardNumber}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Birth (AD)</span>
                <span className="font-medium text-base-content bg-base-200 px-2 py-0.5 rounded">
                  {safeFormatDate(child.birthDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Vaccines</span>
                <span className="font-medium text-base-content bg-base-200 px-2 py-0.5 rounded">
                  {child.vaccinations ? child.vaccinations.length : 0}
                </span>
              </div>
            </div>
          </div>

          {latestWeight && (
            <div className="flex justify-between items-center pt-2 border-t border-base-300">
              <span className="text-base-content/60 text-xs flex items-center space-x-1">
                <FaWeight className="text-xs" />
                <span>Latest Weight</span>
              </span>
              <span className="font-medium text-base-content bg-base-200 px-2 py-0.5 rounded text-xs">
                {latestWeight.weight} kg
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-base-300">
            <p className="text-base-content/60 text-xs">
              Created by{' '}
              <span
                className="font-medium text-primary hover:underline cursor-pointer"
                onClick={(e) => { e.stopPropagation(); navigate(`/users/${child.createdBy.id}`); }}
              >
                {child.createdBy.name}
              </span>
            </p>
          </div>

          <button className="w-full btn btn-sm btn-outline btn-primary group-hover:btn-primary">
            <FaEye className="text-sm" />
            View Details
          </button>
        </div>
      </div>
    );
  };

  // Render detailed child view
  const renderChildDetails = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const vaccinationStats = getVaccinationStats(child);
    const vaccinesByType = organizeVaccinesByType(child);
    const vaccinationTemplate = createVaccinationTemplate(child);

    const handleButtonClick = () => {
      console.log('selectedChild:', child);
      navigate('/graph', { state: { childrenData: child } });
    };

    return (
      <div className="min-h-screen bg-base-200">
        {/* Top Navigation */}
        <div className="bg-base-100 border-b border-base-300">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setSelectedChild(null)}
              className="btn btn-ghost btn-sm"
            >
              <FaChevronLeft />
              Back to List
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-primary btn-sm"
            >
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        {showPrintComponent ? (
          <VaccinationCardOverlay
            data={{
              ...child,
              birthDate: adToBs(safeFormatDateYYMMDD(child.birthDate)),
              vaccinations: child.vaccinations.map((vaccine) => ({
                ...vaccine,
                dateGiven: adToBs(safeFormatDateYYMMDD(vaccine.dateGiven)),
              })),
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Sidebar */}
              <div className="xl:col-span-4 space-y-6">
                {/* Child Basic Info */}
                <div className="bg-base-100 border border-base-300 rounded-lg shadow-sm">
                  <div className="bg-primary text-primary-content px-6 py-4 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-content/20 rounded-full flex items-center justify-center">
                        <FaBaby className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-lg font-semibold">
                          {child.fullName} {child.lastName || ''}
                        </h1>
                        <p className="text-primary-content/80 text-sm">{age.formatted}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs">
                          <span className="bg-primary-content/20 px-2 py-1 rounded">
                            <FaMapMarkerAlt className="inline mr-1" />
                            Ward {child.wardNumber}
                          </span>
                          <span className={`px-2 py-1 rounded ${child.purnaKhop
                              ? 'bg-success/20 text-success-content'
                              : 'bg-warning/20 text-warning-content'
                            }`}>
                            {child.purnaKhop ? 'Fully Vaccinated' : 'Incomplete'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-base-100 border border-base-300 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-base-300">
                    <h3 className="font-semibold text-base-content flex items-center space-x-2">
                      <FaUser className="text-primary" />
                      <span>Personal Information</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-base-content/60">Service Registration</label>
                        <p className="font-medium text-base-content">#{child.sewaDartaNumber}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-base-content/60 flex items-center space-x-1">
                          <FaVenusMars />
                          <span>Gender</span>
                        </label>
                        <p className="font-medium text-base-content">{child.gender}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-base-content/60">Parent Name</label>
                        <p className="font-medium text-base-content">{child.parentName}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-base-content/60">Tole</label>
                        <p className="font-medium text-base-content">{child.tole}</p>
                      </div>

                      {child.phoneNumber && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-base-content/60">Phone</label>
                          <p className="font-medium text-base-content">{child.phoneNumber}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-base-content/60">Municipality</label>
                        <p className="font-medium text-base-content">
                          {child.isFromOtherMunicipality ? 'Other' : 'Local'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-base-content/60">Caste Code</label>
                        <p className="font-medium text-base-content">{child.casteCode}</p>
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-medium text-base-content/60 flex items-center space-x-1">
                          <FaBirthdayCake />
                          <span>Birth Date</span>
                        </label>
                        <div className="flex space-x-4">
                          <span className="font-medium text-base-content">
                            BS: {safeAdToBs(child.birthDate)}
                          </span>
                          <span className="font-medium text-base-content">
                            AD: {safeFormatDate(child.birthDate)}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-2 pt-3 border-t border-base-300">
                        <label className="text-xs font-medium text-base-content/60 flex items-center space-x-1 mb-2">
                          <FaUserMd />
                          <span>Record Information</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs text-base-content/60">Created By:</span>
                            <p className="font-medium text-primary hover:underline cursor-pointer"
                              onClick={() => navigate(`/users/${child.createdBy.id}`)}>
                              {child.createdBy.name}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-base-content/60">Created On:</span>
                            <p className="font-medium text-base-content">
                              {safeFormatDate(child.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vaccination Summary */}
                <div className="bg-base-100 border border-base-300 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-base-300">
                    <h3 className="font-semibold text-base-content flex items-center space-x-2">
                      <FaShieldAlt className="text-primary" />
                      <span>Vaccination Summary</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-base-300"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={
                              vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount) * 100 === 100
                                ? 'text-success'
                                : 'text-primary'
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${(vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount)) * 100}, 100`}
                            strokeLinecap="round"
                            fill="transparent"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-lg font-bold ${vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount) * 100 === 100
                              ? 'text-success'
                              : 'text-primary'
                            }`}>
                            {Math.round((vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount)) * 100) || 0}%
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-base-content/60 font-medium mb-1">Overall Progress</p>
                        <p className="text-lg font-semibold text-base-content">
                          {vaccinationStats.totalGiven} / {vaccinationStats.totalGiven + vaccinationStats.pendingCount} doses given
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-success/10 rounded-lg p-3">
                        <p className="text-2xl font-bold text-success">{vaccinationStats.totalGiven}</p>
                        <p className="text-xs text-base-content/70 mt-1">Complete</p>
                      </div>
                      <div className="bg-error/10 rounded-lg p-3">
                        <p className="text-2xl font-bold text-error">{vaccinationStats.overdueCount}</p>
                        <p className="text-xs text-base-content/70 mt-1">Overdue</p>
                      </div>
                      <div className="bg-warning/10 rounded-lg p-3">
                        <p className="text-2xl font-bold text-warning">{vaccinationStats.pendingCount}</p>
                        <p className="text-xs text-base-content/70 mt-1">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weight Records */}
                {child.weightRecords && child.weightRecords.length > 0 && (
                  <div className="bg-base-100 border border-base-300 rounded-lg shadow-sm">
                    <div className="px-6 py-4 border-b border-base-300">
                      <h3 className="font-semibold text-base-content flex items-center space-x-2">
                        <FaWeight className="text-primary" />
                        <span>Weight Records</span>
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {child.weightRecords
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((record, index) => (
                            <div key={record.id} className="bg-base-200/50 border border-base-300 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <span className="text-xl font-bold text-primary">{record.weight} kg</span>
                                  {index === 0 && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                      Latest
                                    </span>
                                  )}
                                </div>
                                <div className="text-right text-xs text-base-content/60">
                                  <div>BS: {safeAdToBs(record.date)}</div>
                                  <div>AD: {safeFormatDate(record.date)}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-base-content/60">
                                <div className="flex items-center space-x-2">
                                  <FaUserMd />
                                  <span
                                    className="hover:text-primary hover:underline cursor-pointer font-medium"
                                    onClick={() => navigate(`/users/${record.createdBy.id}`)}
                                  >
                                    Recorded by {record.createdBy.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    <FaClock />
                                    <span>On {safeFormatDate(record.createdAt)}</span>
                                  </div>
                                  <button className="btn btn-primary btn-xs" onClick={handleButtonClick}>
                                    Show Graph
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Vaccination Records - Main Content */}
              <div className="xl:col-span-8">
                <div className="bg-base-100 border border-base-300 rounded-lg shadow-sm">
                  <div className="bg-primary text-primary-content px-6 py-4 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold flex items-center space-x-2">
                          <FaSyringe />
                          <span>Vaccination Records</span>
                        </h2>
                        <p className="text-primary-content/80 text-sm mt-1">Complete vaccination history and schedule</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-primary-content rounded-full"></div>
                          <span>Completed</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-primary-content/30 rounded-full"></div>
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="columns-1 lg:columns-2 gap-6">
                      {Object.entries(vaccinationTemplate).map(([vaccineTypeName, vaccineData]) => {
                        const primaryDoses = vaccineData.doses.filter(d => d.scheduleInfo.isPrimary);
                        const boosterDoses = vaccineData.doses.filter(d => d.scheduleInfo.isBooster);
                        const primaryCompleted = primaryDoses.filter(d => d.status === 'completed').length;
                        const boosterCompleted = boosterDoses.filter(d => d.status === 'completed').length;
                        const primaryTotal = primaryDoses.length;
                        const boosterTotal = boosterDoses.length;
                        const totalRequired = primaryTotal + boosterTotal;
                        const completedCount = primaryCompleted + boosterCompleted;
                        const completionPercentage = totalRequired > 0 ? Math.round((completedCount / totalRequired) * 100) : 0;

                        return (
                          <div
                            key={vaccineTypeName}
                            className="mb-6 break-inside-avoid bg-base-100 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-colors shadow-sm"
                          >
                            {/* Vaccine Type Header */}
                            <div className="px-4 py-3 bg-base-200/50 border-b border-base-300 rounded-t-lg flex items-center justify-between">
                              <h4 className="font-semibold text-base-content">{vaccineTypeName}</h4>
                              <div className="flex items-center space-x-2">
                                {primaryTotal > 0 && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${primaryCompleted === primaryTotal
                                      ? "bg-success/10 text-success"
                                      : primaryCompleted > 0
                                        ? "bg-warning/10 text-warning"
                                        : "bg-base-200 text-base-content/60"
                                    }`}>
                                    Primary: {primaryCompleted}/{primaryTotal}
                                  </span>
                                )}
                                {boosterTotal > 0 && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${boosterCompleted === boosterTotal
                                      ? "bg-success/10 text-success"
                                      : boosterCompleted > 0
                                        ? "bg-warning/10 text-warning"
                                        : "bg-base-200 text-base-content/60"
                                    }`}>
                                    Booster: {boosterCompleted}/{boosterTotal}
                                  </span>
                                )}
                                <span className="text-xs font-semibold text-base-content">
                                  {completionPercentage}%
                                </span>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="px-4 pt-3">
                              <div className="w-full bg-base-300 rounded-full h-1.5 mb-4">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-300 ${completionPercentage === 100 ? "bg-success" : "bg-primary"
                                    }`}
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                            </div>

                            {/* Dose list */}
                            <div className="p-4 space-y-3">
                              {vaccineData.doses.map((dose, index) => {
                                const isGiven = dose.actualVaccination !== undefined;
                                const doseType = dose.scheduleInfo.isPrimary
                                  ? "Primary"
                                  : dose.scheduleInfo.isBooster
                                    ? "Catchup"
                                    : "";

                                return (
                                  <div
                                    key={index}
                                    className={`rounded-lg p-4 border transition-colors ${dose.scheduleInfo.isPrimary
                                        ? "border-l-4 border-l-blue-400 bg-blue-50/30 border-blue-200"
                                        : dose.scheduleInfo.isBooster
                                          ? "border-l-4 border-l-purple-400 bg-purple-50/30 border-purple-200"
                                          : "border-base-300 bg-base-50"
                                      }`}
                                  >
                                    {/* Dose header */}
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${isGiven ? "bg-success" : "bg-base-content/20"
                                          }`} />
                                        <span className="font-semibold text-base-content">
                                          Dose {dose.doseNumber}
                                        </span>
                                        {doseType && (
                                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${dose.scheduleInfo.isPrimary
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-purple-100 text-purple-800"
                                            }`}>
                                            {doseType}
                                          </span>
                                        )}
                                        <span className="text-base-content/60 bg-base-200 px-2 py-1 rounded text-xs">
                                          {getRecommendedAgeDisplay(dose.scheduleInfo)}
                                        </span>
                                      </div>
                                      {isGiven && (
                                        <FaCheckCircle className="text-success text-lg" />
                                      )}
                                    </div>

                                    {/* Given vs Due sections */}
                                    {isGiven ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-2">
                                          <div className="font-medium text-base-content bg-base-200/50 p-2 rounded">
                                            Given On BS: {safeAdToBs(dose.dateGiven)}
                                          </div>
                                          <div className="text-base-content/70 bg-base-200/50 p-2 rounded">
                                            Given On AD: {safeFormatDate(dose.dateGiven)}
                                          </div>
                                          {dose.actualVaccination?.type && (
                                            <div className="mt-2">
                                              <span className="px-2 py-1 rounded text-xs font-medium bg-info/10 text-info">
                                                {dose.actualVaccination.type}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-2">
                                          <div className="bg-base-200/50 p-2 rounded space-y-1">
                                            <div className="flex items-center space-x-2 text-base-content/70">
                                              <FaUserMd className="text-xs" />
                                              <span
                                                className="hover:text-primary hover:underline cursor-pointer font-medium"
                                                onClick={() => navigate(`/users/${dose.actualVaccination.createdBy.id}`)}
                                              >
                                                Created By: {dose.createdBy}
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-base-content/70">
                                              <FaUserMd className="text-xs" />
                                              <span
                                                className="hover:text-primary hover:underline cursor-pointer font-medium"
                                                onClick={() => navigate(`/users/${dose.actualVaccination.administeredBy.id}`)}
                                              >
                                                Given By: {dose.administeredBy}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center space-x-2 text-base-content/70 bg-base-200/50 p-2 rounded">
                                            <FaClock className="text-xs" />
                                            <span>
                                              Recorded: {safeFormatDate(dose.actualVaccination.createdAt)}
                                            </span>
                                          </div>
                                        </div>

                                        {dose.actualVaccination.notes && (
                                          <div className="md:col-span-2 mt-3 p-3 bg-base-200/50 rounded-lg border-l-4 border-primary">
                                            <div className="text-xs text-base-content/60 mb-1 font-medium">Remarks</div>
                                            <div className="text-sm text-base-content">
                                              {dose.actualVaccination.notes}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="p-3 bg-base-200/50 rounded-lg">
                                        {dose.dueDate ? (
                                          <div className="space-y-2">
                                            <div className={`font-medium p-2 rounded ${dose.status === "missed"
                                                ? "text-secondary bg-secondary/10"
                                                : dose.overdueDays
                                                  ? "text-error bg-error/10"
                                                  : "text-warning bg-warning/10"
                                              }`}>
                                              Due On BS: {safeAdToBs(dose.dueDate)}
                                            </div>
                                            <div className={`text-base-content/70 p-2 rounded ${dose.status === "missed"
                                                ? "text-secondary bg-secondary/10"
                                                : dose.overdueDays
                                                  ? "text-error bg-error/10"
                                                  : "text-warning bg-warning/10"
                                              }`}>
                                              Due On AD: {safeFormatDate(dose.dueDate)}
                                            </div>
                                            {dose.status === "missed" ? (
                                              <span className="badge badge-secondary">
                                                Missed (Overdue by {dose.overdueDays} days)
                                              </span>
                                            ) : dose.overdueDays ? (
                                              <span className="badge badge-error">
                                                Overdue by {dose.overdueDays} days
                                              </span>
                                            ) : dose.daysUntilDue ? (
                                              <span className="badge badge-warning">
                                                Due in {dose.daysUntilDue} days
                                              </span>
                                            ) : (
                                              <span className="badge badge-info">Upcoming</span>
                                            )}
                                          </div>
                                        ) : (
                                          <span className="text-base-content/50 italic text-center block">
                                            Not Administered
                                          </span>
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
        )}
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

      {selectedChild ? (
        renderChildDetails(selectedChild)
      ) : (
        <div>
          {/* Header */}
          <div className="bg-base-100 border-b border-base-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-2xl font-bold text-base-content mb-1">Children Records</h1>
                  <p className="text-base-content/70">Manage and track vaccination records for all children</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-base-200 rounded-lg p-1">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${i18n.language === 'en'
                          ? 'bg-base-100 text-base-content shadow-sm'
                          : 'text-base-content/60 hover:text-base-content'
                        }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage('ne')}
                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${i18n.language === 'ne'
                          ? 'bg-base-100 text-base-content shadow-sm'
                          : 'text-base-content/60 hover:text-base-content'
                        }`}
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
            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search by name, phone number, or sewa darta number..."
                    className="input input-bordered w-full pl-12 bg-base-100"
                    value={universalSearch}
                    onChange={(e) => {
                      setUniversalSearch(e.target.value);
                      handleUniversalSearch(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaBaby className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-base-content">{childrenArray.length}</p>
                    <p className="text-sm text-base-content/70">Total Children</p>
                  </div>
                </div>
              </div>

              <div className="bg-base-100 border border-base-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-base-content">
                      {childrenArray.filter((child) => child.purnaKhop).length}
                    </p>
                    <p className="text-sm text-base-content/70">Fully Vaccinated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between mb-6">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FaFilter />
                Advanced Filters
                {showAdvancedFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {(universalSearch || Object.values(advancedFilters).some(val => val !== '' && val !== false)) && (
                <button className="btn btn-ghost btn-sm text-error" onClick={clearAllFilters}>
                  <FaTimesCircle />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 p-6 bg-base-100 border border-base-300 rounded-lg shadow-sm">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Gender</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={advancedFilters.gender}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, gender: e.target.value })}
                  >
                    <option value="">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Ward Number</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={advancedFilters.ward}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, ward: e.target.value })}
                  >
                    <option value="">All Wards</option>
                    {Array.from({ length: 32 }, (_, i) => i + 1).map(ward => (
                      <option key={ward} value={ward}>Ward {ward}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Vaccination Status</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={advancedFilters.vaccinationStatus}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, vaccinationStatus: e.target.value })}
                  >
                    <option value="">All Statuses</option>
                    <option value="complete">Complete</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Created By</span>
                  </label>
                  <label className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-3"
                      checked={advancedFilters.createdByMe}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, createdByMe: e.target.checked })}
                    />
                    <span className="label-text">Created by Me</span>
                  </label>
                </div>
              </div>
            )}

            {/* Children Grid or Empty State */}
            {filteredChildren.length === 0 ? (
              <div className="bg-base-100 border border-base-300 rounded-lg shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBaby className="text-2xl text-base-content/40" />
                </div>
                <h2 className="text-xl font-semibold text-base-content mb-2">
                  {hasSearched ? 'No children found' : 'No children records yet'}
                </h2>
                <p className="text-base-content/70 mb-6 max-w-md mx-auto">
                  {hasSearched
                    ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                    : 'Get started by adding your first child record to track their vaccination progress.'}
                </p>
                {!hasSearched && (
                  <button
                    onClick={() => navigate('/add-child')}
                    className="btn btn-primary"
                  >
                    Add First Child
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentChildren.map(renderChildCard)}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-primary disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-base-content font-medium bg-base-100 border border-base-300 px-4 py-2 rounded-lg">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-primary disabled:opacity-50"
                    >
                      Next
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