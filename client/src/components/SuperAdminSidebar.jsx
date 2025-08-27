import React, { useState } from 'react';
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
    FiUser
} from 'react-icons/fi';

const SuperAdminSidebar = () => {
    const [activeLink, setActiveLink] = useState('dashboard');

    const sidebarLinks = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            path: '/super-admin/dashboard',
            icon: <FiHome className="w-5 h-5" />,
            description: 'Overview & insights'
        },
        {
            id: 'users',
            name: 'User Management',
            path: '/super-admin/users',
            icon: <FiUsers className="w-5 h-5" />,
            badge: '1,234',
            description: 'Manage system users'
        },
        {
            id: 'children',
            name: 'Children',
            path: '/super-admin/children',
            icon: <FiUserCheck className="w-5 h-5" />,
            badge: '856',
            description: 'Child profiles & records'
        },
        {
            id: 'mothers',
            name: 'Mothers',
            path: '/super-admin/mothers',
            icon: <FiActivity className="w-5 h-5" />,
            badge: '542',
            description: 'Maternal health tracking'
        },
        {
            id: 'analytics',
            name: 'Analytics',
            path: '/super-admin/analytics',
            icon: <FiBarChart2 className="w-5 h-5" />,
            description: 'Reports & data insights'
        }
    ];

    const bottomLinks = [
        {
            id: 'settings',
            name: 'Settings',
            path: '/super-admin/settings',
            icon: <FiSettings className="w-5 h-5" />
        },
        {
            id: 'help',
            name: 'Help & Support',
            path: '/super-admin/help',
            icon: <FiHelpCircle className="w-5 h-5" />
        }
    ];

    const NavLinkItem = ({ link, isBottomLink = false }) => {
        const isActive = activeLink === link.id;

        return (
            <button
                onClick={() => setActiveLink(link.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left group
                    ${isActive
                        ? 'bg-primary text-primary-content'
                        : 'text-base-content/70 hover:text-base-content hover:bg-base-200'
                    }`}
            >
                <div className={`flex-shrink-0 ${isActive ? 'text-primary-content' : 'text-base-content/50 group-hover:text-primary'}`}>
                    {link.icon}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{link.name}</span>
                        {link.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2
                                ${isActive
                                    ? 'bg-primary-content/20 text-primary-content'
                                    : 'bg-primary/10 text-primary'
                                }`}>
                                {link.badge}
                            </span>
                        )}
                    </div>
                    {link.description && !isBottomLink && (
                        <p className={`text-xs mt-0.5 truncate ${isActive ? 'text-primary-content/80' : 'text-base-content/50'}`}>
                            {link.description}
                        </p>
                    )}
                </div>
            </button>
        );
    };

    return (
        <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b border-base-300">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-content font-bold text-lg">SA</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-base-content">Super Admin</h2>
                        <p className="text-sm text-base-content/60">System Control Panel</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-base-300">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search menu..."
                        className="w-full pl-10 pr-4 py-2 bg-base-100 border border-base-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-3 overflow-y-auto">
                <div className="mb-4">
                    <h3 className="text-xs font-semibold text-base-content/40 uppercase tracking-wider mb-2 px-3">
                        Main Menu
                    </h3>
                    <div className="space-y-1">
                        {sidebarLinks.map((link) => (
                            <NavLinkItem key={link.id} link={link} />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-base-300">
                <div className="space-y-1 mb-3">
                    {bottomLinks.map((link) => (
                        <NavLinkItem key={link.id} link={link} isBottomLink />
                    ))}
                </div>

                {/* User Info */}
                <div className="p-3 bg-base-100 rounded-lg border border-base-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <FiUser className="w-4 h-4 text-primary-content" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-base-content truncate">Admin User</p>
                            <p className="text-xs text-base-content/60 truncate">admin@system.com</p>
                        </div>
                        <button className="p-1 hover:bg-base-200 rounded transition-colors">
                            <FiMoreVertical className="w-4 h-4 text-base-content/50" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SuperAdminSidebar;