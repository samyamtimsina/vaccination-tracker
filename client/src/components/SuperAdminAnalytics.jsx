import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
    FiUsers,
    FiUserCheck,
    FiActivity,
    FiTrendingUp,
    FiTrendingDown,
    FiDatabase,
    FiCalendar,
    FiFilter,
    FiDownload,
    FiRefreshCw,
    FiArrowLeft,
    FiBarChart2,
    FiPieChart
} from 'react-icons/fi';
import axiosClient from '../api/axiosClient';

// API service for fetching data
export const apiService = {
    async getAllUsers() {
        try {
            const response = await axiosClient.get('/api/users/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return { users: [] };
        }
    },

    async getAllChildren() {
        try {
            const response = await axiosClient.get('/api/child/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching children:', error);
            return [];
        }
    },

    async getAllMothers() {
        try {
            const response = await axiosClient.get('/api/mothers/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching mothers:', error);
            return [];
        }
    },
};

// KPI Card Component
const KPICard = ({ title, value, change, positive, icon, description, color = "from-primary to-secondary" }) => {
    return (
        <div className={`relative overflow-hidden bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
                        <p className="text-white text-3xl font-bold">{value.toLocaleString()}</p>
                        <p className="text-white/70 text-xs mt-1">{description}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white group-hover:bg-white/30 transition-colors">
                        {icon}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {positive ? (
                        <FiTrendingUp className="w-4 h-4 text-white" />
                    ) : (
                        <FiTrendingDown className="w-4 h-4 text-white" />
                    )}
                    <span className="text-white font-semibold text-sm">{change}</span>
                    <span className="text-white/70 text-sm">this month</span>
                </div>
            </div>

            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20 group-hover:scale-110 transition-transform"></div>
                <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/10 group-hover:scale-110 transition-transform"></div>
            </div>
        </div>
    );
};

// Chart Container Component
const ChartContainer = ({ title, children, icon }) => {
    return (
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-white">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                    </div>
                </div>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

// Analytics Dashboard Component
const AnalyticsPage = () => {
    const [data, setData] = useState({
        users: [],
        children: [],
        mothers: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('6months');

    // Fetch all data
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [usersResponse, childrenResponse, mothersResponse] = await Promise.all([
                    apiService.getAllUsers(),
                    apiService.getAllChildren(),
                    apiService.getAllMothers()
                ]);

                setData({
                    users: usersResponse.users || usersResponse || [],
                    children: childrenResponse || [],
                    mothers: mothersResponse || []
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                // Set mock data for demonstration
                setData({
                    users: [
                        { id: 1, role: 'ADMIN', status: 'ACTIVE' },
                        { id: 2, role: 'WARD_OFFICER', status: 'ACTIVE' },
                        { id: 3, role: 'WARD_OFFICER', status: 'PENDING' },
                        { id: 4, role: 'SUPER_ADMIN', status: 'ACTIVE' }
                    ],
                    children: Array.from({ length: 127 }, (_, i) => ({
                        id: i + 1,
                        wardNumber: Math.floor(Math.random() * 5) + 1,
                        gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
                        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                        vaccinations: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({ vaccineType: 'BCG' }))
                    })),
                    mothers: Array.from({ length: 89 }, (_, i) => ({
                        id: i + 1,
                        wardNumber: Math.floor(Math.random() * 5) + 1,
                        tdDoses: Array.from({ length: Math.floor(Math.random() * 4) }, () => ({ doseNumber: 1 })),
                        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
                    }))
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Calculate analytics data
    const analytics = React.useMemo(() => {
        const { users, children, mothers } = data;

        // Basic counts
        const totalChildren = children.length;
        const totalMothers = mothers.length;
        const totalVaccinations = children.reduce((acc, child) =>
            acc + (child.vaccinations ? child.vaccinations.length : 0), 0);
        const totalStaff = users.length;

        // Children registration over time (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const childrenOverTime = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleDateString('en', { month: 'short' });
            const year = date.getFullYear();
            const count = children.filter(child => {
                const childDate = new Date(child.createdAt);
                return childDate.getMonth() === date.getMonth() && childDate.getFullYear() === date.getFullYear();
            }).length;
            childrenOverTime.push({
                name: `${monthName} ${year}`,
                children: count,
                cumulative: children.filter(child => new Date(child.createdAt) <= date).length
            });
        }

        // Vaccinations per ward
        const vaccinationsPerWard = {};
        children.forEach(child => {
            const ward = child.wardNumber || 1;
            const vaccCount = child.vaccinations ? child.vaccinations.length : 0;
            vaccinationsPerWard[ward] = (vaccinationsPerWard[ward] || 0) + vaccCount;
        });

        const wardVaccinationData = Object.entries(vaccinationsPerWard).map(([ward, count]) => ({
            ward: `Ward ${ward}`,
            vaccinations: count
        }));

        // Vaccination schedule adherence
        const scheduleAdherence = children.reduce((acc, child) => {
            const vaccCount = child.vaccinations ? child.vaccinations.length : 0;
            const childAgeMonths = Math.floor((new Date() - new Date(child.birthDate || child.createdAt)) / (1000 * 60 * 60 * 24 * 30));

            let expectedVaccinations = 0;
            if (childAgeMonths >= 0) expectedVaccinations += 1; // BCG at birth
            if (childAgeMonths >= 6) expectedVaccinations += 3; // DPT series
            if (childAgeMonths >= 9) expectedVaccinations += 1; // Measles
            if (childAgeMonths >= 12) expectedVaccinations += 2; // Additional doses

            if (vaccCount >= expectedVaccinations) {
                acc.onSchedule++;
            } else if (vaccCount > 0) {
                acc.behindSchedule++;
            } else {
                acc.overdue++;
            }
            return acc;
        }, { onSchedule: 0, behindSchedule: 0, overdue: 0 });

        const adherenceData = [
            { name: 'On Schedule', value: scheduleAdherence.onSchedule, color: '#10b981' },
            { name: 'Behind Schedule', value: scheduleAdherence.behindSchedule, color: '#f59e0b' },
            { name: 'Overdue', value: scheduleAdherence.overdue, color: '#ef4444' }
        ];

        // Children by age group
        const ageGroups = children.reduce((acc, child) => {
            const childAgeMonths = Math.floor((new Date() - new Date(child.birthDate || child.createdAt)) / (1000 * 60 * 60 * 24 * 30));
            let ageGroup;
            if (childAgeMonths < 12) ageGroup = '0-1 years';
            else if (childAgeMonths < 24) ageGroup = '1-2 years';
            else if (childAgeMonths < 36) ageGroup = '2-3 years';
            else ageGroup = '3+ years';

            acc[ageGroup] = (acc[ageGroup] || 0) + 1;
            return acc;
        }, {});

        const ageGroupData = Object.entries(ageGroups).map(([age, count]) => ({
            ageGroup: age,
            count
        }));

        // Staff roles distribution
        const roleDistribution = users.reduce((acc, user) => {
            const role = user.role || 'UNKNOWN';
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        const roleData = Object.entries(roleDistribution).map(([role, count]) => ({
            name: role.replace('_', ' '),
            value: count,
            color: role === 'SUPER_ADMIN' ? '#dc2626' :
                role === 'ADMIN' ? '#2563eb' :
                    role === 'WARD_OFFICER' ? '#059669' : '#6b7280'
        }));

        // Mother TD vaccination status
        const motherTDStatus = mothers.reduce((acc, mother) => {
            const tdCount = mother.tdDoses ? mother.tdDoses.length : 0;
            if (tdCount >= 3) acc.completed++;
            else if (tdCount > 0) acc.partial++;
            else acc.none++;
            return acc;
        }, { completed: 0, partial: 0, none: 0 });

        return {
            kpis: {
                totalChildren,
                totalMothers,
                totalVaccinations,
                totalStaff
            },
            childrenOverTime,
            wardVaccinationData,
            adherenceData,
            ageGroupData,
            roleData,
            motherTDStatus
        };
    }, [data]);

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleExport = () => {
        console.log('Exporting analytics data...', analytics);
        alert('Export functionality would be implemented here');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <div className="absolute inset-0 animate-ping">
                            <span className="loading loading-spinner loading-lg text-primary/50"></span>
                        </div>
                    </div>
                    <p className="mt-6 text-base-content text-lg font-medium">Loading Analytics...</p>
                    <p className="mt-2 text-base-content/70">Preparing your dashboard insights</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
            {/* Header */}
            <div className="bg-base-100/80 backdrop-blur-sm border-b border-base-300 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="btn btn-ghost btn-circle"
                            >
                                <FiArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-3 shadow-lg">
                                    <FiBarChart2 className="w-full h-full text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Analytics Dashboard
                                    </h1>
                                    <p className="text-base-content/70 font-medium">System performance and insights</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                                    <FiFilter className="w-4 h-4" />
                                    Time Range
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-xl w-48 border">
                                    <li><a onClick={() => setTimeRange('1month')}>Last Month</a></li>
                                    <li><a onClick={() => setTimeRange('3months')}>Last 3 Months</a></li>
                                    <li><a onClick={() => setTimeRange('6months')}>Last 6 Months</a></li>
                                    <li><a onClick={() => setTimeRange('1year')}>Last Year</a></li>
                                </ul>
                            </div>
                            <button onClick={handleExport} className="btn btn-ghost btn-sm">
                                <FiDownload className="w-4 h-4" />
                                Export
                            </button>
                            <button onClick={handleRefresh} className="btn btn-primary btn-sm">
                                <FiRefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Total Children Registered"
                        value={analytics.kpis.totalChildren}
                        change="+12 new"
                        positive={true}
                        icon={<FiUserCheck className="w-6 h-6" />}
                        description="Children in system"
                        color="from-emerald-500 to-teal-600"
                    />
                    <KPICard
                        title="Mother Profiles"
                        value={analytics.kpis.totalMothers}
                        change="+8 new"
                        positive={true}
                        icon={<FiActivity className="w-6 h-6" />}
                        description="Active mother records"
                        color="from-violet-500 to-purple-600"
                    />
                    <KPICard
                        title="Total Vaccinations"
                        value={analytics.kpis.totalVaccinations}
                        change="+45 administered"
                        positive={true}
                        icon={<FiDatabase className="w-6 h-6" />}
                        description="Cumulative vaccinations"
                        color="from-blue-500 to-indigo-600"
                    />
                    <KPICard
                        title="Staff Users"
                        value={analytics.kpis.totalStaff}
                        change="No change"
                        positive={true}
                        icon={<FiUsers className="w-6 h-6" />}
                        description="System user accounts"
                        color="from-amber-500 to-orange-600"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Children Registered Over Time */}
                    <ChartContainer
                        title="Children Registered Over Time"
                        icon={<FiTrendingUp className="w-5 h-5" />}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.childrenOverTime}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="name"
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--b3))',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="children"
                                    stroke="hsl(var(--p))"
                                    strokeWidth={2}
                                    name="New Registrations"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Vaccinations per Ward */}
                    <ChartContainer
                        title="Vaccinations per Ward"
                        icon={<FiBarChart2 className="w-5 h-5" />}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.wardVaccinationData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="ward"
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--b3))',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Bar
                                    dataKey="vaccinations"
                                    fill="hsl(var(--s))"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Vaccination Schedule Adherence */}
                    <ChartContainer
                        title="Vaccination Schedule Adherence"
                        icon={<FiPieChart className="w-5 h-5" />}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.adherenceData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.adherenceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--b3))',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Children by Age Group */}
                    <ChartContainer
                        title="Children by Age Group"
                        icon={<FiUsers className="w-5 h-5" />}
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.ageGroupData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="ageGroup"
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'currentColor' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--b3))',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="hsl(var(--a))"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                {/* Bottom Row - Staff Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartContainer
                        title="Staff Roles Distribution"
                        icon={<FiUsers className="w-5 h-5" />}
                    >
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={analytics.roleData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--b1))',
                                        border: '1px solid hsl(var(--b3))',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Summary Stats */}
                    <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-info to-accent p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 text-white">
                                    <FiDatabase className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">System Summary</h3>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-base-200 rounded-xl">
                                    <div className="text-2xl font-bold text-primary">
                                        {Math.round((analytics.adherenceData.find(d => d.name === 'On Schedule')?.value || 0) / analytics.kpis.totalChildren * 100)}%
                                    </div>
                                    <div className="text-sm text-base-content/70">Vaccination Coverage</div>
                                </div>
                                <div className="text-center p-4 bg-base-200 rounded-xl">
                                    <div className="text-2xl font-bold text-secondary">
                                        {Math.round(analytics.motherTDStatus.completed / analytics.kpis.totalMothers * 100)}%
                                    </div>
                                    <div className="text-sm text-base-content/70">TD Completion</div>
                                </div>
                            </div>
                            <div className="border-t border-base-300 pt-4">
                                <h4 className="font-semibold text-base-content mb-3">Quick Insights</h4>
                                <ul className="space-y-2 text-sm text-base-content/70">
                                    <li>• {analytics.kpis.totalChildren} children registered across all wards</li>
                                    <li>• {analytics.kpis.totalVaccinations} total vaccinations administered</li>
                                    <li>• {analytics.adherenceData.find(d => d.name === 'On Schedule')?.value || 0} children on schedule</li>
                                    <li>• {analytics.motherTDStatus.completed} mothers completed TD vaccination</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="fixed bottom-4 right-4 bg-error text-error-content p-4 rounded-xl shadow-lg max-w-sm">
                    <div className="font-semibold">Data Loading Issue</div>
                    <div className="text-sm opacity-90">Using sample data for demonstration</div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsPage;