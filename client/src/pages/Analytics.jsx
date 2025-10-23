import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { format, subDays } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { debounce } from 'lodash';

const wards = Array.from({ length: 20 }, (_, i) => i + 1);
const genders = ['ALL', 'MALE', 'FEMALE'];
const ageGroups = ['ALL', '0-1y', '1-5y', '5y+'];
const casteCodes = Array.from({ length: 10 }, (_, i) => i + 1);
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
        compareStartDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
        compareEndDate: format(subDays(new Date(), 31), 'yyyy-MM-dd'),
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

            // ... (API request definition logic remains the same)
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
            } else if (activeTab === 'trends') {
                requests = [axiosClient.get(`/api/analytics/trends?${query}`, { signal })];
            } else if (activeTab === 'ward-performance') {
                requests = [axiosClient.get(`/api/analytics/ward-performance?${query}`, { signal })];
            } else if (activeTab === 'equity') {
                const genderQuery = new URLSearchParams({ ...filters, breakdown: 'gender' }).toString();
                const casteQuery = new URLSearchParams({ ...filters, breakdown: 'casteCode' }).toString();
                requests = [
                    axiosClient.get(`/api/analytics/disparities?${genderQuery}`, { signal }),
                    axiosClient.get(`/api/analytics/disparities?${casteQuery}`, { signal })
                ];
            } else if (activeTab === 'comparison') {
                requests = [axiosClient.get(`/api/analytics/comparison?${query}`, { signal })];
            }
            // ... (End of API request definition logic)

            const results = await Promise.all(requests);

            // Initialize a single variable to hold all the processed data for logging
            let processedData = {};

            if (activeTab === 'overview') {
                processedData = {
                    overview: results[0].data.data || {},
                    coverage: results[1].data.data || { byVaccine: [], byWard: [] },
                    dropout: results[2].data.data || [],
                    zeroDose: results[3].data.data || {},
                    growth: results[4].data.data || {},
                    tdCoverage: results[5].data.data || [],
                    dueOverdue: results[6].data.data || {}
                };
                setData(prev => ({
                    ...prev,
                    ...processedData // Use the consolidated variable for state update
                }));
            } else if (activeTab === 'trends') {
                processedData = { trends: results[0].data.data };
                setData(prev => ({ ...prev, ...processedData }));
            } else if (activeTab === 'ward-performance') {
                processedData = { wardPerformance: results[0].data.data };
                setData(prev => ({ ...prev, ...processedData }));
            } else if (activeTab === 'equity') {
                processedData = {
                    disparities: {
                        gender: results[0].data.data,
                        caste: results[1].data.data
                    }
                };
                setData(prev => ({
                    ...prev,
                    ...processedData
                }));
            } else if (activeTab === 'comparison') {
                processedData = { comparison: results[0].data.data };
                setData(prev => ({ ...prev, ...processedData }));
            }

            // Log the single variable containing all processed data
            console.log(`Data fetched for ${activeTab}:`, processedData);

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
            compareStartDate: format(subDays(new Date(), 60), 'yyyy-MM-dd'),
            compareEndDate: format(subDays(new Date(), 31), 'yyyy-MM-dd'),
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
            await axiosClient.get('/api/analytics/refresh-cache');
            alert('Cache refreshed successfully');
            debouncedFetch();
        } catch (err) {
            console.error('Refresh cache error:', err);
            alert('Failed to refresh cache');
        }
    };

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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow text-sm">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
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
                        🔄 Refresh
                    </button>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-sm btn-primary">
                            {exportLoading ? '⏳' : '📥'} Export
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                            <li><a onClick={() => handleExport('overview')}>Overview</a></li>
                            <li><a onClick={() => handleExport('coverage')}>Coverage</a></li>
                            <li><a onClick={() => handleExport('trends')}>Trends</a></li>
                            <li><a onClick={() => handleExport('ward-performance')}>Ward Performance</a></li>
                            <li><a onClick={() => handleExport('disparities')}>Disparities</a></li>
                        </ul>
                    </div>
                </div>
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
                        <label className="label font-semibold">Caste</label>
                        <select className="select select-bordered w-full" name="casteCode" value={filters.casteCode} onChange={handleFilterChange}>
                            <option value="">All Castes</option>
                            {casteCodes.map(c => <option key={c} value={c}>Caste {c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">Gender</label>
                        <select className="select select-bordered w-full" name="gender" value={filters.gender} onChange={handleFilterChange}>
                            <option value="">All</option>
                            {genders.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="label font-semibold">Age Group</label>
                        <select className="select select-bordered w-full" name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange}>
                            <option value="">All</option>
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

                    {compareMode && (
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
                        <button className="btn btn-primary" onClick={() => fetchData()} disabled={loading}>
                            {loading ? '🔄' : '🔍'} Apply
                        </button>
                        <button className="btn btn-outline" onClick={clearFilters}>
                            🗑️ Clear
                        </button>
                        <label className="btn btn-outline cursor-pointer">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary mr-2"
                                checked={compareMode}
                                onChange={(e) => setCompareMode(e.target.checked)}
                            />
                            Compare
                        </label>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-200 p-1">
                {['overview', 'trends', 'ward-performance', 'equity', 'comparison'].map(tab => (
                    <a
                        key={tab}
                        className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </a>
                ))}
            </div>

            {loading && (
                <div className="flex justify-center items-center h-64">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && !loading && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">🧒 Children</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Registered:</span>
                                        <span className="font-bold">{data.overview?.children?.totalRegistered?.toLocaleString() ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Vaccinated:</span>
                                        <span className="font-bold text-success">{data.overview?.children?.vaccinated?.toLocaleString() ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Coverage:</span>
                                        <span className="font-bold text-info">{safeFixed(data.overview?.children?.coverageRate)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Dropout:</span>
                                        <span className="font-bold text-error">{safeFixed(data.overview?.children?.dropoutRate)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Overdue:</span>
                                        <span className="font-bold text-error">{data.overview?.children?.overdue ?? 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">🤰 Mothers</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Registered:</span>
                                        <span className="font-bold">{data.overview?.mothers?.totalRegistered?.toLocaleString() ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>TD Doses:</span>
                                        <span className="font-bold text-success">{data.overview?.mothers?.tdDosesGiven?.toLocaleString() ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Coverage:</span>
                                        <span className="font-bold text-info">{safeFixed(data.overview?.mothers?.tdCoverage)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Overdue:</span>
                                        <span className="font-bold text-error">{data.overview?.mothers?.overdue ?? 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">⚖️ Nutrition</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Records:</span>
                                        <span className="font-bold">{data.overview?.nutrition?.totalRecords?.toLocaleString() ?? 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Avg Weight:</span>
                                        <span className="font-bold">{safeFixed(data.overview?.nutrition?.avgWeightKg)} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Underweight:</span>
                                        <span className="font-bold text-warning">{safeFixed(data.overview?.nutrition?.underweightRate)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Normal:</span>
                                        <span className="font-bold text-success">{safeFixed(data.overview?.nutrition?.normalRate)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                            <h3 className="font-bold text-lg mb-4">📉 Dropout Rates</h3>
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

                        <div className="card bg-base-100 p-4 shadow-xl">
                            <h3 className="font-bold text-lg mb-4">🍎 Growth Monitoring</h3>
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
                                    <div className="stat-title">Due</div>
                                    <div className="stat-value text-info text-2xl">{data.dueOverdue?.dueToday ?? 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Overdue</div>
                                    <div className="stat-value text-error text-2xl">{data.dueOverdue?.overdue ?? 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">On Time</div>
                                    <div className="stat-value text-success text-2xl">{data.dueOverdue?.onTime ?? 0}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Timeliness</div>
                                    <div className="stat-value text-info text-2xl">{safeFixed(data.dueOverdue?.timelinessRate)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Trends Tab */}
            {activeTab === 'trends' && !loading && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <select
                            className="select select-bordered"
                            name="granularity"
                            value={filters.granularity}
                            onChange={handleFilterChange}
                        >
                            <option value="day">Daily</option>
                            <option value="week">Weekly</option>
                            <option value="month">Monthly</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="card bg-base-100 p-4 shadow-xl">
                            <h3 className="font-bold text-lg mb-4">📈 Coverage Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.trends?.coverage || []}>
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
                            <h3 className="font-bold text-lg mb-4">📉 Dropout Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.trends?.dropout || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="dropoutRate" name="Dropout %" stroke="#FF8042" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card bg-base-100 p-4 shadow-xl">
                            <h3 className="font-bold text-lg mb-4">⏰ Timeliness Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.trends?.timeliness || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="timelinessRate" name="Timeliness %" stroke="#00C49F" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card bg-base-100 p-4 shadow-xl">
                            <h3 className="font-bold text-lg mb-4">🍎 Nutrition Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.trends?.nutrition || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="avgWeightKg" name="Avg Weight (kg)" stroke="#0088FE" strokeWidth={2} />
                                    <Line type="monotone" dataKey="underweightRate" name="Underweight %" stroke="#FF8042" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Ward Performance Tab */}
            {activeTab === 'ward-performance' && !loading && (
                <div className="space-y-6">
                    <div className="card bg-base-100 p-4 shadow-xl">
                        <h3 className="font-bold text-lg mb-4">🏆 Top Performing Wards</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data.wardPerformance || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="ward" type="category" width={80} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="coverage" name="Coverage %" fill="#0088FE" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card bg-base-100 shadow-xl overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Ward</th>
                                    <th>Coverage %</th>
                                    <th>Overdue</th>
                                    <th>Dropout %</th>
                                    <th>Underweight %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data.wardPerformance || []).map((ward, idx) => (
                                    <tr key={idx}>
                                        <td className="font-bold">Ward {ward.ward}</td>
                                        <td className="text-success">{safeFixed(ward.coverage)}%</td>
                                        <td className="text-error">{ward.overdue}</td>
                                        <td className="text-warning">{safeFixed(ward.dropoutRate)}%</td>
                                        <td className="text-warning">{safeFixed(ward.underweightRate)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Equity Tab */}
            {activeTab === 'equity' && !loading && (
                <div className="space-y-6">
                    <div className="card bg-base-100 p-4 shadow-xl">
                        <h3 className="font-bold text-lg mb-4">👥 Coverage by Gender</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.disparities?.gender || []}>
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
                        <h3 className="font-bold text-lg mb-4">🏘️ Coverage by Caste</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.disparities?.caste || []}>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card bg-base-100 shadow-xl overflow-x-auto">
                            <div className="card-body">
                                <h3 className="font-bold">Gender Breakdown</h3>
                                <table className="table table-sm">
                                    <thead>
                                        <tr><th>Gender</th><th>Coverage</th><th>Total</th></tr>
                                    </thead>
                                    <tbody>
                                        {(data.disparities?.gender || []).map((g, i) => (
                                            <tr key={i}>
                                                <td>{g.group}</td>
                                                <td>{safeFixed(g.coverage)}%</td>
                                                <td>{g.totalChildren}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl overflow-x-auto">
                            <div className="card-body">
                                <h3 className="font-bold">Caste Breakdown</h3>
                                <table className="table table-sm">
                                    <thead>
                                        <tr><th>Caste</th><th>Coverage</th><th>Total</th></tr>
                                    </thead>
                                    <tbody>
                                        {(data.disparities?.caste || []).map((c, i) => (
                                            <tr key={i}>
                                                <td>Caste {c.group}</td>
                                                <td>{safeFixed(c.coverage)}%</td>
                                                <td>{c.totalChildren}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Tab */}
            {activeTab === 'comparison' && !loading && (
                <div className="space-y-6">
                    <div className="alert alert-info">
                        <span>Comparing {filters.compareStartDate} to {filters.compareEndDate} vs {filters.startDate} to {filters.endDate}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(data.comparison || {}).map(([key, value]) => (
                            <div key={key} className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Current:</span>
                                            <span className="font-bold">{value.current}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Previous:</span>
                                            <span className="font-bold">{value.previous}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Change:</span>
                                            <span className={`font-bold flex items-center ${value.changePct > 0 ? 'text-success' : 'text-error'}`}>
                                                {value.changePct > 0 ? '↑' : '↓'} {Math.abs(value.changePct)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;