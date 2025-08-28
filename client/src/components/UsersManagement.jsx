import React, { useState, useEffect } from 'react';
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
            const response = await axiosClient.post(`/api/users/disable-user/${id}`, { status });
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
            INACTIVE: 'badge-ghost'
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
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered w-full"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            className="input input-bordered w-full"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            required
                        >
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
                        <input
                            type="number"
                            className="input input-bordered w-full"
                            value={formData.wardId}
                            onChange={(e) => setFormData(prev => ({ ...prev, wardId: parseInt(e.target.value) || '' }))}
                            required
                        />
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <FiX className="w-4 h-4 mr-2" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
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
            INACTIVE: 'badge-ghost'
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
                            <li><a onClick={() => onToggleStatus(user)}>
                                {user.status === 'ACTIVE' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
                                {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </a></li>
                            <li><a onClick={() => onDelete(user)} className="text-error"><FiTrash2 className="w-4 h-4" />Delete User</a></li>
                        </ul>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                        <span className={`badge ${getRoleBadge(user.role)}`}>
                            {getRoleDisplayName(user.role)}
                        </span>
                        <span className={`badge ${getStatusBadge(user.status)} gap-2`}>
                            {user.status === 'ACTIVE' && <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>}
                            {user.status}
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-base-content/70">
                        <FiPhone className="w-4 h-4 mr-2 text-primary" />
                        {user.phoneNumber}
                    </div>

                    <div className="flex items-center text-sm text-base-content/70">
                        <FiMapPin className="w-4 h-4 mr-2 text-secondary" />
                        Ward {user.wardId}
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="divider my-3"></div>
                <div className="stats stats-horizontal w-full">
                    <div className="stat p-2 text-center">
                        <div className="stat-value text-lg text-primary">{user.Child?.length || 0}</div>
                        <div className="stat-desc text-xs">Children</div>
                    </div>
                    <div className="stat p-2 text-center">
                        <div className="stat-value text-lg text-secondary">{user.createdVaccinationRecords?.length || 0}</div>
                        <div className="stat-desc text-xs">Vaccinations</div>
                    </div>
                    <div className="stat p-2 text-center">
                        <div className="stat-value text-lg text-accent">{user.createdWeightRecords?.length || 0}</div>
                        <div className="stat-desc text-xs">Records</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-4">
                    <button
                        onClick={() => onViewDetails(user)}
                        className="btn btn-primary btn-sm"
                    >
                        <FiEye className="w-4 h-4" />
                        View
                    </button>
                    <button
                        onClick={() => onEdit(user)}
                        className="btn btn-ghost btn-sm"
                    >
                        <FiEdit className="w-4 h-4" />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Users Management Component
const UsersManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [viewMode, setViewMode] = useState('cards');
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, filterRole, filterStatus]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const userData = await apiService.getAllUsers();
            setUsers(userData);
        } catch (err) {
            setError('Failed to load users. Please check if the server is running.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phoneNumber.includes(searchTerm);

            const matchesRole = filterRole === 'ALL' || user.role === filterRole;
            const matchesStatus = filterStatus === 'ALL' || user.status === filterStatus;

            return matchesSearch && matchesRole && matchesStatus;
        });

        setFilteredUsers(filtered);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleSaveUser = async (userId, userData) => {
        try {
            await apiService.updateUser(userId, userData);
            await fetchUsers(); // Refresh the list
            // Show success toast
            const toast = document.createElement('div');
            toast.className = 'toast toast-top toast-end';
            toast.innerHTML = `
                <div class="alert alert-success">
                    <FiCheck className="w-5 h-5" />
                    <span>User updated successfully!</span>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), 3000);
        } catch (error) {
            console.error('Error updating user:', error);
            // Show error toast
            const toast = document.createElement('div');
            toast.className = 'toast toast-top toast-end';
            toast.innerHTML = `
                <div class="alert alert-error">
                    <span>Failed to update user. Please try again.</span>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), 3000);
        }
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            try {
                await apiService.deleteUser(user.id);
                await fetchUsers(); // Refresh the list
                // Show success toast
                const toast = document.createElement('div');
                toast.className = 'toast toast-top toast-end';
                toast.innerHTML = `
                    <div class="alert alert-success">
                        <span>User deleted successfully!</span>
                    </div>
                `;
                document.body.appendChild(toast);
                setTimeout(() => document.body.removeChild(toast), 3000);
            } catch (error) {
                console.error('Error deleting user:', error);
                // Show error toast
                const toast = document.createElement('div');
                toast.className = 'toast toast-top toast-end';
                toast.innerHTML = `
                    <div class="alert alert-error">
                        <span>Failed to delete user. Please try again.</span>
                    </div>
                `;
                document.body.appendChild(toast);
                setTimeout(() => document.body.removeChild(toast), 3000);
            }
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            await apiService.toggleUserStatus(user.id, newStatus);
            await fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handleViewDetails = (user) => {
        setViewingUser(user);
        setIsDetailsModalOpen(true);
    };

    const getUserStats = () => {
        const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
        const pendingUsers = users.filter(u => u.status === 'PENDING').length;
        const totalAdmins = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length;
        const wardOfficers = users.filter(u => u.role === 'WARD_OFFICER').length;

        return { activeUsers, pendingUsers, totalAdmins, wardOfficers };
    };

    const stats = getUserStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-base-content text-lg font-medium mt-4">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="alert alert-error mb-6">
                        <FiUsers className="w-6 h-6" />
                        <div>
                            <h3 className="font-bold">Connection Error</h3>
                            <div className="text-xs">{error}</div>
                        </div>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="btn btn-primary"
                    >
                        <FiRefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <div className="navbar bg-base-100 shadow-lg border-b border-base-300">
                <div className="navbar-start">
                    <button
                        onClick={() => window.history.back()}
                        className="btn btn-ghost btn-circle"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                </div>
                <div className="navbar-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-base-content">User Management</h1>
                        <p className="text-sm text-base-content/70">Manage system users and permissions</p>
                    </div>
                </div>
                <div className="navbar-end space-x-2">
                    <button
                        onClick={fetchUsers}
                        className="btn btn-ghost btn-circle"
                        title="Refresh"
                    >
                        <FiRefreshCw className="w-5 h-5" />
                    </button>
                    <button className="btn btn-primary">
                        <FiUserPlus className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Active Users"
                        value={stats.activeUsers}
                        icon={<FiUserCheck className="w-6 h-6 text-success" />}
                        colorClass="border-l-4 border-l-success"
                    />
                    <StatsCard
                        title="Pending"
                        value={stats.pendingUsers}
                        icon={<FiClock className="w-6 h-6 text-warning" />}
                        colorClass="border-l-4 border-l-warning"
                    />
                    <StatsCard
                        title="Administrators"
                        value={stats.totalAdmins}
                        icon={<FiShield className="w-6 h-6 text-error" />}
                        colorClass="border-l-4 border-l-error"
                    />
                    <StatsCard
                        title="Ward Officers"
                        value={stats.wardOfficers}
                        icon={<FiUsers className="w-6 h-6 text-info" />}
                        colorClass="border-l-4 border-l-info"
                    />
                </div>

                {/* Filters */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="form-control">
                                    <div className="input-group">
                                        <span className="bg-base-200 border-base-300">
                                            <FiSearch className="w-5 h-5" />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            className="input input-bordered flex-1 w-full sm:w-64"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <select
                                    className="select select-bordered"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                >
                                    <option value="ALL">All Roles</option>
                                    <option value="SUPER_ADMIN">Super Admin</option>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="WARD_OFFICER">Ward Officer</option>
                                </select>

                                <select
                                    className="select select-bordered"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>

                            <div className="join">
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`btn join-item ${viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    <FiGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`btn join-item ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                                >
                                    <FiList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-base-content/70">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                    </div>
                </div>

                {/* Users Display */}
                {filteredUsers.length === 0 ? (
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body p-12 text-center">
                            <FiUsers className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-base-content mb-2">No Users Found</h3>
                            <p className="text-base-content/70 mb-6">
                                {searchTerm || filterRole !== 'ALL' || filterStatus !== 'ALL'
                                    ? 'Try adjusting your search criteria.'
                                    : 'No users have been created yet.'}
                            </p>
                            <button className="btn btn-primary">
                                <FiUserPlus className="w-4 h-4" />
                                Add First User
                            </button>
                        </div>
                    </div>
                ) : viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                onToggleStatus={handleToggleStatus}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card bg-base-100 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Ward</th>
                                        <th>Activity</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-primary text-primary-content rounded-lg w-10 h-10">
                                                            <span className="text-xs font-medium">
                                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold capitalize">{user.name}</div>
                                                        <div className="text-sm opacity-50">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`badge ${user.role === 'SUPER_ADMIN' ? 'badge-error' :
                                                    user.role === 'ADMIN' ? 'badge-warning' : 'badge-info'}`}>
                                                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' :
                                                        user.role === 'ADMIN' ? 'Administrator' :
                                                            user.role === 'WARD_OFFICER' ? 'Ward Officer' : user.role}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`badge gap-2 ${user.status === 'ACTIVE' ? 'badge-success' :
                                                    user.status === 'PENDING' ? 'badge-warning' : 'badge-ghost'}`}>
                                                    {user.status === 'ACTIVE' && <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>}
                                                    {user.status}
                                                </div>
                                            </td>
                                            <td>Ward {user.wardId}</td>
                                            <td>
                                                <div className="text-sm">
                                                    <div>{user.Child?.length || 0} Children</div>
                                                    <div className="opacity-60">{user.createdVaccinationRecords?.length || 0} Vaccinations</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dropdown dropdown-end">
                                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                                                        <FiMoreVertical className="w-4 h-4" />
                                                    </div>
                                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-48 border border-base-300">
                                                        <li><a onClick={() => handleViewDetails(user)}><FiEye className="w-4 h-4" />View Details</a></li>
                                                        <li><a onClick={() => handleEditUser(user)}><FiEdit className="w-4 h-4" />Edit User</a></li>
                                                        <li><a onClick={() => handleToggleStatus(user)}>
                                                            {user.status === 'ACTIVE' ? <FiLock className="w-4 h-4" /> : <FiUnlock className="w-4 h-4" />}
                                                            {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                                        </a></li>
                                                        <li><a onClick={() => handleDeleteUser(user)} className="text-error"><FiTrash2 className="w-4 h-4" />Delete User</a></li>
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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