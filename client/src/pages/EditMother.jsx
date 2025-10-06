import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft, FaSearch, FaUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { calculateAge } from '../../helpers/calculateAge.jsx';
import { useMotherContext } from '../context/motherContext';
import { adToBs } from '@sbmdkl/nepali-date-converter';

export default function EditMother() {
    const { t } = useTranslation('addMother');
    const navigate = useNavigate();
    const location = useLocation();
    const { updateMotherInState } = useMotherContext();

    const [selectedMother, setSelectedMother] = useState(null);
    const [showSearchSection, setShowSearchSection] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchedMother, setFetchedMother] = useState(null);
    const [healthWorkers, setHealthWorkers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const resultsPerPage = 10;
    const [filters, setFilters] = useState({
        name: '',
        phoneNumber: '',
        sewaDartaNumber: '',
        wardNumber: '',
        createdByMe: false,
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            fullName: '',
            lastName: '',
            casteCode: '',
            dateOfBirth: '',
            phoneNumber: '',
            tole: '',
            pregnancyCount: '',
            previousTDTakenCount: '',
            remarks: '',
            tdDose1: '',
            tdDose2: '',
            tdDose2Plus: '',
            administeredById: '',
        },
    });

    // Fetch health workers
    useEffect(() => {
        const fetchHealthWorkers = async () => {
            try {
                // Use the same logic as EditChild: show all for SUPER_ADMIN, else only ward officers
                let url = '/api/users?role=WARD_OFFICER';
                // If you have user context and role, you can check for SUPER_ADMIN here
                // if (user?.role === 'SUPER_ADMIN') url = '/api/users';
                const res = await axiosClient.get(url);
                setHealthWorkers(res.data);
            } catch (err) {
                console.error('Failed to fetch health workers:', err);
            }
        };
        fetchHealthWorkers();
    }, []);

    // Fetch mother data if selected
    useEffect(() => {
        if (location.state?.selectedMother) {
            setSelectedMother(location.state.selectedMother);
            setShowSearchSection(false);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchMotherData = async () => {
            if (!selectedMother) return;
            setIsLoading(true);
            try {
                const res = await axiosClient.get(`/api/mothers/${selectedMother.sewaDartaNumber}`);
                const motherData = res.data;
                setFetchedMother(motherData);

                // --- Populate form fields like EditChild ---
                // Parse AD dateOfBirth to BS for the date picker
                let dobBs = '';
                if (motherData.dateOfBirth) {
                    // Accepts both Date and string
                    const adDate = typeof motherData.dateOfBirth === 'string'
                        ? motherData.dateOfBirth.split('T')[0]
                        : motherData.dateOfBirth;
                    dobBs = adToBs(adDate);
                }

                // TD Doses: find by doseNumber, convert dateGiven to BS
                const tdDose1 = motherData.tdDoses?.find(d => d.doseNumber === 1);
                const tdDose2 = motherData.tdDoses?.find(d => d.doseNumber === 2);
                const tdDose2Plus = motherData.tdDoses?.find(d => d.doseNumber === 3);

                const tdDose1Date = tdDose1?.dateGiven ? adToBs(tdDose1.dateGiven.split('T')[0]) : '';
                const tdDose2Date = tdDose2?.dateGiven ? adToBs(tdDose2.dateGiven.split('T')[0]) : '';
                const tdDose2PlusDate = tdDose2Plus?.dateGiven ? adToBs(tdDose2Plus.dateGiven.split('T')[0]) : '';

                // Find the administeredById for the most recent dose with a date
                let administeredById = '';
                if (tdDose2Plus && tdDose2Plus.administeredById) {
                    administeredById = tdDose2Plus.administeredById.toString();
                } else if (tdDose2 && tdDose2.administeredById) {
                    administeredById = tdDose2.administeredById.toString();
                } else if (tdDose1 && tdDose1.administeredById) {
                    administeredById = tdDose1.administeredById.toString();
                }

                reset({
                    fullName: motherData.name?.split(' ')[0] || '',
                    lastName: motherData.name?.split(' ').slice(1).join(' ') || '',
                    casteCode: motherData.casteCode?.toString() || '',
                    dateOfBirth: dobBs,
                    phoneNumber: motherData.phoneNumber || '',
                    tole: motherData.tole || '',
                    pregnancyCount: motherData.pregnancyCount?.toString() || '',
                    previousTDTakenCount: motherData.previousTDTakenCount?.toString() || '',
                    remarks: motherData.remarks || '',
                    tdDose1: tdDose1Date,
                    tdDose2: tdDose2Date,
                    tdDose2Plus: tdDose2PlusDate,
                    administeredById,
                });
            } catch (err) {
                console.error('Failed to fetch mother data:', err);
                toast.error('Failed to retrieve mother data.');
                setShowSearchSection(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMotherData();
    }, [selectedMother, reset]);

    // Search logic
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            const hasSearchFilters = filters.name || filters.sewaDartaNumber || filters.phoneNumber || filters.wardNumber || filters.createdByMe;
            if (!hasSearchFilters) {
                setSearchResults([]);
                return;
            }
            setIsLoading(true);
            try {
                const res = await axiosClient.get('/api/mothers/search', {
                    params: {
                        name: filters.name,
                        phoneNumber: filters.phoneNumber,
                        sewaDartaNumber: filters.sewaDartaNumber,
                        wardId: filters.wardNumber || 'all',
                        createdByMe: filters.createdByMe,
                    },
                });
                setSearchResults(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Search failed:', err);
                toast.error('खोज्दा त्रुटि भयो');
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [filters]);

    const dateOfBirth = watch('dateOfBirth');
    const age = calculateAge(dateOfBirth);

    // Caste code options (same as AddChild)
    const casteCodeOptions = [
        { value: 1, label: 'Code 1: Dalit' },
        { value: 2, label: 'Code 2: Pahad Janajati (Hill Indigenous Nationalities)' },
        { value: 3, label: 'Code 3: Madheshi' },
        { value: 4, label: 'Code 4: Muslim' },
        { value: 5, label: 'Code 5: Brahmin/Chhetri' },
        { value: 6, label: 'Code 6: Other (Anya)' }
    ];

    const onSubmit = async (data) => {
        if (!fetchedMother) {
            toast.error('No mother loaded');
            return;
        }
        try {
            if ((data.tdDose1 || data.tdDose2 || data.tdDose2Plus) && !data.administeredById) {
                toast.error(t('health_worker_required'));
                return;
            }

            const tdDoses = [];
            if (data.tdDose1) {
                tdDoses.push({
                    doseNumber: 1,
                    dateGiven: data.tdDose1,
                    administeredById: parseInt(data.administeredById, 10),
                    remarks: '',
                });
            }
            if (data.tdDose2) {
                tdDoses.push({
                    doseNumber: 2,
                    dateGiven: data.tdDose2,
                    administeredById: parseInt(data.administeredById, 10),
                    remarks: '',
                });
            }
            if (data.tdDose2Plus) {
                tdDoses.push({
                    doseNumber: 3,
                    dateGiven: data.tdDose2Plus,
                    administeredById: parseInt(data.administeredById, 10),
                    remarks: '',
                });
            }

            const payload = {
                fullName: data.fullName,
                lastName: data.lastName || '',
                casteCode: parseInt(data.casteCode, 10),
                dateOfBirth: data.dateOfBirth,
                phoneNumber: data.phoneNumber,
                tole: data.tole,
                pregnancyCount: parseInt(data.pregnancyCount, 10),
                previousTDTakenCount: parseInt(data.previousTDTakenCount, 10),
                remarks: data.remarks || '',
                isFromOtherMunicipality: false,
                tdDoses,
            };

            const response = await axiosClient.put(`/api/mothers/${fetchedMother.sewaDartaNumber}`, payload);
            updateMotherInState(response.data);

            toast.success(t('success_message'));
            reset();
        } catch (err) {
            console.error('Frontend error:', err.response?.data || err.message);
            toast.error(t('error_message'));
        }
    };

    const totalResults = Array.isArray(searchResults) ? searchResults.length : 0;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const paginatedResults = Array.isArray(searchResults)
        ? searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)
        : [];

    return (
        <div className="min-h-screen bg-base-200">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="bg-base-100 border-b border-base-300 sticky top-0 z-50 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <FaUser className="text-primary-content text-lg" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-base-content">
                                    {t('edit_title', 'Edit Mother')}
                                </h1>
                                <p className="text-base text-base-content/70">
                                    {t('edit_description', 'Update mother details and TD doses')}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-outline btn-primary"
                            title={t('back_to_dashboard')}
                        >
                            <FaArrowLeft className="mr-2" />
                            {t('back_to_dashboard')}
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-6 py-8">
                {showSearchSection ? (
                    <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 p-6 mb-8">
                        <div className="flex items-center mb-4">
                            <FaSearch className="text-primary text-lg mr-2" />
                            <h2 className="text-lg font-medium text-base-content">आमाको खोजी</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="form-control">
                                <input
                                    type="text"
                                    value={filters.name}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
                                    className="input input-bordered input-sm"
                                    placeholder="नाम..."
                                />
                            </div>
                            <div className="form-control">
                                <input
                                    type="text"
                                    value={filters.sewaDartaNumber}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, sewaDartaNumber: e.target.value }))}
                                    className="input input-bordered input-sm"
                                    placeholder="सेवा दर्ता नं..."
                                />
                            </div>
                            <div className="form-control">
                                <input
                                    type="text"
                                    value={filters.phoneNumber}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                                    className="input input-bordered input-sm"
                                    placeholder="फोन नम्बर..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 items-end">
                            <div className="form-control">
                                <select
                                    value={filters.wardNumber}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, wardNumber: e.target.value }))}
                                    className="select select-bordered select-sm"
                                >
                                    <option value="">वडा - सबै</option>
                                    {[...Array(13)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            वडा {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start py-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.createdByMe}
                                        onChange={(e) => setFilters((prev) => ({ ...prev, createdByMe: e.target.checked }))}
                                        className="checkbox checkbox-primary checkbox-sm"
                                    />
                                    <span className="label-text text-sm ml-2">मैले दर्ता गरेको</span>
                                </label>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <span className="loading loading-spinner loading-md text-primary"></span>
                            </div>
                        ) : paginatedResults.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="table table-sm w-full table-zebra">
                                        <thead>
                                            <tr className="text-xs">
                                                <th className="py-2">सेवा दर्ता नं.</th>
                                                <th className="py-2">नाम</th>
                                                <th className="py-2">फोन</th>
                                                <th className="py-2">जन्म मिति</th>
                                                <th className="py-2 text-center">क्रिया</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedResults.map((mother) => (
                                                <tr key={mother.sewaDartaNumber} className="hover">
                                                    <td className="py-2 text-sm font-mono">{mother.sewaDartaNumber}</td>
                                                    <td className="py-2 text-sm font-medium">{mother.name}</td>
                                                    <td className="py-2 text-sm">{mother.phoneNumber}</td>
                                                    <td className="py-2 text-sm">
                                                        {mother.dateOfBirth
                                                            ? adToBs(
                                                                typeof mother.dateOfBirth === 'string'
                                                                    ? mother.dateOfBirth.split('T')[0]
                                                                    : mother.dateOfBirth
                                                            )
                                                            : ''}
                                                    </td>
                                                    <td className="py-2 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMother(mother);
                                                                setShowSearchSection(false);
                                                            }}
                                                            className="btn btn-primary btn-xs"
                                                        >
                                                            छान्नुहोस्
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-4">
                                        <div className="join">
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <FaUser className="text-4xl text-base-content/40 mx-auto mb-2" />
                                <p className="text-sm text-base-content/70">कुनै आमा फेला परेन</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-base-100 shadow-sm rounded-xl border border-base-300 min-w-[20rem]">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="p-8 space-y-12"
                        >
                            <div>
                                <div className="flex items-center mb-8">
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                        <FaUser className="text-primary text-lg" />
                                    </div>
                                    <h2 className="text-xl font-medium text-base-content">
                                        {t('personal_information')}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="form-control">
                                        <label className="label" htmlFor="fullName">
                                            <span className="label-text">
                                                {t('full_name')} <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <input
                                            id="fullName"
                                            {...register('fullName', { required: true })}
                                            className="input input-bordered w-full"
                                            placeholder={t('full_name_placeholder')}
                                        />
                                        {errors.fullName && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {t('full_name_error')}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label" htmlFor="lastName">
                                            <span className="label-text">
                                                {t('last_name')} <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <input
                                            id="lastName"
                                            {...register('lastName', { required: true })}
                                            className="input input-bordered w-full"
                                            placeholder={t('last_name_placeholder')}
                                        />
                                        {errors.lastName && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {t('last_name_error')}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label" htmlFor="tole">
                                            <span className="label-text">{t('tole')}</span>
                                        </label>
                                        <input
                                            id="tole"
                                            {...register('tole')}
                                            className="input input-bordered w-full"
                                            placeholder={t('tole_placeholder')}
                                        />
                                    </div>
                                    {/* Caste Code (Jaati) */}
                                    <div className="form-control">
                                        <label className="label" htmlFor="casteCode">
                                            <span className="label-text">
                                                {t('caste_code')} <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <select
                                            id="casteCode"
                                            {...register('casteCode', { required: true })}
                                            className="select select-bordered w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                {t('caste_code_placeholder')}
                                            </option>
                                            {casteCodeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.casteCode && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {t('caste_code_error')}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                    {/* Date of Birth */}
                                    <div className="form-control">
                                        <label className="label" htmlFor="dateOfBirth">
                                            <span className="label-text">
                                                {t('date_of_birth')} <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <Controller
                                                name="dateOfBirth"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <>
                                                        <NepaliDatePicker
                                                            {...field}
                                                            inputClassName="input input-bordered w-full pr-8"
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                            className="w-full"
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        {field.value && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setValue('dateOfBirth', '')}
                                                                className="absolute right-3 top-1/2 flex h-6 w-6 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                                                                title={t('clear_date')}
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>
                                        {errors.dateOfBirth && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {t('date_of_birth_error')}
                                                </span>
                                            </label>
                                        )}
                                        {/* Show calculated age in Nepali style like AddChild */}
                                        {dateOfBirth && (
                                            <div className="mt-2 text-success font-medium">
                                                {`आमाको उमेर: ${age.years} वर्ष, ${age.months} महिना, ${age.days} दिन`}
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label" htmlFor="phoneNumber">
                                            <span className="label-text">
                                                {t('phone_number')} <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            {...register('phoneNumber', { required: true })}
                                            className="input input-bordered w-full"
                                            placeholder={t('phone_number_placeholder')}
                                        />
                                        {errors.phoneNumber && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {t('phone_number_error')}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label" htmlFor="pregnancyCount">
                                            <span className="label-text">
                                                {t('pregnancy_count')} <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <input
                                            id="pregnancyCount"
                                            type="number"
                                            {...register('pregnancyCount', {
                                                required: true,
                                                valueAsNumber: true,
                                                min: 1,
                                            })}
                                            className="input input-bordered w-full"
                                            placeholder={t('pregnancy_count_placeholder')}
                                        />
                                        {errors.pregnancyCount && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {t('pregnancy_count_error')}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label" htmlFor="previousTDTakenCount">
                                            <span className="label-text">
                                                {t('previous_td_taken_count')} <span className="text-error">*</span>
                                            </span>
                                        </label>
                                        <input
                                            id="previousTDTakenCount"
                                            type="number"
                                            {...register('previousTDTakenCount', {
                                                required: true,
                                                valueAsNumber: true,
                                                min: 0,
                                            })}
                                            className="input input-bordered w-full"
                                            placeholder={t('previous_td_taken_count_placeholder')}
                                        />
                                        {errors.previousTDTakenCount && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">
                                                    {t('previous_td_taken_count_error')}
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
                                <h3 className="text-lg font-medium text-base-content mb-3">
                                    {t('td_vaccination_history')}
                                </h3>
                                <p className="text-sm text-base-content/70 mb-4">
                                    {t('td_vaccination_description')}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* TD Dose 1 */}
                                    <div className="form-control">
                                        <label className="label" htmlFor="tdDose1">
                                            <span className="label-text">{t('td_dose_1')}</span>
                                        </label>
                                        <div className="relative">
                                            <Controller
                                                name="tdDose1"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <NepaliDatePicker
                                                            {...field}
                                                            inputClassName="input input-bordered w-full pr-8"
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                            className="w-full"
                                                            style={{ cursor: 'pointer' }}
                                                            placeholder={t('date_placeholder')}
                                                        />
                                                        {field.value && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setValue('tdDose1', '')}
                                                                className="absolute right-3 top-1/2 flex h-6 w-6 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                                                                title={t('clear_date')}
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {/* TD Dose 2 */}
                                    <div className="form-control">
                                        <label className="label" htmlFor="tdDose2">
                                            <span className="label-text">{t('td_dose_2')}</span>
                                        </label>
                                        <div className="relative">
                                            <Controller
                                                name="tdDose2"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <NepaliDatePicker
                                                            {...field}
                                                            inputClassName="input input-bordered w-full pr-8"
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                            className="w-full"
                                                            style={{ cursor: 'pointer' }}
                                                            placeholder={t('date_placeholder')}
                                                        />
                                                        {field.value && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setValue('tdDose2', '')}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                                                                title={t('clear_date')}
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {/* TD Dose 2+ / Booster */}
                                    <div className="form-control">
                                        <label className="label" htmlFor="tdDose2Plus">
                                            <span className="label-text">{t('td_dose_2_plus')}</span>
                                        </label>
                                        <div className="relative">
                                            <Controller
                                                name="tdDose2Plus"
                                                control={control}
                                                render={({ field }) => (
                                                    <>
                                                        <NepaliDatePicker
                                                            {...field}
                                                            inputClassName="input input-bordered w-full pr-8"
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                            className="w-full"
                                                            style={{ cursor: 'pointer' }}
                                                            placeholder={t('date_placeholder')}
                                                        />
                                                        {field.value && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setValue('tdDose2Plus', '')}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 items-center justify-center rounded-full bg-transparent p-1 text-error transition-all duration-200 hover:scale-110 hover:bg-error/20 focus:outline-none cursor-pointer"
                                                                title={t('clear_date')}
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    {/* Administered By */}
                                    {(watch('tdDose1') || watch('tdDose2') || watch('tdDose2Plus')) && (
                                        <div className="form-control">
                                            <label className="label" htmlFor="administeredById">
                                                <span className="label-text">
                                                    {t('administered_by')} <span className="text-error">*</span>
                                                </span>
                                            </label>
                                            <select
                                                id="administeredById"
                                                {...register('administeredById', { required: true, valueAsNumber: true })}
                                                className="select select-bordered w-full"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>
                                                    {t('administered_by_placeholder')}
                                                </option>
                                                {healthWorkers
                                                    .sort((a, b) => {
                                                        // Sort by wardId first (nulls at the end), then by name
                                                        const wardA = a.wardId ?? Infinity;
                                                        const wardB = b.wardId ?? Infinity;
                                                        if (wardA !== wardB) return wardA - wardB;
                                                        return a.name.localeCompare(b.name);
                                                    })
                                                    .map(worker => (
                                                        <option key={worker.id} value={worker.id}>
                                                            {worker.wardId ? `Ward ${worker.wardId} — ` : ''}
                                                            {worker.name}
                                                            {worker.role ? ` [${worker.role}]` : ''}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors.administeredById && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">
                                                        {t('administered_by_error')}
                                                    </span>
                                                </label>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </section>
                            <section className="bg-base-200 p-6 rounded-lg border border-base-300 shadow-sm">
                                <div className="form-control">
                                    <label className="label" htmlFor="remarks">
                                        <span className="label-text">{t('remarks')}</span>
                                    </label>
                                    <textarea
                                        id="remarks"
                                        {...register('remarks')}
                                        rows={4}
                                        className="textarea textarea-bordered h-24 w-full"
                                        placeholder={t('remarks_placeholder')}
                                    />
                                </div>
                            </section>
                            <div className="flex space-x-3 pt-0">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn flex-1 text-base font-semibold transition-all duration-300 ease-in-out
      ${isSubmitting ? 'btn-disabled' : 'btn-primary'}
      hover:-translate-y-0.5 hover:shadow-md active:translate-y-0`}
                                >
                                    {isSubmitting ? t('saving') : t('save')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="btn flex-1 btn-secondary text-base font-semibold transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}