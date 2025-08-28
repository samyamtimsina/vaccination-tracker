// import React, { useState, useEffect } from 'react';
// import {
//     FiUsers,
//     FiUserCheck,
//     FiActivity,
//     FiBarChart2,
//     FiHome,
//     FiSettings,
//     FiHelpCircle,
//     FiSearch,
//     FiMoreVertical,
//     FiUser,
//     FiPlus
// } from 'react-icons/fi';

// const SuperAdminSidebar = () => {
//     const [activeLink, setActiveLink] = useState('dashboard');

//     const handleNavigation = (path, id) => {
//         setActiveLink(id);
//         if (path.startsWith('http') || path.startsWith('/')) {
//             window.location.href = path;
//         }
//     };

//     // Set active link based on current URL
//     useEffect(() => {
//         const path = window.location.pathname;
//         if (path.includes('view-children')) {
//             setActiveLink('view-children');
//         } else if (path.includes('view-mothers')) {
//             setActiveLink('view-mothers');
//         } else if (path.includes('add-child')) {
//             setActiveLink('add-child');
//         } else if (path.includes('add-mother')) {
//             setActiveLink('add-mother');
//         } else if (path.includes('analytics')) {
//             setActiveLink('analytics');
//         } else if (path.includes('settings')) {
//             setActiveLink('settings');
//         } else if (path.includes('help')) {
//             setActiveLink('help');
//         } else {
//             setActiveLink('dashboard');
//         }
//     }, []);

//     const sidebarLinks = [
//         {
//             id: 'dashboard',
//             name: 'Dashboard',
//             path: '/super-admin/dashboard',
//             icon: <FiHome className="w-5 h-5" />,
//             description: 'Overview & insights'
//         },
//         {
//             id: 'view-children',
//             name: 'Children',
//             path: '/view-children',
//             icon: <FiUserCheck className="w-5 h-5" />,
//             description: 'View all children'
//         },
//         {
//             id: 'view-mothers',
//             name: 'Mothers',
//             path: '/view-mothers',
//             icon: <FiActivity className="w-5 h-5" />,
//             description: 'View all mothers'
//         },
//         {
//             id: 'add-child',
//             name: 'Add Child',
//             path: '/add-child',
//             icon: <FiPlus className="w-5 h-5" />,
//             description: 'Register new child'
//         },
//         {
//             id: 'add-mother',
//             name: 'Add Mother',
//             path: '/add-mother',
//             icon: <FiPlus className="w-5 h-5" />,
//             description: 'Register new mother'
//         },
//         {
//             id: 'analytics',
//             name: 'Analytics',
//             path: '/super-admin/analytics',
//             icon: <FiBarChart2 className="w-5 h-5" />,
//             description: 'Reports & data insights'
//         }
//     ];

//     const bottomLinks = [
//         {
//             id: 'settings',
//             name: 'Settings',
//             path: '/super-admin/settings',
//             icon: <FiSettings className="w-5 h-5" />
//         },
//         {
//             id: 'help',
//             name: 'Help & Support',
//             path: '/super-admin/help',
//             icon: <FiHelpCircle className="w-5 h-5" />
//         }
//     ];

//     const NavLinkItem = ({ link, isBottomLink = false }) => {
//         const isActive = activeLink === link.id;

//         return (
//             <button
//                 onClick={() => handleNavigation(link.path, link.id)}
//                 className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left group
//                     ${isActive
//                         ? 'bg-blue-600 text-white'
//                         : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
//                     }`}
//             >
//                 <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`}>
//                     {link.icon}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between">
//                         <span className="font-medium truncate">{link.name}</span>
//                     </div>
//                     {link.description && !isBottomLink && (
//                         <p className={`text-xs mt-0.5 truncate ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
//                             {link.description}
//                         </p>
//                     )}
//                 </div>
//             </button>
//         );
//     };

//     return (
//         <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200">
//                 <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                         <span className="text-white font-bold text-lg">SA</span>
//                     </div>
//                     <div>
//                         <h2 className="font-bold text-gray-900">Super Admin</h2>
//                         <p className="text-sm text-gray-600">System Control Panel</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Search Bar */}
//             <div className="p-3 border-b border-gray-200">
//                 <div className="relative">
//                     <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                         type="text"
//                         placeholder="Search menu..."
//                         className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     />
//                 </div>
//             </div>

//             {/* Main Navigation */}
//             <nav className="flex-1 p-3 overflow-y-auto">
//                 <div className="mb-4">
//                     <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
//                         Main Menu
//                     </h3>
//                     <div className="space-y-1">
//                         {sidebarLinks.map((link) => (
//                             <NavLinkItem key={link.id} link={link} />
//                         ))}
//                     </div>
//                 </div>
//             </nav>

//             {/* Bottom Section */}
//             <div className="p-3 border-t border-gray-200">
//                 <div className="space-y-1 mb-3">
//                     {bottomLinks.map((link) => (
//                         <NavLinkItem key={link.id} link={link} isBottomLink />
//                     ))}
//                 </div>

//                 {/* User Info */}
//                 <div className="p-3 bg-white rounded-lg border border-gray-200">
//                     <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                             <FiUser className="w-4 h-4 text-white" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
//                             <p className="text-xs text-gray-600 truncate">admin@system.com</p>
//                         </div>
//                         <button className="p-1 hover:bg-gray-100 rounded transition-colors">
//                             <FiMoreVertical className="w-4 h-4 text-gray-500" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </aside>
//     );
// };

// export default SuperAdminSidebar;