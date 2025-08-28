import React, { useState, useEffect } from 'react';
import {
    FiUsers,
    FiUserCheck,
    FiActivity,
    FiBarChart2,
    FiHome,
    FiSettings,
    FiHelpCircle,
    FiSearch,
    FiMoreVertical,
    FiUser,
    FiTrendingDown,
    FiCalendar,
    FiFilter,
    FiDownload,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiEye,
    FiShield,
    FiUserPlus,
    FiUserMinus,
    FiLock,
    FiUnlock,
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiBell,
    FiGrid,
    FiDatabase,
    FiTrendingUp
} from 'react-icons/fi';

// API service
const apiService = {
    async getAllUsers() {
        try {
            const response = await fetch('http://localhost:5000/api/users/all');
            if (!response.ok) throw new Error('Failed to fetch users');
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    async getAllChildren() {
        try {
            const response = await fetch('http://localhost:5000/api/child/');
            if (!response.ok) throw new Error('Failed to fetch children');
            return await response.json();
        } catch (error) {
            console.error('Error fetching children:', error);
            return [];
        }
    },

    async getAllMothers() {
        try {
            const response = await fetch('http://localhost:5000/api/child/mothers/');
            if (!response.ok) throw new Error('Failed to fetch mothers');
            return await response.json();
        } catch (error) {
            console.error('Error fetching mothers:', error);
            return [];
        }
    }
};

// Modern Stats Card with gradient backgrounds and animations
const ModernStatsCard = ({ title, value, change, positive, icon, onClick, color, description }) => {
    return (
        <div
            className={`relative overflow-hidden bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 group`}
            onClick={onClick}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
                        <p className="text-white text-3xl font-bold">{value}</p>
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
                    <span className="text-white font-semibold text-sm">
                        {change}
                    </span>
                    <span className="text-white/70 text-sm">this month</span>
                </div>
            </div>

            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20 group-hover:scale-110 transition-transform"></div>
                <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/10 group-hover:scale-110 transition-transform"></div>
            </div>
        </div>
    );
};

// Modern Navigation Card
const NavigationCard = ({ title, description, icon, path, color, count }) => {
    const handleNavigation = () => {
        window.location.href = path;
    };

    return (
        <div
            onClick={handleNavigation}
            className="group relative overflow-hidden bg-base-100 hover:bg-gradient-to-br hover:from-base-100 hover:to-base-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-102 border border-base-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} text-white group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                {count && (
                    <div className="badge badge-primary badge-lg font-bold">{count}</div>
                )}
            </div>

            <h3 className="text-xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-base-content/70 text-sm leading-relaxed">
                {description}
            </p>

            <div className="absolute bottom-4 right-4 text-base-content/20 group-hover:text-primary/30 transition-colors">
                <FiTrendingUp className="w-5 h-5" />
            </div>
        </div>
    );
};

