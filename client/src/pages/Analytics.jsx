import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { format, subDays } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
    AreaChart, Area
} from 'recharts';
import { debounce } from 'lodash';

const wards = Array.from({ length: 20 }, (_, i) => i + 1);
const genders = ['ALL', 'MALE', 'FEMALE'];
const ageGroups = ['ALL', '0-1y', '1-5y', '5y+'];
const casteCodes = Array.from({ length: 10 }, (_, i) => i + 1);
const granularities = ['day', 'week', 'month'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E74C3C'];

const safeFixed = (v, n = 2) => (typeof v === 'number' && isFinite(v) ? v.toFixed(n) : (v || 0));

const AnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [compareMode, setCompareMode] = useState(false);

    const [filters, setFilters] = useState({
        ward: '',
        casteCode: '',
        gender: '',
        ageGroup: '',
        startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        groupBy: '',
        granularity: 'day',
        breakdown: 'gender',
        compareStartDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
        compareEndDate: format(subDays(new Date(), 31), 'yyyy-MM-dd'),
        limit: '10',
        sortBy: 'coverage'
    });

    const [data, setData] = useState({
        overview: { children: {}, mothers: {}, nutrition: {} },
        coverage: { byVaccine: [], byWard: [] },
        dropout: [],
        zeroDose: {},
        growth: {},
        tdCoverage: [],
        dueOverdue: {},
        trends: { days: [], coverage: [], dropout: [], timeliness: [], nutrition: [] },
        wardPerformance: [],
        disparities: { gender: [], caste: [] },
        comparison: {}
    });

    const [vaccineMap, setVaccineMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);

    // Fetch vaccine schedule
    const fetchVaccineSchedule = useCallback(async () => {
        try {
            const response = await axiosClient.get('/api/vaccine-schedule');
            const schedule = response.data;
            const mapping = {};
            schedule.doses.forEach(dose => {
                if (dose.vaccineType && dose.vaccineType.name) {
                    mapping[dose.vaccineType.id] = dose.vaccineType.name;
                }
            });
            setVaccineMap(mapping);
        } catch (err) {
            console.error('Failed to fetch vaccine schedule:', err);
        }
    }, []);

    const getVaccineName = (vaccineTypeId) => {
        return vaccineMap[vaccineTypeId] || `Vaccine ${vaccineTypeId}`;
    };

    const fetchData = useCallback(async (signal) => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();

            let requests = [];

            // Overview tab data
            if (activeTab === 'overview') {
                requests = [
                    axiosClient.get(`/api/analytics/overview?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/coverage?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/dropout?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/zero-dose?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/growth?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/td-coverage?${query}`, { signal }),
                    axiosClient.get(`/api/analytics/due-overdue?${query}`, { signal })
                ];
            }

            // Trends tab
            else if (activeTab === 'trends') {
                requests = [
                    axiosClient.get(`/api/analytics/trends?${query}`, { signal })
                ];
            }

            // Ward Performance tab
            else if (activeTab === 'ward-performance') {
                requests = [
                    axiosClient.get(`/api/analytics/ward-performance?${query}`, { signal })
                ];
            }

            // Equity tab
            else if (activeTab === 'equity') {
                const genderQuery = new URLSearchParams({ ...filters, breakdown: 'gender' }).toString();
                const casteQuery = new URLSearchParams({ ...filters, breakdown: 'casteCode' }).toString();
                requests = [
                    axiosClient.get(`/api/analytics/disparities?${genderQuery}`, { signal }),
                    axiosClient.get(`/api/analytics/disparities?${casteQuery}`, { signal })
                ];
            }

            // Comparison tab
            else if (activeTab === 'comparison') {
                requests = [
                    axiosClient.get(`/api/analytics/comparison?${query}`, { signal })
                ];
            }

            const results = await Promise.all(requests);

            if (activeTab === 'overview') {
                setData(prev => ({
                    ...prev,
                    overview: results[0].data.data || {},
                    coverage: results[1].data.data || { byVaccine: [], byWard: [] },
                    dropout: results[2].data.data || [],
                    zeroDose: results[3].data.data || {},
                    growth: results[4].data.data || {},
                    tdCoverage: results[5].data.data || [],
                    dueOverdue: results[6].data.data || {}
                }));
            } else if (activeTab === 'trends') {
                setData(prev => ({ ...prev, trends: results[0].data.data || {} }));
            } else if (activeTab === 'ward-performance') {
                setData(prev => ({ ...prev, wardPerformance: results[0].data.data || [] }));
            } else if (activeTab === 'equity') {
                setData(prev => ({
                    ...prev,
                    disparities: {
                        gender: results[0].data.data || [],
                        caste: results[1].data.data || []
                    }
                }));
            } else if (activeTab === 'comparison') {
                setData(prev => ({ ...prev, comparison: results[0].data.data || {} }));
            }

            setLastUpdated(new Date());
        } catch (err) {
            if (err.name !== 'CanceledError') {
                console.error('fetchData error', err);
            }
        } finally {
            setLoading(false);
        }
    }, [filters, activeTab]);

    const debouncedFetch = useMemo(() => {
        const controllerMap = { current: null };
        const debounced = debounce(() => {
            if (controllerMap.current) controllerMap.current.abort();
            controllerMap.current = new AbortController();
            fetchData(controllerMap.current.signal);
        }, 500);
        debounced.cancelController = () => {
            if (controllerMap.current) controllerMap.current.abort();
        };
        return debounced;
    }, [fetchData]);

    useEffect(() => {
        fetchVaccineSchedule();
    }, [fetchVaccineSchedule]);

    useEffect(() => {
        debouncedFetch();
        return () => debouncedFetch.cancelController?.();
    }, [filters, activeTab, debouncedFetch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            ward: '',
            casteCode: '',
            gender: '',
            ageGroup: '',
            startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
            endDate: format(new Date(), 'yyyy-MM-dd'),
            groupBy: '',
            granularity: 'day',
            breakdown: 'gender',
            compareStartDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
            compareEndDate: format(subDays(new Date(), 31), 'yyyy-MM-dd'),
            limit: '10',
            sortBy: 'coverage'
        });
    };

    const handleExport = async (type) => {
        setExportLoading(true);
        try {
            const query = new URLSearchParams({ ...filters, type }).toString();
            const response = await axiosClient.get(`/api/analytics/export?${query}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export error:', err);
            alert('Failed to export data');
        } finally {
            setExportLoading(false);
        }
    };

    const handleRefreshCache = async () => {
        try {
            await axiosClient.post('/api/analytics/refresh-cache');
            alert('Cache refreshed successfully');
            debouncedFetch();
        } catch (err) {
            console.error('Refresh cache error:', err);
            alert('Failed to refresh cache');
        }
    };

    // Chart data preparation
    const coverageChartData = useMemo(() => {
        const vaccines = data.coverage?.byVaccine || [];
        return vaccines
            .filter(v => v.vaccineTypeId !== 0)
            .map(v => ({
                vaccineTypeId: v.vaccineTypeId,
                vaccineName: getVaccineName(v.vaccineTypeId),
                coverage: Number(v.coverage || 0),
                vaccinated: v.vaccinated || 0,
                total: v.total || 0
            }))
            .sort((a, b) => b.coverage - a.coverage);
    }, [data.coverage, vaccineMap]);

    const dropoutChartData = useMemo(() => {
        const dropouts = data.dropout || [];
        return dropouts.map(d => ({
            vaccineTypeId: d.vaccineTypeId,
            vaccineName: getVaccineName(d.vaccineTypeId),
            dropoutRate: Number(d.dropoutRate || 0),
        })).sort((a, b) => b.dropoutRate - a.dropoutRate);
    }, [data.dropout, vaccineMap]);

    const growthPieData = useMemo(() => {
        const nutrition = data.overview?.nutrition || {};
        return [
            { name: 'Underweight', value: nutrition.underweightCount || 0, rate: nutrition.underweightRate || 0 },
            { name: 'Normal', value: nutrition.normalWeightCount || 0, rate: nutrition.normalRate || 0 },
            { name: 'Overweight', value: nutrition.overweightCount || 0, rate: nutrition.overweightRate || 0 }
        ];
    }, [data.overview]);

    const trendsCoverageData = useMemo(() => {
        return data.trends?.coverage || [];
    }, [data.trends]);

    const trendsDropoutData = useMemo(() => {
        return data.trends?.dropout || [];
    }, [data.trends]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow text-sm">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {typeof entry.value === 'number' ? safeFixed(entry.value) : entry.value}
                            {entry.dataKey?.includes('Rate') || entry.dataKey?.includes('coverage') ? '%' : ''}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const ComparisonCard = ({ title, metric, unit = '' }) => {
        if (!data.comparison[metric]) return null;

        const { current, previous, changePct } = data.comparison[metric];
        const isPositive = changePct > 0;
        const isCoverage = metric === 'coverage' || metric === 'timeliness';

        return (
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <h3 className="card-title text-sm">{title}</h3>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-2xl font-bold">{safeFixed(current)}{unit}</div>
                            <div className="text-sm text-gray-500">vs {safeFixed(previous)}{unit}</div>
                        </div>
                        <div className={`text-lg font-semibold ${isPositive && isCoverage ? 'text-success' : !isPositive && isCoverage ? 'text-error' : isPositive ? 'text-error' : 'text-success'}`}>
                            {changePct > 0 ? '↑' : '↓'} {Math.abs(changePct)}%
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">📊 Analytics Dashboard</h1>
                <div className="flex items-center gap-3">
                    {lastUpdated && (
                        <div className="text-sm text-gray-500">
                            Updated: {lastUpdated.toLocaleTimeString()}
                        </div>
                    )}
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={handleRefreshCache}
                    >
                        🔄 Refresh Cache
                    </button>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-sm btn-primary">
                            {exportLoading ? '⏳' : '📥'} Export
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a onClick={() => handleExport('overview')}>Overview</a></li>
                            <li><a onClick={() => handleExport('coverage')}>Coverage</a></li>
                            <li><a onClick={() => handleExport('trends')}>Trends</a></li>
                            <li><a onClick={() => handleExport('ward-performance')}>Ward Performance</a></li>
                            <li><a onClick={() => handleExport('disparities')}>Disparities</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed">
                <button
                    className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📈 Overview
                </button>
                <button
                    className={`tab ${activeTab === 'trends' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('trends')}
                >
                    📊 Trends
                </button>
                <button
                    className={`tab ${activeTab === 'ward-performance' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('ward-performance')}
                >
                    🏆 Ward Performance
                </button>
                <button
                    className={`tab ${activeTab === 'equity' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('equity')}
                >
                    ⚖️ Equity Analysis
                </button>
                <button
                    className={`tab ${activeTab === 'comparison' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('comparison')}
                >
                    🔄 Comparison
                </button>
            </div>

            {/* Filters */}
            <div className="bg-base-200 p-4 rounded-lg">
                <div className="flex flex-wrap gap-4 items-end mb-4">
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">Ward</label>
                        <select className="select select-bordered w-full" name="ward" value={filters.ward} onChange={handleFilterChange}>
                            <option value="">All Wards</option>
                            {wards.map(w => <option key={w} value={w}>Ward {w}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">Caste Code</label>
                        <select className="select select-bordered w-full" name="casteCode" value={filters.casteCode} onChange={handleFilterChange}>
                            <option value="">All Castes</option>
                            {casteCodes.map(c => <option key={c} value={c}>Caste {c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">Gender</label>
                        <select className="select select-bordered w-full" name="gender" value={filters.gender} onChange={handleFilterChange}>
                            <option value="">All Genders</option>
                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">Age Group</label>
                        <select className="select select-bordered w-full" name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange}>
                            <option value="">All Ages</option>
                            {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">Start Date</label>
                        <input type="date" className="input input-bordered w-full" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">End Date</label>
                        <input type="date" className="input input-bordered w-full" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                    </div>

                    {/* Tab-specific filters */}
                    {activeTab === 'trends' && (
                        <div className="flex-1 min-w-[150px]">
                            <label className="label font-semibold">Granularity</label>
                            <select className="select select-bordered w-full" name="granularity" value={filters.granularity} onChange={handleFilterChange}>
                                {granularities.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                            </select>
                        </div>
                    )}

                    {activeTab === 'ward-performance' && (
                        <>
                            <div className="flex-1 min-w-[150px]">
                                <label className="label font-semibold">Sort By</label>
                                <select className="select select-bordered w-full" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                                    <option value="coverage">Coverage</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="dropoutRate">Dropout Rate</option>
                                    <option value="underweightRate">Underweight Rate</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="label font-semibold">Limit</label>
                                <select className="select select-bordered w-full" name="limit" value={filters.limit} onChange={handleFilterChange}>
                                    <option value="5">Top 5</option>
                                    <option value="10">Top 10</option>
                                    <option value="20">Top 20</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeTab === 'comparison' && (
                        <>
                            <div className="flex-1 min-w-[150px]">
                                <label className="label font-semibold">Compare Start</label>
                                <input type="date" className="input input-bordered w-full" name="compareStartDate" value={filters.compareStartDate} onChange={handleFilterChange} />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="label font-semibold">Compare End</label>
                                <input type="date" className="input input-bordered w-full" name="compareEndDate" value={filters.compareEndDate} onChange={handleFilterChange} />
                            </div>
                        </>
                    )}

                    <div className="flex gap-2">
                        <button className="btn btn-primary" onClick={() => debouncedFetch()} disabled={loading}>
                            {loading ? '🔄 Loading...' : '🔍 Apply Filters'}
                        </button>
                        <button className="btn btn-outline" onClick={clearFilters}>
                            🗑️ Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            )}

            {/* Tab Content */}
            {!loading && (
                <>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title">🧒 Children</h2>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Total Registered:</span><span className="font-bold">{data.overview?.children?.totalRegistered?.toLocaleString() ?? 0}</span></div>
                                            <div className="flex justify-between"><span>Vaccinated:</span><span className="font-bold text-success">{data.overview?.children?.vaccinated?.toLocaleString() ?? 0}</span></div>
                                            <div className="flex justify-between"><span>Zero Dose:</span><span className="font-bold text-warning">{data.overview?.children?.zeroDose?.toLocaleString() ?? 0}</span></div>
                                            <div className="flex justify-between"><span>Coverage:</span><span className="font-bold text-info">{safeFixed(data.overview?.children?.coverageRate ?? 0)}%</span></div>
                                            <div className="flex justify-between"><span>Dropout Rate:</span><span className="font-bold text-error">{safeFixed(data.overview?.children?.dropoutRate ?? 0)}%</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title">🤰 Mothers</h2>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Total Registered:</span><span className="font-bold">{data.overview?.mothers?.totalRegistered?.toLocaleString() ?? 0}</span></div>
                                            <div className="flex justify-between"><span>TD Doses Given:</span><span className="font-bold text-success">{data.overview?.mothers?.tdDosesGiven?.toLocaleString() ?? 0}</span></div>
                                            <div className="flex justify-between"><span>Zero TD:</span><span className="font-bold text-warning">{data.overview?.mothers?.zeroTD?.toLocaleString() ?? 0}</span></div>
                                            <div className="flex justify-between"><span>TD Coverage:</span><span className="font-bold text-info">{safeFixed(data.overview?.mothers?.tdCoverage ?? 0)}%</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title">⚖️ Nutrition</h2>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Total Records:</span><span className="font-bold">{data.overview?.nutrition?.totalRecords?.toLocaleString() ?? 0}</span></div>
                                            <div className="flex justify-between"><span>Avg Weight:</span><span className="font-bold">{safeFixed(data.overview?.nutrition?.avgWeightKg ?? 0)} kg</span></div>
                                            <div className="flex justify-between"><span>Underweight:</span><span className="font-bold text-warning">{safeFixed(data.overview?.nutrition?.underweightRate ?? 0)}%</span></div>
                                            <div className="flex justify-between"><span>Normal:</span><span className="font-bold text-success">{safeFixed(data.overview?.nutrition?.normalRate ?? 0)}%</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">💉 Vaccine Coverage</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={coverageChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="vaccineName" angle={-45} textAnchor="end" height={80} />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="coverage" name="Coverage %" fill="#0088FE" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">📈 Dropout Rates</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dropoutChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="vaccineName" angle={-45} textAnchor="end" height={80} />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="dropoutRate" name="Dropout %" fill="#FF8042" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">🍏 Growth Monitoring</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={growthPieData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                                label={({ name, rate }) => `${name}: ${safeFixed(rate)}%`}
                                            >
                                                {growthPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">📅 Due & Overdue</h3>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="stat">
                                            <div className="stat-title">Due Today</div>
                                            <div className="stat-value text-info">{data.dueOverdue?.dueToday ?? 0}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Overdue</div>
                                            <div className="stat-value text-error">{data.dueOverdue?.overdue ?? 0}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">On Time</div>
                                            <div className="stat-value text-success">{data.dueOverdue?.onTime ?? 0}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Timeliness</div>
                                            <div className="stat-value text-info">{safeFixed(data.dueOverdue?.timelinessRate ?? 0)}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Trends Tab */}
                    {activeTab === 'trends' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">📈 Coverage Trends</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={trendsCoverageData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Line type="monotone" dataKey="coveragePct" name="Coverage %" stroke="#0088FE" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">📉 Dropout Rate Trends</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={trendsDropoutData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Area type="monotone" dataKey="dropoutRate" name="Dropout Rate %" stroke="#FF8042" fill="#FF8042" fillOpacity={0.3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Ward Performance Tab */}
                    {activeTab === 'ward-performance' && (
                        <div className="space-y-6">
                            <div className="card bg-base-100 p-4 shadow-xl">
                                <h3 className="font-bold text-lg mb-4">🏆 Ward Performance Rankings</h3>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Ward</th>
                                                <th>Coverage</th>
                                                <th>Overdue</th>
                                                <th>Dropout Rate</th>
                                                <th>Underweight Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.wardPerformance.map((ward, index) => (
                                                <tr key={ward.ward}>
                                                    <td className="font-bold">Ward {ward.ward}</td>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div className="radial-progress bg-primary text-primary-content border-4 border-primary"
                                                                style={{ "--value": ward.coverage, "--size": "3rem" }}>
                                                                {safeFixed(ward.coverage)}%
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${ward.overdue > 10 ? 'badge-error' : 'badge-warning'}`}>
                                                            {ward.overdue}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${ward.dropoutRate > 5 ? 'badge-error' : 'badge-warning'}`}>
                                                            {safeFixed(ward.dropoutRate)}%
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${ward.underweightRate > 15 ? 'badge-error' : 'badge-warning'}`}>
                                                            {safeFixed(ward.underweightRate)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Equity Tab */}
                    {activeTab === 'equity' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">⚖️ Coverage by Gender</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.disparities.gender}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="group" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="coverage" name="Coverage %" fill="#0088FE" />
                                            <Bar dataKey="dropoutRate" name="Dropout %" fill="#FF8042" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="card bg-base-100 p-4 shadow-xl">
                                    <h3 className="font-bold text-lg mb-4">⚖️ Coverage by Caste</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={data.disparities.caste}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="group" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="coverage" name="Coverage %" fill="#00C49F" />
                                            <Bar dataKey="underweightRate" name="Underweight %" fill="#FFBB28" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comparison Tab */}
                    {activeTab === 'comparison' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <ComparisonCard title="Coverage Rate" metric="coverage" unit="%" />
                                <ComparisonCard title="Dropout Rate" metric="dropoutRate" unit="%" />
                                <ComparisonCard title="Zero Dose" metric="zeroDose" />
                                <ComparisonCard title="Overdue" metric="overdue" />
                                <ComparisonCard title="Timeliness" metric="timeliness" unit="%" />
                                <ComparisonCard title="Underweight Rate" metric="underweightRate" unit="%" />
                                <ComparisonCard title="Avg Weight" metric="avgWeight" unit="kg" />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AnalyticsDashboard;