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

  // Fetch vaccine types
  useEffect(() => {
    const fetchVaccineTypes = async () => {
      setLoadingVaccineTypes(true);
      try {
        const response = await axiosClient.get('/api/vaccine-schedule/types');
        setVaccineTypes(response.data || []);
      } catch (error) {
        console.error('Error fetching vaccine types:', error);
        setVaccineTypes([]);
      } finally {
        setLoadingVaccineTypes(false);
      }
    };

    fetchVaccineTypes();
  }, []);

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
            if (isOverdue) {
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
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content text-lg font-medium mt-4">Loading vaccination schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main loading state
  if (loading || loadingVaccineTypes) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content text-lg font-medium mt-4">Loading children records...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body items-center text-center">
            <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-error text-xl" />
            </div>
            <h3 className="card-title text-base-content">Error Loading Data</h3>
            <p className="text-base-content/70 mb-6">{error}</p>
            <div className="card-actions">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-error"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render child card
  const renderChildCard = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const vaccinationStats = getVaccinationStats(child);

    return (
      <div
        key={child.id}
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer border border-base-300"
        onClick={() => setSelectedChild(child)}
      >
        {/* Header */}
        <div className="card-body p-0">
          <div className="bg-primary text-primary-content p-4 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {child.fullName}
                </h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <FaBirthdayCake className="w-3 h-3" />
                    {age.formatted}
                  </span>
                  <span>•</span>
                  <div className="badge badge-primary badge-outline">
                    Ward {child.wardNumber}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`badge ${vaccinationStats.isFullyVaccinated
                  ? 'badge-success'
                  : 'badge-warning'
                  }`}>
                  {vaccinationStats.isFullyVaccinated ? 'Complete' : 'Incomplete'}
                </div>
                <div className="text-xs opacity-70 mt-1">#{child.sewaDartaNumber}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Quick info grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-base-content/60 text-xs font-medium">Parent</div>
                <div className="font-medium text-base-content truncate">{child.parentName}</div>
              </div>
              <div>
                <div className="text-base-content/60 text-xs font-medium">Gender</div>
                <div className="font-medium text-base-content">
                  {child.gender === 'MALE' ? 'Male' : 'Female'}
                </div>
              </div>
              <div>
                <div className="text-base-content/60 text-xs font-medium">Phone</div>
                <div className="text-base-content/80 text-xs truncate">{child.phoneNumber || 'N/A'}</div>
              </div>
              <div>
                <div className="text-base-content/60 text-xs font-medium">Location</div>
                <div className="text-base-content/80 text-xs truncate">{child.tole}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-base-200 rounded-lg p-3">
              <div className="stats stats-horizontal w-full">
                <div className="stat p-2">
                  <div className="stat-value text-success text-base">{vaccinationStats.totalGiven}</div>
                  <div className="stat-desc text-xs">Given</div>
                </div>
                <div className="stat p-2">
                  <div className="stat-value text-error text-base">{vaccinationStats.overdueCount}</div>
                  <div className="stat-desc text-xs">Overdue</div>
                </div>
                <div className="stat p-2">
                  <div className="stat-value text-info text-base">{vaccinationStats.pendingCount}</div>
                  <div className="stat-desc text-xs">Pending</div>
                </div>
                <div className="stat p-2">
                  <div className="stat-value text-secondary text-base">{vaccinationStats.whatsLeft}</div>
                  <div className="stat-desc text-xs">Left</div>
                </div>
              </div>
            </div>

            {/* Birth dates */}
            <div className="alert alert-info">
              <FaInfoCircle />
              <div>
                <div className="text-xs font-medium">Birth Information</div>
                <div className="space-y-1 text-sm mt-1">
                  <div className="font-medium">{safeFormatDate(child.birthDate)} (AD)</div>
                  <div className="opacity-80">{safeAdToBs(child.birthDate)} (BS)</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {(child.isFromOtherMunicipality || vaccinationStats.overdueCount > 0) && (
              <div className="flex flex-wrap gap-2">
                {child.isFromOtherMunicipality && (
                  <div className="badge badge-info badge-outline">
                    Other Municipality
                  </div>
                )}
                {vaccinationStats.overdueCount > 0 && (
                  <div className="badge badge-error badge-outline">
                    {vaccinationStats.overdueCount} Overdue
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render detailed child view
  const renderChildDetails = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const vaccinationStats = getVaccinationStats(child);
    const vaccinesByType = organizeVaccinesByType(child);

    return (
      <div className="min-h-screen bg-base-200">
        {/* Header */}
        <div className="navbar bg-base-100 border-b border-base-300">
          <div className="navbar-start">
            <button
              onClick={() => setSelectedChild(null)}
              className="btn btn-primary"
            >
              <FaChevronLeft />
              Back
            </button>
          </div>
          <div className="navbar-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-base-content">
                {child.fullName}
              </h1>
              <p className="text-base-content/70">
                #{child.sewaDartaNumber} • {age.formatted} • {child.gender === 'MALE' ? 'Male' : 'Female'}
              </p>
            </div>
          </div>
          <div className="navbar-end gap-2">
            <button
              onClick={() => navigate('/graph', { state: { childrenData: child } })}
              className="btn btn-info"
            >
              <FaChartLine />
              Growth Chart
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-success"
            >
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
          {/* Stats Grid */}
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            {[
              { value: vaccinationStats.totalGiven, label: 'Vaccines Given', color: 'text-success', icon: FaCheckCircle },
              { value: vaccinationStats.overdueCount, label: 'Overdue', color: 'text-error', icon: FaExclamationTriangle },
              { value: vaccinationStats.pendingCount, label: 'Pending', color: 'text-info', icon: FaClock },
              { value: vaccinationStats.whatsLeft, label: 'Remaining', color: 'text-secondary', icon: FaStar },
              { value: child.weightRecords?.length || 0, label: 'Weight Records', color: 'text-accent', icon: FaWeight }
            ].map((stat, index) => (
              <div key={index} className="stat">
                <div className="stat-figure">
                  <stat.icon className={`text-2xl ${stat.color}`} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Information */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <FaUser className="text-primary" />
                    Personal Info
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Parent', value: child.parentName },
                      { label: 'Phone', value: child.phoneNumber || 'N/A' },
                      { label: 'Address', value: child.tole },
                      { label: 'Ward', value: child.wardNumber },
                      { label: 'Caste Code', value: child.casteCode },
                      ...(child.email ? [{ label: 'Email', value: child.email }] : [])
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-base-content/70 text-sm">{item.label}:</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                    {child.isFromOtherMunicipality && (
                      <div className="badge badge-info">
                        Other Municipality
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Birth Information */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <FaBirthdayCake className="text-primary" />
                    Birth Info
                  </h3>
                  <div className="space-y-3">
                    <div className="alert alert-info">
                      <div>
                        <div className="text-xs font-medium">Birth Date (AD)</div>
                        <div className="font-semibold">{safeFormatDate(child.birthDate)}</div>
                      </div>
                    </div>
                    <div className="alert alert-info">
                      <div>
                        <div className="text-xs font-medium">Birth Date (BS)</div>
                        <div className="font-semibold">{safeAdToBs(child.birthDate)}</div>
                      </div>
                    </div>
                    <div className="alert alert-info">
                      <div>
                        <div className="text-xs font-medium">Current Age</div>
                        <div className="font-semibold">{age.formatted}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <FaShieldAlt className="text-primary" />
                    Administrative
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Created', value: safeFormatDate(child.createdAt) },
                      { label: 'Created By', value: child.createdBy?.name },
                      ...(child.verifiedBy ? [{ label: 'Verified By', value: child.verifiedBy?.name }] : [])
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-base-content/70 text-sm">{item.label}:</span>
                        <span className="text-sm font-medium text-primary">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight Records */}
              {child.weightRecords && child.weightRecords.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">
                      <FaWeight className="text-primary" />
                      Weight Records
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {child.weightRecords
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((record, index) => (
                          <div key={index} className="alert alert-info">
                            <div className="w-full">
                              <div className="flex justify-between items-start mb-2">
                                <div className="text-xl font-bold">{record.weight} kg</div>
                                <div className="badge badge-info">#{index + 1}</div>
                              </div>
                              <div className="text-sm opacity-80 mb-1">{safeAdToBs(record.date)} (BS)</div>
                              <div className="text-xs opacity-70 space-y-1">
                                <div>Administered: <span className="font-medium">{record.administeredBy?.name}</span></div>
                                <div>Created: <span className="font-medium">{record.createdBy?.name}</span></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl">
                    <FaSyringe className="text-primary" />
                    Vaccination Records
                  </h2>

                  {(() => {
                    const vaccinationTemplate = createVaccinationTemplate(child);

                    if (Object.keys(vaccinationTemplate).length === 0) {
                      return (
                        <div className="text-center py-8">
                          <FaSyringe className="text-base-content/40 text-3xl mx-auto mb-3" />
                          <p className="text-base-content/60">No vaccination schedule available</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {Object.entries(vaccinationTemplate).map(([vaccineTypeName, vaccineData]) => {
                          const sectionKey = `vaccine-${vaccineTypeName}`;
                          const isExpanded = expandedSections[sectionKey] !== false;

                          // Calculate summary stats
                          const completedCount = vaccineData.doses.filter(dose => dose.status === 'completed').length;
                          const overdueCount = vaccineData.doses.filter(dose => dose.status === 'overdue').length;
                          const dueCount = vaccineData.doses.filter(dose => dose.status === 'due').length;
                          const pendingCount = vaccineData.doses.filter(dose => dose.status === 'pending').length;

                          return (
                            <div key={vaccineTypeName} className="collapse collapse-plus bg-base-200">
                              <input
                                type="checkbox"
                                checked={isExpanded}
                                onChange={() => toggleSection(sectionKey)}
                              />
                              <div className="collapse-title">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FaSyringe className="text-primary" />
                                    <div>
                                      <h3 className="font-semibold">{vaccineTypeName}</h3>
                                      <div className="text-base-content/60 text-sm">
                                        {vaccineData.doses.length} total doses
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    {completedCount > 0 && (
                                      <div className="badge badge-success badge-sm">
                                        {completedCount} ✓
                                      </div>
                                    )}
                                    {overdueCount > 0 && (
                                      <div className="badge badge-error badge-sm">
                                        {overdueCount} ⚠
                                      </div>
                                    )}
                                    {dueCount > 0 && (
                                      <div className="badge badge-warning badge-sm">
                                        {dueCount} ⏱
                                      </div>
                                    )}
                                    {pendingCount > 0 && (
                                      <div className="badge badge-info badge-sm">
                                        {pendingCount} ⏸
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="collapse-content">
                                <div className="grid gap-3">
                                  {vaccineData.doses.map((dose, index) => {
                                    const IconComponent = dose.statusIcon === 'FaCheckCircle' ? FaCheckCircle
                                      : dose.statusIcon === 'FaExclamationTriangle' ? FaExclamationTriangle
                                        : FaClock;

                                    return (
                                      <div
                                        key={`${vaccineTypeName}-${dose.doseNumber}`}
                                        className={`card bg-base-100 border-l-4 ${dose.status === 'completed' ? 'border-l-success'
                                          : dose.status === 'overdue' ? 'border-l-error'
                                            : dose.status === 'due' ? 'border-l-warning'
                                              : 'border-l-info'
                                          }`}
                                      >
                                        <div className="card-body p-4">
                                          <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3">
                                              <div className={`p-2 rounded-full ${dose.status === 'completed' ? 'bg-success/20 text-success'
                                                : dose.status === 'overdue' ? 'bg-error/20 text-error'
                                                  : dose.status === 'due' ? 'bg-warning/20 text-warning'
                                                    : 'bg-info/20 text-info'
                                                }`}>
                                                <IconComponent className="w-4 h-4" />
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                  <h4 className="font-semibold">Dose {dose.doseNumber}</h4>
                                                  <div className={`badge ${dose.statusColor} badge-sm`}>
                                                    {dose.status.charAt(0).toUpperCase() + dose.status.slice(1)}
                                                  </div>
                                                  {dose.isCatchUp && (
                                                    <div className="badge badge-secondary badge-sm">
                                                      Catch-up
                                                    </div>
                                                  )}
                                                  {dose.scheduleInfo.isPrimary && (
                                                    <div className="badge badge-primary badge-outline badge-sm">
                                                      Primary
                                                    </div>
                                                  )}
                                                </div>

                                                {/* Schedule Information */}
                                                <div className="text-sm space-y-1 mb-3">
                                                  <div className="text-base-content/70">
                                                    <span className="font-medium">Recommended at:</span> {getRecommendedAgeDisplay(dose.scheduleInfo)}
                                                  </div>
                                                  <div className="text-base-content/70">
                                                    <span className="font-medium">Max age:</span> {getMaxAgeDisplay(dose.scheduleInfo)}
                                                  </div>
                                                </div>

                                                {/* Actual Data */}
                                                <div className="space-y-2">
                                                  {dose.dateGiven && (
                                                    <div className="alert alert-success alert-sm">
                                                      <FaCheckCircle className="w-4 h-4" />
                                                      <div>
                                                        <div className="font-medium">Given on: {safeAdToBs(dose.dateGiven)} (BS)</div>
                                                        {dose.administeredBy && (
                                                          <div className="text-xs opacity-80">By: {dose.administeredBy}</div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {dose.dueDate && !dose.dateGiven && (
                                                    <div className={`alert ${dose.status === 'overdue' ? 'alert-error' : 'alert-warning'
                                                      } alert-sm`}>
                                                      <IconComponent className="w-4 h-4" />
                                                      <div>
                                                        <div className="font-medium">
                                                          {dose.status === 'overdue' ? 'Was due:' : 'Due:'} {safeAdToBs(dose.dueDate)} (BS)
                                                        </div>
                                                        {dose.overdueDays && (
                                                          <div className="text-xs opacity-80">{dose.overdueDays} days overdue</div>
                                                        )}
                                                        {dose.daysUntilDue && (
                                                          <div className="text-xs opacity-80">{dose.daysUntilDue} days remaining</div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {!dose.dueDate && !dose.dateGiven && (
                                                    <div className="alert alert-info alert-sm">
                                                      <FaInfoCircle className="w-4 h-4" />
                                                      <div className="text-sm">Scheduled according to vaccination timeline</div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Component */}
        {showPrintComponent && (
          <VaccinationCardOverlay
            child={child}
            onClose={() => setShowPrintComponent(false)}
          />
        )}
      </div>
    );
  };

  // Render detailed view if child is selected
  if (selectedChild) {
    return renderChildDetails(selectedChild);
  }

  // Main list view
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-2">
              Children Records
            </h1>
            <p className="text-base-content/70 text-lg">
              Manage vaccination records for all children
            </p>
          </div>
          <button
            onClick={() => navigate('/add-child')}
            className="btn btn-primary btn-lg"
          >
            <FaPlus />
            Add New Child
          </button>
        </div>

        {/* Search and Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            {/* Search Bar */}
            <div className="form-control mb-4">
              <div className="input-group">
                <span className="bg-base-200">
                  {isSearching ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <FaSearch />
                  )}
                </span>
                <input
                  type="text"
                  placeholder="Search by name, phone number, or Sewa Darta Number..."
                  className="input input-bordered flex-1"
                  value={universalSearch}
                  onChange={(e) => {
                    setUniversalSearch(e.target.value);
                    if (e.target.value.trim()) {
                      handleUniversalSearch(e.target.value);
                    } else {
                      setSearchResults([]);
                      setHasSearched(false);
                    }
                  }}
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`btn ${showAdvancedFilters ? 'btn-primary' : 'btn-outline'}`}
              >
                <FaFilter />
                Advanced Filters
              </button>

              {(hasSearched || universalSearch || Object.values(advancedFilters).some(v => v)) && (
                <button
                  onClick={clearAllFilters}
                  className="btn btn-error"
                >
                  <FaTimesCircle />
                  Clear All
                </button>
              )}
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="divider"></div>
            )}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { key: 'gender', label: 'Gender', options: [{ value: '', label: 'All Genders' }, { value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }] },
                  { key: 'ward', label: 'Ward', options: [{ value: '', label: 'All Wards' }, ...Array.from({ length: 35 }, (_, i) => ({ value: i + 1, label: `Ward ${i + 1}` }))] },
                  { key: 'vaccinationStatus', label: 'Status', options: [{ value: '', label: 'All Status' }, { value: 'complete', label: 'Complete' }, { value: 'incomplete', label: 'Incomplete' }] }
                ].map((filter) => (
                  <div key={filter.key} className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">{filter.label}</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={advancedFilters[filter.key]}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, [filter.key]: e.target.value })}
                    >
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                ))}

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Created by me</span>
                  </label>
                  <label className="cursor-pointer label bg-base-200 rounded-lg">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={advancedFilters.createdByMe}
                      onChange={(e) => setAdvancedFilters({ ...advancedFilters, createdByMe: e.target.checked })}
                    />
                    <span className="label-text">Show only my records</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-base-content/70">
          {hasSearched ? (
            <span>Found {filteredChildren.length} result{filteredChildren.length !== 1 ? 's' : ''}</span>
          ) : (
            <span>Showing {filteredChildren.length} children</span>
          )}
        </div>

        {/* Results */}
        {filteredChildren.length === 0 ? (
          <div className="text-center py-12">
            <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
              <div className="card-body text-center">
                <FaBaby className="text-base-content/40 text-6xl mx-auto mb-4" />
                <h3 className="card-title justify-center text-base-content mb-2">
                  {hasSearched ? 'No results found' : 'No children records yet'}
                </h3>
                <p className="text-base-content/70 mb-6">
                  {hasSearched
                    ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                    : 'Get started by adding your first child record to the system.'
                  }
                </p>
                {!hasSearched && (
                  <div className="card-actions justify-center">
                    <button
                      onClick={() => navigate('/add-child')}
                      className="btn btn-primary"
                    >
                      <FaPlus />
                      Add First Child
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {currentChildren.map(child => renderChildCard(child))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`join-item btn ${currentPage === pageNum ? 'btn-primary' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="join-item btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}      