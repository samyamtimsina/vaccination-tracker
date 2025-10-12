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
  FaExpand,
  FaCompress,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaVenusMars,
  FaFileAlt,
  FaHospital,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaListAlt,
  FaClipboardCheck
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
  const [allExpanded, setAllExpanded] = useState(false);

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
  console.log('vaccine schedule', vaccineSchedule)

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
    console.log('selectedchild', selectedChild)
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
        let endpoint = '/api/child/search-ward';
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
          endpoint = '/api/child/search';
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
      console.log('selected child', selectedChild)
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
      console.log('response', response.data)
    } catch (error) {
      console.error('Failed to fetch child details:', error);
    } finally {
      setIsSearching(false);
    }
  };

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

  // Get filtered children
  const filteredChildren = useMemo(() => {
    if (hasActiveFilters) {
      return searchResults;
    }
    return childrenArray;
  }, [childrenArray, searchResults, hasActiveFilters]);

  // Pagination
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
    setExpandedSections(prev => {
      const next = { ...prev, [sectionKey]: !prev[sectionKey] };
      return next;
    });
  };

  const expandAll = (expand) => {
    if (!selectedChild) return;
    const template = createVaccinationTemplate(selectedChild);
    const newState = {};
    Object.keys(template).forEach(k => {
      newState[`vaccine-${k}`] = expand;
    });
    setExpandedSections(newState);
    setAllExpanded(expand);
  };

  // Create vaccination template
  const createVaccinationTemplate = (child) => {
    if (!vaccineSchedule?.doses) return {};

    const childAgeDays = calculateAgeInDays(child.birthDate);
    const vaccinationTemplate = {};

    Object.entries(vaccineSchedule.doses).forEach(([vaccineTypeName, scheduleDoses]) => {
      vaccinationTemplate[vaccineTypeName] = {
        name: vaccineTypeName,
        doses: scheduleDoses.map(scheduleDose => {
          const actualVaccination = child.vaccinations?.find(vacc =>
            vacc.vaccineType?.name === vaccineTypeName &&
            vacc.doseNumber === scheduleDose.doseNumber
          );

          const dueVaccine = child.dueVaccines?.find(due =>
            due.vaccineTypeId === scheduleDose.vaccineTypeId &&
            due.doseNumber === scheduleDose.doseNumber
          );

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

          const createdOn = actualVaccination?.createdAt || dueVaccine?.createdAt || null;
          const createdByName = actualVaccination?.createdBy?.name || dueVaccine?.createdBy?.name || null;

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
            createdBy: createdByName || null,
            createdOn: createdOn || null,
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

  // Get vaccination stats
  const getVaccinationStats = (child) => {
    const vaccinationTemplate = createVaccinationTemplate(child);

    let totalPrimaryDoses = 0;
    let completedPrimaryDoses = 0;
    let pendingPrimaryDoses = 0;
    let overduePrimaryDoses = 0;

    let totalCatchupDoses = 0;
    let completedCatchupDoses = 0;
    let pendingCatchupDoses = 0;
    let overdueCatchupDoses = 0;

    Object.values(vaccinationTemplate).forEach(vaccineData => {
      vaccineData.doses.forEach(dose => {
        if (dose.scheduleInfo.isPrimary) {
          totalPrimaryDoses++;
          if (dose.status === 'completed') {
            completedPrimaryDoses++;
          } else if (dose.status === 'overdue' || dose.status === 'missed') {
            overduePrimaryDoses++;
            pendingPrimaryDoses++;
          } else if (dose.status === 'due' || dose.status === 'pending') {
            pendingPrimaryDoses++;
          }
        } else if (dose.scheduleInfo.isBooster || dose.isCatchUp) {
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
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSyringe className="text-2xl text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Loading Vaccination Schedule</h2>
            <p className="text-base-content/60">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main loading state
  if (loading || loadingVaccineTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaBaby className="text-2xl text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Loading Children Records</h2>
            <p className="text-base-content/60">Fetching data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center space-y-4">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-3xl text-error" />
            </div>
            <h2 className="card-title text-xl">Something Went Wrong</h2>
            <p className="text-base-content/70 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm gap-2"
            >
              <FaSpinner className="animate-spin" />
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
    const vaccinationCount = child._count?.vaccinations || 0;
    const genderDisplay = child.gender === 'MALE' ? 'Male' : child.gender === 'FEMALE' ? 'Female' : child.gender || 'N/A';

    return (
      <div
        key={child.id}
        className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group border border-base-300 hover:border-primary/40"
        onClick={() => handleChildSelect(child)}
      >
        <div className={`h-1 w-full ${child.purnaKhop ? 'bg-success' : 'bg-warning'}`}></div>

        <div className="card-body p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="avatar placeholder">
              <div className={`w-12 h-12 rounded-lg ${child.purnaKhop ? 'bg-success/10' : 'bg-warning/10'}`}>
                <FaBaby className={`text-xl ${child.purnaKhop ? 'text-success' : 'text-warning'}`} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-1 truncate group-hover:text-primary transition-colors">
                {child.fullName} {child.lastName || ''}
              </h3>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="badge badge-ghost badge-sm gap-1">
                  <FaClock className="text-[10px]" />
                  {age.formatted}
                </span>
                <span className="badge badge-ghost badge-sm gap-1">
                  <FaMapMarkerAlt className="text-[10px]" />
                  W{child.wardNumber}
                </span>
                <span className="badge badge-outline badge-sm font-mono">
                  #{child.sewaDartaNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="bg-base-200/50 rounded p-2">
              <div className="text-base-content/60 mb-0.5">Gender</div>
              <div className="font-semibold">{genderDisplay}</div>
            </div>
            <div className="bg-base-200/50 rounded p-2">
              <div className="text-base-content/60 mb-0.5">Caste</div>
              <div className="font-semibold">{child.casteCode || 'N/A'}</div>
            </div>
            <div className="bg-primary/5 rounded p-2">
              <div className="text-base-content/60 mb-0.5">Vaccines</div>
              <div className="font-bold text-primary">{vaccinationCount}</div>
            </div>
            <div className="bg-secondary/5 rounded p-2">
              <div className="text-base-content/60 mb-0.5">Weights</div>
              <div className="font-bold text-secondary">{child._count?.weightRecords || 0}</div>
            </div>
          </div>

          {latestWeight && (
            <div className="alert alert-info py-1.5 text-xs mb-3">
              <FaWeight className="text-sm" />
              <span className="font-bold">{latestWeight.weight} kg</span>
              <span className="text-[10px] opacity-70">Latest</span>
            </div>
          )}

          <div className={`badge ${child.purnaKhop ? 'badge-success' : 'badge-warning'} badge-sm gap-1.5 mb-3`}>
            {child.purnaKhop ? (
              <>
                <FaCheckCircle className="text-xs" />
                Complete
              </>
            ) : (
              <>
                <FaExclamationTriangle className="text-xs" />
                Incomplete
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            <div className="bg-base-200/30 rounded p-1.5">
              <div className="text-base-content/50">Birth Date</div>
              <div className="font-medium">{safeFormatDate(child.birthDate)}</div>
              <div className="text-base-content/50">{safeAdToBs(child.birthDate)} BS</div>
            </div>
            <div className="bg-base-200/30 rounded p-1.5">
              <div className="text-base-content/50">Created By</div>
              <button
                className="font-medium text-primary hover:underline text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/users/${child.createdBy.id}`);
                }}
              >
                {child.createdBy.name}
              </button>
              <div className="text-base-content/50">{safeFormatDate(child.createdAt)}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              className="btn btn-primary btn-xs gap-1 flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleChildSelect(child);
              }}
            >
              <FaEye className="text-xs" />
              View
            </button>
            <button
              className="btn btn-outline btn-primary btn-xs gap-1"
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
              Edit
            </button>
            {child._count?.weightRecords > 0 && (
              <button
                className="btn btn-outline btn-secondary btn-xs gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/graph", { state: { childrenData: child } });
                }}
              >
                <FaChartLine className="text-xs" />
              </button>
            )}
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

    const getStatusIcon = (status) => {
      switch (status) {
        case "completed":
          return <FaCheckCircle className="text-success" title="Given" />;
        case "overdue":
          return <FaExclamationTriangle className="text-error" title="Overdue" />;
        case "missed":
          return <FaTimesCircle className="text-error" title="Missed" />;
        case "due":
          return <FaClock className="text-warning" title="Due Soon" />;
        default:
          return <FaClock className="text-base-content/40" title="Pending" />;
      }
    };

    const renderStatusBadge = (dose) => {
      switch (dose.status) {
        case "completed":
          return <span className="badge badge-success badge-sm gap-1"><FaCheckCircle className="text-xs" /> Given</span>;
        case "overdue":
          return (
            <span className="badge badge-error badge-sm gap-1">
              <FaExclamationTriangle className="text-xs" />
              Overdue {dose.overdueDays ? `(${dose.overdueDays}d)` : ''}
            </span>
          );
        case "missed":
          return <span className="badge badge-secondary badge-sm gap-1"><FaTimesCircle className="text-xs" /> Missed</span>;
        case "due":
          return (
            <span className="badge badge-warning badge-sm gap-1">
              <FaClock className="text-xs" />
              Due {dose.daysUntilDue ? `in ${dose.daysUntilDue}d` : ''}
            </span>
          );
        default:
          return <span className="badge badge-ghost badge-sm gap-1"><FaClock className="text-xs" /> Pending</span>;
      }
    };

    const genderDisplay = child.gender === 'MALE' ? '♂ Male' : child.gender === 'FEMALE' ? '♀ Female' : child.gender || 'N/A';
    const genderColor = child.gender === 'MALE' ? 'text-blue-600' : child.gender === 'FEMALE' ? 'text-pink-600' : 'text-purple-600';

    // Group due vaccines by status for better organization
    const dueCategorized = (() => {
      const overdue = [];
      const upcoming = [];
      const future = [];

      child.dueVaccines?.forEach(due => {
        if (due.isCompleted) return;
        const dueDate = new Date(due.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          overdue.push({ ...due, diffDays: Math.abs(diffDays) });
        } else if (diffDays <= 30) {
          upcoming.push({ ...due, diffDays });
        } else {
          future.push({ ...due, diffDays });
        }
      });

      return { overdue, upcoming, future };
    })();

    return (
      <div className="min-h-screen bg-base-200">
        {/* Compact Top Navigation */}
        <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 min-h-[3.5rem] h-14 border-b border-base-300">
          <div className="navbar-start">
            <button
              onClick={() => setSelectedChild(null)}
              className="btn btn-ghost btn-sm gap-1.5"
            >
              <FaChevronLeft />
              <span className="hidden sm:inline text-sm">Back</span>
            </button>
          </div>
          <div className="navbar-center">
            <div className="flex items-center gap-2">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-8 h-8">
                  <FaBaby className="text-sm" />
                </div>
              </div>
              <div className="text-left hidden md:block">
                <h1 className="text-sm font-bold leading-tight">{child.fullName} {child.lastName || ''}</h1>
                <p className="text-[10px] text-base-content/60">#{child.sewaDartaNumber}</p>
              </div>
            </div>
          </div>
          <div className="navbar-end gap-1">
            <button
              onClick={() => expandAll(!allExpanded)}
              className="btn btn-ghost btn-xs gap-1"
            >
              {allExpanded ? <FaCompress className="text-xs" /> : <FaExpand className="text-xs" />}
              <span className="hidden lg:inline text-xs">{allExpanded ? 'Collapse' : 'Expand'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-primary btn-xs gap-1"
            >
              <FaPrint className="text-xs" />
              <span className="hidden sm:inline text-xs">Print</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-3 py-4 max-w-[1400px]">
          {/* Compact Hero Card */}
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg mb-4">
            <div className="card-body p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-start gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-base-100 text-primary rounded-xl w-16 h-16">
                      <span className="text-2xl">{child.gender === 'MALE' ? '♂' : child.gender === 'FEMALE' ? '♀' : '👶'}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">{child.fullName} {child.lastName || ''}</h2>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="badge badge-sm bg-primary-content/20 border-0 gap-1">
                        <FaClock className="text-xs" />
                        {age.formatted}
                      </div>
                      <div className="badge badge-sm bg-primary-content/20 border-0 gap-1">
                        <FaMapMarkerAlt className="text-xs" />
                        Ward {child.wardNumber}
                      </div>
                      <div className="badge badge-sm bg-primary-content/20 border-0 gap-1 font-mono">
                        #{child.sewaDartaNumber}
                      </div>
                    </div>
                    <div className={`badge ${child.purnaKhop ? 'badge-success' : 'badge-warning'} badge-sm gap-1`}>
                      {child.purnaKhop ? (
                        <>
                          <FaCheckCircle className="text-xs" /> Complete
                        </>
                      ) : (
                        <>
                          <FaExclamationTriangle className="text-xs" /> {child.whatsLeft} Remaining
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Compact Stats */}
                <div className="stats shadow bg-base-100 text-base-content stats-horizontal">
                  <div className="stat py-2 px-3">
                    <div className="stat-title text-[10px]">Given</div>
                    <div className="stat-value text-success text-lg">{vaccinationStats.totalGiven}</div>
                  </div>
                  <div className="stat py-2 px-3">
                    <div className="stat-title text-[10px]">Pending</div>
                    <div className="stat-value text-warning text-lg">{vaccinationStats.totalPending}</div>
                  </div>
                  <div className="stat py-2 px-3">
                    <div className="stat-title text-[10px]">Overdue</div>
                    <div className="stat-value text-error text-lg">{vaccinationStats.totalOverdue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* LEFT COLUMN - Compact Personal Info & Stats */}
            <div className="xl:col-span-1 space-y-4">
              {/* Personal Information Card */}
              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-4">
                  <h3 className="flex items-center gap-2 font-bold text-sm mb-3">
                    <div className="p-1.5 bg-primary/10 rounded">
                      <FaUser className="text-primary text-xs" />
                    </div>
                    Personal Info
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-base-200 rounded">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaVenusMars className={genderColor} />
                        <span className="font-medium text-base-content/70">Gender</span>
                      </div>
                      <span className={`font-bold ${genderColor}`}>{genderDisplay}</span>
                    </div>

                    <div className="p-2 bg-base-200 rounded">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaUser className="text-secondary text-xs" />
                        <span className="font-medium text-base-content/70">Parent</span>
                      </div>
                      <span className="font-semibold break-words">{child.parentName || 'N/A'}</span>
                    </div>

                    <div className="p-2 bg-base-200 rounded">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaPhone className="text-info text-xs" />
                        <span className="font-medium text-base-content/70">Phone</span>
                      </div>
                      <span className="font-mono text-xs">{child.phoneNumber || 'N/A'}</span>
                    </div>

                    {child.email && (
                      <div className="p-2 bg-base-200 rounded">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <FaEnvelope className="text-accent text-xs" />
                          <span className="font-medium text-base-content/70">Email</span>
                        </div>
                        <span className="break-words text-xs">{child.email}</span>
                      </div>
                    )}

                    <div className="p-2 bg-base-200 rounded">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaHome className="text-warning text-xs" />
                        <span className="font-medium text-base-content/70">Tole</span>
                      </div>
                      <span className="font-semibold break-words">{child.tole || 'N/A'}</span>
                    </div>

                    <div className="p-2 bg-base-200 rounded">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaListAlt className="text-purple-500 text-xs" />
                        <span className="font-medium text-base-content/70">Caste Code</span>
                      </div>
                      <span className="font-semibold">{child.casteCode || 'N/A'}</span>
                    </div>

                    <div className="p-2 bg-base-200 rounded">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FaMapMarkerAlt className="text-error text-xs" />
                        <span className="font-medium text-base-content/70">Other Municipality</span>
                      </div>
                      <div className={`badge badge-xs ${child.isFromOtherMunicipality ? 'badge-info' : 'badge-ghost'}`}>
                        {child.isFromOtherMunicipality ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Birth Information */}
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <FaCalendarAlt className="text-primary text-xs" />
                      <span className="font-bold text-primary text-xs">Birth Information</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-base-content/70">AD Date:</span>
                        <div className="font-bold">{safeFormatDate(child.birthDate)}</div>
                      </div>
                      <div>
                        <span className="text-base-content/70">BS Date:</span>
                        <div className="font-bold">{safeAdToBs(child.birthDate)}</div>
                      </div>
                      <div>
                        <span className="text-base-content/70">Age:</span>
                        <div className="font-bold text-primary">{age.formatted}</div>
                      </div>
                    </div>
                  </div>

                  {/* Record Metadata */}
                  <div className="bg-secondary/5 p-3 rounded-lg border border-secondary/20 mt-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <FaFileAlt className="text-secondary text-xs" />
                      <span className="font-bold text-secondary text-xs">Record Details</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-base-content/70">Created By:</span>
                        <button
                          onClick={() => navigate(`/user/${child.createdBy?.id}`)}
                          className="link link-secondary font-semibold block break-words"
                        >
                          {child.createdBy?.name || 'N/A'}
                        </button>
                      </div>
                      <div>
                        <span className="text-base-content/70">Created On:</span>
                        <div>{safeFormatDate(child.createdAt)}</div>
                      </div>
                      {child.verifiedBy && (
                        <div>
                          <span className="text-base-content/70">Verified By:</span>
                          <button
                            onClick={() => navigate(`/user/${child.verifiedBy?.id}`)}
                            className="link link-accent font-semibold block break-words"
                          >
                            {child.verifiedBy?.name}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {child.remarks && (
                    <div className="alert alert-warning py-2 mt-3">
                      <FaInfoCircle className="text-sm" />
                      <div>
                        <h4 className="font-bold text-xs">Remarks</h4>
                        <p className="text-[10px]">{child.remarks}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Vaccination Summary Stats */}
              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-4">
                  <h3 className="flex items-center gap-2 font-bold text-sm mb-3">
                    <div className="p-1.5 bg-success/10 rounded">
                      <FaShieldAlt className="text-success text-xs" />
                    </div>
                    Vaccination Progress
                  </h3>

                  {/* Primary Doses Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold">Primary Doses</span>
                      <span className="text-xs font-bold text-primary">
                        {vaccinationStats.primaryStats.completed}/{vaccinationStats.primaryStats.total}
                      </span>
                    </div>
                    <progress
                      className="progress progress-primary w-full h-2"
                      value={vaccinationStats.primaryStats.completed}
                      max={vaccinationStats.primaryStats.total}
                    ></progress>
                    <div className="flex justify-between mt-1.5">
                      <span className="badge badge-success badge-xs gap-1">
                        ✓ {vaccinationStats.primaryStats.completed}
                      </span>
                      {vaccinationStats.primaryStats.overdue > 0 && (
                        <span className="badge badge-error badge-xs gap-1">
                          ! {vaccinationStats.primaryStats.overdue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Booster/Catchup Doses */}
                  {vaccinationStats.catchupStats.total > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold">Booster/Catchup</span>
                        <span className="text-xs font-bold text-info">
                          {vaccinationStats.catchupStats.completed}/{vaccinationStats.catchupStats.total}
                        </span>
                      </div>
                      <progress
                        className="progress progress-info w-full h-2"
                        value={vaccinationStats.catchupStats.completed}
                        max={vaccinationStats.catchupStats.total}
                      ></progress>
                    </div>
                  )}

                  <div className="divider my-2"></div>

                  {/* Detailed Stats Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="stat bg-success/10 rounded-lg p-2 border border-success/20">
                      <div className="stat-value text-lg text-success">{vaccinationStats.primaryStats.completed}</div>
                      <div className="stat-desc text-[10px] font-medium">Primary Done</div>
                    </div>
                    <div className="stat bg-error/10 rounded-lg p-2 border border-error/20">
                      <div className="stat-value text-lg text-error">{vaccinationStats.primaryStats.overdue}</div>
                      <div className="stat-desc text-[10px] font-medium">Overdue</div>
                    </div>
                    <div className="stat bg-warning/10 rounded-lg p-2 border border-warning/20">
                      <div className="stat-value text-lg text-warning">{vaccinationStats.primaryStats.pending}</div>
                      <div className="stat-desc text-[10px] font-medium">Pending</div>
                    </div>
                    <div className="stat bg-info/10 rounded-lg p-2 border border-info/20">
                      <div className="stat-value text-lg text-info">{vaccinationStats.catchupStats.completed}</div>
                      <div className="stat-desc text-[10px] font-medium">Boosters</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight Records */}
              {child.weightRecords && child.weightRecords.length > 0 && (
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="flex items-center gap-2 font-bold text-sm">
                        <div className="p-1.5 bg-secondary/10 rounded">
                          <FaWeight className="text-secondary text-xs" />
                        </div>
                        Weight Records
                      </h3>
                      <button
                        className="btn btn-xs btn-secondary gap-1"
                        onClick={() => navigate("/graph", { state: { childrenData: child } })}
                      >
                        <FaChartLine className="text-xs" />
                        Graph
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="table table-zebra table-xs">
                        <thead>
                          <tr className="bg-secondary/10">
                            <th className="text-center">Weight</th>
                            <th>Date</th>
                            <th>Given By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {child.weightRecords
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((rec, idx) => (
                              <tr key={rec.id} className={idx === 0 ? 'bg-secondary/5' : ''}>
                                <td className="text-center">
                                  <div className="flex flex-col items-center">
                                    <span className="font-bold text-secondary text-sm">
                                      {rec.weight} kg
                                    </span>
                                    {idx === 0 && (
                                      <span className="badge badge-secondary badge-xs mt-0.5">Latest</span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-[10px]">
                                    <div className="font-medium">{safeFormatDate(rec.date)}</div>
                                    <div className="text-base-content/60">{safeAdToBs(rec.date)} BS</div>
                                  </div>
                                </td>
                                <td>
                                  {rec.administeredBy ? (
                                    <button
                                      onClick={() => navigate(`/user/${rec.administeredBy.id}`)}
                                      className="link link-secondary text-[10px] font-semibold"
                                    >
                                      {rec.administeredBy.name}
                                    </button>
                                  ) : (
                                    <span className="text-[10px] opacity-50">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Vaccination Details */}
            <div className="xl:col-span-3 space-y-4">
              {/* Vaccination Records by Type */}
              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-4">
                  <h3 className="flex items-center gap-2 font-bold text-sm mb-3">
                    <div className="p-1.5 bg-primary/10 rounded">
                      <FaSyringe className="text-primary text-xs" />
                    </div>
                    Complete Vaccination Records
                  </h3>

                  <div className="space-y-2">
                    {Object.entries(vaccinationTemplate).map(([vType, vData]) => {
                      const completedCount = vData.doses.filter(d => d.status === 'completed').length;
                      const primaryTotal = vData.doses.filter(d => d.scheduleInfo.isPrimary).length;
                      const primaryCompleted = vData.doses.filter(d => d.scheduleInfo.isPrimary && d.status === 'completed').length;
                      const boosterTotal = vData.doses.filter(d => d.scheduleInfo.isBooster || d.isCatchUp).length;
                      const boosterCompleted = vData.doses.filter(d => (d.scheduleInfo.isBooster || d.isCatchUp) && d.status === 'completed').length;
                      const sectionKey = `vaccine-${vType}`;
                      const hasOverdue = vData.doses.some(d => d.status === 'overdue' || d.status === 'missed');

                      return (
                        <div
                          key={vType}
                          className={`collapse collapse-arrow bg-base-200 border ${hasOverdue ? 'border-error/30' : 'border-base-300'}`}
                        >
                          <input
                            type="checkbox"
                            checked={expandedSections[sectionKey] || false}
                            onChange={() => toggleSection(sectionKey)}
                          />
                          <div className="collapse-title text-sm font-medium py-3 min-h-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold">{vType}</h4>
                                <div className="flex flex-wrap gap-1">
                                  <div className="badge badge-primary badge-xs gap-0.5">
                                    {primaryCompleted}/{primaryTotal} P
                                  </div>
                                  {boosterTotal > 0 && (
                                    <div className="badge badge-info badge-xs gap-0.5">
                                      {boosterCompleted}/{boosterTotal} B
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                  {vData.doses.map(d => (
                                    <div key={d.doseNumber} className="tooltip" data-tip={`Dose ${d.doseNumber}: ${d.status}`}>
                                      <div className="w-5 h-5 flex items-center justify-center">
                                        {getStatusIcon(d.status)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <span className="badge badge-outline badge-xs">{completedCount}/{vData.doses.length}</span>
                              </div>
                            </div>
                          </div>
                          <div className="collapse-content px-2 pb-2">
                            <div className="overflow-x-auto">
                              <table className="table table-xs">
                                <thead>
                                  <tr className="bg-base-300">
                                    <th className="text-center px-2 py-1">Dose</th>
                                    <th className="px-2 py-1">Type</th>
                                    <th className="px-2 py-1">Status</th>
                                    <th className="px-2 py-1">Date (AD)</th>
                                    <th className="px-2 py-1">Date (BS)</th>
                                    <th className="px-2 py-1">Given By</th>
                                    <th className="px-2 py-1">Created By</th>
                                    <th className="px-2 py-1">Created On</th>
                                    <th className="px-2 py-1 min-w-[150px]">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {vData.doses.map((dose) => {
                                    const isGiven = !!dose.actualVaccination;
                                    const isExternal = dose.actualVaccination?.isExternallyAdministered;

                                    return (
                                      <tr key={`${vType}-${dose.doseNumber}`} className="hover">
                                        <td className="text-center px-2 py-1">
                                          <span className="badge badge-primary badge-xs">#{dose.doseNumber}</span>
                                        </td>
                                        <td className="px-2 py-1">
                                          <span className={`badge badge-xs ${dose.scheduleInfo.isPrimary ? 'badge-primary' : 'badge-info'}`}>
                                            {dose.scheduleInfo.isPrimary ? 'P' : (dose.scheduleInfo.isBooster ? 'B' : 'C')}
                                          </span>
                                        </td>
                                        <td className="px-2 py-1">{renderStatusBadge(dose)}</td>
                                        <td className="px-2 py-1 text-[11px]">
                                          {isGiven ? (
                                            <span className="font-semibold text-success">
                                              {safeFormatDate(dose.dateGiven)} <span className="text-[9px] text-success/70">(Given)</span>
                                            </span>
                                          ) : dose.dueDate ? (
                                            <span className="text-warning font-medium">
                                              {safeFormatDate(dose.dueDate)} <span className="text-[9px] text-warning/70">(Due)</span>
                                            </span>
                                          ) : "-"}
                                        </td>
                                        <td className="px-2 py-1 text-[11px]">
                                          {isGiven ? (
                                            <span className="font-semibold text-success">
                                              {safeAdToBs(dose.dateGiven)}
                                            </span>
                                          ) : dose.dueDate ? (
                                            <span className="text-warning font-medium">
                                              {safeAdToBs(dose.dueDate)}
                                            </span>
                                          ) : "-"}
                                        </td>
                                        <td className="px-2 py-1 text-[11px]">
                                          {isGiven ? (
                                            isExternal ? (
                                              <div className="flex flex-col gap-0.5">
                                                <span className="badge badge-warning badge-xs gap-0.5">
                                                  <FaHospital className="text-[8px]" />
                                                  Ext
                                                </span>
                                                <span className="font-semibold">
                                                  {dose.actualVaccination.externalAdministeredBy || 'External'}
                                                </span>
                                              </div>
                                            ) : dose.actualVaccination?.administeredBy ? (
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  navigate(`/user/${dose.actualVaccination.administeredBy.id}`);
                                                }}
                                                className="link link-primary font-semibold"
                                              >
                                                {dose.actualVaccination.administeredBy.name}
                                              </button>
                                            ) : (
                                              <span className="opacity-50">-</span>
                                            )
                                          ) : (
                                            <span className="opacity-50">-</span>
                                          )}
                                        </td>
                                        <td className="px-2 py-1 text-[11px]">
                                          {dose.createdBy ? (
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/user/${dose.actualVaccination?.createdBy?.id || dose.dueVaccine?.createdBy?.id}`);
                                              }}
                                              className="link link-secondary font-semibold"
                                            >
                                              {dose.createdBy}
                                            </button>
                                          ) : (
                                            <span className="opacity-50">-</span>
                                          )}
                                        </td>
                                        <td className="px-2 py-1 text-[10px]">
                                          {dose.createdOn ? (
                                            <div>
                                              <div className="font-medium">{safeAdToBs(dose.createdOn)}</div>
                                              <div className="text-base-content/60">{safeFormatDate(dose.createdOn)}</div>
                                            </div>
                                          ) : (
                                            <span className="opacity-50">-</span>
                                          )}
                                        </td>
                                        <td className="px-2 py-1 text-[10px] min-w-[150px] max-w-[200px]">
                                          {dose.actualVaccination?.remarks || dose.dueVaccine?.notes ? (
                                            <div className="break-words">
                                              {dose.actualVaccination?.remarks || dose.dueVaccine?.notes}
                                            </div>
                                          ) : (
                                            <span className="opacity-50">-</span>
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
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Print-Only Section */}
          <div className="hidden print:block mt-8">
            <div className="border-2 border-black p-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">Vaccination Record Card</h1>
                <p className="text-sm">Child Health & Immunization Tracking</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p><strong>Name:</strong> {child.fullName} {child.lastName || ""}</p>
                  <p><strong>Parent:</strong> {child.parentName}</p>
                  <p><strong>DOB (AD):</strong> {safeFormatDate(child.birthDate)}</p>
                  <p><strong>DOB (BS):</strong> {safeAdToBs(child.birthDate)}</p>
                </div>
                <div>
                  <p><strong>ID:</strong> #{child.sewaDartaNumber}</p>
                  <p><strong>Gender:</strong> {genderDisplay}</p>
                  <p><strong>Ward:</strong> {child.wardNumber}</p>
                  <p><strong>Age:</strong> {age.formatted}</p>
                </div>
              </div>

              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-200 border-2 border-black">
                    <th className="border border-black p-1">Vaccine</th>
                    <th className="border border-black p-1">Dose</th>
                    <th className="border border-black p-1">Type</th>
                    <th className="border border-black p-1">Status</th>
                    <th className="border border-black p-1">Date (AD)</th>
                    <th className="border border-black p-1">Date (BS)</th>
                    <th className="border border-black p-1">Given By</th>
                    <th className="border border-black p-1">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(vaccinationTemplate).map(([vType, vData], typeIndex) =>
                    vData.doses.map((dose, idx) => {
                      const isGiven = !!dose.actualVaccination;
                      const isExternal = dose.actualVaccination?.isExternallyAdministered;
                      let statusText = "Pending";
                      if (isGiven) statusText = "✓ Given";
                      else if (dose.status === "missed") statusText = "Missed";
                      else if (dose.status === "overdue") statusText = `Overdue`;
                      else if (dose.status === "due") statusText = `Due`;

                      return (
                        <tr
                          key={`${vType}-${dose.doseNumber}`}
                          className={`border border-black ${idx === 0 && typeIndex > 0 ? 'border-t-2' : ''}`}
                        >
                          {idx === 0 && (
                            <td
                              rowSpan={vData.doses.length}
                              className="border-r-2 border-black p-2 font-bold align-top bg-gray-50"
                            >
                              {vType}
                            </td>
                          )}
                          <td className="border border-black p-1 text-center">{dose.doseNumber}</td>
                          <td className="border border-black p-1 text-center">
                            {dose.scheduleInfo.isPrimary ? "P" : "B"}
                          </td>
                          <td className="border border-black p-1 text-center font-semibold">
                            {statusText}
                          </td>
                          <td className="border border-black p-1">
                            {isGiven ? safeFormatDate(dose.dateGiven) : dose.dueDate ? safeFormatDate(dose.dueDate) : "-"}
                          </td>
                          <td className="border border-black p-1">
                            {isGiven ? safeAdToBs(dose.dateGiven) : dose.dueDate ? safeAdToBs(dose.dueDate) : "-"}
                          </td>
                          <td className="border border-black p-1">
                            {isExternal
                              ? `Ext: ${dose.actualVaccination.externalAdministeredBy || 'External'}`
                              : dose.actualVaccination?.administeredBy?.name || "-"
                            }
                          </td>
                          <td className="border border-black p-1 text-[10px]">
                            {dose.actualVaccination?.remarks || dose.dueVaccine?.notes || "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {child.weightRecords && child.weightRecords.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Weight Records</h3>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-200 border border-black">
                        <th className="border border-black p-1">Date</th>
                        <th className="border border-black p-1">Weight (kg)</th>
                        <th className="border border-black p-1">Measured By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {child.weightRecords
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(rec => (
                          <tr key={rec.id} className="border border-black">
                            <td className="border border-black p-1">{safeFormatDate(rec.date)}</td>
                            <td className="border border-black p-1 text-center font-bold">{rec.weight}</td>
                            <td className="border border-black p-1">{rec.administeredBy?.name || "-"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
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
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSearch className="text-xl text-primary" />
              </div>
            </div>
            <p className="text-base-content/60 font-medium">Searching...</p>
          </div>
        </div>
      ) : selectedChild ? (
        renderChildDetails(selectedChild)
      ) : (
        <div>
          {/* Compact Header */}
          <div className="bg-base-100 border-b border-base-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Children Records
                  </h1>
                  <p className="text-base-content/70 text-sm">Manage and track vaccination records</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="join">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`btn btn-xs join-item ${i18n.language === 'en' ? 'btn-primary' : 'btn-outline'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => changeLanguage('ne')}
                      className={`btn btn-xs join-item ${i18n.language === 'ne' ? 'btn-primary' : 'btn-outline'}`}
                    >
                      नेपाली
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('/add-child')}
                    className="btn btn-primary btn-sm gap-1.5"
                  >
                    <FaPlus className="text-xs" />
                    Add Child
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Compact Search & Filter */}
            <div className="card bg-base-100 shadow-md mb-6">
              <div className="card-body p-4">
                <h2 className="flex items-center gap-2 font-bold text-sm mb-3">
                  <FaFilter className="text-primary" />
                  Search & Filter
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-medium">Name</span>
                    </label>
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                      className="input input-bordered input-sm"
                      placeholder="Search by name..."
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-medium">Registration No.</span>
                    </label>
                    <input
                      type="text"
                      value={filters.serviceRegistrationNumber}
                      onChange={(e) => setFilters((prev) => ({ ...prev, serviceRegistrationNumber: e.target.value }))}
                      className="input input-bordered input-sm"
                      placeholder="Service registration..."
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-medium">Phone Number</span>
                    </label>
                    <input
                      type="text"
                      value={filters.phoneNumber}
                      onChange={(e) => setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      className="input input-bordered input-sm"
                      placeholder="Phone number..."
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-medium">Gender</span>
                    </label>
                    <select
                      value={filters.gender}
                      onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                      className="select select-bordered select-sm"
                    >
                      <option value="">All Genders</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-base-300">
                    <div className="text-xs">
                      {isLoadingSearch ? (
                        <span className="flex items-center gap-1.5">
                          <span className="loading loading-spinner loading-xs"></span>
                          Searching...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <FaSearch className="text-primary" />
                          Found <span className="font-bold text-primary">{filteredChildren.length}</span> result{filteredChildren.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="btn btn-ghost btn-xs text-error gap-1"
                    >
                      <FaTimesCircle className="text-xs" />
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Stats */}
            <div className="stats stats-vertical lg:stats-horizontal shadow-md w-full mb-6">
              <div className="stat py-3">
                <div className="stat-figure text-primary">
                  <FaBaby className="text-3xl" />
                </div>
                <div className="stat-title text-xs">Total Children</div>
                <div className="stat-value text-primary text-2xl">{filteredChildren.length}</div>
                <div className="stat-desc text-xs">{hasActiveFilters ? 'Filtered' : 'All records'}</div>
              </div>

              <div className="stat py-3">
                <div className="stat-figure text-success">
                  <FaCheckCircle className="text-3xl" />
                </div>
                <div className="stat-title text-xs">Fully Vaccinated</div>
                <div className="stat-value text-success text-2xl">
                  {filteredChildren.filter((child) => child.purnaKhop).length}
                </div>
                <div className="stat-desc text-xs">Complete records</div>
              </div>

              <div className="stat py-3">
                <div className="stat-figure text-warning">
                  <FaExclamationTriangle className="text-3xl" />
                </div>
                <div className="stat-title text-xs">Incomplete</div>
                <div className="stat-value text-warning text-2xl">
                  {filteredChildren.filter((child) => !child.purnaKhop).length}
                </div>
                <div className="stat-desc text-xs">Needs attention</div>
              </div>
            </div>

            {/* Children Grid */}
            {filteredChildren.length === 0 ? (
              <div className="card bg-base-100 shadow-md">
                <div className="card-body items-center text-center py-12">
                  <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
                    <FaBaby className="text-4xl opacity-40" />
                  </div>
                  <h2 className="card-title text-2xl mb-2">
                    {hasActiveFilters ? 'No children found' : 'No children records yet'}
                  </h2>
                  <p className="text-base-content/70 mb-4 max-w-md text-sm">
                    {hasActiveFilters
                      ? 'Try adjusting your search criteria to find what you\'re looking for.'
                      : 'Get started by adding your first child record to track their vaccination progress.'}
                  </p>
                  {!hasActiveFilters && (
                    <button
                      onClick={() => navigate('/add-child')}
                      className="btn btn-primary gap-2"
                    >
                      <FaPlus />
                      Add First Child
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentChildren.map(renderChildCard)}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-primary btn-sm disabled:opacity-50 gap-1.5"
                    >
                      <FaChevronLeft className="text-xs" />
                      Previous
                    </button>
                    <div className="join">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
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
                            onClick={() => setCurrentPage(pageNum)}
                            className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-primary btn-sm disabled:opacity-50 gap-1.5"
                    >
                      Next
                      <FaChevronLeft className="rotate-180 text-xs" />
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