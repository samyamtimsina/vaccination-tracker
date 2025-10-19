// File: client/src/pages/AnalyticsDashboard.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { format } from 'date-fns';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { debounce } from 'lodash';

const wards = [1, 2, 3, 4, 5];
const genders = ['ALL', 'M', 'F'];
const ageGroups = ['ALL', '0-1y', '1-5y', '5y+'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#E74C3C'];

const AnalyticsDashboard = () => {
    const [filters, setFilters] = useState({
        ward: '',
        casteCode: '',
        gender: '',
        ageGroup: '',
        startDate: format(new Date(Date.now() - 30 * 864e5), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const [data, setData] = useState({
        overview: {},
        coverage: [],
        dropout: [],
        zeroDose: {},
        growth: {},
        tdCoverage: [],
        dueOverdue: {}
    });

    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const [
                overviewRes,
                coverageRes,
                dropoutRes,
                zeroDoseRes,
                growthRes,
                tdRes,
                dueOverdueRes
            ] = await Promise.all([
                axiosClient.get(`/api/analytics/overview?${query}`),
                axiosClient.get(`/api/analytics/coverage?${query}`),
                axiosClient.get(`/api/analytics/dropout?${query}`),
                axiosClient.get(`/api/analytics/zero-dose?${query}`),
                axiosClient.get(`/api/analytics/growth?${query}`),
                axiosClient.get(`/api/analytics/td-coverage?${query}`),
                axiosClient.get(`/api/analytics/due-overdue?${query}`)
            ]);

            setData({
                overview: overviewRes.data.data, // ✅ FIXED: Use the full data object
                coverage: coverageRes.data.data,
                dropout: dropoutRes.data.data,
                zeroDose: zeroDoseRes.data.data,
                growth: growthRes.data.data,
                tdCoverage: tdRes.data.data,
                dueOverdue: dueOverdueRes.data.data
            });

        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, [filters]);

    // Debounce fetchData on filter changes
    const debouncedFetch = useMemo(() => debounce(fetchData, 500), [fetchData]);

    useEffect(() => {
        debouncedFetch();
        return debouncedFetch.cancel;
    }, [filters, debouncedFetch]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const exportCSV = async (type) => {
        try {
            const query = new URLSearchParams({ ...filters, type }).toString();
            const res = await axiosClient.get(`/analytics/export/csv?${query}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    // Memoize chart data - FIXED version
    const growthPieData = useMemo(() => {
        const nutrition = data.overview?.nutrition || {};
        const totalRecords = nutrition.totalRecords || 1;

        return [
            {
                name: 'Underweight',
                value: Math.round((nutrition.underweightRate / 100) * totalRecords) || 0
            },
            {
                name: 'Normal',
                value: Math.round((nutrition.normalRate / 100) * totalRecords) || 0
            },
            {
                name: 'Overweight',
                value: Math.round((nutrition.overweightRate / 100) * totalRecords) || 0
            }
        ];
    }, [data.overview?.nutrition]);

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold mb-4">📊 Analytics Dashboard</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <label className="label">Ward</label>
                    <select className="select select-bordered" name="ward" value={filters.ward} onChange={handleFilterChange}>
                        <option value="">All</option>
                        {wards.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label">Gender</label>
                    <select className="select select-bordered" name="gender" value={filters.gender} onChange={handleFilterChange}>
                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label">Age Group</label>
                    <select className="select select-bordered" name="ageGroup" value={filters.ageGroup} onChange={handleFilterChange}>
                        {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label">Start Date</label>
                    <input type="date" className="input input-bordered" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                </div>
                <div>
                    <label className="label">End Date</label>
                    <input type="date" className="input input-bordered" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                </div>
                <button className="btn btn-primary mt-6" onClick={fetchData} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
                <button className="btn btn-secondary mt-6" onClick={() => exportCSV('overview')}>Export CSV</button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card bg-base-100 shadow p-4">
                    <h2 className="font-bold">🧒 Children</h2>
                    <p>Total Registered: {data.overview?.children?.totalRegistered || 0}</p>
                    <p>Vaccinated: {data.overview?.children?.vaccinated || 0}</p>
                    <p>Zero Dose: {data.overview?.children?.zeroDose || 0}</p>
                    <p>Coverage: {data.overview?.children?.coverageRate?.toFixed(2) || 0}%</p>
                    <p>Dropout Rate: {data.overview?.children?.dropoutRate?.toFixed(2) || 0}%</p>
                </div>
                <div className="card bg-base-100 shadow p-4">
                    <h2 className="font-bold">🤰 Mothers (TD)</h2>
                    <p>Total Registered: {data.overview?.mothers?.totalRegistered || 0}</p>
                    <p>TD Doses Given: {data.overview?.mothers?.tdDosesGiven || 0}</p>
                    <p>Zero TD: {data.overview?.mothers?.zeroTD || 0}</p>
                    <p>Full TD: {data.overview?.mothers?.fullTD || 0}</p>
                    <p>Coverage: {data.overview?.mothers?.tdCoverage?.toFixed(2) || 0}%</p>
                </div>
                <div className="card bg-base-100 shadow p-4">
                    <h2 className="font-bold">⚖️ Nutrition</h2>
                    <p>Total Records: {data.overview?.nutrition?.totalRecords || 0}</p>
                    <p>Avg Weight: {data.overview?.nutrition?.avgWeightKg?.toFixed(2) || 0} kg</p>
                    <p>Underweight: {data.overview?.nutrition?.underweightRate?.toFixed(2) || 0}%</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="card bg-base-100 p-4 shadow">
                    <h3 className="font-bold mb-2">💉 Vaccine Coverage</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.coverage}>
                            <XAxis dataKey="vaccineTypeId" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="coverage" fill="#0088FE" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="card bg-base-100 p-4 shadow">
                    <h3 className="font-bold mb-2">📈 Dropout Rates</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.dropout}>
                            <XAxis dataKey="vaccineTypeId" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="dropoutRate" fill="#FF4D4F" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="card bg-base-100 p-4 shadow">
                    <h3 className="font-bold mb-2">👶 Zero-Dose Children</h3>
                    <p>Count: {data.zeroDose.zeroDoseCount || 0}</p>
                    <p>Rate: {data.zeroDose.zeroDoseRate?.toFixed(2) || 0}%</p>
                </div>
                <div className="card bg-base-100 p-4 shadow">
                    <h3 className="font-bold mb-2">🤰 Mothers TD Coverage</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.tdCoverage}>
                            <XAxis dataKey="doseNumber" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="coverage" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card bg-base-100 p-4 shadow mt-6">
                <h3 className="font-bold mb-2">🍏 Growth & Nutrition Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={growthPieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;