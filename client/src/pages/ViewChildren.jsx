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

  // State management
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
  const itemsPerPage = 12;

  const { childrenData, error, loading, fetchChildren } = useChildContext();
  const { vaccineSchedule, loading: scheduleLoading } = useVaccineScheduleContext();

  // Loading state for schedule
  if (scheduleLoading || !vaccineSchedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <p className="text-white text-lg font-medium">Loading vaccination schedule...</p>
        </div>
      </div>
    );
  }

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
  }, [sewaDartaNumber]);

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

  // Render child card
  const renderChildCard = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const vaccinationStats = getVaccinationStats(child);

    return (
      <div
        key={child.id}
        className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 overflow-hidden transform hover:scale-[1.02]"
        onClick={() => setSelectedChild(child)}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 text-white">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-200 transition-colors">
                {child.fullName}
              </h3>
              <div className="flex items-center gap-3 text-sm text-indigo-200">
                <span className="flex items-center gap-1">
                  <FaBirthdayCake className="w-3 h-3" />
                  {age.formatted}
                </span>
                <span>•</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  Ward {child.wardNumber}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${vaccinationStats.isFullyVaccinated
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                }`}>
                {vaccinationStats.isFullyVaccinated ? '✨ Complete' : '⚡ Incomplete'}
              </div>
              <div className="text-xs text-indigo-200 mt-1">#{child.sewaDartaNumber}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 space-y-4">
          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-gray-500 text-xs font-medium">Parent</div>
              <div className="font-semibold text-gray-800 truncate">{child.parentName}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-xs font-medium">Gender</div>
              <div className="font-semibold text-gray-800">
                {child.gender === 'MALE' ? '👦 Male' : '👧 Female'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-xs font-medium">Phone</div>
              <div className="text-gray-700 text-xs truncate">{child.phoneNumber || 'N/A'}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-xs font-medium">Location</div>
              <div className="text-gray-700 text-xs truncate">{child.tole}</div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="group-hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-green-600">{vaccinationStats.totalGiven}</div>
                <div className="text-xs text-gray-600">Given</div>
              </div>
              <div className="group-hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-red-500">{vaccinationStats.overdueCount}</div>
                <div className="text-xs text-gray-600">Overdue</div>
              </div>
              <div className="group-hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-blue-500">{vaccinationStats.pendingCount}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="group-hover:scale-105 transition-transform">
                <div className="text-lg font-bold text-purple-500">{vaccinationStats.whatsLeft}</div>
                <div className="text-xs text-gray-600">Left</div>
              </div>
            </div>
          </div>

          {/* Birth dates */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <div className="text-xs font-medium text-blue-700 mb-2">Birth Information</div>
            <div className="space-y-1 text-sm">
              <div className="font-medium text-gray-800">{safeFormatDate(child.birthDate)} (AD)</div>
              <div className="text-gray-600">{safeAdToBs(child.birthDate)} (BS)</div>
            </div>
          </div>

          {/* Special badges */}
          <div className="flex flex-wrap gap-2">
            {child.isFromOtherMunicipality && (
              <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full text-xs font-medium">
                🏢 Other Municipality
              </div>
            )}
            {vaccinationStats.overdueCount > 0 && (
              <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full text-xs font-medium animate-pulse">
                ⚠️ {vaccinationStats.overdueCount} Overdue
              </div>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    );
  };

  // Render detailed child view
  const renderChildDetails = (child) => {
    const age = calculateDetailedAge(child.birthDate);
    const vaccinationStats = getVaccinationStats(child);
    const vaccinesByType = organizeVaccinesByType(child);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-purple-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedChild(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <FaChevronLeft />
                  <span>Back</span>
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {child.fullName}
                  </h1>
                  <p className="text-gray-600 font-medium">
                    #{child.sewaDartaNumber} • {age.formatted} • {child.gender === 'MALE' ? '👦 Male' : '👧 Female'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/graph', { state: { childrenData: child } })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <FaChartLine />
                  Growth Chart
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <FaPrint />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { value: vaccinationStats.totalGiven, label: 'Vaccines Given', color: 'from-green-400 to-emerald-500', icon: FaAward },
              { value: vaccinationStats.overdueCount, label: 'Overdue', color: 'from-red-400 to-red-500', icon: FaExclamationTriangle },
              { value: vaccinationStats.pendingCount, label: 'Pending', color: 'from-blue-400 to-blue-500', icon: FaClock },
              { value: vaccinationStats.whatsLeft, label: 'Remaining', color: 'from-purple-400 to-purple-500', icon: FaStar },
              { value: child.weightRecords?.length || 0, label: 'Weight Records', color: 'from-pink-400 to-pink-500', icon: FaHeart }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
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
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
                      <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                  {child.isFromOtherMunicipality && (
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full text-xs font-medium">
                      🏢 Other Municipality
                    </div>
                  )}
                </div>
              </div>

              {/* Birth Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
                    <FaBirthdayCake className="text-white text-sm" />
                  </div>
                  Birth Info
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl border border-pink-200">
                    <div className="text-sm text-pink-700 font-medium mb-1">Birth Date (AD)</div>
                    <div className="font-bold text-gray-800">{safeFormatDate(child.birthDate)}</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                    <div className="text-sm text-red-700 font-medium mb-1">Birth Date (BS)</div>
                    <div className="font-bold text-gray-800">{safeAdToBs(child.birthDate)}</div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="text-sm text-purple-700 font-medium mb-1">Current Age</div>
                    <div className="font-bold text-gray-800">{age.formatted}</div>
                  </div>
                </div>
              </div>

              {/* Administrative */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-white text-sm" />
                  </div>
                  Administrative
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Created', value: safeFormatDate(child.createdAt) },
                    { label: 'Created By', value: child.createdBy?.name },
                    ...(child.verifiedBy ? [{ label: 'Verified By', value: child.verifiedBy?.name }] : [])
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
                      <span className="text-sm font-semibold text-blue-600">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weight Records */}
              {child.weightRecords && child.weightRecords.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <FaWeight className="text-white text-sm" />
                    </div>
                    Weight Records
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {child.weightRecords
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((record, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-2xl font-bold text-purple-700">{record.weight} kg</div>
                            <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                              #{index + 1}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{safeAdToBs(record.date)} (BS)</div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>Administered: <span className="font-medium text-purple-600">{record.administeredBy?.name}</span></div>
                            <div>Created: <span className="font-medium text-purple-600">{record.createdBy?.name}</span></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content - Vaccination Data */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaSyringe className="text-white text-lg" />
                  </div>
                  Vaccination Records by Type
                </h2>

                {Object.keys(vaccinesByType).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaSyringe className="text-gray-400 text-2xl" />
                    </div>
                    <p className="text-gray-500 text-lg">No vaccination data available</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(vaccinesByType).map(([vaccineType, data]) => {
                      const sectionKey = `vaccine-${vaccineType}`;
                      const isExpanded = expandedSections[sectionKey] !== false;

                      return (
                        <div key={vaccineType} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                          {/* Vaccine Type Header */}
                          <button
                            onClick={() => toggleSection(sectionKey)}
                            className="w-full p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center hover:from-indigo-600 hover:to-purple-700 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <FaSyringe className="text-white" />
                              </div>
                              <div className="text-left">
                                <h3 className="text-xl font-bold">{vaccineType}</h3>
                                <div className="text-indigo-200 text-sm">
                                  {data.completed.length + data.due.length + data.overdue.length} total doses
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex gap-2">
                                {data.completed.length > 0 && (
                                  <div className="bg-green-400/30 text-green-100 px-3 py-1 rounded-full text-xs font-medium">
                                    {data.completed.length} ✓
                                  </div>
                                )}
                                {data.overdue.length > 0 && (
                                  <div className="bg-red-400/30 text-red-100 px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                                    {data.overdue.length} ⚠
                                  </div>
                                )}
                                {data.due.length > 0 && (
                                  <div className="bg-yellow-400/30 text-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
                                    {data.due.length} ⏱
                                  </div>
                                )}
                              </div>
                              <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                <FaChevronDown className="text-white" />
                              </div>
                            </div>
                          </button>

                          {/* Vaccine Details */}
                          {isExpanded && (
                            <div className="p-6 space-y-4">
                              {/* Completed Vaccinations */}
                              {data.completed.map((vacc, index) => (
                                <div key={`completed-${index}`} className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                        <FaCheckCircle className="text-white text-sm" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-green-800 text-lg">
                                          Dose {vacc.doseNumber} - Completed ✨
                                        </div>
                                        <div className="text-green-600 font-medium">
                                          {safeAdToBs(vacc.dateGiven)} (BS)
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right text-sm bg-green-100 rounded-lg p-3">
                                      <div className="text-green-700 font-medium mb-1">👨‍⚕️ Administered by:</div>
                                      <div className="font-bold text-green-800">{vacc.administeredBy?.name}</div>
                                      <div className="text-green-600 mt-1">📝 Created by: {vacc.createdBy?.name}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* Overdue Vaccinations */}
                              {data.overdue.map((vacc, index) => (
                                <div key={`overdue-${index}`} className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow animate-pulse">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                                        <FaExclamationTriangle className="text-white text-sm" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-red-800 text-lg">
                                          Dose {vacc.doseNumber} - OVERDUE ⚠️
                                        </div>
                                        <div className="text-red-600 font-medium">
                                          Due: {safeAdToBs(vacc.dueDate)} (BS)
                                        </div>
                                        <div className="text-red-500 text-sm mt-1">
                                          {Math.floor((new Date() - new Date(vacc.dueDate)) / (1000 * 60 * 60 * 24))} days overdue
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className={`px-3 py-2 rounded-lg text-white font-medium ${vacc.isCatchUp ? 'bg-orange-500' : 'bg-red-500'
                                        }`}>
                                        {vacc.isCatchUp ? '🔄 Catch-up' : '📅 Regular'}
                                      </div>
                                      {vacc.catchUpLocked && (
                                        <div className="text-xs text-red-600 mt-1">🔒 Locked</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* Due Soon Vaccinations */}
                              {data.due.map((vacc, index) => (
                                <div key={`due-${index}`} className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                                        <FaClock className="text-white text-sm" />
                                      </div>
                                      <div>
                                        <div className="font-bold text-yellow-800 text-lg">
                                          Dose {vacc.doseNumber} - Due Soon ⏰
                                        </div>
                                        <div className="text-yellow-600 font-medium">
                                          Due: {safeAdToBs(vacc.dueDate)} (BS)
                                        </div>
                                        <div className="text-yellow-600 text-sm mt-1">
                                          {Math.ceil((new Date(vacc.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className={`px-3 py-2 rounded-lg text-white font-medium ${vacc.isCatchUp ? 'bg-orange-500' : 'bg-yellow-500'
                                        }`}>
                                        {vacc.isCatchUp ? '🔄 Catch-up' : '📅 Regular'}
                                      </div>
                                      {vacc.catchUpLocked && (
                                        <div className="text-xs text-yellow-600 mt-1">🔒 Locked</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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

  // Main loading state
  if (loading || loadingVaccineTypes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-center shadow-2xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <p className="text-white text-lg font-medium">Loading children records...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-500 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render detailed view if child is selected
  if (selectedChild) {
    return renderChildDetails(selectedChild);
  }

  // Main list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
              Children Records
            </h1>
            <p className="text-white/80 text-lg font-medium">
              Manage vaccination records for all children
            </p>
          </div>
          <button
            onClick={() => navigate('/add-child')}
            className="flex items-center gap-2 px-6 py-4 bg-white/20 backdrop-blur-lg text-white rounded-2xl hover:bg-white/30 transition-all shadow-lg hover:shadow-2xl font-medium border border-white/20"
          >
            <FaPlus className="text-lg" />
            Add New Child
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 mb-8 border border-white/20">
          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search by name, phone number, or Sewa Darta Number..."
              className="w-full px-6 py-4 pl-16 bg-white/50 backdrop-blur-sm border-0 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-purple-300 placeholder-gray-500 font-medium shadow-lg"
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
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              {isSearching ? (
                <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
              ) : (
                <FaSearch className="text-gray-400 text-xl" />
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${showAdvancedFilters
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
                }`}
            >
              <FaFilter />
              Advanced Filters
            </button>

            {(hasSearched || universalSearch || Object.values(advancedFilters).some(v => v)) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg font-medium"
              >
                <FaTimesCircle />
                Clear All
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { key: 'gender', label: 'Gender', options: [{ value: '', label: 'All Genders' }, { value: 'MALE', label: 'Male' }, { value: 'FEMALE', label: 'Female' }] },
                { key: 'ward', label: 'Ward', options: [{ value: '', label: 'All Wards' }, ...Array.from({ length: 35 }, (_, i) => ({ value: i + 1, label: `Ward ${i + 1}` }))] },
                { key: 'vaccinationStatus', label: 'Status', options: [{ value: '', label: 'All Status' }, { value: 'complete', label: 'Complete' }, { value: 'incomplete', label: 'Incomplete' }] }
              ].map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{filter.label}</label>
                  <select
                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium shadow-lg"
                    value={advancedFilters[filter.key]}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, [filter.key]: e.target.value })}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Created by me</label>
                <div className="flex items-center bg-white/60 rounded-xl p-3 shadow-lg">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    checked={advancedFilters.createdByMe}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, createdByMe: e.target.checked })}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">Show only my records</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-white/90 font-medium text-lg">
          {hasSearched ? (
            <span>Found {filteredChildren.length} result{filteredChildren.length !== 1 ? 's' : ''}</span>
          ) : (
            <span>Showing {filteredChildren.length} children</span>
          )}
        </div>

        {/* Results */}
        {filteredChildren.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBaby className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {hasSearched ? 'No results found' : 'No children records yet'}
              </h3>
              <p className="text-white/80 mb-8 font-medium">
                {hasSearched
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Get started by adding your first child record to the system.'
                }
              </p>
              {!hasSearched && (
                <button
                  onClick={() => navigate('/add-child')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-lg text-white rounded-2xl hover:bg-white/30 transition-all mx-auto shadow-lg hover:shadow-2xl font-medium border border-white/20"
                >
                  <FaPlus />
                  Add First Child
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentChildren.map(child => renderChildCard(child))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-2xl p-2 shadow-lg">
                  <button
                    className="px-4 py-3 rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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
                        className={`px-4 py-3 rounded-xl transition-all font-medium ${currentPage === pageNum
                            ? 'bg-white text-purple-600 shadow-lg'
                            : 'text-white hover:bg-white/20'
                          }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="px-4 py-3 rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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