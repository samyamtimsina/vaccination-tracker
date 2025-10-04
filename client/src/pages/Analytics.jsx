// src/pages/AnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const AnalyticsDashboard = () => {
    // --- Filter States ---
    const [ward, setWard] = useState('');
    const [vaccine, setVaccine] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    // --- Data States ---
    const [coverageData, setCoverageData] = useState([]);
    const [dropoffData, setDropoffData] = useState([]);
    const [timelinessData, setTimelinessData] = useState([]);
    const [trendsData, setTrendsData] = useState([]);
    const [missedData, setMissedData] = useState([]);
    const [workerData, setWorkerData] = useState({ vaccinationPerformance: [], weightPerformance: [] });
    const [motherCoverageData, setMotherCoverageData] = useState([]);
    const [motherTrends, setMotherTrends] = useState([]);

    // --- Loading/Error States ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- Fetch All Analytics ---
    const fetchAnalytics = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                ward: ward || undefined,
                vaccine: vaccine || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                year
            };

            const [
                coverageRes,
                dropoffRes,
                timelinessRes,
                trendsRes,
                missedRes,
                workerRes,
                motherRes
            ] = await Promise.all([
                axiosClient.get('/api/analytics/coverage', { params }),
                axiosClient.get('/api/analytics/dropoff', { params }),
                axiosClient.get('/api/analytics/timeliness', { params }),
                axiosClient.get('/api/analytics/trends', { params }),
                axiosClient.get('/api/analytics/missed', { params }),
                axiosClient.get('/api/analytics/worker-performance', { params }),
                axiosClient.get('/api/analytics/mother-coverage', { params })
            ]);

            setCoverageData(coverageRes.data.data.coverageStats || []);
            setDropoffData(dropoffRes.data.data.funnelData || []);
            setTimelinessData(timelinessRes.data.data.timelinessStats || []);
            setTrendsData(trendsRes.data.data.trends || []);
            setMissedData(missedRes.data.data.overdueRecords || []);
            setWorkerData(workerRes.data.data || { vaccinationPerformance: [], weightPerformance: [] });
            setMotherCoverageData(motherRes.data.data.coverageStats || []);
            setMotherTrends(motherRes.data.data.monthlyTrends || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error fetching analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // --- Handle Filter Submit ---
    const handleApplyFilters = () => {
        fetchAnalytics();
    };

    // --- Helper Functions ---
    const formatDate = (dateStr) => dateStr ? format(new Date(dateStr), 'yyyy-MM-dd') : '';

    return (
        <div className="p-4 space-y-6">
            {/* --- Filters --- */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                    <label className="label">Ward Number</label>
                    <input type="number" value={ward} onChange={e => setWard(e.target.value)} className="input input-bordered w-full" />
                </div>
                <div>
                    <label className="label">Vaccine</label>
                    <input type="text" value={vaccine} onChange={e => setVaccine(e.target.value)} className="input input-bordered w-full" />
                </div>
                <div>
                    <label className="label">Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input input-bordered w-full" />
                </div>
                <div>
                    <label className="label">End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input input-bordered w-full" />
                </div>
                <div>
                    <label className="label">Year</label>
                    <input type="number" value={year} onChange={e => setYear(e.target.value)} className="input input-bordered w-full" />
                    <button onClick={handleApplyFilters} className="btn btn-primary mt-2 w-full">Apply Filters</button>
                </div>
            </div>

            {/* --- Loading/Error --- */}
            {loading && <div className="alert alert-info">Loading analytics...</div>}
            {error && <div className="alert alert-error">{error}</div>}

            {/* --- Coverage Table --- */}
            <div className="card shadow-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Vaccination Coverage</h2>
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Ward</th>
                            <th>Vaccine</th>
                            <th>Vaccinated Children</th>
                            <th>Total Doses</th>
                            <th>Average Dose</th>
                            <th>Coverage %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coverageData.map(c => (
                            <tr key={`${c.ward}-${c.vaccineId}`}>
                                <td>{c.ward}</td>
                                <td>{c.vaccineName}</td>
                                <td>{c.vaccinatedChildren}</td>
                                <td>{c.totalDoses}</td>
                                <td>{c.averageDoseNumber.toFixed(2)}</td>
                                <td>{c.coveragePercentage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Dropoff Analysis --- */}
            <div className="card shadow-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Dropoff Analysis</h2>
                <table className="table table-compact table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Ward</th>
                            <th>Vaccine</th>
                            <th>Dose Number</th>
                            <th>Children Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dropoffData.map(d => (
                            <tr key={`${d.ward}-${d.vaccine_name}-${d.doseNumber}`}>
                                <td>{d.ward}</td>
                                <td>{d.vaccine_name}</td>
                                <td>{d.doseNumber}</td>
                                <td>{d.children_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Timeliness --- */}
            <div className="card shadow-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Timeliness Analysis</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timelinessData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="vaccine_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="on_time" fill="#4ade80" name="On Time" />
                        <Bar dataKey="delayed" fill="#f87171" name="Delayed" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* --- Trends --- */}
            <div className="card shadow-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Trends Analysis</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" tickFormatter={formatDate} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="children_vaccinated" stroke="#60a5fa" name="Children Vaccinated" />
                        <Line type="monotone" dataKey="doses_given" stroke="#fbbf24" name="Doses Given" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* --- Missed Vaccinations --- */}
            <div className="card shadow-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Missed / Overdue Vaccinations</h2>
                <table className="table table-compact table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Child Name</th>
                            <th>Ward</th>
                            <th>Vaccine</th>
                            <th>Due Date</th>
                            <th>Days Overdue</th>
                            <th>Age (Days)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {missedData.map(m => (
                            <tr key={`${m.child.id}-${m.vaccineType.id}`}>
                                <td>{m.child.fullName}</td>
                                <td>{m.child.wardNumber}</td>
                                <td>{m.vaccineType.name}</td>
                                <td>{formatDate(m.dueDate)}</td>
                                <td>{m.daysOverdue}</td>
                                <td>{m.childAge}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Worker Performance --- */}
            <div className="card shadow-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Health Worker Performance</h2>
                <table className="table table-compact table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Worker</th>
                            <th>Ward</th>
                            <th>Vaccinations Administered</th>
                            <th>Children Served</th>
                            <th>Vaccine Types</th>
                            <th>Performance Rank</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workerData.vaccinationPerformance.map(w => (
                            <tr key={w.worker_id}>
                                <td>{w.worker_name}</td>
                                <td>{w.worker_ward}</td>
                                <td>{w.vaccinations_administered}</td>
                                <td>{w.unique_children_served}</td>
                                <td>{w.vaccine_types_administered}</td>
                                <td>{w.performance_rank}</td>
                                <td>{w.performance_category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- Mother Coverage --- */}
            <div className="card shadow-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-bold mb-2">Mother TT Coverage</h2>
                <table className="table table-compact table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Ward</th>
                            <th>Total Mothers</th>
                            <th>Fully Protected</th>
                            <th>Received Dose</th>
                            <th>Total Doses</th>
                            <th>Protection %</th>
                            <th>Period Coverage %</th>
                            <th>Avg Age</th>
                            <th>Avg Pregnancy Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {motherCoverageData.map(m => (
                            <tr key={m.ward}>
                                <td>{m.ward}</td>
                                <td>{m.total_mothers}</td>
                                <td>{m.fully_protected_mothers}</td>
                                <td>{m.mothers_received_dose_this_period}</td>
                                <td>{m.total_doses_given_this_period}</td>
                                <td>{m.protection_coverage_percentage}</td>
                                <td>{m.period_coverage_percentage}</td>
                                <td>{m.avg_mother_age}</td>
                                <td>{m.avg_pregnancy_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="text-lg font-bold mt-4">Monthly TT Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={motherTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="doses_given" stroke="#34d399" name="Doses Given" />
                        <Line type="monotone" dataKey="unique_mothers_served" stroke="#fbbf24" name="Unique Mothers" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
