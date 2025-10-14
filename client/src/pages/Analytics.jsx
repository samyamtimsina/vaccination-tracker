import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
    Activity, Shield, TrendingUp, AlertTriangle, Users,
    Calendar, RefreshCw, ChevronDown, ChevronUp, Scale,
    Heart, Target, Eye
} from 'lucide-react';

// ==================== UTILITY COMPONENTS ====================

const StatCard = ({ icon: Icon, title, value, subtitle, trend, className = '' }) => (
    <div className={`stat bg-base-100 rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}>
        <div className="stat-figure text-primary">
            <Icon className="w-8 h-8" />
        </div>
        <div className="stat-title text-sm opacity-70">{title}</div>
        <div className="stat-value text-2xl text-primary">{value}</div>
        {subtitle && <div className="stat-desc text-xs mt-1">{subtitle}</div>}
        {trend && <div className={`stat-desc ${trend > 0 ? 'text-success' : 'text-error'}`}>
            {trend > 0 ? '↗︎' : '↘︎'} {Math.abs(trend)}%
        </div>}
    </div>
);

const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-8 bg-base-300 rounded w-3/4"></div>
        <div className="h-32 bg-base-300 rounded"></div>
        <div className="h-24 bg-base-300 rounded"></div>
    </div>
);

const ErrorAlert = ({ message, onRetry }) => (
    <div className="alert alert-error shadow-lg">
        <div>
            <AlertTriangle className="w-6 h-6" />
            <div>
                <h3 className="font-bold">Error Loading Data</h3>
                <div className="text-sm">{message}</div>
            </div>
        </div>
        {onRetry && (
            <button className="btn btn-sm btn-ghost" onClick={onRetry}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
            </button>
        )}
    </div>
);

const EmptyState = ({ message = "No data available" }) => (
    <div className="flex flex-col items-center justify-center py-12 text-base-content/60">
        <Activity className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg">{message}</p>
    </div>
);

// ==================== VACCINE DETAIL TABLE ====================

const VaccineDetailRow = ({ vaccine, stats }) => {
    const [expanded, setExpanded] = useState(false);

    const doses = Object.entries(stats.doses || {}).sort(([a], [b]) => Number(a) - Number(b));
    const maxCoverage = Math.max(...doses.map(([_, d]) => parseFloat(d.coverage || 0)));

    return (
        <>
            <tr
                className="hover:bg-base-200 cursor-pointer transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <td className="font-semibold">
                    <div className="flex items-center gap-2">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {vaccine}
                    </div>
                </td>
                <td>
                    <div className="badge badge-outline">{doses.length} doses</div>
                </td>
                <td>
                    <div className="flex items-center gap-2">
                        <progress
                            className="progress progress-primary w-20"
                            value={maxCoverage}
                            max="100"
                        ></progress>
                        <span className="text-sm font-semibold">{maxCoverage.toFixed(1)}%</span>
                    </div>
                </td>
                <td>
                    {stats.totalVaccinated?.toLocaleString() || 0}
                </td>
                <td>
                    {stats.dropoutRates && stats.dropoutRates.length > 0 ? (
                        <span className={`badge ${parseFloat(stats.dropoutRates[stats.dropoutRates.length - 1].dropoutRate) > 5
                                ? 'badge-error'
                                : 'badge-success'
                            }`}>
                            {stats.dropoutRates[stats.dropoutRates.length - 1].dropoutRate}
                        </span>
                    ) : (
                        <span className="badge badge-ghost">N/A</span>
                    )}
                </td>
            </tr>
            {expanded && (
                <tr className="bg-base-200/50">
                    <td colSpan="5" className="p-4">
                        <div className="space-y-3">
                            {/* Dose Details */}
                            <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Dose Coverage
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {doses.map(([doseNum, doseData]) => (
                                        <div key={doseNum} className="card bg-base-100 shadow-sm p-3">
                                            <div className="text-xs opacity-70">Dose {doseNum}</div>
                                            <div className="text-lg font-bold text-primary">
                                                {parseFloat(doseData.coverage).toFixed(1)}%
                                            </div>
                                            <div className="text-xs">
                                                {doseData.vaccinated?.toLocaleString()} children
                                            </div>
                                            {doseData.firstDate && (
                                                <div className="text-xs opacity-60 mt-1">
                                                    First: {new Date(doseData.firstDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dropout Rates */}
                            {stats.dropoutRates && stats.dropoutRates.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Dropout Analysis
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="table table-xs">
                                            <thead>
                                                <tr>
                                                    <th>Transition</th>
                                                    <th>Dropout Rate</th>
                                                    <th>Children Lost</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.dropoutRates.map((dropout, idx) => (
                                                    <tr key={idx}>
                                                        <td>Dose {dropout.fromDose} → {dropout.toDose}</td>
                                                        <td>
                                                            <span className={`badge badge-sm ${parseFloat(dropout.dropoutRate) > 5
                                                                    ? 'badge-error'
                                                                    : parseFloat(dropout.dropoutRate) > 2
                                                                        ? 'badge-warning'
                                                                        : 'badge-success'
                                                                }`}>
                                                                {dropout.dropoutRate}
                                                            </span>
                                                        </td>
                                                        <td>{dropout.childrenLost}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

// ==================== MAIN COMPONENT ====================

const AnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('vaccination');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState({
        ward: '',
        vaccine: '',
        startDate: '',
        endDate: ''
    });

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await axiosClient.get(
                `/api/analytics/vaccine-coverage?${queryParams.toString()}`
            );

            if (response.data.success) {
                setData(response.data.data);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApplyFilters = () => {
        fetchData();
    };

    const handleResetFilters = () => {
        setFilters({ ward: '', vaccine: '', startDate: '', endDate: '' });
        setTimeout(fetchData, 100);
    };

    // Calculate summary metrics
    const getSummaryMetrics = () => {
        if (!data?.vaccineCoverage) return null;

        const vaccines = Object.values(data.vaccineCoverage);
        const totalDoses = vaccines.reduce((sum, v) => sum + (v.totalVaccinated || 0), 0);

        const coverages = vaccines.flatMap(v =>
            Object.values(v.doses || {}).map(d => parseFloat(d.coverage || 0))
        );
        const avgCoverage = coverages.length > 0
            ? coverages.reduce((a, b) => a + b, 0) / coverages.length
            : 0;

        const dropouts = vaccines.flatMap(v => v.dropoutRates || []);
        const avgDropout = dropouts.length > 0
            ? dropouts.reduce((sum, d) => sum + parseFloat(d.dropoutRate), 0) / dropouts.length
            : 0;

        return {
            totalEligible: data.totalEligibleChildren || 0,
            totalDoses,
            avgCoverage: avgCoverage.toFixed(1),
            avgDropout: avgDropout.toFixed(2),
            vaccineTypes: Object.keys(data.vaccineCoverage).length
        };
    };

    // Prepare dropout chart data
    const getDropoutChartData = () => {
        if (!data?.vaccineCoverage) return [];

        return Object.entries(data.vaccineCoverage)
            .filter(([_, stats]) => stats.dropoutRates && stats.dropoutRates.length > 0)
            .map(([vaccine, stats]) => ({
                vaccine: vaccine.length > 15 ? vaccine.substring(0, 15) + '...' : vaccine,
                dropoutRate: Math.abs(parseFloat(stats.dropoutRates[stats.dropoutRates.length - 1].dropoutRate))
            }))
            .slice(0, 10);
    };

    const summaryMetrics = getSummaryMetrics();

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                    <Activity className="w-10 h-10 text-primary" />
                    Analytics Dashboard
                </h1>
                <p className="text-base-content/70">
                    Comprehensive vaccination coverage and health monitoring insights
                </p>
            </div>

            {/* Filters */}
            <div className="card bg-base-100 shadow-lg mb-6">
                <div className="card-body">
                    <h2 className="card-title text-lg mb-4">
                        <Calendar className="w-5 h-5" />
                        Filters
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Ward</span>
                            </label>
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
                            <label className="label">
                                <span className="label-text">Start Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">End Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Vaccine Type</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={filters.vaccine}
                                onChange={(e) => setFilters({ ...filters, vaccine: e.target.value })}
                            >
                                <option value="">All Vaccines</option>
                                <option value="BCG">BCG</option>
                                <option value="DPT">DPT</option>
                                <option value="OPV">OPV</option>
                                <option value="Measles">Measles</option>
                            </select>
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={handleResetFilters}
                        >
                            Reset
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed bg-base-100 p-1 mb-6 shadow-md">
                <button
                    className={`tab tab-lg ${activeTab === 'vaccination' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('vaccination')}
                >
                    <Shield className="w-4 h-4 mr-2" />
                    Vaccination
                </button>
                <button
                    className={`tab tab-lg ${activeTab === 'maternal' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('maternal')}
                >
                    <Heart className="w-4 h-4 mr-2" />
                    Maternal
                </button>
                <button
                    className={`tab tab-lg ${activeTab === 'growth' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('growth')}
                >
                    <Scale className="w-4 h-4 mr-2" />
                    Growth
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <LoadingSkeleton />
            ) : error ? (
                <ErrorAlert message={error} onRetry={fetchData} />
            ) : !data ? (
                <EmptyState />
            ) : (
                <>
                    {/* VACCINATION TAB */}
                    {activeTab === 'vaccination' && summaryMetrics && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    icon={Users}
                                    title="Eligible Children"
                                    value={summaryMetrics.totalEligible.toLocaleString()}
                                    subtitle="Total registered"
                                    className="bg-gradient-to-br from-primary/10 to-primary/5"
                                />
                                <StatCard
                                    icon={Shield}
                                    title="Average Coverage"
                                    value={`${summaryMetrics.avgCoverage}%`}
                                    subtitle="Across all vaccines"
                                    className="bg-gradient-to-br from-success/10 to-success/5"
                                />
                                <StatCard
                                    icon={TrendingUp}
                                    title="Total Doses Given"
                                    value={summaryMetrics.totalDoses.toLocaleString()}
                                    subtitle="All vaccine types"
                                    className="bg-gradient-to-br from-info/10 to-info/5"
                                />
                                <StatCard
                                    icon={AlertTriangle}
                                    title="Avg Dropout Rate"
                                    value={`${summaryMetrics.avgDropout}%`}
                                    subtitle="Between doses"
                                    className="bg-gradient-to-br from-warning/10 to-warning/5"
                                />
                            </div>

                            {/* Vaccine Details Table */}
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title mb-4">
                                        <Eye className="w-5 h-5" />
                                        Vaccine Coverage Details
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra">
                                            <thead>
                                                <tr>
                                                    <th>Vaccine</th>
                                                    <th>Doses</th>
                                                    <th>Max Coverage</th>
                                                    <th>Total Vaccinated</th>
                                                    <th>Dropout</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(data.vaccineCoverage).map(([vaccine, stats]) => (
                                                    <VaccineDetailRow
                                                        key={vaccine}
                                                        vaccine={vaccine}
                                                        stats={stats}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Dropout Chart */}
                            {getDropoutChartData().length > 0 && (
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h2 className="card-title mb-4">
                                            <TrendingUp className="w-5 h-5" />
                                            Dropout Rate Comparison
                                        </h2>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={getDropoutChartData()}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                                <XAxis
                                                    dataKey="vaccine"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={80}
                                                    fontSize={12}
                                                />
                                                <YAxis label={{ value: 'Dropout %', angle: -90, position: 'insideLeft' }} />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'hsl(var(--b1))',
                                                        border: '1px solid hsl(var(--bc) / 0.2)',
                                                        borderRadius: '0.5rem'
                                                    }}
                                                />
                                                <Bar dataKey="dropoutRate" name="Dropout Rate (%)">
                                                    {getDropoutChartData().map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.dropoutRate > 5 ? '#ef4444' : entry.dropoutRate > 2 ? '#f59e0b' : '#10b981'}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MATERNAL TAB (Placeholder) */}
                    {activeTab === 'maternal' && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <EmptyState message="Maternal health analytics coming soon" />
                            </div>
                        </div>
                    )}

                    {/* GROWTH TAB (Placeholder) */}
                    {activeTab === 'growth' && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <EmptyState message="Growth & nutrition analytics coming soon" />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-base-content/60">
                <p>Vaccination Management System Analytics</p>
                <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;