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
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-3" />
          <p className="text-base-content">Loading vaccination schedule...</p>
        </div>
      </div>
    );
  }

  // Main loading state
  if (loading || loadingVaccineTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-3" />
          <p className="text-base-content">Loading children records...</p>
        </div>
      </div>
    );
  }

  // Error state
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

  // Render child card (styled like second code)
  const renderChildCard = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const hasWeightRecords = child.weightRecords && child.weightRecords.length > 0;
    const latestWeight = hasWeightRecords ?
      child.weightRecords.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;

    return (
      <div
        key={child.id}
        className="bg-base-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-base-200 overflow-hidden group cursor-pointer hover:scale-[1.02]"
        onClick={() => setSelectedChild(child)}
      >
        <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <FaBaby className="text-xl" />
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${child.purnaKhop
                ? 'bg-green-500/30 text-green-100'
                : 'bg-yellow-500/30 text-yellow-100'
                } backdrop-blur-sm`}
            >
              {child.purnaKhop ? 'Vaccinated' : 'Pending'}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-1">
            {child.fullName} {child.lastName || ''}
          </h3>
          <p className="text-primary-content/80 text-sm">
            {age.formatted}
          </p>
        </div>
        <div className="p-4 bg-base-100">
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-base-content/60 font-medium">
                Birth (BS)
              </span>
              <span className="font-semibold text-base-content bg-base-200 px-2 py-1 rounded-md">
                {safeAdToBs(child.birthDate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/60 font-medium">
                Birth (AD)
              </span>
              <span className="font-semibold text-base-content bg-base-200 px-2 py-1 rounded-md">
                {safeFormatDate(child.birthDate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/60 font-medium">Ward</span>
              <span className="font-semibold text-base-content bg-base-200 px-2 py-1 rounded-md">
                {child.wardNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base-content/60 font-medium">Vaccinations</span>
              <span className="font-semibold text-base-content bg-base-200 px-2 py-1 rounded-md">
                {child.vaccinations ? child.vaccinations.length : 0}
              </span>
            </div>
            {latestWeight && (
              <div className="flex items-center justify-between">
                <span className="text-base-content/60 font-medium flex items-center space-x-1">
                  <FaWeight className="text-base" />
                  <span>Latest Weight</span>
                </span>
                <span className="font-semibold text-base-content bg-base-200 px-2 py-1 rounded-md">
                  {latestWeight.weight} kg
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-base-200">
              <span className="text-base-content/60 flex items-center space-x-1">
                <FaUserMd className="text-base" />
                <span
                  className="hover:text-primary hover:underline cursor-pointer font-medium"
                  onClick={(e) => { e.stopPropagation(); navigate(`/users/${child.createdBy.id}`); }}
                >
                  Created By: {child.createdBy.name}
                </span>
              </span>
            </div>
          </div>
          <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-content py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-primary/20 group-hover:bg-primary group-hover:text-primary-content">
            <FaEye />
            <span>View Details</span>
          </button>
        </div>
      </div>
    );
  };

  // Render detailed child view (styled like second code)
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
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 min-w-[20rem]">
        <div className="bg-base-100 shadow-md border-b border-base-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button
              onClick={() => setSelectedChild(null)}
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-semibold cursor-pointer group"
            >
              <FaChevronLeft className="text-base group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center space-x-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-content transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:scale-105 cursor-pointer"
            >
              <FaPrint className="text-lg" />
              <span>Print</span>
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
              <div className="xl:col-span-4 space-y-6">
                {/* Child Basic Info */}
                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                  <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        <FaBaby className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                          {child.fullName}{' '}
                          {child.lastName || ''}
                        </h1>
                        <p className="text-primary-content/80 text-base mt-1">
                          {age.formatted}
                        </p>
                        <div className="flex items-center space-x-4 mt-3 text-sm">
                          <span className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full">
                            <FaMapMarkerAlt />
                            <span>Ward {child.wardNumber}</span>
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${child.purnaKhop
                              ? 'bg-green-500/30 text-green-100'
                              : 'bg-yellow-500/30 text-yellow-100'
                              } backdrop-blur-sm`}
                          >
                            {child.purnaKhop
                              ? 'Fully Vaccinated'
                              : 'Incomplete'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="font-bold text-xl text-base-content mb-4 flex items-center space-x-2">
                    <FaUser className="text-primary text-2xl" />
                    <span>Personal Info</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                    <div className="bg-base-200/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-base-content/60 block mb-1">
                        Service Registration
                      </label>
                      <p className="font-semibold text-base-content">
                        #{child.sewaDartaNumber}
                      </p>
                    </div>

                    <div className="bg-base-200/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-base-content/60 block mb-1 flex items-center space-x-1">
                        <FaVenusMars className="text-base" />
                        <span>Gender</span>
                      </label>
                      <p className="font-semibold text-base-content">
                        {child.gender}
                      </p>
                    </div>

                    <div className="bg-base-200/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-base-content/60 block mb-1">
                        Parent Name
                      </label>
                      <p className="font-semibold text-base-content">
                        {child.parentName}
                      </p>
                    </div>

                    <div className="bg-base-200/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-base-content/60 block mb-1">
                        Tole
                      </label>
                      <p className="font-semibold text-base-content">
                        {child.tole}
                      </p>
                    </div>

                    {child.phoneNumber && (
                      <div className="bg-base-200/50 p-3 rounded-lg">
                        <label className="text-sm font-medium text-base-content/60 block mb-1">
                          Phone
                        </label>
                        <p className="font-semibold text-base-content">
                          {child.phoneNumber}
                        </p>
                      </div>
                    )}

                    <div className="bg-base-200/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-base-content/60 block mb-1">
                        Municipality
                      </label>
                      <p className="font-semibold text-base-content">
                        {child.isFromOtherMunicipality
                          ? 'Other'
                          : 'Local'}
                      </p>
                    </div>

                    <div className="bg-base-200/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-base-content/60 block mb-1">
                        Caste Code
                      </label>
                      <p className="font-semibold text-base-content">
                        {child.casteCode}
                      </p>
                    </div>

                    <div className="sm:col-span-2 bg-base-200/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-base-content/60 block mb-1 flex items-center space-x-1">
                        <FaBirthdayCake className="text-base" />
                        <span>Birth Date</span>
                      </label>
                      <div className="flex space-x-4">
                        <span className="font-semibold text-base-content">
                          BS: {safeAdToBs(child.birthDate)}
                        </span>
                        <span className="font-semibold text-base-content">
                          AD: {safeFormatDate(child.birthDate)}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 pt-4 border-t border-base-200">
                      <label className="text-sm font-medium text-base-content/60 block mb-2 flex items-center space-x-1">
                        <FaUserMd className="text-base" />
                        <span>Record Info</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-base-200/50 p-3 rounded-lg">
                          <span className="text-base-content/70 block mb-1">
                            Created By:
                          </span>
                          <span
                            className="font-semibold text-base-content hover:text-primary hover:underline cursor-pointer"
                            onClick={() => navigate(`/users/${child.createdBy.id}`)}
                          >
                            {child.createdBy.name}
                          </span>
                        </div>
                        <div className="bg-base-200/50 p-3 rounded-lg">
                          <span className="text-base-content/70 block mb-1">Created On:</span>
                          <span className="font-semibold text-base-content">
                            {safeFormatDate(child.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vaccination Summary */}
                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="font-bold text-xl text-base-content mb-4 flex items-center space-x-2">
                    <FaShieldAlt className="text-primary text-2xl" />
                    <span>Vaccination Summary</span>
                  </h3>
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative w-24 h-24">
                      <svg
                        className="w-24 h-24 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-base-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount) * 100 === 100
                              ? 'text-green-500'
                              : 'text-primary'
                          }
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${(vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount)) * 100}, 100`}
                          strokeLinecap="round"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-xl font-bold ${vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount) * 100 === 100 ? 'text-green-500' : 'text-primary'}`}
                        >
                          {Math.round((vaccinationStats.totalGiven / (vaccinationStats.totalGiven + vaccinationStats.pendingCount)) * 100) || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-base-content/70 font-medium mb-1">
                        Overall Progress
                      </p>
                      <p className="text-xl font-bold text-base-content">
                        {vaccinationStats.totalGiven} / {vaccinationStats.totalGiven + vaccinationStats.pendingCount} doses given
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 rounded-lg p-4 shadow-inner">
                      <p className="text-3xl font-bold text-green-600">
                        {vaccinationStats.totalGiven}
                      </p>
                      <p className="text-sm text-base-content/80 mt-1">Complete</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 shadow-inner">
                      <p className="text-3xl font-bold text-red-600">
                        {vaccinationStats.overdueCount}
                      </p>
                      <p className="text-sm text-base-content/80 mt-1">Overdue</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 shadow-inner">
                      <p className="text-3xl font-bold text-yellow-600">
                        {vaccinationStats.pendingCount}
                      </p>
                      <p className="text-sm text-base-content/80 mt-1">Pending</p>
                    </div>
                  </div>
                </div>

                {/* Weight Records */}
                {child.weightRecords && child.weightRecords.length > 0 && (
                  <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="font-bold text-xl text-base-content mb-4 flex items-center space-x-2">
                      <FaWeight className="text-primary text-2xl" />
                      <span>Weight Records</span>
                    </h3>

                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {child.weightRecords
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((record, index) => (
                          <div key={record.id} className="bg-base-200/50 border border-base-200 rounded-xl p-4 hover:bg-base-200 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl font-bold text-primary">
                                  {record.weight} kg
                                </span>
                                {index === 0 && (
                                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                                    Latest
                                  </span>
                                )}
                              </div>
                              <div className="text-right text-sm text-base-content/70">
                                <div>BS: {safeAdToBs(record.date)}</div>
                                <div>AD: {safeFormatDate(record.date)}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-base-content/60">
                              <div className="flex items-center space-x-2">
                                <FaUserMd className="text-base" />
                                <span
                                  className="hover:text-primary hover:underline cursor-pointer font-medium"
                                  onClick={() => navigate(`/users/${record.createdBy.id}`)}
                                >
                                  Recorded By: {record.createdBy.name}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FaClock className="text-base" />
                                <span>Recorded On {safeFormatDate(record.createdAt)}</span>
                                <button className='btn btn-primary btn-sm rounded-full' onClick={handleButtonClick}>Show Graph</button>
                              </div>
                            </div>

                          </div>

                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vaccination Records */}
              <div className="xl:col-span-8">
                <div className="bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold flex items-center space-x-2">
                          <FaSyringe className="text-2xl" />
                          <span>Vaccination Records</span>
                        </h2>
                        <p className="text-primary-content/80 text-sm mt-1">
                          Track and manage vaccinations
                        </p>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                          <span>Given</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                          <span>Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="columns-1 lg:columns-2 gap-6">
                      {Object.entries(vaccinationTemplate).map(
                        ([vaccineTypeName, vaccineData]) => {
                          const completedCount = vaccineData.doses.filter(
                            (dose) => dose.status === "completed"
                          ).length;
                          const totalRequired = vaccineData.doses.length;
                          const completionPercentage = Math.round(
                            (completedCount / totalRequired) * 100
                          );

                          return (
                            <div
                              key={vaccineTypeName}
                              className="mb-6 break-inside-avoid bg-base-100 rounded-2xl shadow-lg border border-base-300 hover:shadow-xl transition-all"
                            >
                              {/* Vaccine Type Header */}
                              <div className="px-4 py-2 bg-primary/10 border-b border-base-200 rounded-t-2xl flex items-center justify-between">
                                <h4 className="font-bold text-lg text-base-content">
                                  {vaccineTypeName}
                                </h4>
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${completedCount === totalRequired
                                        ? "bg-green-100 text-green-800"
                                        : completedCount > 0
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {completedCount}/{totalRequired}
                                  </span>
                                  <span className="text-sm font-medium text-base-content">
                                    {completionPercentage}%
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="px-4 pt-4">
                                <div className="w-full bg-base-200 rounded-full h-2 mb-4">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${completionPercentage === 100
                                        ? "bg-green-500"
                                        : "bg-primary"
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
                                      className={`rounded-xl p-4 space-y-3 border shadow-sm transition-colors ${dose.scheduleInfo.isPrimary
                                          ? "border-l-4 border-blue-500 bg-blue-50/50"
                                          : dose.scheduleInfo.isBooster
                                            ? "border-l-4 border-purple-500 bg-purple-50/50"
                                            : "border border-base-200 bg-base-100"
                                        }`}
                                    >
                                      {/* Dose header */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div
                                            className={`w-3 h-3 rounded-full ${isGiven ? "bg-green-500" : "bg-base-content/20"
                                              }`}
                                          />
                                          <span className="font-semibold text-base">
                                            Dose {dose.doseNumber}
                                          </span>
                                          {doseType && (
                                            <span
                                              className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide ${dose.scheduleInfo.isPrimary
                                                  ? "bg-blue-500 text-white"
                                                  : "bg-purple-500 text-white"
                                                }`}
                                            >
                                              {doseType}
                                            </span>
                                          )}
                                          <span className="text-base-content/60 bg-base-200 px-3 py-1 rounded-full text-sm">
                                            {getRecommendedAgeDisplay(dose.scheduleInfo)}
                                          </span>
                                        </div>
                                        {isGiven && (
                                          <FaCheckCircle className="text-green-500 text-xl" />
                                        )}
                                      </div>

                                      {/* Given vs Due sections */}
                                      {isGiven ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                          <div className="space-y-2">
                                            <div className="font-medium text-base-content bg-base-200/50 p-2 rounded-md">
                                              Given On BS: {safeAdToBs(dose.dateGiven)}
                                            </div>
                                            <div className="text-base-content/70 bg-base-200/50 p-2 rounded-md">
                                              Given On AD: {safeFormatDate(dose.dateGiven)}
                                            </div>
                                            {dose.actualVaccination?.type && (
                                              <div className="mt-2">
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                                  {dose.actualVaccination.type}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="space-y-2">
                                            {/* Created By / Given By */}
                                            <div className="bg-base-200/50 p-2 rounded-md space-y-1">
                                              <div className="flex items-center space-x-2 text-base-content/70">
                                                <FaUserMd className="text-base" />
                                                <span
                                                  className="hover:text-primary hover:underline cursor-pointer font-medium"
                                                  onClick={() =>
                                                    navigate(
                                                      `/users/${dose.actualVaccination.createdBy.id}`
                                                    )
                                                  }
                                                >
                                                  Created By: {dose.createdBy}
                                                </span>
                                              </div>
                                              <div className="flex items-center space-x-2 text-base-content/70">
                                                <FaUserMd className="text-base" />
                                                <span
                                                  className="hover:text-primary hover:underline cursor-pointer font-medium"
                                                  onClick={() =>
                                                    navigate(
                                                      `/users/${dose.actualVaccination.administeredBy.id}`
                                                    )
                                                  }
                                                >
                                                  Given By: {dose.administeredBy}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Recorded On */}
                                            <div className="flex items-center space-x-2 text-base-content/70 bg-base-200/50 p-2 rounded-md">
                                              <FaClock className="text-base" />
                                              <span>
                                                Recorded:{" "}
                                                {safeFormatDate(
                                                  dose.actualVaccination.createdAt
                                                )}
                                              </span>
                                            </div>
                                          </div>

                                          {dose.actualVaccination.notes && (
                                            <div className="md:col-span-2 mt-3 p-3 bg-base-200 rounded-xl border-l-4 border-primary">
                                              <div className="text-sm text-base-content/70 mb-1 font-medium">
                                                Remarks
                                              </div>
                                              <div className="text-base text-base-content">
                                                {dose.actualVaccination.notes}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="p-3 bg-base-200 rounded-xl">
                                          {dose.dueDate ? (
                                            <div className="space-y-2">
                                              <div
                                                className={`font-medium ${dose.status === "missed"
                                                    ? "text-purple-600"
                                                    : dose.overdueDays
                                                      ? "text-red-600"
                                                      : "text-yellow-600"
                                                  } bg-white/50 p-2 rounded-md`}
                                              >
                                                Due On BS: {safeAdToBs(dose.dueDate)}
                                              </div>
                                              <div
                                                className={`text-base-content/70 ${dose.status === "missed"
                                                    ? "text-purple-600"
                                                    : dose.overdueDays
                                                      ? "text-red-600"
                                                      : "text-yellow-600"
                                                  } bg-white/50 p-2 rounded-md`}
                                              >
                                                Due On AD: {safeFormatDate(dose.dueDate)}
                                              </div>
                                              {dose.status === "missed" ? (
                                                <span className="badge badge-secondary badge-lg px-4 py-3">
                                                  Missed (Overdue by {dose.overdueDays} days)
                                                </span>
                                              ) : dose.overdueDays ? (
                                                <span className="badge badge-error badge-lg px-4 py-3">
                                                  Overdue by {dose.overdueDays} days
                                                </span>
                                              ) : dose.daysUntilDue ? (
                                                <span className="badge badge-warning badge-lg px-4 py-3">
                                                  Due in {dose.daysUntilDue} days
                                                </span>
                                              ) : (
                                                <span className="badge badge-info badge-lg px-4 py-3">
                                                  Upcoming
                                                </span>
                                              )}
                                            </div>
                                          ) : (
                                            <span className="text-base-content/50 italic text-base block text-center">
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
                        }
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
  };

  // Main view (styled like second code)
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 min-w-[20rem]">
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
          <div className="bg-base-100 shadow-md border-b border-base-200">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold text-base-content mb-1">
                    Children Records
                  </h1>
                  <p className="text-base-content/70 text-base">
                    Manage and track vaccination records for all children
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`text-base font-medium px-3 py-1 rounded-md transition-colors ${i18n.language === 'en' ? 'bg-primary text-primary-content' : 'text-base-content/60 hover:bg-base-200'}`}
                  >
                    English
                  </button>
                  <span className="text-base-content/30">|</span>
                  <button
                    onClick={() => changeLanguage('ne')}
                    className={`text-base font-medium px-3 py-1 rounded-md transition-colors ${i18n.language === 'ne' ? 'bg-primary text-primary-content' : 'text-base-content/60 hover:bg-base-200'}`}
                  >
                    नेपाली
                  </button>
                  <button
                    onClick={() => navigate('/add-child')}
                    className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-content px-5 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer">
                    <FaPlus />
                    <span>Add Child</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 text-xl" />
                  <input
                    type="text"
                    placeholder="Search by name, phone number, or sewa darta number..."
                    className="w-full pl-12 pr-4 py-4 bg-base-100 border border-base-200 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-base-content placeholder:text-base-content/60 text-base"
                    value={universalSearch}
                    onChange={(e) => {
                      setUniversalSearch(e.target.value);
                      handleUniversalSearch(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FaBaby className="text-primary text-2xl" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-base-content">
                      {childrenArray.length}
                    </p>
                    <p className="text-base text-base-content/70">Total Children</p>
                  </div>
                </div>
              </div>

              <div className="bg-base-100 rounded-2xl p-5 shadow-md border border-base-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-base-content">
                      {childrenArray.filter((child) => child.purnaKhop).length}
                    </p>
                    <p className="text-base text-base-content/70">Fully Vaccinated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between mb-6">
              <button
                className="btn btn-ghost gap-2 text-base font-medium hover:bg-base-200 rounded-full px-5 py-2.5"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <FaFilter className="text-lg" />
                Advanced Filters
                {showAdvancedFilters ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
              </button>

              {(universalSearch || Object.values(advancedFilters).some(val => val !== '' && val !== false)) && (
                <button
                  className="btn btn-ghost btn-error gap-2 text-base font-medium hover:bg-error/10 rounded-full px-5 py-2.5"
                  onClick={clearAllFilters}
                >
                  <FaTimesCircle className="text-lg" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 p-6 bg-base-100 rounded-2xl border border-base-200 shadow-md">
                {/* Gender Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Gender</span>
                  </label>
                  <select
                    className="select select-bordered rounded-full text-base"
                    value={advancedFilters.gender}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, gender: e.target.value })}
                  >
                    <option value="">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                {/* Ward Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Ward Number</span>
                  </label>
                  <select
                    className="select select-bordered rounded-full text-base"
                    value={advancedFilters.ward}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, ward: e.target.value })}
                  >
                    <option value="">All Wards</option>
                    {Array.from({ length: 32 }, (_, i) => i + 1).map(ward => (
                      <option key={ward} value={ward}>Ward {ward}</option>
                    ))}
                  </select>
                </div>

                {/* Vaccination Status */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Vaccination Status</span>
                  </label>
                  <select
                    className="select select-bordered rounded-full text-base"
                    value={advancedFilters.vaccinationStatus}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, vaccinationStatus: e.target.value })}
                  >
                    <option value="">All Statuses</option>
                    <option value="complete">Complete</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>

                {/* Created By Me */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-base">Created By</span>
                  </label>
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary rounded-full"
                      checked={advancedFilters.createdByMe}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, createdByMe: e.target.checked })}
                    />
                    <span className="label-text text-base">Created by Me</span>
                  </label>
                </div>
              </div>
            )}

            {filteredChildren.length === 0 ? (
              <div className="bg-base-100 rounded-2xl shadow-md border border-base-200 p-12 text-center">
                <FaBaby className="text-6xl text-base-content/20 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  {hasSearched ? 'No children found' : 'No children records yet'}
                </h2>
                <p className="text-base-content/70 text-base mb-6 max-w-md mx-auto">
                  {hasSearched
                    ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                    : 'Get started by adding your first child record to track their vaccination progress.'}
                </p>
                {!hasSearched && (
                  <button
                    onClick={() => navigate('/add-child')}
                    className="bg-primary hover:bg-primary/90 text-primary-content px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg"
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
                      className="btn btn-primary rounded-full px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                    >
                      Previous
                    </button>
                    <span className="text-base-content text-base font-medium bg-base-100 px-6 py-3 rounded-full shadow-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="btn btn-primary rounded-full px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
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