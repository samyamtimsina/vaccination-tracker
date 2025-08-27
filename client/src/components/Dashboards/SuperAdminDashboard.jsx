import React from 'react';
import {
    FiUsers,
    FiUserCheck,
    FiActivity,
    FiBarChart2,
    FiSettings,
    FiMoreVertical,
    FiTrendingUp,
    FiTrendingDown,
    FiCalendar,
    FiFilter,
    FiDownload
} from 'react-icons/fi';

// Stats Card Component
const StatsCard = ({ title, value, change, positive, icon }) => {
    return (
        <div className="bg-base-100 p-6 rounded-lg border border-base-300 hover:shadow-sm transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-base-content/60 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-base-content">{value}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {icon}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {positive ? (
                    <FiTrendingUp className="w-4 h-4 text-success" />
                ) : (
                    <FiTrendingDown className="w-4 h-4 text-error" />
                )}
                <span className={`text-sm font-medium ${positive ? 'text-success' : 'text-error'}`}>
                    {change}
                </span>
                <span className="text-sm text-base-content/50">vs last month</span>
            </div>
        </div>
    );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
    return (
        <div className="flex items-start gap-3 p-3 hover:bg-base-200/50 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.bgColor}`}>
                {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-base-content">{activity.title}</p>
                <p className="text-xs text-base-content/60 mt-1">{activity.description}</p>
                <p className="text-xs text-base-content/50 mt-1">{activity.time}</p>
            </div>
        </div>
    );
};

// Recent Activity Component
const RecentActivity = ({ activities }) => {
    return (
        <div className="bg-base-100 rounded-lg border border-base-300">
            <div className="p-4 border-b border-base-300">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base-content">Recent Activity</h3>
                    <div className="flex items-center gap-2">
                        <button className="btn btn-ghost btn-sm">
                            <FiFilter className="w-4 h-4" />
                        </button>
                        <button className="btn btn-ghost btn-sm">View All</button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="space-y-2">
                    {activities.map((activity, index) => (
                        <ActivityItem key={index} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Quick Actions Component
const QuickActions = () => {
    return (
        <div className="bg-base-100 rounded-lg border border-base-300 p-4">
            <h3 className="font-semibold text-base-content mb-4">Quick Actions</h3>
            <div className="space-y-2">
                <button className="w-full btn btn-primary btn-sm justify-start">
                    <FiUsers className="w-4 h-4" />
                    Add New User
                </button>
                <button className="w-full btn btn-outline btn-sm justify-start">
                    <FiBarChart2 className="w-4 h-4" />
                    Generate Report
                </button>
                <button className="w-full btn btn-outline btn-sm justify-start">
                    <FiDownload className="w-4 h-4" />
                    Export Data
                </button>
                <button className="w-full btn btn-outline btn-sm justify-start">
                    <FiCalendar className="w-4 h-4" />
                    Schedule Task
                </button>
            </div>
        </div>
    );
};

// System Status Component
const SystemStatus = () => {
    return (
        <div className="bg-base-100 rounded-lg border border-base-300 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-base-content">System Status</h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">All Systems Operational</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-lg font-bold text-base-content">99.9%</div>
                    <div className="text-xs text-base-content/60">Uptime</div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-lg font-bold text-base-content">45ms</div>
                    <div className="text-xs text-base-content/60">Response Time</div>
                </div>
                <div className="text-center p-3 bg-base-200 rounded-lg">
                    <div className="text-lg font-bold text-base-content">2.1GB</div>
                    <div className="text-xs text-base-content/60">Storage Used</div>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Content Component
const DashboardContent = () => {
    const activities = [
        {
            title: 'New user registered',
            description: 'John Doe has been added to the system',
            time: '2 minutes ago',
            icon: <FiUsers className="w-4 h-4 text-blue-600" />,
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Child profile updated',
            description: 'Vaccination record updated for Sarah Smith',
            time: '15 minutes ago',
            icon: <FiUserCheck className="w-4 h-4 text-green-600" />,
            bgColor: 'bg-green-100'
        },
        {
            title: 'System maintenance completed',
            description: 'Database optimization finished successfully',
            time: '1 hour ago',
            icon: <FiSettings className="w-4 h-4 text-purple-600" />,
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Monthly report generated',
            description: 'Analytics report for March 2024 is ready',
            time: '2 hours ago',
            icon: <FiBarChart2 className="w-4 h-4 text-orange-600" />,
            bgColor: 'bg-orange-100'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Users"
                    value="1,234"
                    change="+12%"
                    positive={true}
                    icon={<FiUsers className="w-5 h-5" />}
                />
                <StatsCard
                    title="Active Children"
                    value="856"
                    change="+8%"
                    positive={true}
                    icon={<FiUserCheck className="w-5 h-5" />}
                />
                <StatsCard
                    title="Registered Mothers"
                    value="542"
                    change="+15%"
                    positive={true}
                    icon={<FiActivity className="w-5 h-5" />}
                />
                <StatsCard
                    title="System Health"
                    value="98.5%"
                    change="+2%"
                    positive={true}
                    icon={<FiBarChart2 className="w-5 h-5" />}
                />
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <QuickActions />
                <div className="lg:col-span-2">
                    <RecentActivity activities={activities} />
                </div>
            </div>

            {/* System Status */}
            <SystemStatus />
        </div>
    );
};

export default DashboardContent;