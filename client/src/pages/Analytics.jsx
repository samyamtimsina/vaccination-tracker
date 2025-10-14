import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    Activity, Users, TrendingUp, AlertTriangle, Calendar,
    Award, Filter, Download, RefreshCw, Baby, UserCheck,
    MessageSquare, Clock, Target, Droplets, MapPin, CheckCircle2,
    XCircle, AlertCircle, Heart, Globe, Shield, Stethoscope,
    Scale, BarChart3, Eye
} from 'lucide-react';

// API Base URL
const API_BASE = '/api/analytics';

// PERFORMANCE: Safety cap for rendering large datasets
const safeData = (data, maxItems = 100) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.slice(0, maxItems);
    if (typeof data === 'object') {
        const entries = Object.entries(data);
        return entries.slice(0, maxItems);
    }
    return data;
};

const AnalyticsDashboard = () => {
    // State for filters
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        ward: '',
        vaccine: '',
        interval: 'month'
    });

    // PERFORMANCE: Lazy-loaded data per tab (only fetch when tab is active)
    const [data, setData] = useState({
        systemOverview: null,
        vaccineCoverage: null,
        zeroDoseChildren: null,
        dropoutRates: null,
        vaccinationTimeliness: null,
        weightCoverage: null,
        growthTrajectories: null,
        growthFaltering: null,
        tdCompletion: null,
        motherChildLinkage: null,
        defaulterTracking: null,
        cohortAnalysis: null,
        yearlyTrends: null,
        dataCompleteness: null,
        defaultRiskPrediction: null
    });

    const [loading, setLoading] = useState({});
    const [lastUpdated, setLastUpdated] = useState({});
    const [activeTab, setActiveTab] = useState('overview');

    // PERFORMANCE: Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50
    });

    // Replace fetchData in Analytics.jsx
    const fetchData = async (endpoint, key, params = {}) => {
        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            const queryParams = {
                ...filters,
                ...params,
                page: pagination.page,
                limit: pagination.limit
            };
            const queryString = Object.entries(queryParams)
                .filter(([_, v]) => v !== '' && v !== null && v !== undefined)
                .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
                .join('&');

            const url = `${API_BASE}${endpoint}${queryString ? '?' + queryString : ''}`;
            const response = await axios.get(url);

            setData(prev => ({ ...prev, [key]: response.data.data }));
            setLastUpdated(prev => ({ ...prev, [key]: new Date().toLocaleString() }));
        } catch (error) {
            console.error(`Error fetching ${key}:`, error);
            setData(prev => ({ ...prev, [key]: null }));
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };


    // PERFORMANCE: Lazy load - only fetch data when tab becomes active
    useEffect(() => {
        if (!data[getTabDataKey(activeTab)]) {
            handleApplyFilters();
        }
    }, [activeTab]);

    // Helper to get data key for active tab
    const getTabDataKey = (tab) => {
        const tabDataMap = {
            'overview': 'systemOverview',
            'vaccination': 'vaccineCoverage',
            'growth': 'weightCoverage',
            'maternal': 'tdCompletion',
            'advanced': 'defaultRiskPrediction'
        };
        return tabDataMap[tab] || 'systemOverview';
    };

    const fetchOverviewData = () => {
        fetchData('/system-overview', 'systemOverview');
        fetchData('/vaccine-coverage', 'vaccineCoverage');
        fetchData('/zero-dose-children', 'zeroDoseChildren');
        fetchData('/td-completion', 'tdCompletion');
    };

    const fetchVaccinationData = () => {
        fetchData('/vaccine-coverage', 'vaccineCoverage');
        fetchData('/dropout-rates', 'dropoutRates');
        fetchData('/vaccination-timeliness', 'vaccinationTimeliness');
    };

    const fetchGrowthData = () => {
        fetchData('/weight-coverage', 'weightCoverage');
        fetchData('/growth-trajectories', 'growthTrajectories');
        fetchData('/growth-faltering', 'growthFaltering');
    };

    const fetchMaternalData = () => {
        fetchData('/td-completion', 'tdCompletion');
        fetchData('/mother-child-linkage', 'motherChildLinkage');
    };

    const fetchAdvancedData = () => {
        fetchData('/defaulter-tracking', 'defaulterTracking');
        fetchData('/cohort-analysis', 'cohortAnalysis');
        fetchData('/yearly-trends', 'yearlyTrends');
        fetchData('/data-completeness', 'dataCompleteness');
        fetchData('/default-risk-prediction', 'defaultRiskPrediction');
    };

    const handleApplyFilters = () => {
        // PERFORMANCE: Only fetch data for active tab, not all tabs at once
        switch (activeTab) {
            case 'overview':
                fetchOverviewData();
                break;
            case 'vaccination':
                fetchVaccinationData();
                break;
            case 'growth':
                fetchGrowthData();
                break;
            case 'maternal':
                fetchMaternalData();
                break;
            case 'advanced':
                fetchAdvancedData();
                break;
            default:
                fetchOverviewData();
        }
    };

    const handleResetFilters = () => {
        setFilters({ startDate: '', endDate: '', ward: '', vaccine: '', interval: 'month' });
        setPagination({ page: 1, limit: 50 });
    };

    // Chart colors
    const COLORS = {
        primary: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'],
        gender: { male: '#3b82f6', female: '#ec4899', other: '#8b5cf6' },
        status: {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#10b981',
            critical: '#dc2626',
            safe: '#16a34a'
        },
        vaccine: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#84cc16']
    };

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-4 bg-base-300 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-base-300 rounded"></div>
        </div>
    );

    // Empty state
    const EmptyState = ({ message = "No data available" }) => (
        <div className="flex flex-col items-center justify-center py-12 text-base-content/60">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p>{message}</p>
        </div>
    );

    // Card wrapper component
    const DashboardCard = ({ title, icon: Icon, children, onRefresh, lastUpdate, className = '' }) => (
        <div className={`card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-5 h-5 text-primary" />}
                        <h3 className="card-title text-lg">{title}</h3>
                    </div>
                    {onRefresh && (
                        <button onClick={onRefresh} className="btn btn-ghost btn-sm btn-circle">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {children}
                {lastUpdate && (
                    <div className="text-xs text-base-content/50 mt-2">
                        Last updated: {lastUpdate}
                    </div>
                )}
            </div>
        </div>
    );

    // Tab navigation
    const tabs = [
        { id: 'overview', name: 'Overview', icon: Activity },
        { id: 'vaccination', name: 'Vaccination', icon: Shield },
        { id: 'growth', name: 'Growth', icon: Scale },
        { id: 'maternal', name: 'Maternal', icon: Heart },
        { id: 'advanced', name: 'Advanced', icon: BarChart3 }
    ];

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Activity className="w-8 h-8 text-primary" />
                    Vaccination Analytics Dashboard
                </h1>
                <p className="text-base-content/70">Comprehensive public health vaccination data insights</p>
            </div>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed bg-base-100 p-1 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab tab-lg flex items-center gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Filter Panel */}
            <div className="card bg-base-100 shadow-lg mb-6">
                <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-primary" />
                        <h2 className="card-title">Filters</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Start Date</span></label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">End Date</span></label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Ward</span></label>
                            <select
                                className="select select-bordered"
                                value={filters.ward}
                                onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
                            >
                                <option value="">All Wards</option>
                                {[...Array(15)].map((_, i) => (
                                    <option key={i} value={i + 1}>Ward {i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Vaccine Type</span></label>
                            <select
                                className="select select-bordered"
                                value={filters.vaccine}
                                onChange={(e) => setFilters({ ...filters, vaccine: e.target.value })}
                            >
                                <option value="">All Vaccines</option>
                                <option value="BCG">BCG</option>
                                <option value="OPV">OPV</option>
                                <option value="DPT">DPT</option>
                                <option value="Measles">Measles</option>
                                <option value="Hepatitis B">Hepatitis B</option>
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Interval</span></label>
                            <select
                                className="select select-bordered"
                                value={filters.interval}
                                onChange={(e) => setFilters({ ...filters, interval: e.target.value })}
                            >
                                <option value="month">Monthly</option>
                                <option value="quarter">Quarterly</option>
                                <option value="year">Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleApplyFilters} className="btn btn-primary">
                            Apply Filters
                        </button>
                        <button onClick={handleResetFilters} className="btn btn-ghost">
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* System Overview */}
                    <DashboardCard
                        title="System Overview"
                        icon={Activity}
                        lastUpdate={lastUpdated.systemOverview}
                        onRefresh={() => fetchData('/system-overview', 'systemOverview')}
                        className="xl:col-span-3"
                    >
                        {loading.systemOverview ? <LoadingSkeleton /> : !data.systemOverview ? (
                            <EmptyState />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="stat bg-primary/10 rounded-lg">
                                    <div className="stat-figure text-primary">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Total Children</div>
                                    <div className="stat-value text-primary text-2xl">
                                        {data.systemOverview.overview?.totalChildren || 0}
                                    </div>
                                </div>
                                <div className="stat bg-success/10 rounded-lg">
                                    <div className="stat-figure text-success">
                                        <UserCheck className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Total Mothers</div>
                                    <div className="stat-value text-success text-2xl">
                                        {data.systemOverview.overview?.totalMothers || 0}
                                    </div>
                                </div>
                                <div className="stat bg-warning/10 rounded-lg">
                                    <div className="stat-figure text-warning">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Vaccinations (30d)</div>
                                    <div className="stat-value text-warning text-2xl">
                                        {data.systemOverview.overview?.recentActivity?.vaccinationsLast30Days || 0}
                                    </div>
                                    <div className="stat-desc">
                                        {data.systemOverview.overview?.recentActivity?.vaccinationCoverage || '0%'} coverage
                                    </div>
                                </div>
                                <div className="stat bg-info/10 rounded-lg">
                                    <div className="stat-figure text-info">
                                        <Stethoscope className="w-8 h-8" />
                                    </div>
                                    <div className="stat-title">Active Workers</div>
                                    <div className="stat-value text-info text-2xl">
                                        {data.systemOverview.overview?.activeUsers || 0}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DashboardCard>

                    {/* Vaccine Coverage */}
                    <DashboardCard
                        title="Vaccine Coverage"
                        icon={Shield}
                        lastUpdate={lastUpdated.vaccineCoverage}
                        onRefresh={() => fetchData('/vaccine-coverage', 'vaccineCoverage')}
                        className="xl:col-span-2"
                    >
                        {loading.vaccineCoverage ? <LoadingSkeleton /> : !data.vaccineCoverage ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-base-content/70">Coverage by vaccine type</p>
                                    <div className="badge badge-primary">
                                        {data.vaccineCoverage.totalEligibleChildren || 0} eligible children
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={safeData(
                                        Object.entries(data.vaccineCoverage.vaccineCoverage || {}).map(([vaccine, stats]) => ({
                                            vaccine,
                                            coverage: Object.values(stats.doses || {}).reduce((max, dose) =>
                                                Math.max(max, parseFloat(dose.coverage || 0)), 0)
                                        })), 10
                                    )}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                        <XAxis dataKey="vaccine" stroke="currentColor" opacity={0.5} />
                                        <YAxis stroke="currentColor" opacity={0.5} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--bc) / 0.2)' }}
                                        />
                                        <Bar dataKey="coverage" fill="#3b82f6" name="Coverage %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </DashboardCard>

                    {/* Zero Dose Children */}
                    <DashboardCard
                        title="Zero Dose Children"
                        icon={AlertTriangle}
                        lastUpdate={lastUpdated.zeroDoseChildren}
                        onRefresh={() => fetchData('/zero-dose-children', 'zeroDoseChildren')}
                    >
                        {loading.zeroDoseChildren ? <LoadingSkeleton /> : !data.zeroDoseChildren ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="text-center py-4">
                                    <div className="radial-progress text-warning"
                                        style={{ "--value": parseFloat(data.zeroDoseChildren.zeroDosePercentage || 0), "--size": "8rem", "--thickness": "8px" }}>
                                        <span className="text-2xl font-bold">{data.zeroDoseChildren.zeroDosePercentage || 0}%</span>
                                    </div>
                                    <p className="text-sm text-base-content/70 mt-2">Zero-dose children</p>
                                </div>
                                <div className="stats stats-vertical shadow w-full">
                                    <div className="stat">
                                        <div className="stat-title">Total Children</div>
                                        <div className="stat-value text-2xl">{data.zeroDoseChildren.totalChildren || 0}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Vaccinated</div>
                                        <div className="stat-value text-success text-xl">{data.zeroDoseChildren.vaccinatedChildren || 0}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Zero Dose</div>
                                        <div className="stat-value text-warning text-xl">{data.zeroDoseChildren.zeroDoseChildren || 0}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* TD Completion */}
                    <DashboardCard
                        title="TD Vaccine Completion"
                        icon={Heart}
                        lastUpdate={lastUpdated.tdCompletion}
                        onRefresh={() => fetchData('/td-completion', 'tdCompletion')}
                        className="xl:col-span-2"
                    >
                        {loading.tdCompletion ? <LoadingSkeleton /> : !data.tdCompletion ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">
                                            {data.tdCompletion.completionRates?.atLeastOneDose || 0}%
                                        </div>
                                        <div className="text-sm text-base-content/70">1+ Dose</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-success">
                                            {data.tdCompletion.completionRates?.twoDoses || 0}%
                                        </div>
                                        <div className="text-sm text-base-content/70">2 Doses</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-info">
                                            {data.tdCompletion.completionRates?.boosters || 0}%
                                        </div>
                                        <div className="text-sm text-base-content/70">Boosters</div>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={[
                                        { name: 'Dose 1', value: data.tdCompletion.doseDistribution?.dose1 || 0 },
                                        { name: 'Dose 2', value: data.tdCompletion.doseDistribution?.dose2 || 0 },
                                        { name: 'Booster', value: data.tdCompletion.doseDistribution?.booster || 0 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                        <XAxis dataKey="name" stroke="currentColor" opacity={0.5} />
                                        <YAxis stroke="currentColor" opacity={0.5} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--bc) / 0.2)' }}
                                        />
                                        <Bar dataKey="value" fill="#ec4899" name="Doses Administered" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </DashboardCard>
                </div>
            )}

            {/* VACCINATION TAB */}
            {activeTab === 'vaccination' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Vaccine Coverage Details */}
                    <DashboardCard
                        title="Vaccine Coverage Details"
                        icon={Shield}
                        lastUpdate={lastUpdated.vaccineCoverage}
                        onRefresh={() => fetchData('/vaccine-coverage', 'vaccineCoverage')}
                        className="xl:col-span-2"
                    >
                        {loading.vaccineCoverage ? <LoadingSkeleton /> : !data.vaccineCoverage ? (
                            <EmptyState />
                        ) : (
                            <div className="overflow-x-auto max-h-96">
                                <table className="table table-xs table-pin-rows">
                                    <thead>
                                        <tr>
                                            <th>Vaccine</th>
                                            <th>Doses</th>
                                            <th>Coverage</th>
                                            <th>Dropout</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {safeData(Object.entries(data.vaccineCoverage.vaccineCoverage || {}), 20).map(([vaccine, stats]) => (
                                            <tr key={vaccine}>
                                                <td className="font-bold">{vaccine}</td>
                                                <td>{Object.keys(stats.doses || {}).length}</td>
                                                <td>
                                                    <span className="badge badge-primary">
                                                        {Math.max(...Object.values(stats.doses || {}).map(d => parseFloat(d.coverage || 0)))}%
                                                    </span>
                                                </td>
                                                <td>
                                                    {stats.dropoutRates && stats.dropoutRates.length > 0 ? (
                                                        <span className="badge badge-warning">
                                                            {stats.dropoutRates[stats.dropoutRates.length - 1].dropoutRate}
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-success">0%</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </DashboardCard>

                    {/* Dropout Rates */}
                    <DashboardCard
                        title="Dropout Rates"
                        icon={TrendingUp}
                        lastUpdate={lastUpdated.dropoutRates}
                        onRefresh={() => fetchData('/dropout-rates', 'dropoutRates')}
                    >
                        {loading.dropoutRates ? <LoadingSkeleton /> : !data.dropoutRates ? (
                            <EmptyState />
                        ) : (
                            <div className="overflow-x-auto max-h-80">
                                <table className="table table-xs">
                                    <thead>
                                        <tr>
                                            <th>Vaccine</th>
                                            <th>From → To</th>
                                            <th>Dropout</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {safeData(
                                            Object.entries(data.dropoutRates || {}).flatMap(([vaccine, stats]) =>
                                                (stats.dropoutRates || []).map((dropout, idx) => ({
                                                    key: `${vaccine}-${idx}`,
                                                    vaccine,
                                                    dropout
                                                }))
                                            ), 30
                                        ).map(item => (
                                            <tr key={item.key}>
                                                <td className="font-medium">{item.vaccine}</td>
                                                <td>Dose {item.dropout.fromDose} → {item.dropout.toDose}</td>
                                                <td>
                                                    <span className={`badge ${parseFloat(item.dropout.dropoutRate) > 10 ? 'badge-error' : 'badge-success'}`}>
                                                        {item.dropout.dropoutRate}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </DashboardCard>

                    {/* Vaccination Timeliness */}
                    <DashboardCard
                        title="Vaccination Timeliness"
                        icon={Clock}
                        lastUpdate={lastUpdated.vaccinationTimeliness}
                        onRefresh={() => fetchData('/vaccination-timeliness', 'vaccinationTimeliness')}
                        className="xl:col-span-3"
                    >
                        {loading.vaccinationTimeliness ? <LoadingSkeleton /> : !data.vaccinationTimeliness ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="stat bg-success/10 rounded-lg">
                                        <div className="stat-title">On Time</div>
                                        <div className="stat-value text-success text-2xl">
                                            {data.vaccinationTimeliness.onTimePercentage || 0}%
                                        </div>
                                        <div className="stat-desc">{data.vaccinationTimeliness.onTime || 0} vaccines</div>
                                    </div>
                                    <div className="stat bg-warning/10 rounded-lg">
                                        <div className="stat-title">Late</div>
                                        <div className="stat-value text-warning text-2xl">
                                            {data.vaccinationTimeliness.latePercentage || 0}%
                                        </div>
                                        <div className="stat-desc">{data.vaccinationTimeliness.late || 0} vaccines</div>
                                    </div>
                                    <div className="stat bg-error/10 rounded-lg">
                                        <div className="stat-title">Missed</div>
                                        <div className="stat-value text-error text-2xl">
                                            {data.vaccinationTimeliness.missedPercentage || 0}%
                                        </div>
                                        <div className="stat-desc">{data.vaccinationTimeliness.missed || 0} vaccines</div>
                                    </div>
                                    <div className="stat bg-info/10 rounded-lg">
                                        <div className="stat-title">Total</div>
                                        <div className="stat-value text-info text-2xl">
                                            {data.vaccinationTimeliness.total || 0}
                                        </div>
                                        <div className="stat-desc">Due vaccines</div>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={safeData(
                                        Object.entries(data.vaccinationTimeliness.byVaccine || {}).map(([vaccine, stats]) => ({
                                            vaccine,
                                            onTime: stats.onTime || 0,
                                            late: stats.late || 0,
                                            missed: stats.missed || 0
                                        })), 10
                                    )}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                        <XAxis dataKey="vaccine" stroke="currentColor" opacity={0.5} />
                                        <YAxis stroke="currentColor" opacity={0.5} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--bc) / 0.2)' }}
                                        />
                                        <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
                                        <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                                        <Bar dataKey="missed" stackId="a" fill="#ef4444" name="Missed" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </DashboardCard>
                </div>
            )}

            {/* GROWTH TAB */}
            {activeTab === 'growth' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Weight Coverage */}
                    <DashboardCard
                        title="Weight Monitoring Coverage"
                        icon={Scale}
                        lastUpdate={lastUpdated.weightCoverage}
                        onRefresh={() => fetchData('/weight-coverage', 'weightCoverage')}
                    >
                        {loading.weightCoverage ? <LoadingSkeleton /> : !data.weightCoverage ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="text-center py-4">
                                    <div className="radial-progress text-primary"
                                        style={{ "--value": parseFloat(data.weightCoverage.overallCoverage || 0), "--size": "8rem", "--thickness": "8px" }}>
                                        <span className="text-2xl font-bold">{data.weightCoverage.overallCoverage || 0}%</span>
                                    </div>
                                    <p className="text-sm text-base-content/70 mt-2">Overall coverage</p>
                                </div>
                                <div className="stats stats-vertical shadow w-full">
                                    <div className="stat">
                                        <div className="stat-title">Total Children</div>
                                        <div className="stat-value text-2xl">{data.weightCoverage.totalChildren || 0}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Measured</div>
                                        <div className="stat-value text-success text-xl">{data.weightCoverage.totalMeasured || 0}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Period</div>
                                        <div className="stat-value text-info text-lg">{data.weightCoverage.period || 'N/A'}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* Growth Faltering */}
                    <DashboardCard
                        title="Growth Faltering Detection"
                        icon={AlertTriangle}
                        lastUpdate={lastUpdated.growthFaltering}
                        onRefresh={() => fetchData('/growth-faltering', 'growthFaltering')}
                    >
                        {loading.growthFaltering ? <LoadingSkeleton /> : !data.growthFaltering ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="text-center py-4">
                                    <div className="radial-progress text-warning"
                                        style={{ "--value": parseFloat(data.growthFaltering.falteringPercentage || 0), "--size": "8rem", "--thickness": "8px" }}>
                                        <span className="text-2xl font-bold">{data.growthFaltering.falteringPercentage || 0}%</span>
                                    </div>
                                    <p className="text-sm text-base-content/70 mt-2">Children with growth concerns</p>
                                </div>
                                <div className="stats stats-vertical shadow w-full">
                                    <div className="stat">
                                        <div className="stat-title">Analyzed</div>
                                        <div className="stat-value text-2xl">{data.growthFaltering.totalChildrenAnalyzed || 0}</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">At Risk</div>
                                        <div className="stat-value text-warning text-xl">{data.growthFaltering.falteringChildrenCount || 0}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* Growth Trajectories */}
                    <DashboardCard
                        title="Growth Trajectories"
                        icon={TrendingUp}
                        lastUpdate={lastUpdated.growthTrajectories}
                        onRefresh={() => fetchData('/growth-trajectories', 'growthTrajectories')}
                        className="xl:col-span-3"
                    >
                        {loading.growthTrajectories ? <LoadingSkeleton /> : !data.growthTrajectories ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="stat bg-primary/10 rounded-lg">
                                        <div className="stat-title">Children Tracked</div>
                                        <div className="stat-value text-primary text-2xl">
                                            {data.growthTrajectories.totalChildrenTracked || 0}
                                        </div>
                                    </div>
                                    <div className="stat bg-success/10 rounded-lg">
                                        <div className="stat-title">Weight Records</div>
                                        <div className="stat-value text-success text-2xl">
                                            {data.growthTrajectories.totalWeightRecords || 0}
                                        </div>
                                    </div>
                                    <div className="stat bg-info/10 rounded-lg">
                                        <div className="stat-title">Avg Weight</div>
                                        <div className="stat-value text-info text-xl">
                                            {data.growthTrajectories.cohortAverages?.['0-6 months']?.averageWeight || 0} kg
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </DashboardCard>
                </div>
            )}

            {/* MATERNAL TAB */}
            {activeTab === 'maternal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Mother-Child Linkage */}
                    <DashboardCard
                        title="Mother-Child Linkage"
                        icon={Heart}
                        lastUpdate={lastUpdated.motherChildLinkage}
                        onRefresh={() => fetchData('/mother-child-linkage', 'motherChildLinkage')}
                        className="xl:col-span-2"
                    >
                        {loading.motherChildLinkage ? <LoadingSkeleton /> : !data.motherChildLinkage ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="stat bg-primary/10 rounded-lg">
                                        <div className="stat-title">Total Mothers</div>
                                        <div className="stat-value text-primary text-2xl">
                                            {data.motherChildLinkage.totalMothers || 0}
                                        </div>
                                    </div>
                                    <div className="stat bg-success/10 rounded-lg">
                                        <div className="stat-title">With TD Vaccines</div>
                                        <div className="stat-value text-success text-2xl">
                                            {data.motherChildLinkage.tdImpactAnalysis?.withTD?.mothers || 0}
                                        </div>
                                        <div className="stat-desc">
                                            {data.motherChildLinkage.tdImpactAnalysis?.withTD?.vaccinationRate || 0}% child vaccination rate
                                        </div>
                                    </div>
                                </div>
                                <div className="alert alert-info">
                                    <div className="flex items-start gap-2">
                                        <Eye className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <div className="font-semibold">TD Impact Analysis</div>
                                            <div>
                                                Mothers with TD: {data.motherChildLinkage.tdImpactAnalysis?.withTD?.mothers || 0} |
                                                Child vaccination rate: {data.motherChildLinkage.tdImpactAnalysis?.withTD?.vaccinationRate || 0}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* TD Completion Details */}
                    <DashboardCard
                        title="TD Completion Details"
                        icon={UserCheck}
                        lastUpdate={lastUpdated.tdCompletion}
                        onRefresh={() => fetchData('/td-completion', 'tdCompletion')}
                    >
                        {loading.tdCompletion ? <LoadingSkeleton /> : !data.tdCompletion ? (
                            <EmptyState />
                        ) : (
                            <div className="overflow-x-auto max-h-80">
                                <table className="table table-xs">
                                    <thead>
                                        <tr>
                                            <th>Age Group</th>
                                            <th>Coverage</th>
                                            <th>Vaccinated</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {safeData(Object.entries(data.tdCompletion.ageGroupAnalysis || {}), 10).map(([ageGroup, stats]) => (
                                            <tr key={ageGroup}>
                                                <td>{ageGroup}</td>
                                                <td>
                                                    <span className="badge badge-primary">{stats.coverage || 0}%</span>
                                                </td>
                                                <td>{stats.vaccinated || 0}</td>
                                                <td>{stats.total || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </DashboardCard>
                </div>
            )}

            {/* ADVANCED TAB */}
            {activeTab === 'advanced' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Default Risk Prediction */}
                    <DashboardCard
                        title="Default Risk Prediction"
                        icon={AlertTriangle}
                        lastUpdate={lastUpdated.defaultRiskPrediction}
                        onRefresh={() => fetchData('/default-risk-prediction', 'defaultRiskPrediction')}
                        className="xl:col-span-2"
                    >
                        {loading.defaultRiskPrediction ? <LoadingSkeleton /> : !data.defaultRiskPrediction ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="stat bg-error/10 rounded-lg">
                                        <div className="stat-title">High Risk</div>
                                        <div className="stat-value text-error text-2xl">
                                            {data.defaultRiskPrediction.statistics?.highRisk || 0}
                                        </div>
                                    </div>
                                    <div className="stat bg-warning/10 rounded-lg">
                                        <div className="stat-title">Medium Risk</div>
                                        <div className="stat-value text-warning text-2xl">
                                            {data.defaultRiskPrediction.statistics?.mediumRisk || 0}
                                        </div>
                                    </div>
                                    <div className="stat bg-success/10 rounded-lg">
                                        <div className="stat-title">Low Risk</div>
                                        <div className="stat-value text-success text-2xl">
                                            {data.defaultRiskPrediction.statistics?.lowRisk || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto max-h-80">
                                    <table className="table table-xs table-pin-rows">
                                        <thead>
                                            <tr>
                                                <th>Child</th>
                                                <th>Vaccine Due</th>
                                                <th>Days Until</th>
                                                <th>Risk Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safeData(data.defaultRiskPrediction.atRiskChildren || [], 50).map((child, idx) => (
                                                <tr key={idx} className={
                                                    child.riskAssessment?.level === 'high' ? 'bg-error/10' :
                                                        child.riskAssessment?.level === 'medium' ? 'bg-warning/10' : ''
                                                }>
                                                    <td className="font-medium">{child.child?.name || 'N/A'}</td>
                                                    <td>{child.dueVaccine?.vaccine || 'N/A'} (Dose {child.dueVaccine?.doseNumber || 0})</td>
                                                    <td>{child.dueVaccine?.daysUntilDue || 0}</td>
                                                    <td>
                                                        <span className={`badge ${child.riskAssessment?.level === 'high' ? 'badge-error' :
                                                            child.riskAssessment?.level === 'medium' ? 'badge-warning' : 'badge-success'
                                                            }`}>
                                                            {child.riskAssessment?.level || 'low'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* Data Completeness */}
                    <DashboardCard
                        title="Data Quality Score"
                        icon={Award}
                        lastUpdate={lastUpdated.dataCompleteness}
                        onRefresh={() => fetchData('/data-completeness', 'dataCompleteness')}
                    >
                        {loading.dataCompleteness ? <LoadingSkeleton /> : !data.dataCompleteness ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="text-center py-4">
                                    <div className="radial-progress text-primary"
                                        style={{ "--value": parseFloat(data.dataCompleteness.overallQualityScore || 0), "--size": "8rem", "--thickness": "8px" }}>
                                        <span className="text-2xl font-bold">{data.dataCompleteness.overallQualityScore || 0}%</span>
                                    </div>
                                    <p className="text-sm text-base-content/70 mt-2">{data.dataCompleteness.qualityRating || 'N/A'} Quality</p>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {safeData(data.dataCompleteness.recommendations || [], 5).map((rec, idx) => (
                                        <div key={idx} className="alert alert-warning alert-sm">
                                            <div>{rec}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* Defaulter Tracking */}
                    <DashboardCard
                        title="Defaulter Tracking"
                        icon={Clock}
                        lastUpdate={lastUpdated.defaulterTracking}
                        onRefresh={() => fetchData('/defaulter-tracking', 'defaulterTracking')}
                        className="xl:col-span-2"
                    >
                        {loading.defaulterTracking ? <LoadingSkeleton /> : !data.defaulterTracking ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="stat bg-warning/10 rounded-lg">
                                        <div className="stat-title">Total Defaulters</div>
                                        <div className="stat-value text-warning text-2xl">
                                            {data.defaulterTracking.statistics?.totalDefaulters || 0}
                                        </div>
                                    </div>
                                    <div className="stat bg-error/10 rounded-lg">
                                        <div className="stat-title">Overdue Vaccines</div>
                                        <div className="stat-value text-error text-2xl">
                                            {data.defaulterTracking.statistics?.totalOverdueVaccines || 0}
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto max-h-80">
                                    <table className="table table-xs table-pin-rows">
                                        <thead>
                                            <tr>
                                                <th>Child</th>
                                                <th>Parent</th>
                                                <th>Phone</th>
                                                <th>Overdue Vaccines</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {safeData(data.defaulterTracking.defaulters || [], 50).map((defaulter, idx) => (
                                                <tr key={idx}>
                                                    <td className="font-medium">{defaulter.child?.fullName || 'N/A'}</td>
                                                    <td>{defaulter.child?.parentName || 'N/A'}</td>
                                                    <td>{defaulter.child?.phoneNumber || 'N/A'}</td>
                                                    <td>
                                                        <span className="badge badge-error">
                                                            {defaulter.totalOverdue || 0}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* Cohort Analysis */}
                    <DashboardCard
                        title="Cohort Analysis"
                        icon={Users}
                        lastUpdate={lastUpdated.cohortAnalysis}
                        onRefresh={() => fetchData('/cohort-analysis', 'cohortAnalysis')}
                    >
                        {loading.cohortAnalysis ? <LoadingSkeleton /> : !data.cohortAnalysis ? (
                            <EmptyState />
                        ) : (
                            <>
                                <div className="stats stats-vertical shadow w-full">
                                    <div className="stat">
                                        <div className="stat-title">Cohort Year</div>
                                        <div className="stat-value text-primary text-2xl">
                                            {data.cohortAnalysis.cohortYear || new Date().getFullYear()}
                                        </div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Total Children</div>
                                        <div className="stat-value text-2xl">
                                            {data.cohortAnalysis.totalChildren || 0}
                                        </div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Fully Vaccinated</div>
                                        <div className="stat-value text-success text-xl">
                                            {data.cohortAnalysis.vaccinationMetrics?.fullyVaccinated || 0}
                                        </div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Avg Vaccines/Child</div>
                                        <div className="stat-value text-info text-xl">
                                            {data.cohortAnalysis.vaccinationMetrics?.averageVaccinesPerChild || 0}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </DashboardCard>

                    {/* Yearly Trends */}
                    <DashboardCard
                        title="Yearly Trends"
                        icon={TrendingUp}
                        lastUpdate={lastUpdated.yearlyTrends}
                        onRefresh={() => fetchData('/yearly-trends', 'yearlyTrends')}
                        className="xl:col-span-2"
                    >
                        {loading.yearlyTrends ? <LoadingSkeleton /> : !data.yearlyTrends ? (
                            <EmptyState />
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={safeData(data.yearlyTrends.data?.vaccinationRate || [], 10)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                        <XAxis dataKey="year" stroke="currentColor" opacity={0.5} />
                                        <YAxis stroke="currentColor" opacity={0.5} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--bc) / 0.2)' }}
                                        />
                                        <Line type="monotone" dataKey="rate" stroke="#3b82f6" name="Vaccination Rate %" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </DashboardCard>
                </div>
            )}

            {/* Quick Actions Footer */}
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                    className="btn btn-outline gap-2"
                    onClick={() => {
                        // PERFORMANCE: Only refresh current tab data
                        switch (activeTab) {
                            case 'overview': fetchOverviewData(); break;
                            case 'vaccination': fetchVaccinationData(); break;
                            case 'growth': fetchGrowthData(); break;
                            case 'maternal': fetchMaternalData(); break;
                            case 'advanced': fetchAdvancedData(); break;
                            default: fetchOverviewData();
                        }
                    }}
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                </button>
                <button className="btn btn-outline gap-2" onClick={() => alert('Export functionality - Integrate with your backend')}>
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Pagination Controls (if applicable) */}
            {data[getTabDataKey(activeTab)]?.pagination && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        className="btn btn-sm"
                        disabled={pagination.page === 1}
                        onClick={() => {
                            setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }));
                            // fetch only current tab
                            handleApplyFilters();
                        }}
                    >
                        Previous
                    </button>
                    <div className="btn btn-sm btn-disabled">
                        Page {pagination.page}
                    </div>
                    <button
                        className="btn btn-sm"
                        onClick={() => {
                            setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                            handleApplyFilters();
                        }}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Footer Info */}
            <div className="mt-6 text-center text-sm text-base-content/60">
                <p>Vaccination Management System Analytics Dashboard</p>
                <p className="mt-1">Data updates in real-time based on backend records</p>
                <p className="mt-1 text-xs">
                    ⚡ Optimized for millions of records with lazy loading and pagination
                </p>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;