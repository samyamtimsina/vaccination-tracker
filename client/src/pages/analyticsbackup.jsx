import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import axiosClient from '../api/axiosClient';

// 🎨 Color Palettes
const COLORS = {
    primary: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'],
    risk: { high: '#ef4444', medium: '#f59e0b', low: '#10b981' },
    status: { complete: '#10b981', pending: '#f59e0b', overdue: '#ef4444' }
};

const Analytics = () => {
    // 📊 STATE MANAGEMENT
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        ward: '',
        vaccine: '',
        startDate: '',
        endDate: '',
        months: 6
    });

    // Data states for each section
    const [systemOverview, setSystemOverview] = useState(null);
    const [vaccineCoverage, setVaccineCoverage] = useState(null);
    const [zeroDose, setZeroDose] = useState(null);
    const [dropoutRates, setDropoutRates] = useState(null);
    const [timeliness, setTimeliness] = useState(null);
    const [defaulters, setDefaulters] = useState(null);
    const [cohortAnalysis, setCohortAnalysis] = useState(null);
    const [yearlyTrends, setYearlyTrends] = useState(null);
    const [tdCompletion, setTdCompletion] = useState(null);
    const [motherChildLinkage, setMotherChildLinkage] = useState(null);
    const [weightCoverage, setWeightCoverage] = useState(null);
    const [growthTrajectories, setGrowthTrajectories] = useState(null);
    const [growthFaltering, setGrowthFaltering] = useState(null);
    const [dataCompleteness, setDataCompleteness] = useState(null);
    const [riskPrediction, setRiskPrediction] = useState(null);

    // 🔄 FETCH ALL DATA
    const fetchAllData = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            if (filters.ward) queryParams.append('ward', filters.ward);
            if (filters.vaccine) queryParams.append('vaccine', filters.vaccine);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);
            if (filters.months) queryParams.append('months', filters.months);

            const query = queryParams.toString();

            // Parallel fetching for better performance
            const [
                overviewRes,
                coverageRes,
                zeroDoseRes,
                dropoutRes,
                timelinessRes,
                defaultersRes,
                cohortRes,
                trendsRes,
                tdRes,
                linkageRes,
                weightRes,
                trajectoriesRes,
                falteringRes,
                completenessRes,
                riskRes
            ] = await Promise.all([
                axiosClient.get(`/api/analytics/system-overview?${query}`),
                axiosClient.get(`/api/analytics/vaccine-coverage?${query}`),
                axiosClient.get(`/api/analytics/zero-dose-children?${query}`),
                axiosClient.get(`/api/analytics/dropout-rates?${query}`),
                axiosClient.get(`/api/analytics/vaccination-timeliness?${query}`),
                axiosClient.get(`/api/analytics/defaulter-tracking?${query}`),
                axiosClient.get(`/api/analytics/cohort-analysis?cohortYear=${new Date().getFullYear() - 1}&${query}`),
                axiosClient.get(`/api/analytics/yearly-trends?years=5&${query}`),
                axiosClient.get(`/api/analytics/td-completion?${query}`),
                axiosClient.get(`/api/analytics/mother-child-linkage?${query}`),
                axiosClient.get(`/api/analytics/weight-coverage?${query}`),
                axiosClient.get(`/api/analytics/growth-trajectories?${query}`),
                axiosClient.get(`/api/analytics/growth-faltering?${query}`),
                axiosClient.get(`/api/analytics/data-completeness?${query}`),
                axiosClient.get(`/api/analytics/default-risk-prediction?${query}`)
            ]);

            setSystemOverview(overviewRes.data.data);
            setVaccineCoverage(coverageRes.data.data);
            setZeroDose(zeroDoseRes.data.data);
            setDropoutRates(dropoutRes.data.data);
            setTimeliness(timelinessRes.data.data);
            setDefaulters(defaultersRes.data.data);
            setCohortAnalysis(cohortRes.data.data);
            setYearlyTrends(trendsRes.data.data);
            setTdCompletion(tdRes.data.data);
            setMotherChildLinkage(linkageRes.data.data);
            setWeightCoverage(weightRes.data.data);
            setGrowthTrajectories(trajectoriesRes.data.data);
            setGrowthFaltering(falteringRes.data.data);
            setDataCompleteness(completenessRes.data.data);
            setRiskPrediction(riskRes.data.data);

        } catch (err) {
            setError(err.message || 'Failed to fetch analytics data');
            console.error('Analytics fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [filters]);

    // 🎯 FILTER HANDLER
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // 💀 LOADING SKELETON
    const LoadingSkeleton = () => (
        <div className="animate-pulse space-y-4">
            <div className="h-32 bg-base-300 rounded-lg"></div>
            <div className="h-64 bg-base-300 rounded-lg"></div>
            <div className="h-48 bg-base-300 rounded-lg"></div>
        </div>
    );

    // ❌ ERROR STATE
    if (error) {
        return (
            <div className="container mx-auto p-6">
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error loading analytics: {error}</span>
                    <button className="btn btn-sm" onClick={fetchAllData}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 lg:p-6 space-y-8">
            {/* 🎯 HEADER & FILTERS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-sm text-base-content/70 mt-1">Comprehensive vaccination & health monitoring</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <select
                        className="select select-bordered select-sm"
                        value={filters.ward}
                        onChange={(e) => handleFilterChange('ward', e.target.value)}
                    >
                        <option value="">All Wards</option>
                        {[...Array(15)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Ward {i + 1}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        className="input input-bordered input-sm"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        placeholder="Start Date"
                    />

                    <input
                        type="date"
                        className="input input-bordered input-sm"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        placeholder="End Date"
                    />

                    <button className="btn btn-primary btn-sm" onClick={fetchAllData}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? <LoadingSkeleton /> : (
                <>
                    {/* 📊 PHASE 1: CORE METRICS OVERVIEW */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">System Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="stat bg-base-200 rounded-lg shadow">
                                <div className="stat-figure text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Total Children</div>
                                <div className="stat-value text-primary">{systemOverview?.overview?.totalChildren || 0}</div>
                                <div className="stat-desc">Registered in system</div>
                            </div>

                            <div className="stat bg-base-200 rounded-lg shadow">
                                <div className="stat-figure text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Total Mothers</div>
                                <div className="stat-value text-secondary">{systemOverview?.overview?.totalMothers || 0}</div>
                                <div className="stat-desc">Maternal health tracking</div>
                            </div>

                            <div className="stat bg-base-200 rounded-lg shadow">
                                <div className="stat-figure text-accent">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Vaccinations (30d)</div>
                                <div className="stat-value text-accent">{systemOverview?.overview?.recentActivity?.vaccinationsLast30Days || 0}</div>
                                <div className="stat-desc">Coverage: {systemOverview?.overview?.recentActivity?.vaccinationCoverage || '0%'}</div>
                            </div>

                            <div className="stat bg-base-200 rounded-lg shadow">
                                <div className="stat-figure text-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="stat-title">Overdue</div>
                                <div className="stat-value text-error">{systemOverview?.overview?.upcoming?.currentlyOverdue || 0}</div>
                                <div className="stat-desc">Due next 7d: {systemOverview?.overview?.upcoming?.dueNext7Days || 0}</div>
                            </div>
                        </div>

                        {dataCompleteness && (
                            <div className="card bg-base-200 shadow mt-4">
                                <div className="card-body">
                                    <h3 className="card-title">Data Quality Score</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="radial-progress text-primary" style={{ "--value": dataCompleteness.overallQualityScore }} role="progressbar">
                                            {dataCompleteness.overallQualityScore}%
                                        </div>
                                        <div>
                                            <div className="badge badge-lg badge-primary">{dataCompleteness.qualityRating}</div>
                                            <p className="text-sm mt-2">{dataCompleteness.recommendations?.[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 📊 PHASE 2: CHILD IMMUNIZATION ANALYTICS */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Child Immunization Analytics</h2>

                        {/* Vaccine Coverage Chart */}
                        {vaccineCoverage && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Vaccine Coverage by Type</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={Object.entries(vaccineCoverage.vaccineCoverage || {}).map(([name, data]) => ({
                                            vaccine: name,
                                            coverage: parseFloat(data.doses[1]?.coverage || 0)
                                        }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="vaccine" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="coverage" fill="#3b82f6" name="Coverage %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Dropout Analysis Table */}
                        {dropoutRates && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Dropout Analysis</h3>
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr>
                                                    <th>Vaccine</th>
                                                    <th>From Dose</th>
                                                    <th>To Dose</th>
                                                    <th>Dropout Rate</th>
                                                    <th>Children Lost</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(dropoutRates).map(([vaccine, data]) =>
                                                    data.dropoutRates?.map((dropout, idx) => (
                                                        <tr key={`${vaccine}-${idx}`}>
                                                            <td>{vaccine}</td>
                                                            <td>{dropout.fromDose}</td>
                                                            <td>{dropout.toDose}</td>
                                                            <td>
                                                                <span className={`badge ${parseFloat(dropout.dropoutRate) > 10 ? 'badge-error' : 'badge-success'}`}>
                                                                    {dropout.dropoutRate}
                                                                </span>
                                                            </td>
                                                            <td>{dropout.childrenDropped}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Zero-Dose Children */}
                        {zeroDose && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Zero-Dose Children</h3>
                                    <div className="stats stats-vertical lg:stats-horizontal shadow">
                                        <div className="stat">
                                            <div className="stat-title">Zero-Dose Count</div>
                                            <div className="stat-value text-error">{zeroDose.zeroDoseChildren}</div>
                                            <div className="stat-desc">{zeroDose.zeroDosePercentage}% of total</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Vaccinated</div>
                                            <div className="stat-value text-success">{zeroDose.vaccinatedChildren}</div>
                                            <div className="stat-desc">Out of {zeroDose.totalChildren} children</div>
                                        </div>
                                    </div>

                                    {zeroDose.children?.length > 0 && (
                                        <div className="overflow-x-auto mt-4">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Parent</th>
                                                        <th>Ward</th>
                                                        <th>Age (months)</th>
                                                        <th>Phone</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {zeroDose.children.slice(0, 10).map((child) => (
                                                        <tr key={child.id}>
                                                            <td>{child.name}</td>
                                                            <td>{child.parentName}</td>
                                                            <td>{child.ward}</td>
                                                            <td>{child.ageMonths}</td>
                                                            <td>{child.phoneNumber}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timeliness Donut Chart */}
                        {timeliness && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Vaccination Timeliness</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'On Time', value: timeliness.onTime, fill: COLORS.status.complete },
                                                    { name: 'Late', value: timeliness.late, fill: COLORS.status.pending },
                                                    { name: 'Missed', value: timeliness.missed, fill: COLORS.status.overdue }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                dataKey="value"
                                            />
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Defaulter Tracking */}
                        {defaulters && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Defaulter Tracking</h3>
                                    <div className="stats shadow mb-4">
                                        <div className="stat">
                                            <div className="stat-title">Total Defaulters</div>
                                            <div className="stat-value">{defaulters.statistics?.totalDefaulters || 0}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Overdue Vaccines</div>
                                            <div className="stat-value">{defaulters.statistics?.totalOverdueVaccines || 0}</div>
                                        </div>
                                    </div>

                                    {defaulters.defaulters?.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Child</th>
                                                        <th>Ward</th>
                                                        <th>Overdue Vaccines</th>
                                                        <th>Max Days Overdue</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {defaulters.defaulters.slice(0, 10).map((defaulter, idx) => {
                                                        const maxOverdue = Math.max(...defaulter.overdueVaccines.map(v => v.daysOverdue));
                                                        return (
                                                            <tr key={idx}>
                                                                <td>{defaulter.child.fullName}</td>
                                                                <td>{defaulter.child.wardNumber}</td>
                                                                <td>{defaulter.totalOverdue}</td>
                                                                <td>
                                                                    <span className={`badge ${maxOverdue > 60 ? 'badge-error' : maxOverdue > 30 ? 'badge-warning' : 'badge-info'}`}>
                                                                        {maxOverdue} days
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {defaulter.overdueVaccines[0]?.notificationSent ? (
                                                                        <span className="badge badge-success badge-sm">Notified</span>
                                                                    ) : (
                                                                        <span className="badge badge-warning badge-sm">Pending</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 📊 PHASE 4: MATERNAL & TD ANALYTICS */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Maternal & TD Analytics</h2>

                        {tdCompletion && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">TD Completion Rates</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={[
                                            { dose: 'At least 1 dose', percentage: parseFloat(tdCompletion.completionRates?.atLeastOneDose || 0) },
                                            { dose: 'Two doses', percentage: parseFloat(tdCompletion.completionRates?.twoDoses || 0) },
                                            { dose: 'Boosters', percentage: parseFloat(tdCompletion.completionRates?.boosters || 0) }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="dose" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="percentage" fill="#8b5cf6" />
                                        </BarChart>
                                    </ResponsiveContainer>

                                    <div className="stats stats-vertical lg:stats-horizontal shadow mt-4">
                                        <div className="stat">
                                            <div className="stat-title">Total Mothers</div>
                                            <div className="stat-value">{tdCompletion.totalMothers}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">With 1+ Dose</div>
                                            <div className="stat-value text-primary">{tdCompletion.withAtLeastOneDose}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">With 2 Doses</div>
                                            <div className="stat-value text-secondary">{tdCompletion.withTwoDoses}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {motherChildLinkage && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Mother-Child Linkage Analysis</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Mothers with TD', value: motherChildLinkage.tdImpactAnalysis?.withTD?.mothers || 0 },
                                                    { name: 'Mothers without TD', value: motherChildLinkage.tdImpactAnalysis?.withoutTD?.mothers || 0 }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                dataKey="value"
                                                label
                                            >
                                                {[COLORS.primary[0], COLORS.primary[3]].map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 📊 PHASE 5: GROWTH & NUTRITION ANALYTICS */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Growth & Nutrition Analytics</h2>

                        {weightCoverage && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Weight Monitoring Coverage</h3>
                                    <div className="stats shadow">
                                        <div className="stat">
                                            <div className="stat-title">Overall Coverage</div>
                                            <div className="stat-value text-primary">{weightCoverage.overallCoverage}%</div>
                                            <div className="stat-desc">{weightCoverage.period}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Children Measured</div>
                                            <div className="stat-value">{weightCoverage.totalMeasured}</div>
                                            <div className="stat-desc">Out of {weightCoverage.totalChildren}</div>
                                        </div>
                                    </div>
                                    <progress
                                        className="progress progress-primary w-full mt-4"
                                        value={parseFloat(weightCoverage.overallCoverage)}
                                        max="100"
                                    ></progress>
                                </div>
                            </div>
                        )}

                        {growthTrajectories && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Growth Trajectories Overview</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="stat bg-base-100 rounded">
                                            <div className="stat-title">Children Tracked</div>
                                            <div className="stat-value text-sm">{growthTrajectories.totalChildrenTracked}</div>
                                        </div>
                                        <div className="stat bg-base-100 rounded">
                                            <div className="stat-title">Weight Records</div>
                                            <div className="stat-value text-sm">{growthTrajectories.totalWeightRecords}</div>
                                        </div>
                                        <div className="stat bg-base-100 rounded">
                                            <div className="stat-title">Avg Weight (0-6m)</div>
                                            <div className="stat-value text-sm">
                                                {growthTrajectories.cohortAverages?.['0-6 months']?.averageWeight || 0} kg
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {growthFaltering && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Growth Faltering Detection</h3>
                                    <div className="alert alert-warning mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>Threshold: {growthFaltering.threshold}</span>
                                    </div>

                                    <div className="stats stats-vertical lg:stats-horizontal shadow">
                                        <div className="stat">
                                            <div className="stat-title">Children Analyzed</div>
                                            <div className="stat-value">{growthFaltering.totalChildrenAnalyzed}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Faltering Cases</div>
                                            <div className="stat-value text-error">{growthFaltering.falteringChildrenCount}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Faltering Rate</div>
                                            <div className="stat-value text-error">{growthFaltering.falteringPercentage}%</div>
                                        </div>
                                    </div>

                                    <progress
                                        className="progress progress-error w-full mt-4"
                                        value={parseFloat(growthFaltering.falteringPercentage)}
                                        max="100"
                                    ></progress>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 📊 PHASE 6: TRENDS & PREDICTIONS */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Trends & Predictive Analytics</h2>

                        {/* Cohort Analysis */}
                        {cohortAnalysis && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Cohort Analysis - {cohortAnalysis.cohortYear}</h3>
                                    <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                                        <div className="stat">
                                            <div className="stat-title">Total Children</div>
                                            <div className="stat-value">{cohortAnalysis.totalChildren}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Fully Vaccinated</div>
                                            <div className="stat-value text-success">{cohortAnalysis.vaccinationMetrics?.fullyVaccinated || 0}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Partially Vaccinated</div>
                                            <div className="stat-value text-warning">{cohortAnalysis.vaccinationMetrics?.partiallyVaccinated || 0}</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Not Vaccinated</div>
                                            <div className="stat-value text-error">{cohortAnalysis.vaccinationMetrics?.notVaccinated || 0}</div>
                                        </div>
                                    </div>

                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={[
                                            { status: 'Fully Vaccinated', count: cohortAnalysis.vaccinationMetrics?.fullyVaccinated || 0, fill: '#10b981' },
                                            { status: 'Partially Vaccinated', count: cohortAnalysis.vaccinationMetrics?.partiallyVaccinated || 0, fill: '#f59e0b' },
                                            { status: 'Not Vaccinated', count: cohortAnalysis.vaccinationMetrics?.notVaccinated || 0, fill: '#ef4444' }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="status" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count">
                                                {[0, 1, 2].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={[COLORS.status.complete, COLORS.status.pending, COLORS.status.overdue][index]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Yearly Trends */}
                        {yearlyTrends && yearlyTrends.data?.vaccinationRate && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Yearly Vaccination Trends</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={yearlyTrends.data.vaccinationRate}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="year" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="rate"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ r: 5 }}
                                                activeDot={{ r: 8 }}
                                                name="Vaccination Rate (%)"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Risk Prediction */}
                        {riskPrediction && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Default Risk Prediction</h3>

                                    <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
                                        <div className="stat">
                                            <div className="stat-title">Total Assessed</div>
                                            <div className="stat-value">{riskPrediction.statistics?.totalAssessed || 0}</div>
                                        </div>
                                        <div className="stat place-items-center">
                                            <div className="stat-title">High Risk</div>
                                            <div className="stat-value text-error">{riskPrediction.statistics?.highRisk || 0}</div>
                                        </div>
                                        <div className="stat place-items-center">
                                            <div className="stat-title">Medium Risk</div>
                                            <div className="stat-value text-warning">{riskPrediction.statistics?.mediumRisk || 0}</div>
                                        </div>
                                        <div className="stat place-items-center">
                                            <div className="stat-title">Low Risk</div>
                                            <div className="stat-value text-success">{riskPrediction.statistics?.lowRisk || 0}</div>
                                        </div>
                                    </div>

                                    {riskPrediction.atRiskChildren?.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="table table-sm">
                                                <thead>
                                                    <tr>
                                                        <th>Child</th>
                                                        <th>Ward</th>
                                                        <th>Due Vaccine</th>
                                                        <th>Days Until Due</th>
                                                        <th>Risk Level</th>
                                                        <th>Risk Score</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {riskPrediction.atRiskChildren.slice(0, 10).map((risk, idx) => (
                                                        <tr key={idx}>
                                                            <td>{risk.child.name}</td>
                                                            <td>{risk.child.ward}</td>
                                                            <td>{risk.dueVaccine.vaccine} (Dose {risk.dueVaccine.doseNumber})</td>
                                                            <td>{risk.dueVaccine.daysUntilDue}</td>
                                                            <td>
                                                                <span className={`badge ${risk.riskAssessment.level === 'high' ? 'badge-error' :
                                                                    risk.riskAssessment.level === 'medium' ? 'badge-warning' :
                                                                        'badge-success'
                                                                    }`}>
                                                                    {risk.riskAssessment.level.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td>{risk.riskAssessment.score}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Risk Distribution Chart */}
                                    {riskPrediction.statistics && (
                                        <ResponsiveContainer width="100%" height={250} className="mt-6">
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'High Risk', value: riskPrediction.statistics.highRisk, fill: COLORS.risk.high },
                                                        { name: 'Medium Risk', value: riskPrediction.statistics.mediumRisk, fill: COLORS.risk.medium },
                                                        { name: 'Low Risk', value: riskPrediction.statistics.lowRisk, fill: COLORS.risk.low }
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    dataKey="value"
                                                />
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 📊 PHASE 7: DATA QUALITY & SYSTEM HEALTH */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Data Quality & System Health</h2>

                        {dataCompleteness && (
                            <div className="card bg-base-200 shadow mb-4">
                                <div className="card-body">
                                    <h3 className="card-title">Data Completeness Analysis</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {/* Vaccinations Completeness */}
                                        <div className="card bg-base-100">
                                            <div className="card-body">
                                                <h4 className="font-semibold">Vaccination Records</h4>
                                                <div className="stat">
                                                    <div className="stat-title">Completeness</div>
                                                    <div className="stat-value text-sm">{dataCompleteness.completeness?.vaccinations?.completeness || '0%'}</div>
                                                    <div className="stat-desc">
                                                        {dataCompleteness.completeness?.vaccinations?.actual || 0} / {dataCompleteness.completeness?.vaccinations?.expected || 0} expected
                                                    </div>
                                                </div>
                                                <progress
                                                    className="progress progress-primary w-full"
                                                    value={parseFloat(dataCompleteness.completeness?.vaccinations?.completeness || 0)}
                                                    max="100"
                                                ></progress>
                                            </div>
                                        </div>

                                        {/* Weight Records Completeness */}
                                        <div className="card bg-base-100">
                                            <div className="card-body">
                                                <h4 className="font-semibold">Weight Records</h4>
                                                <div className="stat">
                                                    <div className="stat-title">Completeness</div>
                                                    <div className="stat-value text-sm">{dataCompleteness.completeness?.weightRecords?.completeness || '0%'}</div>
                                                    <div className="stat-desc">
                                                        {dataCompleteness.completeness?.weightRecords?.actual || 0} / {dataCompleteness.completeness?.weightRecords?.expected || 0} expected
                                                    </div>
                                                </div>
                                                <progress
                                                    className="progress progress-secondary w-full"
                                                    value={parseFloat(dataCompleteness.completeness?.weightRecords?.completeness || 0)}
                                                    max="100"
                                                ></progress>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overall Score Gauge */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="radial-progress text-primary text-4xl"
                                            style={{ "--value": dataCompleteness.overallQualityScore, "--size": "12rem", "--thickness": "1rem" }}
                                            role="progressbar">
                                            {dataCompleteness.overallQualityScore}%
                                        </div>
                                        <div className="text-center">
                                            <div className={`badge badge-lg ${dataCompleteness.qualityRating === 'Excellent' ? 'badge-success' :
                                                dataCompleteness.qualityRating === 'Good' ? 'badge-primary' :
                                                    dataCompleteness.qualityRating === 'Fair' ? 'badge-warning' :
                                                        'badge-error'
                                                }`}>
                                                {dataCompleteness.qualityRating}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    {dataCompleteness.recommendations?.length > 0 && (
                                        <div className="alert alert-info mt-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <div>
                                                <h4 className="font-bold">Recommendations</h4>
                                                <ul className="list-disc list-inside">
                                                    {dataCompleteness.recommendations.map((rec, idx) => (
                                                        <li key={idx}>{rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Active Users Section */}
                        {systemOverview && (
                            <div className="card bg-base-200 shadow">
                                <div className="card-body">
                                    <h3 className="card-title">System Activity</h3>
                                    <div className="stats shadow">
                                        <div className="stat">
                                            <div className="stat-figure text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                            <div className="stat-title">Active Users</div>
                                            <div className="stat-value text-primary">{systemOverview.overview?.activeUsers || 0}</div>
                                            <div className="stat-desc">Health workers currently active</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 📊 PHASE 3: COVERAGE & EQUITY ANALYTICS */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Coverage & Equity Insights</h2>

                        {vaccineCoverage && (
                            <div className="card bg-base-200 shadow">
                                <div className="card-body">
                                    <h3 className="card-title">Ward-Level Coverage Distribution</h3>
                                    <p className="text-sm text-base-content/70 mb-4">
                                        Total Eligible Children: <strong>{vaccineCoverage.totalEligibleChildren}</strong>
                                    </p>

                                    <div className="alert alert-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Use ward filter above to see detailed coverage by ward. Age group, gender, and caste analytics require additional endpoint development.</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Export & Actions */}
                    <section className="flex justify-end gap-2 mt-8">
                        <button className="btn btn-outline btn-sm gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export PDF Report
                        </button>
                        <button className="btn btn-outline btn-sm gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export CSV Data
                        </button>
                        <button className="btn btn-primary btn-sm gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Schedule Report
                        </button>
                    </section>
                </>
            )}
        </div>
    );
};

export default Analytics;