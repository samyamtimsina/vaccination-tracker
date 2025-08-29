import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
    FiUsers,
    FiUserCheck,
    FiClock,
    FiShield,
    FiSearch,
    FiMoreVertical,
    FiUser,
    FiPhone,
    FiMapPin,
    FiEdit,
    FiTrash2,
    FiEye,
    FiLock,
    FiUnlock,
    FiUserPlus,
    FiRefreshCw,
    FiFilter,
    FiGrid,
    FiList,
    FiArrowLeft,
    FiSave,
    FiX,
    FiCheck,
    FiMail,
    FiCalendar,
    FiActivity,
} from 'react-icons/fi';
import { BsBarChartLineFill } from "react-icons/bs";
import axiosClient from '../api/axiosClient';

// API service for managing users
const apiService = {
    async getAllUsers() {
        try {
            const response = await axiosClient.get('/api/users/all');
            return response.data.users || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    async updateUser(id, userData) {
        console.log('userData', userData);
        try {
            const response = await axiosClient.patch(`/api/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    async deleteUser(id) {
        try {
            const response = await axiosClient.delete(`/api/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    async toggleUserStatus(id, status) {
        try {
            const response = await axiosClient.post(`/api/users/update-user-status/${id}`, status);
            return response.data;
        } catch (error) {
            console.error('Error toggling user status:', error);
            throw error;
        }
    }
};

// Stats Card Component with DaisyUI theming
const StatsCard = ({ title, value, icon, colorClass }) => (
    <div className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 ${colorClass}`}>
        <div className="card-body p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-base-content/70 text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold text-base-content">{value}</p>
                </div>
                <div className="w-14 h-14 bg-base-200 rounded-xl flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

// User Details Modal Component
const UserDetailsModal = ({ user, isOpen, onClose, onEdit }) => {
    if (!isOpen || !user) return null;

    const getRoleDisplayName = (role) => {
        const names = {
            SUPER_ADMIN: 'Super Admin',
            ADMIN: 'Administrator',
            WARD_OFFICER: 'Ward Officer'
        };
        return names[role] || role;
    };

    const getRoleBadge = (role) => {
        const styles = {
            SUPER_ADMIN: 'badge-error',
            ADMIN: 'badge-warning',
            WARD_OFFICER: 'badge-info'
        };
        return styles[role] || 'badge-ghost';
    };

    const getStatusBadge = (status) => {
        const styles = {
            ACTIVE: 'badge-success',
            PENDING: 'badge-warning',
            INACTIVE: 'badge-ghost',
            DISABLED: 'badge-error'
        };
        return styles[status] || 'badge-ghost';
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const childrenCount = user.Child?.length || 0;
    const vaccinationsCreated = user.createdVaccinationRecords?.length || 0;
    const vaccinationsAdministered = user.administeredVaccinations?.length || 0;
    const weightRecordsCreated = user.createdWeightRecords?.length || 0;
    const weightRecordsAdministered = user.administeredWeightRecords?.length || 0;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-xl w-16 h-16">
                                <span className="text-xl font-bold">{getInitials(user.name)}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-base-content capitalize">{user.name}</h3>
                            <p className="text-base-content/70">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`badge ${getRoleBadge(user.role)}`}>
                                    {getRoleDisplayName(user.role)}
                                </span>
                                <span className={`badge ${getStatusBadge(user.status)} gap-2`}>
                                    {user.status === 'ACTIVE' && <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>}
                                    {user.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(user);
                            }}
                            className="btn btn-primary btn-sm"
                        >
                            <FiEdit className="w-4 h-4 mr-1" />
                            Edit
                        </button>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="card bg-base-200 border border-base-300">
                        <div className="card-body p-4">
                            <h4 className="font-semibold text-base-content mb-3 flex items-center">
                                <FiUser className="w-5 h-5 mr-2 text-primary" />
                                Contact Information
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <FiMail className="w-4 h-4 mr-3 text-secondary" />
                                    <span className="text-base-content/70">Email:</span>
                                    <span className="ml-2 font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <FiPhone className="w-4 h-4 mr-3 text-accent" />
                                    <span className="text-base-content/70">Phone:</span>
                                    <span className="ml-2 font-medium">{user.phoneNumber}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <FiMapPin className="w-4 h-4 mr-3 text-info" />
                                    <span className="text-base-content/70">Ward:</span>
                                    <span className="ml-2 font-medium">Ward {user.wardId}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-200 border border-base-300">
                        <div className="card-body p-4">
                            <h4 className="font-semibold text-base-content mb-3 flex items-center">
                                <BsBarChartLineFill className="w-5 h-5 mr-2 text-primary" />
                                Activity Summary
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-primary">{childrenCount}</div>
                                    <div className="text-xs text-base-content/70">Children Registered</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-secondary">{vaccinationsCreated}</div>
                                    <div className="text-xs text-base-content/70">Vaccinations Created</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-accent">{weightRecordsCreated}</div>
                                    <div className="text-xs text-base-content/70">Weight Records</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-info">{vaccinationsAdministered}</div>
                                    <div className="text-xs text-base-content/70">Vaccines Administered</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Activities */}
                <div className="space-y-6">
                    {/* Children Section */}
                    {childrenCount > 0 && (
                        <div className="card bg-base-200 border border-base-300">
                            <div className="card-body p-4">
                                <h4 className="font-semibold text-base-content mb-3 flex items-center">
                                    <FiUsers className="w-5 h-5 mr-2 text-primary" />
                                    Registered Children ({childrenCount})
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Ward</th>
                                                <th>Parent</th>
                                                <th>Birth Date</th>
                                                <th>Gender</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Corrected: Apply .slice(0, 5) to limit the displayed records */}
                                            {user.Child.slice(0, 5).map((child) => (
                                                <tr key={child.id}>
                                                    <td className="font-medium capitalize">{child.fullName}</td>
                                                    <td>Ward {child.wardNumber}</td>
                                                    <td className="capitalize">{child.parentName}</td>
                                                    <td>{formatDate(child.birthDate)}</td>
                                                    <td>
                                                        <span className={`badge badge-sm ${child.gender === 'MALE' ? 'badge-info' : 'badge-secondary'}`}>
                                                            {child.gender}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {/* Corrected: Show a message if there are more records than displayed */}
                                    {childrenCount > 5 && (
                                        <div className="text-center text-sm text-base-content/70 mt-2">
                                            And {childrenCount - 5} more records...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Vaccination Records */}
                    {vaccinationsCreated > 0 && (
                        <div className="card bg-base-200 border border-base-300">
                            <div className="card-body p-4">
                                <h4 className="font-semibold text-base-content mb-3 flex items-center">
                                    <FiShield className="w-5 h-5 mr-2 text-secondary" />
                                    Vaccination Records Created ({vaccinationsCreated})
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Vaccine</th>
                                                <th>Dose</th>
                                                <th>Date Given</th>
                                                <th>Ward</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {user.createdVaccinationRecords.slice(0, 5).map((record) => (
                                                <tr key={record.id}>
                                                    <td className="font-medium">{record.vaccineType}</td>
                                                    <td>Dose {record.doseNumber}</td>
                                                    <td>{formatDate(record.dateGiven)}</td>
                                                    <td>Ward {record.wardOfVaccination}</td>
                                                    <td>
                                                        <span className={`badge badge-sm ${record.isComplete ? 'badge-success' : 'badge-warning'}`}>
                                                            {record.isComplete ? 'Complete' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {vaccinationsCreated > 5 && (
                                        <div className="text-center text-sm text-base-content/70 mt-2">
                                            And {vaccinationsCreated - 5} more records...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Weight Records */}
                    {weightRecordsCreated > 0 && (
                        <div className="card bg-base-200 border border-base-300">
                            <div className="card-body p-4">
                                <h4 className="font-semibold text-base-content mb-3 flex items-center">
                                    <FiActivity className="w-5 h-5 mr-2 text-accent" />
                                    Weight Records Created ({weightRecordsCreated})
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Weight</th>
                                                <th>Ward</th>
                                                <th>Created</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {user.createdWeightRecords.slice(0, 5).map((record) => (
                                                <tr key={record.id}>
                                                    <td>{formatDate(record.date)}</td>
                                                    <td className="font-medium">{record.weight} kg</td>
                                                    <td>Ward {record.wardOfVaccination}</td>
                                                    <td>{formatDate(record.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {weightRecordsCreated > 5 && (
                                        <div className="text-center text-sm text-base-content/70 mt-2">
                                            And {weightRecordsCreated - 5} more records...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Activity State */}
                    {childrenCount === 0 && vaccinationsCreated === 0 && weightRecordsCreated === 0 && (
                        <div className="card bg-base-200 border border-base-300">
                            <div className="card-body p-8 text-center">
                                <FiActivity className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-base-content mb-2">No Activity Yet</h4>
                                <p className="text-base-content/70">
                                    This user hasn't created any records or registered any children yet.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Edit User Modal Component
const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
        wardId: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                role: user.role || '',
                wardId: user.wardId || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(user.id, formData);
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
                <h3 className="font-bold text-lg text-base-content mb-4">Edit User</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" className="input input-bordered w-full" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" className="input input-bordered w-full" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <input type="tel" className="input input-bordered w-full" value={formData.phoneNumber} onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select className="select select-bordered w-full" value={formData.role} onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))} required >
                            <option value="">Select Role</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="ADMIN">Administrator</option>
                            <option value="WARD_OFFICER">Ward Officer</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Ward ID</span>
                        </label>
                        <input type="number" className="input input-bordered w-full" value={formData.wardId} onChange={(e) => setFormData(prev => ({ ...prev, wardId: parseInt(e.target.value) || '' }))} required />
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading} >
                            <FiX className="w-4 h-4 mr-2" />
                            Cancel
                        </button>
                        <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading} >
                            {!loading && <FiSave className="w-4 h-4 mr-2" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// User Card Component with DaisyUI theming
const UserCard = ({ user, onEdit, onDelete, onToggleStatus, onViewDetails }) => {
    const getRoleBadge = (role) => {
        const styles = {
            SUPER_ADMIN: 'badge-error',
            ADMIN: 'badge-warning',
            WARD_OFFICER: 'badge-info'
        };
        return styles[role] || 'badge-ghost';
    };

    const getStatusBadge = (status) => {
        const styles = {
            ACTIVE: 'badge-success',
            PENDING: 'badge-warning',
            INACTIVE: 'badge-ghost',
            DISABLED: 'badge-error'
        };
        return styles[status] || 'badge-ghost';
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getRoleDisplayName = (role) => {
        const names = {
            SUPER_ADMIN: 'Super Admin',
            ADMIN: 'Administrator',
            WARD_OFFICER: 'Ward Officer'
        };
        return names[role] || role;
    };

    return (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
            <div className="card-body p-6">
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-xl w-12 h-12">
                                <span className="font-semibold">{getInitials(user.name)}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-base-content capitalize">{user.name}</h3>
                            <p className="text-sm text-base-content/70">{user.email}</p>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                            <FiMoreVertical className="w-4 h-4" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300">
                            <li><a onClick={() => onViewDetails(user)}><FiEye className="w-4 h-4" />View Details</a></li>
                            <li><a onClick={() => onEdit(user)}><FiEdit className="w-4 h-4" />Edit User</a></li>
                            <li>
                                <a onClick={() => onToggleStatus(user)}>
                                    {/* Logic: If ACTIVE, allow DISABLING. If DISABLED, allow PENDING. If PENDING, allow DISABLING. */}
                                    {user.status === 'ACTIVE' && (
                                        <>
                                            <FiLock className="w-4 h-4" />
                                            Deactivate
                                        </>
                                    )}
                                    {user.status === 'DISABLED' && (
                                        <>
                                            <FiUnlock className="w-4 h-4" />
                                            Re-activate
                                        </>
                                    )}
                                    {user.status === 'PENDING' && (
                                        <>
                                            <FiLock className="w-4 h-4" />
                                            Disable
                                        </>
                                    )}
                                </a>
                            </li>
                            <li><a onClick={() => onDelete(user)} className="text-error"><FiTrash2 className="w-4 h-4" />Delete User</a></li>
                        </ul>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                        <span className={`badge ${getRoleBadge(user.role)}`}>{getRoleDisplayName(user.role)}</span>
                        <span className={`badge ${getStatusBadge(user.status)} gap-2`}>
                            {user.status === 'ACTIVE' && <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>}
                            {user.status}
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <FiMail className="w-4 h-4 mr-2 text-base-content/70" />
                        <span className="text-base-content/70">{user.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <FiPhone className="w-4 h-4 mr-2 text-base-content/70" />
                        <span className="text-base-content/70">{user.phoneNumber}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Users Management Page Component
const UsersManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ active: 0, inactive: 0, pending: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('All');
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAllUsers();
            setUsers(data);
            const activeCount = data.filter(user => user.status === 'ACTIVE').length;
            const pendingCount = data.filter(user => user.status === 'PENDING').length;
            const disabledCount = data.filter(user => user.status === 'DISABLED').length;
            setStats({
                active: activeCount,
                inactive: disabledCount,
                pending: pendingCount,
                total: data.length
            });
            toast.success('Users loaded successfully!');
        } catch (error) {
            toast.error('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleSaveUser = async (id, userData) => {
        try {
            await apiService.updateUser(id, userData);
            fetchUsers();
            toast.success('User updated successfully!');
        } catch (error) {
            toast.error('Failed to update user.');
        }
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            try {
                await apiService.deleteUser(user.id);
                fetchUsers();
                toast.success('User deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete user.');
            }
        }
    };

    const handleToggleStatus = async (user) => {
        let newStatus = '';
        if (user.status === 'ACTIVE') {
            newStatus = 'DISABLED';
        } else if (user.status === 'DISABLED') {
            newStatus = 'PENDING';
        } else if (user.status === 'PENDING') {
            newStatus = 'DISABLED';
        }

        if (newStatus) {
            try {
                await apiService.toggleUserStatus(user.id, { status: newStatus });
                fetchUsers();
                toast.success(`User status changed to ${newStatus}!`);
            } catch (error) {
                toast.error(`Failed to change user status.`);
            }
        }
    };

    const filteredAndSortedUsers = users
        .filter(user =>
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedRole === 'All' || user.role === selectedRole)
        )
        .sort((a, b) => {
            if (!sortKey) return 0;

            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="min-h-screen bg-base-200 p-8">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header and Stats */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-base-content">User Management</h1>
                    <button className="btn btn-primary">
                        <FiUserPlus className="w-5 h-5 mr-2" />
                        Add New User
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Users" value={stats.total} icon={<FiUsers className="w-8 h-8 text-primary" />} colorClass="bg-primary/10 border-l-4 border-primary" />
                    <StatsCard title="Active" value={stats.active} icon={<FiUserCheck className="w-8 h-8 text-success" />} colorClass="bg-success/10 border-l-4 border-success" />
                    <StatsCard title="Pending" value={stats.pending} icon={<FiClock className="w-8 h-8 text-warning" />} colorClass="bg-warning/10 border-l-4 border-warning" />
                    <StatsCard title="Disabled" value={stats.inactive} icon={<FiLock className="w-8 h-8 text-error" />} colorClass="bg-error/10 border-l-4 border-error" />
                </div>
            </div>

            {/* Filters and View Controls */}
            <div className="bg-base-100 p-6 rounded-lg shadow-lg mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex-1 w-full md:w-auto">
                        <label className="input input-bordered flex items-center gap-2">
                            <FiSearch className="w-4 h-4 opacity-70" />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </label>
                    </div>

                    <div className="flex space-x-4">
                        {/* Role Filter */}
                        <select
                            className="select select-bordered"
                            value={selectedRole}
                            onChange={handleRoleChange}
                        >
                            <option value="All">All Roles</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="ADMIN">Admin</option>
                            <option value="WARD_OFFICER">Ward Officer</option>
                        </select>

                        {/* View Mode Toggle */}
                        <div className="join">
                            <input
                                type="radio"
                                name="view-mode"
                                aria-label="Grid"
                                className="btn btn-sm btn-outline join-item"
                                checked={viewMode === 'grid'}
                                onChange={() => setViewMode('grid')}
                            />
                            <input
                                type="radio"
                                name="view-mode"
                                aria-label="List"
                                className="btn btn-sm btn-outline join-item"
                                checked={viewMode === 'list'}
                                onChange={() => setViewMode('list')}
                            />
                        </div>

                        {/* Refresh Button */}
                        <button className="btn btn-outline" onClick={fetchUsers} disabled={loading}>
                            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* User List/Grid */}
            <div className="transition-all duration-300">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : filteredAndSortedUsers.length === 0 ? (
                    <div className="text-center p-16 bg-base-100 rounded-lg shadow-lg">
                        <FiUser className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-base-content">No Users Found</h2>
                        <p className="text-base-content/70 mt-2">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAndSortedUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                onToggleStatus={handleToggleStatus}
                                onViewDetails={(u) => { setViewingUser(u); setIsDetailsModalOpen(true); }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-lg shadow-lg overflow-x-auto">
                        <table className="table table-lg w-full">
                            <thead>
                                <tr className="text-base-content/80">
                                    <th className="cursor-pointer" onClick={() => handleSort('name')}>
                                        Name
                                        {sortKey === 'name' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                                    </th>
                                    <th className="cursor-pointer" onClick={() => handleSort('email')}>
                                        Email
                                        {sortKey === 'email' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                                    </th>
                                    <th className="cursor-pointer" onClick={() => handleSort('role')}>
                                        Role
                                        {sortKey === 'role' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                                    </th>
                                    <th className="cursor-pointer" onClick={() => handleSort('status')}>
                                        Status
                                        {sortKey === 'status' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                                    </th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-base-200">
                                        <td className="font-medium capitalize">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td><span className={`badge badge-ghost`}>{user.role}</span></td>
                                        <td><span className={`badge badge-ghost`}>{user.status}</span></td>
                                        <td className="text-right">
                                            <div className="dropdown dropdown-end">
                                                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                                                    <FiMoreVertical className="w-4 h-4" />
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300">
                                                    <li><a onClick={() => handleEditUser(user)}><FiEdit className="w-4 h-4" />Edit User</a></li>
                                                    <li><a onClick={() => handleToggleStatus(user)}>{user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</a></li>
                                                    <li><a onClick={() => handleDeleteUser(user)} className="text-error"><FiTrash2 className="w-4 h-4" />Delete User</a></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            <UserDetailsModal
                user={viewingUser}
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setViewingUser(null);
                }}
                onEdit={handleEditUser}
            />

            {/* Edit User Modal */}
            <EditUserModal
                user={editingUser}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                }}
                onSave={handleSaveUser}
            />
        </div>
    );
};

export default UsersManagementPage;