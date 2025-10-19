import { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../api/axiosClient';

const FiltersPanel = ({ filters, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [vaccines, setVaccines] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        setLoading(true);
        try {
            const [vaccinesRes] = await Promise.all([
                axiosClient.get('/api/vaccine-schedule/types')
            ]);

            setVaccines(vaccinesRes.data.data || []);

            // Generate ward numbers 1-32 (common for Nepal municipalities)
            setWards(Array.from({ length: 32 }, (_, i) => i + 1));
        } catch (error) {
            console.error('Failed to fetch filter options:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        onFilterChange({ [field]: value || null });
    };

    const clearFilters = () => {
        onFilterChange({
            ward: null,
            vaccine: null,
            startDate: null,
            endDate: null,
            gender: null,
            ageGroup: null,
            caste: null
        });
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== null).length;

    const ageGroups = [
        '0-6 months',
        '6-12 months',
        '12-24 months',
        '2-5 years'
    ];

    const genders = ['Male', 'Female', 'Other'];

    const castes = [
        'Brahmin',
        'Chhetri',
        'Dalit',
        'Janajati',
        'Madhesi',
        'Muslim',
        'Other'
    ];

    return (
        <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
            {/* Filter Toggle Button */}
            <div className="p-4 flex items-center justify-between">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn btn-outline btn-sm gap-2"
                >
                    <FunnelIcon className="w-4 h-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="badge badge-primary badge-sm">{activeFiltersCount}</span>
                    )}
                </button>

                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="btn btn-ghost btn-sm gap-2"
                    >
                        <XMarkIcon className="w-4 h-4" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Filters Dropdown */}
            {isOpen && (
                <div className="p-4 pt-0 border-t border-base-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Ward Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Ward</span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                value={filters.ward || ''}
                                onChange={(e) => handleChange('ward', e.target.value)}
                            >
                                <option value="">All Wards</option>
                                {wards.map(ward => (
                                    <option key={ward} value={ward}>Ward {ward}</option>
                                ))}
                            </select>
                        </div>

                        {/* Vaccine Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Vaccine</span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                value={filters.vaccine || ''}
                                onChange={(e) => handleChange('vaccine', e.target.value)}
                                disabled={loading}
                            >
                                <option value="">All Vaccines</option>
                                {vaccines.map(vaccine => (
                                    <option key={vaccine.id} value={vaccine.name}>
                                        {vaccine.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Gender Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Gender</span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                value={filters.gender || ''}
                                onChange={(e) => handleChange('gender', e.target.value)}
                            >
                                <option value="">All Genders</option>
                                {genders.map(gender => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        </div>

                        {/* Age Group Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Age Group</span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                value={filters.ageGroup || ''}
                                onChange={(e) => handleChange('ageGroup', e.target.value)}
                            >
                                <option value="">All Ages</option>
                                {ageGroups.map(group => (
                                    <option key={group} value={group}>{group}</option>
                                ))}
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Start Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered input-sm"
                                value={filters.startDate || ''}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                            />
                        </div>

                        {/* End Date */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">End Date</span>
                            </label>
                            <input
                                type="date"
                                className="input input-bordered input-sm"
                                value={filters.endDate || ''}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                            />
                        </div>

                        {/* Caste Filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Caste/Ethnicity</span>
                            </label>
                            <select
                                className="select select-bordered select-sm"
                                value={filters.caste || ''}
                                onChange={(e) => handleChange('caste', e.target.value)}
                            >
                                <option value="">All Groups</option>
                                {castes.map(caste => (
                                    <option key={caste} value={caste}>{caste}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {activeFiltersCount > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {Object.entries(filters).map(([key, value]) => {
                                if (!value) return null;
                                return (
                                    <div key={key} className="badge badge-primary gap-2">
                                        <span className="text-xs capitalize">
                                            {key}: {value}
                                        </span>
                                        <button
                                            onClick={() => handleChange(key, null)}
                                            className="hover:bg-primary-focus rounded-full"
                                        >
                                            <XMarkIcon className="w-3 h-3" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FiltersPanel;