import React, { useState, useEffect } from 'react';

// Replaced react-icons/fi with inline SVG and JSX for better compatibility
const FiUsers = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const FiUserCheck = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
const FiActivity = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const FiBarChart2 = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const FiSettings = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.01 1.01c-.13.31-.35.48-.5.58-.5.33-1.15.5-1.9.5s-1.4-.17-1.9-.5c-.15-.1-.37-.27-.5-.58a1.65 1.65 0 0 0-1.01-1.01 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.01-1.01c-.31-.13-.48-.35-.58-.5-.33-.5-.5-1.15-.5-1.9s.17-1.4.5-1.9c.1-.15.27-.37.58-.5a1.65 1.65 0 0 0 1.01-1.01 1.65 1.65 0 0 0-1.82-.33l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1.01-1.01c.13-.31.35-.48.5-.58.5-.33 1.15-.5 1.9-.5s1.4.17 1.9.5c.15.1.37.27.5.58a1.65 1.65 0 0 0 1.01 1.01 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82z"></path></svg>;
const FiHelpCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.8 1c0 2-3 2-3 2"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const FiBell = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const FiShield = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const FiUserPlus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>;
const FiEdit = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;
const FiDatabase = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-database"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const FiEye = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const FiTrendingUp = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const FiTrendingDown = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-down"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>;
const FiClock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

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
            className={`relative overflow-hidden bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
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

// Enhanced Staff Directory (Read-Only)
const StaffDirectory = () => {
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
                        <h2 className="text-2xl font-bold text-white mb-1">Staff Directory</h2>
                        <p className="text-white/80">View all staff members and their roles</p>
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
const AdminDashboard = () => {
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
                // Mock data to prevent compilation error from external API call
                const users = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
                const children = new Array(127).fill(null);
                const mothers = new Array(89).fill(null);

                setStats({
                    totalUsers: users.length,
                    totalChildren: children.length,
                    totalMothers: mothers.length
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
                                    Administrator
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
                        onClick={() => window.location.href = '/admin/users'}
                    />
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NavigationCard
                        title="View Children"
                        description="Browse all child records in the system with advanced filtering options."
                        icon={<FiUserCheck className="w-6 h-6" />}
                        path="/view-children"
                        color="bg-gradient-to-br from-emerald-500 to-teal-600"
                        count={stats.totalChildren}
                    />
                    <NavigationCard
                        title="View Mothers"
                        description="Access comprehensive mother profiles and health records."
                        icon={<FiActivity className="w-6 h-6" />}
                        path="/view-mothers"
                        color="bg-gradient-to-br from-violet-500 to-purple-600"
                        count={stats.totalMothers}
                    />
                    <NavigationCard
                        title="Analytics & Reports"
                        description="Generate detailed reports and view system analytics and statistics."
                        icon={<FiBarChart2 className="w-6 h-6" />}
                        path="/admin/analytics"
                        color="bg-gradient-to-br from-amber-500 to-orange-600"
                    />
                    <NavigationCard
                        title="System Settings"
                        description="View system parameters and administrative options."
                        icon={<FiSettings className="w-6 h-6" />}
                        path="/admin/settings"
                        color="bg-gradient-to-br from-slate-500 to-gray-600"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Staff Directory */}
                    <div className="lg:col-span-2">
                        <StaffDirectory />
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

export default AdminDashboard;