// Enhanced User Management Table
const UserManagement = () => {
    const [users] = useState([
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@hospital.gov',
            role: 'Medical Officer',
            department: 'Pediatrics',
            status: 'Active',
            lastLogin: '2 hours ago',
            permissions: ['read', 'write', 'delete'],
            avatar: 'SJ'
        },
        {
            id: 2,
            name: 'Nurse Mary Wilson',
            email: 'mary.wilson@hospital.gov',
            role: 'Nurse',
            department: 'Maternal Care',
            status: 'Active',
            lastLogin: '1 day ago',
            permissions: ['read', 'write'],
            avatar: 'MW'
        },
        {
            id: 3,
            name: 'John Administrator',
            email: 'john.admin@hospital.gov',
            role: 'Data Entry',
            department: 'Administration',
            status: 'Inactive',
            lastLogin: '1 week ago',
            permissions: ['read'],
            avatar: 'JA'
        },
        {
            id: 4,
            name: 'Dr. Michael Chen',
            email: 'michael.chen@hospital.gov',
            role: 'Senior Doctor',
            department: 'General Medicine',
            status: 'Active',
            lastLogin: '30 minutes ago',
            permissions: ['read', 'write', 'delete', 'admin'],
            avatar: 'MC'
        }
    ]);

    const handleUserAction = (action, user) => {
        console.log(`${action} user:`, user);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Medical Officer': return 'badge-error';
            case 'Senior Doctor': return 'badge-error';
            case 'Nurse': return 'badge-warning';
            case 'Data Entry': return 'badge-info';
            default: return 'badge-ghost';
        }
    };

    return (
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Staff Administration</h2>
                        <p className="text-white/80">Manage system users and permissions</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn btn-white btn-sm">
                            <FiUserPlus className="w-4 h-4" />
                            Add Staff
                        </button>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm text-white hover:bg-white/20">
                                <FiMoreVertical className="w-4 h-4" />
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-xl w-48 border">
                                <li><a><FiDownload className="w-4 h-4" />Export Staff List</a></li>
                                <li><a><FiShield className="w-4 h-4" />Bulk Permissions</a></li>
                                <li><a><FiLock className="w-4 h-4" />Security Audit</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="border-base-300">
                                <th className="font-bold text-base-content">Staff Member</th>
                                <th className="font-bold text-base-content">Role & Department</th>
                                <th className="font-bold text-base-content">Status</th>
                                <th className="font-bold text-base-content">Last Access</th>
                                <th className="font-bold text-base-content">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-base-200 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar placeholder">
                                                <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-xl w-12 h-12 shadow-lg">
                                                    <span className="text-sm font-bold">{user.avatar}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-base-content text-lg">{user.name}</div>
                                                <div className="text-sm text-base-content/70">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className={`badge ${getRoleColor(user.role)} mb-2`}>
                                            {user.role}
                                        </div>
                                        <div className="text-sm text-base-content/70">{user.department}</div>
                                    </td>
                                    <td className="py-4">
                                        <div className={`badge gap-2 ${user.status === 'Active' ? 'badge-success' : 'badge-ghost'}`}>
                                            {user.status === 'Active' ?
                                                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div> :
                                                <FiClock className="w-3 h-3" />
                                            }
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="py-4 text-base-content/70">{user.lastLogin}</td>
                                    <td className="py-4">
                                        <div className="dropdown dropdown-end">
                                            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                                                <FiMoreVertical className="w-4 h-4" />
                                            </div>
                                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-xl w-52 border">
                                                <li><a onClick={() => handleUserAction('edit-permissions', user)}><FiShield className="w-4 h-4" />Edit Permissions</a></li>
                                                <li><a onClick={() => handleUserAction('reset-password', user)}><FiLock className="w-4 h-4" />Reset Password</a></li>
                                                <li><a onClick={() => handleUserAction('toggle-status', user)}>{user.status === 'Active' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}{user.status === 'Active' ? 'Deactivate' : 'Activate'}</a></li>
                                                <li><a onClick={() => handleUserAction('view-logs', user)}><FiEye className="w-4 h-4" />View Activity</a></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Modern Activity Feed
const ActivityFeed = () => {
    const activities = [
        {
            timestamp: '10:30 AM',
            user: 'Dr. Sarah Johnson',
            action: 'Added new child record',
            details: 'Emma Thompson - Medical ID: CH001',
            type: 'create',
            icon: <FiUserPlus className="w-4 h-4" />,
            color: 'bg-success'
        },
        {
            timestamp: '09:45 AM',
            user: 'Nurse Mary Wilson',
            action: 'Updated mother profile',
            details: 'Maria Santos - Health records updated',
            type: 'update',
            icon: <FiEdit className="w-4 h-4" />,
            color: 'bg-info'
        },
        {
            timestamp: '09:15 AM',
            user: 'System',
            action: 'Daily backup completed',
            details: 'Database backup successful - 2.1GB',
            type: 'system',
            icon: <FiDatabase className="w-4 h-4" />,
            color: 'bg-primary'
        },
        {
            timestamp: '08:30 AM',
            user: 'Dr. Michael Chen',
            action: 'Generated monthly report',
            details: 'Maternal health statistics for July 2024',
            type: 'report',
            icon: <FiBarChart2 className="w-4 h-4" />,
            color: 'bg-warning'
        }
    ];

    return (
        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
            <div className="bg-gradient-to-r from-accent to-secondary p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Recent Activity</h2>
                        <p className="text-white/80">Latest system events and user actions</p>
                    </div>
                    <button className="btn btn-ghost btn-sm text-white hover:bg-white/20">
                        <FiEye className="w-4 h-4" />
                        View All
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 hover:bg-base-200 rounded-xl transition-all duration-200 group">
                            <div className={`${activity.color} text-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform`}>
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-base-content group-hover:text-primary transition-colors">
                                        {activity.action}
                                    </span>
                                    <span className="text-sm text-base-content/60 bg-base-200 px-2 py-1 rounded-lg">
                                        {activity.timestamp}
                                    </span>
                                </div>
                                <p className="text-sm text-base-content/80 mb-1">{activity.details}</p>
                                <p className="text-xs text-base-content/60">by {activity.user}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalChildren: 0,
        totalMothers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const [users, children, mothers] = await Promise.all([
                    apiService.getAllUsers(),
                    apiService.getAllChildren(),
                    apiService.getAllMothers()
                ]);

                setStats({
                    totalUsers: Array.isArray(users) ? users.length : 4,
                    totalChildren: Array.isArray(children) ? children.length : 127,
                    totalMothers: Array.isArray(mothers) ? mothers.length : 89
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                setStats({ totalUsers: 4, totalChildren: 127, totalMothers: 89 });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
                    <p className="mt-6 text-base-content text-lg font-medium">Loading Dashboard...</p>
                    <p className="mt-2 text-base-content/70">Preparing your admin interface</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
            {/* Modern Header */}
            <div className="bg-base-100/80 backdrop-blur-sm border-b border-base-300 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="avatar">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary p-3 shadow-lg">
                                    <FiShield className="w-full h-full text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Super Administrator
                                </h1>
                                <p className="text-base-content/70 font-medium">Hospital Management System</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="badge badge-success gap-2 p-3">
                                <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                                System Online
                            </div>
                            <button className="btn btn-ghost btn-circle">
                                <FiBell className="w-5 h-5" />
                            </button>
                            <button className="btn btn-ghost">
                                <FiHelpCircle className="w-5 h-5" />
                                Help
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ModernStatsCard
                        title="Children Registered"
                        value={stats.totalChildren.toLocaleString()}
                        change="+12 this week"
                        positive={true}
                        icon={<FiUserCheck className="w-6 h-6" />}
                        color="from-emerald-500 to-teal-600"
                        description="Total children in system"
                        onClick={() => window.location.href = '/view-children'}
                    />
                    <ModernStatsCard
                        title="Mother Profiles"
                        value={stats.totalMothers.toLocaleString()}
                        change="+8 this week"
                        positive={true}
                        icon={<FiActivity className="w-6 h-6" />}
                        color="from-violet-500 to-purple-600"
                        description="Active mother records"
                        onClick={() => window.location.href = '/view-mothers'}
                    />
                    <ModernStatsCard
                        title="Staff Members"
                        value={stats.totalUsers.toLocaleString()}
                        change="No changes"
                        positive={true}
                        icon={<FiUsers className="w-6 h-6" />}
                        color="from-blue-500 to-indigo-600"
                        description="System user accounts"
                        onClick={() => window.location.href = '/super-admin/users'}
                    />
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NavigationCard
                        title="View Children"
                        description="Browse and manage all child records in the system with advanced filtering options."
                        icon={<FiUserCheck className="w-6 h-6" />}
                        path="/view-children"
                        color="bg-gradient-to-br from-emerald-500 to-teal-600"
                        count={stats.totalChildren}
                    />
                    <NavigationCard
                        title="View Mothers"
                        description="Access comprehensive mother profiles and health records management."
                        icon={<FiActivity className="w-6 h-6" />}
                        path="/view-mothers"
                        color="bg-gradient-to-br from-violet-500 to-purple-600"
                        count={stats.totalMothers}
                    />
                    <NavigationCard
                        title="Add New Child"
                        description="Register a new child with complete medical and personal information."
                        icon={<FiPlus className="w-6 h-6" />}
                        path="/add-child"
                        color="bg-gradient-to-br from-blue-500 to-indigo-600"
                    />
                    <NavigationCard
                        title="Add New Mother"
                        description="Create comprehensive mother profile with health history and contact details."
                        icon={<FiPlus className="w-6 h-6" />}
                        path="/add-mother"
                        color="bg-gradient-to-br from-pink-500 to-rose-600"
                    />
                    <NavigationCard
                        title="Analytics & Reports"
                        description="Generate detailed reports and view system analytics and statistics."
                        icon={<FiBarChart2 className="w-6 h-6" />}
                        path="/super-admin/analytics"
                        color="bg-gradient-to-br from-amber-500 to-orange-600"
                    />
                    <NavigationCard
                        title="System Settings"
                        description="Configure system parameters, security settings and administrative options."
                        icon={<FiSettings className="w-6 h-6" />}
                        path="/super-admin/settings"
                        color="bg-gradient-to-br from-slate-500 to-gray-600"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Management */}
                    <div className="lg:col-span-2">
                        <UserManagement />
                    </div>

                    {/* Activity Feed */}
                    <div className="lg:col-span-1">
                        <ActivityFeed />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;