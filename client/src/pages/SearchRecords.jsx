import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaBaby,
    FaFemale,
    FaChartBar,
    FaChartPie,
    FaChartLine,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaVenusMars,
    FaPhone,
    FaUser,
    FaSyringe,
    FaWeight,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
    FaList,
    FaTable,
    FaTimes,
    FaChevronRight,
    FaPrint,
    FaEdit,
    FaDownload,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaArrowLeft,
    FaArrowRight,
    FaUsers,
    FaHospital,
    FaHome,
    FaPercentage,
    FaCaretUp,
    FaCaretDown
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { adToBs } from '@sbmdkl/nepali-date-converter';

const safeFormatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return '';
    }
};

const safeFormatDateYYMMDD = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
};

const RecordsSearchDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();

    // State for data
    const [childrenData, setChildrenData] = useState([]);
    const [mothersData, setMothersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('children'); // 'children' or 'mothers'

    // Filter states
    const [filters, setFilters] = useState({
        searchTerm: '',
        type: 'all',
        wardNumber: '',
        gender: '',
        status: '',
        dateRange: {
            start: '',
            end: ''
        },
        isComplete: '',
        isFromOtherMunicipality: '',
        ageRange: { min: '', max: '' },
        vaccinationStatus: ''
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });

    // View mode
    const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'analytics'

    // Analytics states
    const [analytics, setAnalytics] = useState({
        children: {
            total: 0,
            byWard: {},
            byGender: {},
            byStatus: {},
            byMonth: {},
            byAgeGroup: {},
            vaccinationStats: {
                fullyVaccinated: 0,
                partiallyVaccinated: 0,
                notVaccinated: 0
            },
            demographics: {
                fromOtherMunicipality: 0,
                averageAge: 0,
                withPhoneNumber: 0
            }
        },
        mothers: {
            total: 0,
            byWard: {},
            byVaccinationStatus: {},
            byPregnancyCount: {},
            demographics: {
                fromOtherMunicipality: 0,
                averageAge: 0,
                withPhoneNumber: 0,
                fullyVaccinated: 0
            }
        },
        summary: {
            totalRecords: 0,
            todayAdded: 0,
            thisWeekAdded: 0,
            thisMonthAdded: 0,
            completionRate: 0,
            avgVaccinationsPerChild: 0
        }
    });

    // Calculate age from birth date
    const calculateAge = (birthDate) => {
        if (!birthDate) return 0;
        const birth = new Date(birthDate);
        const today = new Date();
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        return years + (months / 12);
    };

    // Calculate detailed age for children
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

    // Fetch data based on active tab
    useEffect(() => {
        fetchData();
    }, [activeTab, currentPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'children') {
                // Use the same endpoint pattern as ViewChildren.jsx
                let endpoint = '/api/child/search-ward';
                if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
                    endpoint = '/api/child/search';
                }

                const res = await axiosClient.get(endpoint, {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        name: filters.searchTerm || undefined,
                        wardId: filters.wardNumber || undefined,
                        gender: filters.gender || undefined,
                    }
                });

                let children = [];
                if (Array.isArray(res.data)) {
                    children = res.data;
                } else if (res.data?.children && Array.isArray(res.data.children)) {
                    children = res.data.children;
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    children = res.data.data;
                }

                setChildrenData(children);

                // Fetch analytics separately for all children
                if (currentPage === 1) {
                    await fetchChildrenAnalytics();
                }

            } else {
                // Fetch mothers data - use the search endpoint
                const res = await axiosClient.get('/api/mother/search', {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                        name: filters.searchTerm || undefined,
                        wardId: filters.wardNumber || undefined,
                    }
                });

                let mothers = [];
                if (Array.isArray(res.data)) {
                    mothers = res.data;
                } else if (res.data?.mothers && Array.isArray(res.data.mothers)) {
                    mothers = res.data.mothers;
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    mothers = res.data.data;
                }

                setMothersData(mothers);

                // Fetch analytics separately for all mothers
                if (currentPage === 1) {
                    await fetchMothersAnalytics();
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch children analytics
    const fetchChildrenAnalytics = async () => {
        try {
            let endpoint = '/api/child/search-ward';
            if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
                endpoint = '/api/child/search';
            }

            const res = await axiosClient.get(endpoint, {
                params: {
                    limit: 100, // Get enough for analytics
                }
            });

            let allChildren = [];
            if (Array.isArray(res.data)) {
                allChildren = res.data;
            } else if (res.data?.children && Array.isArray(res.data.children)) {
                allChildren = res.data.children;
            }

            calculateChildrenAnalytics(allChildren);
        } catch (error) {
            console.error('Error fetching children analytics:', error);
        }
    };

    // Fetch mothers analytics
    const fetchMothersAnalytics = async () => {
        try {
            const res = await axiosClient.get('/api/mother/search', {
                params: {
                    limit: 100, // Get enough for analytics
                }
            });

            let allMothers = [];
            if (Array.isArray(res.data)) {
                allMothers = res.data;
            } else if (res.data?.mothers && Array.isArray(res.data.mothers)) {
                allMothers = res.data.mothers;
            }

            calculateMothersAnalytics(allMothers);
        } catch (error) {
            console.error('Error fetching mothers analytics:', error);
        }
    };

    const calculateChildrenAnalytics = (children) => {
        const childrenByWard = {};
        const childrenByGender = {};
        const childrenByStatus = {};
        const childrenByMonth = {};
        const childrenByAgeGroup = {
            '0-1': 0,
            '1-3': 0,
            '3-5': 0,
            '5-10': 0,
            '10+': 0
        };

        let fullyVaccinated = 0;
        let partiallyVaccinated = 0;
        let notVaccinated = 0;
        let fromOtherMunicipalityChildren = 0;
        let childrenWithPhone = 0;
        let totalAge = 0;

        children.forEach(child => {
            // By ward
            const ward = child.wardNumber || 'Unknown';
            childrenByWard[ward] = (childrenByWard[ward] || 0) + 1;

            // By gender
            const gender = child.gender || 'Unknown';
            childrenByGender[gender] = (childrenByGender[gender] || 0) + 1;

            // By status
            const status = child.purnaKhop ? 'Complete' : 'Incomplete';
            childrenByStatus[status] = (childrenByStatus[status] || 0) + 1;

            // By month (from createdAt)
            if (child.createdAt) {
                const createdDate = new Date(child.createdAt);
                const month = createdDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                childrenByMonth[month] = (childrenByMonth[month] || 0) + 1;
            }

            // Age group
            const age = calculateAge(child.birthDate);
            totalAge += age;

            if (age <= 1) childrenByAgeGroup['0-1']++;
            else if (age <= 3) childrenByAgeGroup['1-3']++;
            else if (age <= 5) childrenByAgeGroup['3-5']++;
            else if (age <= 10) childrenByAgeGroup['5-10']++;
            else childrenByAgeGroup['10+']++;

            // Vaccination stats - use _count.vaccinations if available
            const vaccineCount = child._count?.vaccinations || 0;
            if (vaccineCount >= 10) fullyVaccinated++;
            else if (vaccineCount > 0) partiallyVaccinated++;
            else notVaccinated++;

            // Demographics
            if (child.isFromOtherMunicipality) fromOtherMunicipalityChildren++;
            if (child.phoneNumber) childrenWithPhone++;
        });

        const avgAgeChildren = children.length > 0 ? (totalAge / children.length).toFixed(1) : 0;

        setAnalytics(prev => ({
            ...prev,
            children: {
                ...prev.children,
                total: children.length,
                byWard: childrenByWard,
                byGender: childrenByGender,
                byStatus: childrenByStatus,
                byMonth: childrenByMonth,
                byAgeGroup: childrenByAgeGroup,
                vaccinationStats: {
                    fullyVaccinated,
                    partiallyVaccinated,
                    notVaccinated
                },
                demographics: {
                    fromOtherMunicipality: fromOtherMunicipalityChildren,
                    averageAge: parseFloat(avgAgeChildren),
                    withPhoneNumber: childrenWithPhone
                }
            }
        }));
    };

    const calculateMothersAnalytics = (mothers) => {
        const mothersByWard = {};
        const mothersByVaccinationStatus = {
            'Fully': 0,
            'Partial': 0,
            'None': 0
        };
        const mothersByPregnancyCount = {
            '1': 0,
            '2': 0,
            '3+': 0
        };

        let fromOtherMunicipalityMothers = 0;
        let mothersWithPhone = 0;
        let totalMothersAge = 0;
        let fullyVaccinatedMothers = 0;

        mothers.forEach(mother => {
            // By ward
            const ward = mother.wardNumber || 'Unknown';
            mothersByWard[ward] = (mothersByWard[ward] || 0) + 1;

            // By vaccination status - check tdDoses
            const tdCount = mother.tdDoses?.length || 0;
            const vaxStatus = tdCount >= 3 ? 'Fully' : tdCount > 0 ? 'Partial' : 'None';
            mothersByVaccinationStatus[vaxStatus]++;
            if (vaxStatus === 'Fully') fullyVaccinatedMothers++;

            // By pregnancy count
            const pregnancyCount = mother.pregnancyCount || 0;
            if (pregnancyCount === 1) mothersByPregnancyCount['1']++;
            else if (pregnancyCount === 2) mothersByPregnancyCount['2']++;
            else if (pregnancyCount >= 3) mothersByPregnancyCount['3+']++;

            // Demographics
            if (mother.isFromOtherMunicipality) fromOtherMunicipalityMothers++;
            if (mother.phoneNumber) mothersWithPhone++;

            // For mothers, we might not have age, use a default or estimate
            const motherAge = mother.age || 30; // Default age if not available
            totalMothersAge += motherAge;
        });

        const avgAgeMothers = mothers.length > 0 ? (totalMothersAge / mothers.length).toFixed(1) : 0;

        setAnalytics(prev => ({
            ...prev,
            mothers: {
                ...prev.mothers,
                total: mothers.length,
                byWard: mothersByWard,
                byVaccinationStatus: mothersByVaccinationStatus,
                byPregnancyCount: mothersByPregnancyCount,
                demographics: {
                    fromOtherMunicipality: fromOtherMunicipalityMothers,
                    averageAge: parseFloat(avgAgeMothers),
                    withPhoneNumber: mothersWithPhone,
                    fullyVaccinated: fullyVaccinatedMothers
                }
            }
        }));
    };

    // Filter data based on current filters
    const filteredData = useMemo(() => {
        const data = activeTab === 'children' ? childrenData : mothersData;

        return data.filter(item => {
            // Search term filter
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const matchesSearch =
                    (item.fullName || item.name || '').toLowerCase().includes(searchLower) ||
                    (item.sewaDartaNumber?.toString() || '').includes(searchLower) ||
                    (item.phoneNumber || '').includes(searchLower) ||
                    (item.parentName || '').toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Ward filter
            if (filters.wardNumber && item.wardNumber?.toString() !== filters.wardNumber) {
                return false;
            }

            // Gender filter (children only)
            if (activeTab === 'children' && filters.gender && item.gender !== filters.gender) {
                return false;
            }

            // Status filter (for children)
            if (activeTab === 'children' && filters.status) {
                if (filters.status === 'complete' && !item.purnaKhop) return false;
                if (filters.status === 'incomplete' && item.purnaKhop) return false;
            }

            // Date range filter
            if (filters.dateRange.start && item.createdAt) {
                const itemDate = new Date(item.createdAt);
                const startDate = new Date(filters.dateRange.start);
                if (itemDate < startDate) return false;
            }
            if (filters.dateRange.end && item.createdAt) {
                const itemDate = new Date(item.createdAt);
                const endDate = new Date(filters.dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                if (itemDate > endDate) return false;
            }

            // Age range filter (for children)
            if (activeTab === 'children' && (filters.ageRange.min || filters.ageRange.max)) {
                const age = calculateAge(item.birthDate);
                if (filters.ageRange.min && age < parseInt(filters.ageRange.min)) return false;
                if (filters.ageRange.max && age > parseInt(filters.ageRange.max)) return false;
            }

            // Vaccination status filter
            if (filters.vaccinationStatus) {
                const vaxCount = activeTab === 'children'
                    ? item._count?.vaccinations || 0
                    : item.tdDoses?.length || 0;

                if (filters.vaccinationStatus === 'full' && vaxCount < 10) return false;
                if (filters.vaccinationStatus === 'partial' && (vaxCount === 0 || vaxCount >= 10)) return false;
                if (filters.vaccinationStatus === 'none' && vaxCount > 0) return false;
            }

            // Other municipality filter
            if (filters.isFromOtherMunicipality !== '' &&
                item.isFromOtherMunicipality !== (filters.isFromOtherMunicipality === 'true')) {
                return false;
            }

            return true;
        });
    }, [childrenData, mothersData, activeTab, filters]);

    // Sort filtered data
    const sortedData = useMemo(() => {
        const sortableData = [...filteredData];

        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested properties
                if (sortConfig.key === 'age') {
                    aValue = calculateAge(a.birthDate);
                    bValue = calculateAge(b.birthDate);
                }
                if (sortConfig.key === 'vaccinationCount') {
                    aValue = activeTab === 'children' ? a._count?.vaccinations || 0 : a.tdDoses?.length || 0;
                    bValue = activeTab === 'children' ? b._count?.vaccinations || 0 : b.tdDoses?.length || 0;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableData;
    }, [filteredData, sortConfig, activeTab]);

    // Handle sort
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle filter change
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            searchTerm: '',
            type: 'all',
            wardNumber: '',
            gender: '',
            status: '',
            dateRange: { start: '', end: '' },
            isComplete: '',
            isFromOtherMunicipality: '',
            ageRange: { min: '', max: '' },
            vaccinationStatus: ''
        });
        setCurrentPage(1);
    };

    // Handle view record
    const handleViewRecord = (record) => {
        if (activeTab === 'children') {
            navigate(`/view-child/${record.sewaDartaNumber}`);
        } else {
            navigate(`/view-mother/${record.sewaDartaNumber}`);
        }
    };

    // Handle edit record
    const handleEditRecord = (record) => {
        if (activeTab === 'children') {
            navigate('/edit-child', { state: { selectedChild: record } });
        } else {
            navigate('/edit-mother', { state: { selectedMother: record } });
        }
    };

    // Render summary analytics cards
    const renderSummaryCards = () => {
        const stats = activeTab === 'children' ? analytics.children : analytics.mothers;
        const total = activeTab === 'children' ? analytics.children.total : analytics.mothers.total;

        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                {/* Total Records */}
                <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg">
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs opacity-80">Total</div>
                                <div className="text-2xl font-bold">{total}</div>
                                <div className="text-xs opacity-80 mt-1">
                                    {activeTab === 'children' ? 'Children' : 'Mothers'}
                                </div>
                            </div>
                            <div className="text-3xl">
                                {activeTab === 'children' ? <FaBaby /> : <FaFemale />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ward Distribution */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-base-content/60">Wards</div>
                                <div className="text-2xl font-bold">
                                    {Object.keys(stats.byWard).length}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">
                                    Active wards
                                </div>
                            </div>
                            <div className="text-2xl text-info">
                                <FaMapMarkerAlt />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vaccination Stats */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-base-content/60">
                                    {activeTab === 'children' ? 'Fully Vaccinated' : 'TD Complete'}
                                </div>
                                <div className="text-2xl font-bold">
                                    {activeTab === 'children'
                                        ? stats.vaccinationStats.fullyVaccinated
                                        : stats.demographics.fullyVaccinated}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">
                                    {total > 0
                                        ? `${((activeTab === 'children'
                                            ? stats.vaccinationStats.fullyVaccinated
                                            : stats.demographics.fullyVaccinated) / total * 100).toFixed(1)}%`
                                        : '0%'}
                                </div>
                            </div>
                            <div className="text-2xl text-success">
                                <FaCheckCircle />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Average Age */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-base-content/60">Avg. Age</div>
                                <div className="text-2xl font-bold">
                                    {stats.demographics.averageAge}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">
                                    Years
                                </div>
                            </div>
                            <div className="text-2xl text-warning">
                                <FaCalendarAlt />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phone Coverage */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-base-content/60">Phone Coverage</div>
                                <div className="text-2xl font-bold">
                                    {stats.demographics.withPhoneNumber}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">
                                    {total > 0
                                        ? `${(stats.demographics.withPhoneNumber / total * 100).toFixed(1)}%`
                                        : '0%'}
                                </div>
                            </div>
                            <div className="text-2xl text-secondary">
                                <FaPhone />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Other Municipality */}
                <div className="card bg-base-100 shadow-md">
                    <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-base-content/60">Other Municipality</div>
                                <div className="text-2xl font-bold">
                                    {stats.demographics.fromOtherMunicipality}
                                </div>
                                <div className="text-xs text-base-content/60 mt-1">
                                    {total > 0
                                        ? `${(stats.demographics.fromOtherMunicipality / total * 100).toFixed(1)}%`
                                        : '0%'}
                                </div>
                            </div>
                            <div className="text-2xl text-error">
                                <FaHospital />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render table view
    const renderTableView = () => {
        return (
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="bg-base-300">
                            {activeTab === 'children' ? (
                                <>
                                    <th className="bg-base-300">
                                        <button
                                            className="flex items-center gap-1 hover:text-primary"
                                            onClick={() => requestSort('sewaDartaNumber')}
                                        >
                                            ID
                                            {sortConfig.key === 'sewaDartaNumber' && (
                                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                            )}
                                        </button>
                                    </th>
                                    <th className="bg-base-300">
                                        <button
                                            className="flex items-center gap-1 hover:text-primary"
                                            onClick={() => requestSort('fullName')}
                                        >
                                            Name
                                            {sortConfig.key === 'fullName' && (
                                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                            )}
                                        </button>
                                    </th>
                                    <th className="bg-base-300">Parent</th>
                                    <th className="bg-base-300">Ward</th>
                                    <th className="bg-base-300">Gender</th>
                                    <th className="bg-base-300">
                                        <button
                                            className="flex items-center gap-1 hover:text-primary"
                                            onClick={() => requestSort('age')}
                                        >
                                            Age
                                            {sortConfig.key === 'age' && (
                                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                            )}
                                        </button>
                                    </th>
                                    <th className="bg-base-300">
                                        <button
                                            className="flex items-center gap-1 hover:text-primary"
                                            onClick={() => requestSort('purnaKhop')}
                                        >
                                            Status
                                            {sortConfig.key === 'purnaKhop' && (
                                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                            )}
                                        </button>
                                    </th>
                                    <th className="bg-base-300">
                                        <button
                                            className="flex items-center gap-1 hover:text-primary"
                                            onClick={() => requestSort('vaccinationCount')}
                                        >
                                            Vaccines
                                            {sortConfig.key === 'vaccinationCount' && (
                                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                            )}
                                        </button>
                                    </th>
                                    <th className="bg-base-300">Actions</th>
                                </>
                            ) : (
                                <>
                                    <th className="bg-base-300">ID</th>
                                    <th className="bg-base-300">Name</th>
                                    <th className="bg-base-300">Phone</th>
                                    <th className="bg-base-300">Ward</th>
                                    <th className="bg-base-300">Pregnancies</th>
                                    <th className="bg-base-300">TD Doses</th>
                                    <th className="bg-base-300">Actions</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((record) => (
                            <tr key={record.sewaDartaNumber || record.id} className="hover">
                                {activeTab === 'children' ? (
                                    <>
                                        <td className="font-mono font-bold">
                                            #{record.sewaDartaNumber}
                                        </td>
                                        <td>
                                            <div className="font-medium">{record.fullName}</div>
                                            <div className="text-xs text-base-content/60">
                                                {record.birthDate && adToBs(safeFormatDateYYMMDD(record.birthDate))}
                                            </div>
                                        </td>
                                        <td>{record.parentName || '-'}</td>
                                        <td>
                                            <span className="badge badge-outline badge-info">
                                                Ward {record.wardNumber}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${record.gender === 'MALE' ? 'badge-info' :
                                                record.gender === 'FEMALE' ? 'badge-secondary' :
                                                    'badge-neutral'
                                                }`}>
                                                {record.gender === 'MALE' ? 'Male' :
                                                    record.gender === 'FEMALE' ? 'Female' :
                                                        'Other'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-outline">
                                                {calculateAge(record.birthDate).toFixed(1)}y
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${record.purnaKhop ? 'badge-success' : 'badge-warning'
                                                }`}>
                                                {record.purnaKhop ? '✓ Complete' : '⚠ Incomplete'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <FaSyringe className="text-sm" />
                                                <span className="font-bold">{record._count?.vaccinations || 0}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleViewRecord(record)}
                                                    className="btn btn-xs btn-info gap-1"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEditRecord(record)}
                                                    className="btn btn-xs btn-primary gap-1"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="font-mono font-bold">
                                            #{record.sewaDartaNumber}
                                        </td>
                                        <td>
                                            <div className="font-medium">{record.name}</div>
                                            <div className="text-xs text-base-content/60">
                                                Age: {record.age || 'N/A'}
                                            </div>
                                        </td>
                                        <td>{record.phoneNumber || '-'}</td>
                                        <td>
                                            <span className="badge badge-outline badge-info">
                                                Ward {record.wardNumber}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {record.pregnancyCount || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <FaSyringe className="text-sm" />
                                                <span className="font-bold">{record.tdDoses?.length || 0}</span>
                                                <span className="text-xs">/3</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleViewRecord(record)}
                                                    className="btn btn-xs btn-info gap-1"
                                                    title="View"
                                                >
                                                    <FaEye />
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEditRecord(record)}
                                                    className="btn btn-xs btn-primary gap-1"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Render card view
    const renderCardView = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedData.map((record) => (
                    <div key={record.sewaDartaNumber || record.id} className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="card-title text-lg font-bold truncate max-w-[180px]">
                                        {activeTab === 'children' ? record.fullName : record.name}
                                    </h3>
                                    <p className="text-sm text-base-content/60 font-mono">
                                        #{record.sewaDartaNumber}
                                    </p>
                                </div>
                                <span className="badge badge-outline badge-info">
                                    Ward {record.wardNumber}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {activeTab === 'children' ? (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Parent:</span>
                                            <span className="font-medium truncate max-w-[120px]">{record.parentName || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Gender:</span>
                                            <span className={`badge badge-xs ${record.gender === 'MALE' ? 'badge-info' :
                                                record.gender === 'FEMALE' ? 'badge-secondary' :
                                                    'badge-neutral'
                                                }`}>
                                                {record.gender === 'MALE' ? 'Male' :
                                                    record.gender === 'FEMALE' ? 'Female' :
                                                        'Other'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Age:</span>
                                            <span className="font-medium">{calculateAge(record.birthDate).toFixed(1)} years</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Status:</span>
                                            <span className={`badge badge-xs ${record.purnaKhop ? 'badge-success' : 'badge-warning'
                                                }`}>
                                                {record.purnaKhop ? '✓ Complete' : '⚠ Incomplete'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Vaccines:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <FaSyringe className="text-xs" />
                                                {record._count?.vaccinations || 0}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Phone:</span>
                                            <span className="font-medium">{record.phoneNumber || '-'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Age:</span>
                                            <span className="font-medium">{record.age || 'N/A'} years</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Pregnancies:</span>
                                            <span className="badge badge-primary badge-xs">
                                                {record.pregnancyCount || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">TD Doses:</span>
                                            <span className="font-medium flex items-center gap-1">
                                                <FaSyringe className="text-xs" />
                                                {record.tdDoses?.length || 0}/3
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-base-content/60">Previous TD:</span>
                                            <span className="font-medium">{record.previousTDTakenCount || 0}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="card-actions justify-end">
                                <button
                                    onClick={() => handleViewRecord(record)}
                                    className="btn btn-sm btn-info gap-1"
                                >
                                    <FaEye />
                                    View
                                </button>
                                <button
                                    onClick={() => handleEditRecord(record)}
                                    className="btn btn-sm btn-primary gap-1"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-base-content mb-2">
                        Records Search & Analytics Dashboard
                    </h1>
                    <p className="text-base-content/70">
                        Comprehensive view of all records with detailed analytics and filtering
                    </p>
                </div>

                {/* Summary Stats */}
                {!loading && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <FaChartBar className="text-primary" />
                            Quick Statistics
                        </h2>
                        {renderSummaryCards()}
                    </div>
                )}

                {/* Main Controls */}
                <div className="card bg-base-100 shadow-lg mb-6">
                    <div className="card-body">
                        {/* Tabs */}
                        <div className="tabs tabs-boxed mb-4">
                            <button
                                className={`tab flex items-center gap-2 ${activeTab === 'children' ? 'tab-active' : ''}`}
                                onClick={() => {
                                    setActiveTab('children');
                                    setCurrentPage(1);
                                    setFilters(prev => ({ ...prev, gender: '', status: '' })); // Reset child-specific filters
                                }}
                            >
                                <FaBaby />
                                Children ({analytics.children.total})
                            </button>
                            <button
                                className={`tab flex items-center gap-2 ${activeTab === 'mothers' ? 'tab-active' : ''}`}
                                onClick={() => {
                                    setActiveTab('mothers');
                                    setCurrentPage(1);
                                }}
                            >
                                <FaFemale />
                                Mothers ({analytics.mothers.total})
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="form-control">
                                <div className="input-group">
                                    <span className="bg-base-200">
                                        <FaSearch />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search by name, ID, or phone..."
                                        className="input input-bordered flex-1"
                                        value={filters.searchTerm}
                                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <select
                                    className="select select-bordered"
                                    value={filters.wardNumber}
                                    onChange={(e) => handleFilterChange('wardNumber', e.target.value)}
                                >
                                    <option value="">All Wards</option>
                                    {[...Array(13)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            Ward {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {activeTab === 'children' && (
                                <>
                                    <div className="form-control">
                                        <select
                                            className="select select-bordered"
                                            value={filters.gender}
                                            onChange={(e) => handleFilterChange('gender', e.target.value)}
                                        >
                                            <option value="">All Genders</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <select
                                            className="select select-bordered"
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                        >
                                            <option value="">All Status</option>
                                            <option value="complete">Complete</option>
                                            <option value="incomplete">Incomplete</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">
                                    Showing {sortedData.length} of {activeTab === 'children' ? analytics.children.total : analytics.mothers.total} records
                                    {sortedData.length !== (activeTab === 'children' ? analytics.children.total : analytics.mothers.total) &&
                                        ` (${((sortedData.length / (activeTab === 'children' ? analytics.children.total : analytics.mothers.total)) * 100).toFixed(1)}%)`}
                                </span>
                                {(filters.searchTerm || filters.wardNumber || filters.gender || filters.status) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="btn btn-xs btn-ghost text-error gap-1"
                                    >
                                        <FaTimes />
                                        Clear Filters
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-sm gap-2">
                                        <FaFilter />
                                        View Mode
                                    </div>
                                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li>
                                            <button onClick={() => setViewMode('cards')} className={viewMode === 'cards' ? 'active' : ''}>
                                                <FaList />
                                                Cards View
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'active' : ''}>
                                                <FaTable />
                                                Table View
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <select
                                    className="select select-bordered select-sm"
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="10">10 per page</option>
                                    <option value="25">25 per page</option>
                                    <option value="50">50 per page</option>
                                    <option value="100">100 per page</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="mt-4">Loading records...</p>
                    </div>
                ) : (
                    <>
                        {/* Content based on view mode */}
                        {viewMode === 'table' ? (
                            renderTableView()
                        ) : (
                            renderCardView()
                        )}

                        {/* Pagination */}
                        {sortedData.length > 0 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 p-4 bg-base-100 rounded-lg shadow">
                                <div className="text-sm">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} records
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <FaArrowLeft />
                                        Previous
                                    </button>

                                    <div className="join">
                                        {Array.from({ length: Math.min(5, Math.ceil(sortedData.length / itemsPerPage)) }, (_, i) => {
                                            let pageNum;
                                            const totalPages = Math.ceil(sortedData.length / itemsPerPage);

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
                                                    className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-active btn-primary' : ''}`}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        className="btn btn-sm"
                                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(sortedData.length / itemsPerPage), p + 1))}
                                        disabled={currentPage >= Math.ceil(sortedData.length / itemsPerPage)}
                                    >
                                        Next
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default RecordsSearchDashboard;