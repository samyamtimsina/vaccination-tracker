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
  FaFilter
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSyringe className="text-3xl text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-base-content">Loading Vaccination Schedule</h2>
            <p className="text-base-content/60 text-lg">Please wait while we prepare everything...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main loading state
  if (loading || loadingVaccineTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaBaby className="text-3xl text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-base-content">Loading Children Records</h2>
            <p className="text-base-content/60 text-lg">Fetching data from the system...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-error/5 via-base-200 to-error/10 p-4">
        <div className="card bg-base-100 shadow-2xl max-w-md w-full border-2 border-error/20">
          <div className="card-body items-center text-center space-y-4">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-4xl text-error" />
            </div>
            <h2 className="card-title text-2xl">Oops! Something Went Wrong</h2>
            <p className="text-base-content/70">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-wide gap-2"
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
        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-base-300 hover:border-primary/50 overflow-hidden"
        onClick={() => handleChildSelect(child)}
      >
        {/* Status indicator bar */}
        <div className={`h-2 w-full ${child.purnaKhop ? 'bg-gradient-to-r from-success to-success/70' : 'bg-gradient-to-r from-warning to-warning/70'}`}></div>

        <div className="card-body p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="avatar placeholder">
                <div className={`w-16 h-16 rounded-xl ${child.purnaKhop ? 'bg-success/10' : 'bg-warning/10'} ring ring-base-300 ring-offset-2 group-hover:ring-primary transition-all`}>
                  <FaBaby className={`text-2xl ${child.purnaKhop ? 'text-success' : 'text-warning'}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="card-title text-xl mb-2 group-hover:text-primary transition-colors truncate">
                  {child.fullName} {child.lastName || ''}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="badge badge-ghost gap-1.5">
                    <FaClock className="text-xs" />
                    <span className="font-semibold">{age.formatted}</span>
                  </div>
                  <div className="badge badge-ghost gap-1.5">
                    <FaMapMarkerAlt className="text-xs" />
                    <span>Ward {child.wardNumber}</span>
                  </div>
                  <div className="badge badge-outline badge-sm font-mono">
                    #{child.sewaDartaNumber}
                  </div>
                </div>
                <div className={`badge ${child.purnaKhop ? 'badge-success' : 'badge-warning'} gap-2`}>
                  {child.purnaKhop ? (
                    <>
                      <FaCheckCircle />
                      Fully Vaccinated
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle />
                      Incomplete
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Personal Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70 mb-2">
                <FaUser className="text-primary" />
                <span>Personal Details</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-base-200">
                  <span className="text-base-content/70">Gender</span>
                  <span className="font-semibold">{genderDisplay}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-base-200">
                  <span className="text-base-content/70">Caste</span>
                  <span className="font-semibold">{child.casteCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-base-content/70">Other Municipality</span>
                  <div className={`badge badge-sm ${child.isFromOtherMunicipality ? 'badge-info' : 'badge-ghost'}`}>
                    {child.isFromOtherMunicipality ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>

            {/* Records & Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-base-content/70 mb-2">
                <FaChartLine className="text-secondary" />
                <span>Health Records</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="stat bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <div className="stat-value text-2xl text-primary">{vaccinationCount}</div>
                  <div className="stat-desc text-xs">Vaccines</div>
                </div>
                <div className="stat bg-secondary/5 rounded-lg p-3 border border-secondary/20">
                  <div className="stat-value text-2xl text-secondary">{child._count?.weightRecords || 0}</div>
                  <div className="stat-desc text-xs">Weights</div>
                </div>
              </div>
              {latestWeight && (
                <div className="alert alert-info py-2">
                  <FaWeight />
                  <div className="flex-1">
                    <span className="font-bold">{latestWeight.weight} kg</span>
                    <span className="text-xs ml-2">Latest weight</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates Section */}
          <div className="divider my-2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-base-200/50 rounded-lg p-3">
              <div className="text-xs text-base-content/60 mb-1">Birth Date</div>
              <div className="font-semibold">{safeFormatDate(child.birthDate)}</div>
              <div className="text-xs text-base-content/60">{safeAdToBs(child.birthDate)} BS</div>
            </div>
            <div className="bg-base-200/50 rounded-lg p-3">
              <div className="text-xs text-base-content/60 mb-1">Created By</div>
              <button
                className="font-semibold text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/users/${child.createdBy.id}`);
                }}
              >
                {child.createdBy.name}
              </button>
              <div className="text-xs text-base-content/60">{safeFormatDate(child.createdAt)}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card-actions justify-end mt-4 gap-2">
            <button
              className="btn btn-primary btn-sm gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleChildSelect(child);
              }}
            >
              <FaEye />
              View Details
            </button>
            <button
              className="btn btn-outline btn-primary btn-sm gap-2"
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
                className="btn btn-outline btn-secondary btn-sm gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/graph", { state: { childrenData: child } });
                }}
              >
                <FaChartLine />
                Graph
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
          return <span className="badge badge-success gap-1"><FaCheckCircle /> Given</span>;
        case "overdue":
          return <span className="badge badge-error gap-1"><FaExclamationTriangle /> Overdue</span>;
        case "missed":
          return <span className="badge badge-secondary gap-1"><FaTimesCircle /> Missed</span>;
        case "due":
          return <span className="badge badge-warning gap-1"><FaClock /> Due</span>;
        default:
          return <span className="badge badge-ghost gap-1"><FaClock /> Pending</span>;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
        {/* Top Navigation */}
        <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 border-b border-base-300">
          <div className="navbar-start">
            <button onClick={() => setSelectedChild(null)} className="btn btn-ghost gap-2">
              <FaChevronLeft />
              Back to List
            </button>
          </div>
          <div className="navbar-center">
            <h1 className="text-xl font-bold">Child Details</h1>
          </div>
          <div className="navbar-end gap-2">
            <button onClick={() => expandAll(!allExpanded)} className="btn btn-sm btn-ghost gap-2">
              {allExpanded ? <><FaCompress /> Collapse</> : <><FaExpand /> Expand</>}
            </button>
            <button onClick={() => window.print()} className="btn btn-primary btn-sm gap-2">
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="xl:col-span-4 space-y-6 print:hidden">
              {/* Profile Card */}
              <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className="avatar placeholder">
                      <div className="w-20 h-20 bg-base-100/20 rounded-2xl">
                        <FaBaby className="text-3xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="card-title text-2xl mb-2">
                        {child.fullName} {child.lastName || ""}
                      </h2>
                      <p className="text-primary-content/90 text-lg mb-3">{age.formatted} old</p>
                      <div className="flex flex-wrap gap-2">
                        <div className="badge badge-lg bg-base-100/20 border-0 gap-2">
                          <FaMapMarkerAlt />
                          Ward {child.wardNumber}
                        </div>
                        <div className={`badge badge-lg ${child.purnaKhop ? 'bg-success border-0' : 'bg-warning border-0'} gap-2`}>
                          {child.purnaKhop ? "✓ Complete" : "Incomplete"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">
                    <div className="badge badge-primary badge-lg">
                      <FaUser className="mr-2" />
                      Personal Info
                    </div>
                  </h3>
                  <div className="space-y-3">
                    <div className="alert">
                      <div className="flex-1">
                        <div className="text-xs opacity-60">Service Registration</div>
                        <div className="font-bold text-lg">#{child.sewaDartaNumber}</div>
                      </div>
                    </div>
                    <div className="bg-base-200 rounded-lg p-4">
                      <div className="text-xs opacity-60 mb-2">Birth Date</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-medium">AD:</span>
                          <span className="font-bold">{safeFormatDate(child.birthDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">BS:</span>
                          <span className="font-bold">{safeAdToBs(child.birthDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-base-200/50 rounded-lg">
                      <span className="text-sm opacity-70">Created by</span>
                      <button
                        onClick={() => navigate(`/user/${child.createdBy.id}`)}
                        className="link link-primary font-semibold"
                      >
                        {child.createdBy.name}
                      </button>
                    </div>
                    {child.remarks && (
                      <div className="alert alert-warning">
                        <FaExclamationTriangle />
                        <div className="flex-1">
                          <div className="text-xs font-semibold mb-1">General Remarks</div>
                          <p className="text-sm">{child.remarks}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vaccination Summary */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-4">
                    <div className="badge badge-primary badge-lg">
                      <FaShieldAlt className="mr-2" />
                      Vaccination Summary
                    </div>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="stat bg-success/10 rounded-xl border-2 border-success/20 p-4 text-center">
                      <div className="stat-value text-3xl text-success">
                        {vaccinationStats.primaryStats.completed}
                      </div>
                      <div className="stat-desc text-xs font-medium">Primary Complete</div>
                    </div>
                    <div className="stat bg-error/10 rounded-xl border-2 border-error/20 p-4 text-center">
                      <div className="stat-value text-3xl text-error">
                        {vaccinationStats.primaryStats.overdue}
                      </div>
                      <div className="stat-desc text-xs font-medium">Primary Overdue</div>
                    </div>
                    <div className="stat bg-warning/10 rounded-xl border-2 border-warning/20 p-4 text-center">
                      <div className="stat-value text-3xl text-warning">
                        {vaccinationStats.primaryStats.pending}
                      </div>
                      <div className="stat-desc text-xs font-medium">Primary Pending</div>
                    </div>
                    <div className="stat bg-info/10 rounded-xl border-2 border-info/20 p-4 text-center">
                      <div className="stat-value text-3xl text-info">
                        {vaccinationStats.catchupStats.completed}
                      </div>
                      <div className="stat-desc text-xs font-medium">Catchup Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight Records */}
              {child.weightRecords?.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="card-title text-lg">
                        <div className="badge badge-secondary badge-lg">
                          <FaWeight className="mr-2" />
                          Weight Records ({child.weightRecords.length})
                        </div>
                      </h3>
                      <button
                        className="btn btn-sm btn-primary gap-2"
                        onClick={() => navigate("/graph", { state: { childrenData: child } })}
                      >
                        <FaChartLine />
                        View Graph
                      </button>
                    </div>

                    {/* Compact Table View */}
                    <div className="overflow-x-auto">
                      <table className="table table-zebra table-xs">
                        <thead>
                          <tr className="bg-base-200">
                            <th className="text-center">Weight</th>
                            <th>Date</th>
                            <th>Given By</th>
                            <th>Created By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {child.weightRecords
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((rec, idx) => (
                              <tr key={rec.id}>
                                <td className="text-center">
                                  <span className="font-bold text-secondary text-base">
                                    {rec.weight} kg
                                  </span>
                                  {idx === 0 && <span className="badge badge-primary badge-xs ml-1">Latest</span>}
                                </td>
                                <td>
                                  <div className="text-sm font-medium">{safeFormatDate(rec.date)}</div>
                                  <div className="text-xs opacity-60">{safeAdToBs(rec.date)} BS</div>
                                </td>
                                <td>
                                  {rec.administeredBy ? (
                                    <button
                                      onClick={() => navigate(`/user/${rec.administeredBy.id}`)}
                                      className="link link-primary text-xs font-semibold"
                                    >
                                      {rec.administeredBy.name}
                                    </button>
                                  ) : (
                                    <span className="text-xs opacity-50">N/A</span>
                                  )}
                                </td>
                                <td>
                                  {rec.createdBy ? (
                                    <button
                                      onClick={() => navigate(`/user/${rec.createdBy.id}`)}
                                      className="link link-secondary text-xs font-semibold"
                                    >
                                      {rec.createdBy.name}
                                    </button>
                                  ) : (
                                    <span className="text-xs opacity-50">N/A</span>
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

            {/* Vaccination Records */}
            <div className="xl:col-span-8">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-6">
                    <div className="badge badge-primary badge-lg gap-2">
                      <FaSyringe />
                      Vaccination Records
                    </div>
                  </h2>

                  {/* Print Layout */}
                  <div className="hidden print:block">
                    <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] border-2 border-black p-2">
                      <div>
                        <p><strong>Child:</strong> {child.fullName} {child.lastName || ""}</p>
                        <p><strong>Parent:</strong> {child.parentName}</p>
                        <p><strong>Birth (BS):</strong> {safeAdToBs(child.birthDate)}</p>
                      </div>
                      <div>
                        <p><strong>Age:</strong> {age.formatted} | <strong>Ward:</strong> {child.wardNumber}</p>
                        <p><strong>Birth (AD):</strong> {safeFormatDate(child.birthDate)}</p>
                        <p><strong>Weight:</strong> {child.weightRecords?.[0]?.weight ? `${child.weightRecords[0].weight} kg` : "-"}</p>
                      </div>
                    </div>

                    <table className="w-full border-collapse text-[9px] mb-2">
                      <thead>
                        <tr className="bg-gray-200 border-2 border-black">
                          <th className="border border-black px-1 py-0.5">Vaccine</th>
                          <th className="border border-black px-1 py-0.5">D#</th>
                          <th className="border border-black px-1 py-0.5">Typ</th>
                          <th className="border border-black px-1 py-0.5">Stat</th>
                          <th className="border border-black px-1 py-0.5">Date (BS)</th>
                          <th className="border border-black px-1 py-0.5">Date (AD)</th>
                          <th className="border border-black px-1 py-0.5">Given By</th>
                          <th className="border border-black px-1 py-0.5">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(vaccinationTemplate).map(([vType, vData], typeIndex) =>
                          vData.doses.map((dose, idx) => {
                            const isGiven = !!dose.actualVaccination;
                            let statusText = "Pend";
                            if (isGiven) statusText = "✓";
                            else if (dose.status === "missed") statusText = "Miss";
                            else if (dose.status === "overdue") statusText = `OD${dose.overdueDays ? `(${dose.overdueDays}d)` : ''}`;
                            else if (dose.status === "due") statusText = `Due${dose.daysUntilDue ? `(${dose.daysUntilDue}d)` : ''}`;

                            return (
                              <tr
                                key={`${vType}-${dose.doseNumber}`}
                                className={`border border-black ${idx === 0 && typeIndex > 0 ? 'border-t-2' : ''}`}
                              >
                                {idx === 0 && (
                                  <td
                                    rowSpan={vData.doses.length}
                                    className="border-r-2 border-black px-1 py-1 font-bold align-top bg-gray-100 text-[10px]"
                                  >
                                    {vType}
                                  </td>
                                )}
                                <td className="border border-black px-1 py-0.5 text-center">{dose.doseNumber}</td>
                                <td className="border border-black px-1 py-0.5 text-center">{dose.scheduleInfo.isPrimary ? "P" : "C"}</td>
                                <td className="border border-black px-1 py-0.5 text-center font-semibold">{statusText}</td>
                                <td className="border border-black px-1 py-0.5">
                                  {isGiven ? safeAdToBs(dose.dateGiven) : dose.dueDate ? safeAdToBs(dose.dueDate) : "-"}
                                </td>
                                <td className="border border-black px-1 py-0.5">
                                  {isGiven ? safeFormatDate(dose.dateGiven) : dose.dueDate ? safeFormatDate(dose.dueDate) : "-"}
                                </td>
                                <td className="border border-black px-1 py-0.5">{dose.actualVaccination?.administeredBy?.name || "-"}</td>
                                <td className="border border-black px-1 py-0.5 text-[8px]">
                                  {dose.actualVaccination?.remarks || dose.dueVaccine?.notes || "-"}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Screen Display */}
                  <div className="print:hidden space-y-4">
                    {Object.entries(vaccinationTemplate).map(([vType, vData]) => {
                      const completedCount = vData.doses.filter(d => d.status === 'completed').length;
                      const primaryTotal = vData.doses.filter(d => d.scheduleInfo.isPrimary).length;
                      const primaryCompleted = vData.doses.filter(d => d.scheduleInfo.isPrimary && d.status === 'completed').length;
                      const boosterTotal = vData.doses.filter(d => d.scheduleInfo.isBooster || d.isCatchUp).length;
                      const boosterCompleted = vData.doses.filter(d => (d.scheduleInfo.isBooster || d.isCatchUp) && d.status === 'completed').length;
                      const sectionKey = `vaccine-${vType}`;

                      return (
                        <div key={vType} className="collapse collapse-arrow bg-base-200 border border-base-300">
                          <input
                            type="checkbox"
                            checked={expandedSections[sectionKey] || false}
                            onChange={() => toggleSection(sectionKey)}
                          />
                          <div className="collapse-title">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <h4 className="font-bold text-lg">{vType}</h4>
                                <div className="flex gap-2">
                                  <div className="badge badge-primary gap-1">
                                    {primaryCompleted}/{primaryTotal} Primary
                                  </div>
                                  <div className="badge badge-info gap-1">
                                    {boosterCompleted}/{boosterTotal} Booster
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                  {vData.doses.map(d => (
                                    <div key={d.doseNumber} className="tooltip" data-tip={`Dose ${d.doseNumber}`}>
                                      {getStatusIcon(d.status)}
                                    </div>
                                  ))}
                                </div>
                                <span className="badge badge-outline">{completedCount}/{vData.doses.length}</span>
                              </div>
                            </div>
                          </div>
                          <div className="collapse-content">
                            <div className="overflow-x-auto">
                              <table className="table table-zebra table-sm">
                                <thead>
                                  <tr className="bg-base-300">
                                    <th>Dose</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Date (AD)</th>
                                    <th>Date (BS)</th>
                                    <th>Given By</th>
                                    <th>Created By</th>
                                    <th>Created On</th>
                                    <th>Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {vData.doses.map((dose) => {
                                    const isGiven = !!dose.actualVaccination;
                                    return (
                                      <tr key={`${vType}-${dose.doseNumber}`} className="hover">
                                        <td>
                                          <span className="badge badge-primary">#{dose.doseNumber}</span>
                                        </td>
                                        <td>
                                          <span className={`badge badge-sm ${dose.scheduleInfo.isPrimary ? 'badge-primary' : 'badge-info'}`}>
                                            {dose.scheduleInfo.isPrimary ? 'Primary' : (dose.scheduleInfo.isBooster ? 'Booster' : 'Catchup')}
                                          </span>
                                        </td>
                                        <td>{renderStatusBadge(dose)}</td>
                                        <td className="font-medium">
                                          {isGiven ? safeFormatDate(dose.dateGiven) : dose.dueDate ? safeFormatDate(dose.dueDate) : "-"}
                                        </td>
                                        <td className="font-medium">
                                          {isGiven ? safeAdToBs(dose.dateGiven) : dose.dueDate ? safeAdToBs(dose.dueDate) : "-"}
                                        </td>
                                        <td>
                                          {isGiven && dose.actualVaccination?.administeredBy ? (
                                            <button
                                              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${dose.actualVaccination.administeredBy.id}`); }}
                                              className="link link-primary"
                                            >
                                              {dose.actualVaccination.administeredBy.name}
                                            </button>
                                          ) : <span className="opacity-50">-</span>}
                                        </td>
                                        <td>
                                          {dose.createdBy ? (
                                            <button
                                              onClick={(e) => { e.stopPropagation(); navigate(`/user/${dose.actualVaccination?.createdBy?.id || dose.dueVaccine?.createdBy?.id}`); }}
                                              className="link link-secondary"
                                            >
                                              {dose.createdBy}
                                            </button>
                                          ) : <span className="opacity-50">-</span>}
                                        </td>
                                        <td>
                                          <div>
                                            {dose.createdOn ? (
                                              <>
                                                <div className="font-medium">{safeAdToBs(dose.createdOn)}</div>
                                                <div className="text-xs opacity-60">{safeFormatDate(dose.createdOn)}</div>
                                              </>
                                            ) : <span className="opacity-50">-</span>}
                                          </div>
                                        </td>
                                        <td className="text-xs max-w-xs truncate" title={dose.actualVaccination?.remarks || dose.dueVaccine?.notes || ''}>
                                          {dose.actualVaccination?.remarks || dose.dueVaccine?.notes || <span className="opacity-50">-</span>}
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
        </div>
      </div>
    );
  };

  // Main view
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-200 to-secondary/5">
      {showPrintComponent && selectedChild && (
        <VaccinationCardOverlay
          child={selectedChild}
          onClose={() => setShowPrintComponent(false)}
        />
      )}

      {isSearching ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSearch className="text-2xl text-primary" />
              </div>
            </div>
            <p className="text-base-content/60 font-medium text-lg">Searching for child records...</p>
          </div>
        </div>
      ) : selectedChild ? (
        renderChildDetails(selectedChild)
      ) : (
        <div>
          {/* Header */}
          <div className="bg-base-100 border-b border-base-300 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    Children Records
                  </h1>
                  <p className="text-base-content/70 text-lg">Manage and track vaccination records</p>
                </div>
                <div className="flex items-center gap-3">
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
                    className="btn btn-primary gap-2"
                  >
                    <FaPlus />
                    Add Child
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Search & Filter */}
            <div className="card bg-base-100 shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <FaFilter className="text-primary" />
                  Search & Filter
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Name</span>
                    </label>
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                      className="input input-bordered"
                      placeholder="Search by name..."
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Registration No.</span>
                    </label>
                    <input
                      type="text"
                      value={filters.serviceRegistrationNumber}
                      onChange={(e) => setFilters((prev) => ({ ...prev, serviceRegistrationNumber: e.target.value }))}
                      className="input input-bordered"
                      placeholder="Service registration..."
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Phone Number</span>
                    </label>
                    <input
                      type="text"
                      value={filters.phoneNumber}
                      onChange={(e) => setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      className="input input-bordered"
                      placeholder="Phone number..."
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Gender</span>
                    </label>
                    <select
                      value={filters.gender}
                      onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
                      className="select select-bordered"
                    >
                      <option value="">All Genders</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-300">
                    <div className="text-sm">
                      {isLoadingSearch ? (
                        <span className="flex items-center gap-2">
                          <span className="loading loading-spinner loading-sm"></span>
                          Searching records...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaSearch className="text-primary" />
                          Found <span className="font-bold text-primary">{filteredChildren.length}</span> result{filteredChildren.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="btn btn-ghost btn-sm text-error gap-2"
                    >
                      <FaTimesCircle />
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full mb-8">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FaBaby className="text-4xl" />
                </div>
                <div className="stat-title">Total Children</div>
                <div className="stat-value text-primary">{filteredChildren.length}</div>
                <div className="stat-desc">{hasActiveFilters ? 'Filtered results' : 'All records'}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-success">
                  <FaCheckCircle className="text-4xl" />
                </div>
                <div className="stat-title">Fully Vaccinated</div>
                <div className="stat-value text-success">
                  {filteredChildren.filter((child) => child.purnaKhop).length}
                </div>
                <div className="stat-desc">Complete records</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-warning">
                  <FaExclamationTriangle className="text-4xl" />
                </div>
                <div className="stat-title">Incomplete</div>
                <div className="stat-value text-warning">
                  {filteredChildren.filter((child) => !child.purnaKhop).length}
                </div>
                <div className="stat-desc">Needs attention</div>
              </div>
            </div>

            {/* Children Grid */}
            {filteredChildren.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center py-16">
                  <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
                    <FaBaby className="text-5xl opacity-40" />
                  </div>
                  <h2 className="card-title text-3xl mb-3">
                    {hasActiveFilters ? 'No children found' : 'No children records yet'}
                  </h2>
                  <p className="text-base-content/70 text-lg mb-6 max-w-md">
                    {hasActiveFilters
                      ? 'Try adjusting your search criteria to find what you\'re looking for.'
                      : 'Get started by adding your first child record to track their vaccination progress.'}
                  </p>
                  {!hasActiveFilters && (
                    <button
                      onClick={() => navigate('/add-child')}
                      className="btn btn-primary btn-lg gap-3"
                    >
                      <FaPlus />
                      Add First Child
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentChildren.map(renderChildCard)}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-primary disabled:opacity-50 gap-2"
                    >
                      <FaChevronLeft />
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
                            className={`join-item btn ${currentPage === pageNum ? 'btn-primary' : 'btn-outline'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-primary disabled:opacity-50 gap-2"
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